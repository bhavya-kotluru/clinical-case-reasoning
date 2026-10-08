import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = Path(
    os.getenv("DATA_DIR", str(BASE_DIR / "data" / "MedQA-USMLE"))
)

TRAIN_FILE = DATA_DIR / "questions" / "US" / "train.jsonl"
DEV_FILE = DATA_DIR / "questions" / "US" / "dev.jsonl"
TEST_FILE = DATA_DIR / "questions" / "US" / "test.jsonl"

app = FastAPI(
    title="Explainable MedQA-USMLE API",
    description="Retrieval-Augmented Clinical Question Answering using MedQA-USMLE",
    version="2.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AskRequest(BaseModel):
    question: str = Field(..., min_length=2)


records: List[Dict[str, Any]] = []
vectorizer: Optional[TfidfVectorizer] = None
document_matrix = None


def clean_text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, dict):
        return " ".join(f"{k} {clean_text(v)}" for k, v in value.items())
    if isinstance(value, list):
        return " ".join(clean_text(item) for item in value)
    return str(value)


def load_jsonl(file_path: Path, split: str) -> List[Dict[str, Any]]:
    if not file_path.exists():
        print(f"WARNING: File not found: {file_path}")
        return []

    loaded: List[Dict[str, Any]] = []
    with file_path.open("r", encoding="utf-8", errors="ignore") as file:
        for line_number, line in enumerate(file, start=1):
            line = line.strip()
            if not line:
                continue
            try:
                item = json.loads(line)
                if not isinstance(item, dict):
                    continue
                item["_split"] = split
                item["_id"] = f"{split}-{line_number}"
                loaded.append(item)
            except json.JSONDecodeError:
                print(f"Skipping invalid JSON at {file_path.name}:{line_number}")
    return loaded


def options_to_text(options: Any) -> str:
    if not isinstance(options, dict):
        return clean_text(options)
    return " ".join(f"{key}: {clean_text(value)}" for key, value in options.items())


def record_to_text(record: Dict[str, Any]) -> str:
    return (
        f"Question: {clean_text(record.get('question'))} "
        f"Options: {options_to_text(record.get('options', {}))} "
        f"Medical information: {clean_text(record.get('meta_info', ''))}"
    )


def extract_concepts(question: str) -> List[str]:
    text = question.lower()
    medical_terms = [
        "fever", "cough", "dyspnea", "shortness of breath", "chest pain",
        "abdominal pain", "headache", "vomiting", "diarrhea", "hypertension",
        "diabetes", "asthma", "pneumonia", "meningitis", "seizure", "stroke",
        "anemia", "infection", "cancer", "carcinoma", "leukemia", "lymphoma",
        "pregnancy", "pregnant", "kidney", "renal", "liver", "hepatic",
        "cardiac", "heart", "thyroid", "thyrotoxicosis", "hypothyroidism",
        "hyperthyroidism", "bacterial", "viral", "fungal", "autoimmune",
        "antibiotic", "medication", "drug", "treatment", "diagnosis", "symptom",
        "laboratory", "ecg", "ekg", "mri", "ct scan", "x-ray", "biopsy",
    ]
    return list(dict.fromkeys(term for term in medical_terms if term in text))[:10]


def get_answer_text(record: Dict[str, Any]) -> str:
    answer = record.get("answer")
    return "Answer not available." if answer is None else clean_text(answer)


def get_answer_index(record: Dict[str, Any]) -> Optional[Any]:
    return record.get("answer_idx")


def get_option_text(record: Dict[str, Any], answer_idx: Any) -> str:
    options = record.get("options", {})
    if not isinstance(options, dict) or answer_idx is None:
        return ""

    key = str(answer_idx)
    if key in options:
        return clean_text(options[key])

    try:
        index = int(answer_idx)
        option_keys = list(options.keys())
        if 0 <= index < len(option_keys):
            return clean_text(options[option_keys[index]])
    except (ValueError, TypeError):
        pass
    return ""


def make_source(record: Dict[str, Any], score: float) -> Dict[str, Any]:
    question = clean_text(record.get("question"))
    return {
        "id": record.get("_id"),
        "title": question,
        "authors": ["MedQA-USMLE"],
        "year": 0,
        "journal": "MedQA-USMLE",
        "specialty": clean_text(record.get("meta_info", "")),
        "relevance": round(max(0.0, min(1.0, float(score))), 4),
        "snippet": question,
        "abstract": options_to_text(record.get("options", {})),
        "url": "",
        "split": record.get("_split"),
        "answer": get_answer_text(record),
        "answer_idx": get_answer_index(record),
        "retrievalScore": round(float(score), 4),
    }


def build_index() -> None:
    global records, vectorizer, document_matrix

    print("\n========================================")
    print("Loading MedQA-USMLE dataset...")
    print("========================================")

    train_records = load_jsonl(TRAIN_FILE, "train")
    dev_records = load_jsonl(DEV_FILE, "dev")
    test_records = load_jsonl(TEST_FILE, "test")
    records = train_records + dev_records + test_records

    if not records:
        raise RuntimeError(
            f"No MedQA records were loaded. Check dataset directory: {DATA_DIR}"
        )

    documents = [record_to_text(record) for record in records]

    print(f"Loaded {len(train_records)} training questions.")
    print(f"Loaded {len(dev_records)} development questions.")
    print(f"Loaded {len(test_records)} test questions.")
    print(f"Total questions: {len(records)}")

    vectorizer = TfidfVectorizer(
        analyzer="char",
        ngram_range=(2, 5),
        sublinear_tf=True,
        max_features=250000,
    )
    document_matrix = vectorizer.fit_transform(documents)
    print(f"TF-IDF index created: {document_matrix.shape}")
    print("========================================\n")


def retrieve(question: str, top_k: int = 5) -> List[Dict[str, Any]]:
    if vectorizer is None or document_matrix is None or not records:
        raise RuntimeError("Search index has not been initialized.")

    query_vector = vectorizer.transform([question])
    scores = cosine_similarity(query_vector, document_matrix).flatten()
    ranked_indices = scores.argsort()[::-1]

    return [
        {"record": records[index], "score": float(scores[index])}
        for index in ranked_indices[:top_k]
    ]


def build_reasoning(question: str, best_record: Dict[str, Any], score: float) -> List[Dict[str, Any]]:
    concepts = extract_concepts(question)
    matched_question = clean_text(best_record.get("question"))
    concept_text = ", ".join(concepts) if concepts else "No predefined clinical concepts were detected."

    return [
        {
            "id": 1,
            "title": "Question Processing",
            "description": "The submitted question was converted into a searchable medical representation.",
            "status": "completed",
            "details": [
                "The question was normalized before retrieval.",
                f"Detected concepts: {concept_text}",
            ],
            "icon": "MessageSquare",
        },
        {
            "id": 2,
            "title": "Semantic Retrieval",
            "description": "TF-IDF character n-gram retrieval searched the MedQA-USMLE questions.",
            "status": "completed",
            "details": [
                "Character n-grams help match medical terminology and mixed-language text.",
                "The top five records were ranked using cosine similarity.",
            ],
            "icon": "Search",
        },
        {
            "id": 3,
            "title": "Evidence Selection",
            "description": "The highest-scoring MedQA question was selected as the primary evidence.",
            "status": "completed",
            "details": [
                f"Matched question: {matched_question}",
                f"Retrieval similarity: {score:.4f}",
            ],
            "icon": "Layers",
        },
        {
            "id": 4,
            "title": "Answer Mapping",
            "description": "The labeled answer from the selected MedQA record was mapped to the response.",
            "status": "completed",
            "details": [
                f"Answer choice: {get_answer_index(best_record)}",
                f"Answer text: {get_answer_text(best_record)}",
            ],
            "icon": "CheckCircle",
        },
    ]


def calculate_confidence(score: float) -> float:
    return round(max(0.0, min(1.0, score * 1.25)), 3)


def quality_percent(score: float) -> int:
    if score >= 0.55:
        return 90
    if score >= 0.30:
        return 70
    if score >= 0.15:
        return 50
    return 30


@app.on_event("startup")
def startup_event():
    build_index()


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "dataset": "MedQA-USMLE",
        "documents": len(records),
        "data_directory": str(DATA_DIR),
        "train_file": str(TRAIN_FILE),
        "dev_file": str(DEV_FILE),
        "test_file": str(TEST_FILE),
    }


@app.post("/api/ask")
def ask_question(request: AskRequest):
    question = request.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    try:
        retrieved = retrieve(question, top_k=5)
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

    if not retrieved:
        raise HTTPException(status_code=404, detail="No matching medical questions found.")

    best = retrieved[0]
    best_record = best["record"]
    best_score = float(best["score"])
    answer = get_answer_text(best_record)
    answer_idx = get_answer_index(best_record)
    option_text = get_option_text(best_record, answer_idx)
    concepts = extract_concepts(question)
    sources = [make_source(item["record"], item["score"]) for item in retrieved]

    confidence = calculate_confidence(best_score)
    evidence_strength = max(20, round(confidence * 100))
    retrieval_quality = quality_percent(best_score)

    if len(retrieved) > 1 and best_score > 0:
        ratio = retrieved[1]["score"] / best_score
        source_agreement = round(max(25, min(100, ratio * 100)))
    else:
        source_agreement = 25

    evidence = [
        {
            "id": source["id"],
            "caseReportId": source["id"],
            "snippet": source["snippet"],
            "relevance": source["relevance"],
            "supportsAnswer": source["answer"] == answer,
        }
        for source in sources
    ]

    reasoning = build_reasoning(question, best_record, best_score)

    return {
        "question": question,
        "answer": answer,
        "highlightedAnswer": [
            {"text": answer, "isKeyTerm": True}
        ],
        "answer_idx": answer_idx,
        "answer_option": option_text,
        "confidence": confidence,
        "retrievalScore": round(best_score, 4),
        "concepts": concepts,
        "reasoning": reasoning,
        "evidence": evidence,
        "sources": sources,
        "supportingReports": len(sources),
        "evidenceStrength": evidence_strength,
        "retrievalQuality": retrieval_quality,
        "sourceAgreement": source_agreement,
        "dataset": "MedQA-USMLE",
        "matchedQuestion": clean_text(best_record.get("question")),
        "matchedSplit": best_record.get("_split"),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/api/case-reports")
def get_case_reports(specialty: str = "", year: int = 0, limit: int = 20):
    results = []
    specialty = specialty.strip().lower()

    for record in records:
        meta_info = clean_text(record.get("meta_info", ""))
        if specialty and specialty not in meta_info.lower():
            continue
        results.append(make_source(record, 0.0))
        if len(results) >= limit:
            break

    return results


@app.post("/api/reload")
def reload_dataset():
    try:
        build_index()
        return {
            "status": "reloaded",
            "dataset": "MedQA-USMLE",
            "documents": len(records),
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@app.get("/")
def root():
    return {
        "message": "Explainable MedQA-USMLE API is running.",
        "dataset": "MedQA-USMLE",
        "documents": len(records),
        "docs": "/docs",
    }

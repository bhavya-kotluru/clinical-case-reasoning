# Clinical QA Backend

## 1. Start the backend

From the `backend` directory:

```bash
python -m venv .venv
```

Windows:
```bash
.venv\Scripts\activate
```

macOS/Linux:
```bash
source .venv/bin/activate
```

Install:
```bash
pip install -r requirements.txt
```

Run:
```bash
uvicorn app:app --reload --port 8000
```

Check:
- `http://localhost:8000/api/health`
- Swagger docs: `http://localhost:8000/docs`

## 2. Connect the React frontend

From the project root:

```bash
npm install
npm run dev
```

The Vite config proxies `/api` to `http://localhost:8000`, so no frontend API URL is needed for local development.

For a separately hosted backend, create `.env` in the project root:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

## 3. Load your real clinical dataset

Replace:

`backend/data/case_reports.csv`

The loader expects these columns:

`id,title,authors,year,journal,specialty,snippet,abstract,url`

The backend also accepts several common alternatives such as `caption`/`text` for `snippet`.

After replacing the CSV, restart the backend or call:

`POST /api/reload`

## Important

This starter uses TF-IDF retrieval so it works locally without a paid AI API. It is a retrieval/demo backend, not a clinical diagnostic system. For a production RAG system, add validated medical data sources, stronger embedding retrieval, access controls, audit logging, and a separately evaluated answer-generation model.

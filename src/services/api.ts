import type { QAResponse, CaseReport } from '@/types';

const API_BASE_URL = '/api';

export async function askQuestion(question: string): Promise<QAResponse> {
  const url = `${API_BASE_URL}/ask`;

  console.log('Calling backend:', url);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: question.trim(),
      }),
    });

    if (!response.ok) {
      let message = `Backend error: ${response.status}`;

      try {
        const error = await response.json();

        if (error.detail) {
          message = error.detail;
        }
      } catch {
        // Keep default error message
      }

      throw new Error(message);
    }

    return (await response.json()) as QAResponse;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export async function getCaseReports(filters?: {
  search?: string;
  specialty?: string;
  year?: number;
}): Promise<CaseReport[]> {
  const params = new URLSearchParams();

  if (filters?.search) {
    params.append('search', filters.search);
  }

  if (filters?.specialty) {
    params.append('specialty', filters.specialty);
  }

  if (filters?.year) {
    params.append('year', String(filters.year));
  }

  const query = params.toString();

  const response = await fetch(
    `${API_BASE_URL}/case-reports${query ? `?${query}` : ''}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to retrieve MedQA data: ${response.status}`
    );
  }

  return (await response.json()) as CaseReport[];
}

export async function checkBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error('Backend is not available');
  }

  return response.json();
}

export { API_BASE_URL };
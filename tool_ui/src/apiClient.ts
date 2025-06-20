import { APPLICANT_ID_KEY } from './hooks/useApplicantId';
import type { EncryptedApiKey, ResumeResponse, ResumeTemplate } from './types';

export class ApiClient {
  static baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

  static async createApplicant(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/applicant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get applicant ID: ${response.statusText}`);
    }

    const data = await response.json();
    return data.applicantId;
  }

  static async getTemplates(): Promise<ResumeTemplate[]> {
    const response = await fetch(`${this.baseUrl}/templates`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to get templates: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  static async getResume(): Promise<ResumeResponse> {
    const applicantId = window.localStorage.getItem(APPLICANT_ID_KEY);
    const response = await fetch(`${this.baseUrl}/applicant/${applicantId}/resume`);

    if (!response.ok) {
      throw new Error(`Failed to get resume: ${response.statusText}`);
    }

    const blob = await response.blob();

    const disposition = response.headers.get('content-disposition');
    const match = disposition?.match(/filename="(.+)"/);
    const filename = match?.[1] ?? 'resume.pdf';
    return { filePath: window.URL.createObjectURL(blob), filename };
  }

  static async encryptApiKey(rawApiKey: string): Promise<EncryptedApiKey> {
    const response = await fetch(`${this.baseUrl}/encrypt-api-key`, {
      method: 'POST',
      body: JSON.stringify({ key: rawApiKey }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to encrypt api key: ${response.statusText}`);
    }

    const encryptedKeyData = await response.json();

    return encryptedKeyData;
  }
}

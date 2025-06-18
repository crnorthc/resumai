import { APPLICANT_ID_KEY } from './hooks/useApplicantId';
import type {
  ApplicantData,
  EncryptedApiKey,
  JobDataPayload,
  PositionPayload,
  ResumeResponse,
  ResumeTemplate,
} from './types';
import { updateApplicantData, updateJobData } from './utils';

export class ApiClient {
  static baseUrl = import.meta.env.VITE_API_BASE_URL;

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

    const contentType = response.headers.get('content-type');

    const blob = await response.blob();

    const disposition = response.headers.get('content-disposition');
    const match = disposition?.match(/filename="(.+)"/);

    if (contentType === 'application/pdf') {
      const filename = match?.[1] ?? 'resume.pdf';
      return { filePath: window.URL.createObjectURL(blob), type: 'pdf', filename };
    }

    const filename = match?.[1] ?? 'resume.docx';
    return { filePath: window.URL.createObjectURL(blob), type: 'docx', filename };
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

  static async updateApplicantInfo(data: ApplicantData): Promise<void> {
    const applicantId = window.localStorage.getItem(APPLICANT_ID_KEY);
    const response = await fetch(`${this.baseUrl}/applicant/${applicantId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to update applicant info: ${response.statusText}`);
    }

    const applicantData = await response.json();
    updateApplicantData(applicantData);
  }

  static async updateJob(data: JobDataPayload): Promise<void> {
    const applicantId = window.localStorage.getItem(APPLICANT_ID_KEY);
    const response = await fetch(`${this.baseUrl}/applicant/${applicantId}/job`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to update applicant info: ${response.statusText}`);
    }

    const jobData = await response.json();
    updateJobData(jobData.job);
  }

  static async addPosition(data: PositionPayload): Promise<void> {
    const applicantId = window.localStorage.getItem(APPLICANT_ID_KEY);
    const response = await fetch(`${this.baseUrl}/applicant/${applicantId}/position`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to add position: ${response.statusText}`);
    }

    const applicantData = await response.json();
    updateApplicantData(applicantData);
  }

  static async updatePosition(data: PositionPayload, position_index: number): Promise<void> {
    const applicantId = window.localStorage.getItem(APPLICANT_ID_KEY);
    const response = await fetch(`${this.baseUrl}/applicant/${applicantId}/position/${position_index}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to update position: ${response.statusText}`);
    }

    const applicantData = await response.json();
    updateApplicantData(applicantData);
  }

  static async deletePosition(position_index: number): Promise<void> {
    const applicantId = window.localStorage.getItem(APPLICANT_ID_KEY);
    const response = await fetch(`${this.baseUrl}/applicant/${applicantId}/position/${position_index}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete position: ${response.statusText}`);
    }

    const applicantData = await response.json();
    updateApplicantData(applicantData);
  }
}

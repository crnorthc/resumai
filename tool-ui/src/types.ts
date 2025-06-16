export enum ApiKeyType {
  OpenAI = 'openAI',
  Anthropic = 'anthropic',
  Gemini = 'gemini',
}

export const ApiKeyNames = {
  [ApiKeyType.OpenAI]: 'Open AI',
  [ApiKeyType.Anthropic]: 'Anthropic',
  [ApiKeyType.Gemini]: 'Gemini',
};

export interface EncryptedApiKey {
  encrypted_key: string;
  key_label: string;
}

export type ApiKeys = Record<ApiKeyType, EncryptedApiKey | undefined>;

export interface DocumentConfigType {
  document_type: 'pdf' | 'docx';
  edit_generated_info: boolean;
  edit_prompt: boolean;
  resume_template: string;
  dark_mode: boolean;
}

export interface ResumeTemplate {
  key: string;
  name: string;
  previews: {
    dark: string;
    light: string;
  };
}

export interface ConfirmedGeneratedData {
  positions: {
    [company: string]: string[];
  };
  languages: string[];
  tools: string[];
}

export interface PositionPayload {
  position: string;
  company: string;
  location: string;
  start: string;
  end: string;
  description: string;
}

export interface ApplicantData {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  college?: string;
  degree?: string;
  graduation_year?: string;
  tools?: string[];
  languages?: string[];
  positions?: PositionPayload[];
}

export interface GenarateResumePayload extends ApplicantData, DocumentConfigType {
  open_position: JobDataPayload;
}

export interface JobDataPayload {
  job_description?: string;
  company?: string;
  position?: string;
}

export const WebsocketRequestEvent = {
  GenerateResume: 'generate_resume',
  ConfirmedPrompt: 'confirmed_prompt',
  ConfirmedInfo: 'confirmed_info',
};

export interface WebsocketPayloadTypes {
  [WebsocketRequestEvent.GenerateResume]: GenarateResumePayload;
  [WebsocketResponseEvent.ConfirmPrompt]: string;
  [WebsocketResponseEvent.ConfirmInfo]: ConfirmedGeneratedData;
}

export const WebsocketResponseEvent = {
  MissingFields: 'missing_fields',
  GenerationQueued: 'generation_queued',
  JobStarted: 'job_started',
  ConfirmPrompt: 'confirm_prompt',
  ConfirmInfo: 'confirm_info',
  DataGenerated: 'data_generated',
  DocumentGenerating: 'document_generating',
  JobCompleted: 'job_completed',
  ApplicantDataExpired: 'applicant_data_expired',
};

export type WebsocketRequestEventType = (typeof WebsocketRequestEvent)[keyof typeof WebsocketRequestEvent];

export interface ServerEventsType {
  [WebsocketResponseEvent.MissingFields]: (data: string[]) => void;
  [WebsocketResponseEvent.GenerationQueued]: () => void;
  [WebsocketResponseEvent.JobStarted]: () => void;
  [WebsocketResponseEvent.ConfirmPrompt]: (data: string) => void;
  [WebsocketResponseEvent.ConfirmInfo]: () => void;
  [WebsocketResponseEvent.DataGenerated]: (data: ConfirmedGeneratedData) => void;
  [WebsocketResponseEvent.DocumentGenerating]: () => void;
  [WebsocketResponseEvent.JobCompleted]: () => void;
  [WebsocketResponseEvent.ApplicantDataExpired]: () => void;
}

export type ServerCallback<K extends WebsocketRequestEventType> = ServerEventsType[K];

export type ServerEventListeners = Map<keyof ServerEventsType, ServerEventsType[keyof ServerEventsType]>;

export interface ResumeResponse {
  type: 'pdf' | 'docx';
  filePath: string;
  filename: string;
}

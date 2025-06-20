import {
  ApiKeyNames,
  ApiKeyType,
  type ApiKeys,
  type ApplicantData,
  type ConfirmedGeneratedData,
  type DocumentConfigType,
  type EncryptedApiKey,
  type JobDataPayload,
} from './types';

const APPLICANT_DATA_KEY = 'applicantData';
const JOB_DATA_KEY = 'job';
const DOCUMENT_CONFIG_KEY = 'documentConfig';
const CONFIRMED_PROMPT_KEY = 'confirmedPrompt';
const CONFIRMED_INFO = 'confirmedInfo';
const API_KEYS = 'apiKeys';

export const getApplicantData = () =>
  JSON.parse(window.localStorage.getItem(APPLICANT_DATA_KEY) ?? '{}') as ApplicantData;

export const getJobData = () => JSON.parse(window.localStorage.getItem(JOB_DATA_KEY) ?? '{}') as JobDataPayload;

export const updateApplicantData = (applicantDataFromServer: ApplicantData) =>
  window.localStorage.setItem(
    APPLICANT_DATA_KEY,
    JSON.stringify({ ...getApplicantData(), ...applicantDataFromServer })
  );

export const updateJobData = (jobData: JobDataPayload) =>
  window.localStorage.setItem(JOB_DATA_KEY, JSON.stringify({ ...getJobData(), ...jobData }));

export const updateDocumentConfig = (documentConfig: DocumentConfigType) => {
  window.localStorage.setItem(DOCUMENT_CONFIG_KEY, JSON.stringify(documentConfig));
};

export const getDocumentConfig = () =>
  JSON.parse(window.localStorage.getItem(DOCUMENT_CONFIG_KEY) ?? '{}') as DocumentConfigType;

export const getConfirmedPrompt = () => window.localStorage.getItem(CONFIRMED_PROMPT_KEY) ?? '';

export const setConfirmedPrompt = (prompt: string) => window.localStorage.setItem(CONFIRMED_PROMPT_KEY, prompt);

export const getConfirmedInfo = () => {
  const savedInfo = window.localStorage.getItem(CONFIRMED_INFO);

  return savedInfo ? JSON.parse(savedInfo) : undefined;
};

export const setConfirmedInfo = (confirmedInfo: ConfirmedGeneratedData | null) =>
  window.localStorage.setItem(CONFIRMED_INFO, JSON.stringify(confirmedInfo));

export const getApiKeys = () => {
  const savedApiKeys = JSON.parse(window.localStorage.getItem(API_KEYS) ?? '{}');
  const allApiKeys = Object.fromEntries(Object.keys(ApiKeyNames).map((key) => [key, undefined]));

  return { ...allApiKeys, ...savedApiKeys } as ApiKeys;
};

export const setApiKey = (keyType: ApiKeyType, encryptedApiKey?: EncryptedApiKey) => {
  const currentKeys = getApiKeys();
  currentKeys[keyType] = encryptedApiKey;
  window.localStorage.setItem(API_KEYS, JSON.stringify(currentKeys));
};

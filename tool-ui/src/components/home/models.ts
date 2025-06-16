import { ApiKeyNames, ApiKeyType } from '../../types';

export const Models = {
  [ApiKeyType.OpenAI]: [
    'gpt-4.1',
    'gpt-4.1-mini',
    'gpt-4.1-nano',
    'o4-mini',
    'o3',
    'o3-mini',
    'o1',
    'o1-mini',
    'gpt-4o',
    'chatgpt-4o-latest',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-4',
    'gpt-3.5-turbo',
  ],
  [ApiKeyType.Anthropic]: [
    'claude-3-7-sonnet-latest',
    'claude-3-5-haiku-latest',
    'claude-sonnet-4-0',
    'claude-3-5-sonnet-latest',
    'claude-opus-4-0',
    'claude-2.1',
    'claude-2.0',
  ],
  [ApiKeyType.Gemini]: ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash', 'gemini-1.5-pro'],
};

export const AIModels = [
  {
    name: ApiKeyNames[ApiKeyType.OpenAI],
    code: ApiKeyType.OpenAI,
    models: [
      { modelName: 'gpt-4.1', aiName: ApiKeyType.OpenAI },
      { modelName: 'gpt-4.1-mini', aiName: ApiKeyType.OpenAI },
      { modelName: 'gpt-4.1-nano', aiName: ApiKeyType.OpenAI },
      { modelName: 'o4-mini', aiName: ApiKeyType.OpenAI },
      { modelName: 'o3', aiName: ApiKeyType.OpenAI },
      { modelName: 'o3-mini', aiName: ApiKeyType.OpenAI },
      { modelName: 'o1', aiName: ApiKeyType.OpenAI },
      { modelName: 'o1-mini', aiName: ApiKeyType.OpenAI },
      { modelName: 'gpt-4o', aiName: ApiKeyType.OpenAI },
      { modelName: 'chatgpt-4o-latest', aiName: ApiKeyType.OpenAI },
      { modelName: 'gpt-4o-mini', aiName: ApiKeyType.OpenAI },
      { modelName: 'gpt-4-turbo', aiName: ApiKeyType.OpenAI },
      { modelName: 'gpt-4', aiName: ApiKeyType.OpenAI },
      { modelName: 'gpt-3.5-turbo', aiName: ApiKeyType.OpenAI },
    ],
  },
  {
    name: ApiKeyNames[ApiKeyType.Anthropic],
    code: ApiKeyType.Anthropic,
    models: [
      { modelName: 'claude-3-7-sonnet-latest', aiName: ApiKeyType.Anthropic },
      { modelName: 'claude-3-5-haiku-latest', aiName: ApiKeyType.Anthropic },
      { modelName: 'claude-sonnet-4-0', aiName: ApiKeyType.Anthropic },
      { modelName: 'claude-3-5-sonnet-latest', aiName: ApiKeyType.Anthropic },
      { modelName: 'claude-opus-4-0', aiName: ApiKeyType.Anthropic },
      { modelName: 'claude-2.1', aiName: ApiKeyType.Anthropic },
      { modelName: 'claude-2.0', aiName: ApiKeyType.Anthropic },
    ],
  },
  {
    name: ApiKeyNames[ApiKeyType.Anthropic],
    code: ApiKeyType.Anthropic,
    models: [
      { modelName: 'gemini-2.0-flash', aiName: ApiKeyType.Anthropic },
      { modelName: 'gemini-2.0-flash-lite', aiName: ApiKeyType.Anthropic },
      { modelName: 'gemini-1.5-flash', aiName: ApiKeyType.Anthropic },
      { modelName: 'gemini-1.5-pro', aiName: ApiKeyType.Anthropic },
    ],
  },
];

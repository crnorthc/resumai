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
      { model: 'gpt-4.1', provider: ApiKeyType.OpenAI },
      { model: 'gpt-4.1-mini', provider: ApiKeyType.OpenAI },
      { model: 'gpt-4.1-nano', provider: ApiKeyType.OpenAI },
      { model: 'o4-mini', provider: ApiKeyType.OpenAI },
      { model: 'o3', provider: ApiKeyType.OpenAI },
      { model: 'o3-mini', provider: ApiKeyType.OpenAI },
      { model: 'o1', provider: ApiKeyType.OpenAI },
      { model: 'o1-mini', provider: ApiKeyType.OpenAI },
      { model: 'gpt-4o', provider: ApiKeyType.OpenAI },
      { model: 'chatgpt-4o-latest', provider: ApiKeyType.OpenAI },
      { model: 'gpt-4o-mini', provider: ApiKeyType.OpenAI },
      { model: 'gpt-4-turbo', provider: ApiKeyType.OpenAI },
      { model: 'gpt-4', provider: ApiKeyType.OpenAI },
      { model: 'gpt-3.5-turbo', provider: ApiKeyType.OpenAI },
    ],
  },
  {
    name: ApiKeyNames[ApiKeyType.Anthropic],
    code: ApiKeyType.Anthropic,
    models: [
      { model: 'claude-3-7-sonnet-latest', provider: ApiKeyType.Anthropic },
      { model: 'claude-3-5-haiku-latest', provider: ApiKeyType.Anthropic },
      { model: 'claude-sonnet-4-0', provider: ApiKeyType.Anthropic },
      { model: 'claude-3-5-sonnet-latest', provider: ApiKeyType.Anthropic },
      { model: 'claude-opus-4-0', provider: ApiKeyType.Anthropic },
      { model: 'claude-2.1', provider: ApiKeyType.Anthropic },
      { model: 'claude-2.0', provider: ApiKeyType.Anthropic },
    ],
  },
  {
    name: ApiKeyNames[ApiKeyType.Anthropic],
    code: ApiKeyType.Anthropic,
    models: [
      { model: 'gemini-2.0-flash', provider: ApiKeyType.Anthropic },
      { model: 'gemini-2.0-flash-lite', provider: ApiKeyType.Anthropic },
      { model: 'gemini-1.5-flash', provider: ApiKeyType.Anthropic },
      { model: 'gemini-1.5-pro', provider: ApiKeyType.Anthropic },
    ],
  },
];

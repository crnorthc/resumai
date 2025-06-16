import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { ApiKeyNames, ApiKeyType, type ApplicantData, type EncryptedApiKey } from '../../types';
import { getApiKeys, setApiKey } from '../../utils';
import { ApiClient } from '../../apiClient';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Keys(_props: { applicantData: ApplicantData; refreshApplicant: () => void }) {
  const [keys, setKeys] = useState(getApiKeys());

  const onSave = async (keyId: ApiKeyType, apiKey: string) => {
    if (!apiKey) {
      setApiKey(keyId, undefined);
      setKeys(getApiKeys());
      return;
    }
    const encryptedKeyResponse = await ApiClient.encryptApiKey(apiKey);
    setApiKey(keyId, encryptedKeyResponse);
    setKeys(getApiKeys());
  };

  return (
    <div className="bg-darkish pt-4 px-4 pb-8 rounded-md overflow-x-hidden w-full flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-center mb-6">API Keys</h2>
      <div className="grid grid-rows-2 gap-4 w-full px-8">
        {Object.entries(keys).map(([keyId, value]) =>
          value ? (
            <Key
              key={keyId}
              name={ApiKeyNames[keyId as ApiKeyType]}
              keyId={keyId as ApiKeyType}
              value={value}
              onSave={onSave}
            />
          ) : (
            <MissingKey
              key={keyId}
              name={ApiKeyNames[keyId as ApiKeyType]}
              keyId={keyId as ApiKeyType}
              onSave={onSave}
            />
          )
        )}
      </div>
    </div>
  );
}

function MissingKey({
  name,
  keyId,
  onSave,
}: {
  name: string;
  keyId: ApiKeyType;
  onSave: (key: ApiKeyType, apiKey: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newKey, setNewKey] = useState<string | undefined>(undefined);

  return (
    <div className="w-full grid grid-cols-6 justify-between items-center gap-1">
      <label className="text-lg font-bold opacity-40">{name}</label>
      <InputText
        onChange={(e) => setNewKey(e.target.value)}
        value={newKey}
        className="col-span-4"
        disabled={!isEditing}
        placeholder={`No ${name} api key found`}
      />
      {isEditing ? (
        <div className="w-full flex justify-end">
          <Button
            onClick={() => {
              setNewKey('');
              setIsEditing(false);
            }}
            icon="pi pi-times"
            className="text-xs !mr-4 h-11"
            severity="danger"
            outlined
          />
          <Button
            onClick={() => {
              if (newKey) onSave(keyId, newKey);
              setIsEditing(false);
            }}
            icon="pi pi-check"
            severity="success"
            className="text-xs h-11"
            outlined
          />
        </div>
      ) : (
        <div className="w-full flex justify-end">
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
            icon="pi pi-pencil"
            severity="secondary"
            className="text-xs h-11"
            outlined
          />
        </div>
      )}
    </div>
  );
}

function Key({
  name,
  value,
  keyId,
  onSave,
}: {
  name: string;
  value: EncryptedApiKey;
  keyId: ApiKeyType;
  onSave: (key: ApiKeyType, apiKey: string) => void;
}) {
  const [newKey, setNewKey] = useState<string | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="w-full grid grid-cols-6 justify-between items-center gap-1">
      <label className="text-lg font-bold">{name}</label>
      <InputText
        onChange={(e) => setNewKey(e.target.value)}
        onFocus={() => setIsEditing(true)}
        value={newKey}
        variant="filled"
        placeholder={value.key_label}
        className="col-span-4"
      />
      {isEditing ? (
        <div className="w-full flex justify-end">
          <Button
            onClick={() => {
              setNewKey(undefined);
              setIsEditing(false);
            }}
            icon="pi pi-times"
            className="text-xs !mr-4 h-11"
            severity="danger"
            outlined
          />
          <Button
            onClick={() => {
              if (newKey) onSave(keyId, newKey);
              setIsEditing(false);
            }}
            icon="pi pi-check"
            severity="success"
            className="text-xs h-11"
            outlined
          />
        </div>
      ) : (
        <div className="w-full flex justify-end">
          <Button
            onClick={() => {
              onSave(keyId, '');
              setIsEditing(true);
            }}
            icon="pi pi-trash"
            severity="danger"
            className="text-xs h-11"
            outlined
          />
        </div>
      )}
    </div>
  );
}

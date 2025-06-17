import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { SelectButton } from 'primereact/selectbutton';
import { useTemplates } from '../useTemplates';
import { useContext, useEffect, useState, type RefObject } from 'react';
import { StepperStateContext, useStepperState } from '../useStepperState';
import type { Stepper } from 'primereact/stepper';
import type SocketClient from '../../../socketClient';
import { ApiKeyType, WebsocketRequestEvent, WebsocketResponseEvent } from '../../../types';
import { getApiKeys, getApplicantData, getDocumentConfig, getJobData, updateDocumentConfig } from '../../../utils';
import { CascadeSelect } from 'primereact/cascadeselect';
import { AIModels } from '../models';
import { Link } from 'react-router-dom';

export function StepTwo({ socket, stepperRef }: { socket: SocketClient; stepperRef: RefObject<Stepper | null> }) {
  const { editBulletPoints, setEditBulletPoints, editPrompt, setEditPrompt } = useContext(StepperStateContext);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const { templates } = useTemplates();
  const documentConfig = getDocumentConfig();
  const [template, setTemplate] = useState<string>(documentConfig?.resume_template);
  const [darkMode, setDarkMode] = useState(documentConfig?.dark_mode ?? true);
  const [docType, selectDocType] = useState<'pdf' | 'docx'>(documentConfig?.document_type ?? 'pdf');

  const keys = getApiKeys();
  const availableModels = AIModels.filter((model) => keys[model.code as ApiKeyType]);
  const [model, setModel] = useState<{ model: string; provider: ApiKeyType }>(documentConfig.model);

  const { setStep } = useStepperState();
  useEffect(() => {
    setStep('settings');
  }, []);

  socket.on(WebsocketResponseEvent.MissingFields, (data: string[]) => {
    setMissingFields(data);
  });

  socket.on(WebsocketResponseEvent.GenerationQueued, () => {
    stepperRef.current?.nextCallback();
  });

  const handleNext = () => {
    const documentConfig = {
      dark_mode: darkMode,
      document_type: docType,
      edit_generated_info: editBulletPoints,
      edit_prompt: editPrompt,
      resume_template: template,
      model: { ...model, api_key: keys[model.provider]?.encrypted_key ?? '' },
    };

    updateDocumentConfig(documentConfig);

    socket.emit(WebsocketRequestEvent.GenerateResume, {
      ...getApplicantData(),
      ...documentConfig,
      open_position: getJobData(),
    });
  };

  if (!availableModels.length) {
    return (
      <div className="w-full flex justify-center py-24">
        <div className="flex space-x-1">
          <h2>No models available. Please enter your API keys</h2>
          <Link className="underline" to={'/edit?tab=4'}>
            here
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full py-8 flex flex-col items-center space-y-6 bg-darkish rounded-md">
        {!!missingFields.length && (
          <div className="w-full flex items-center justify-center mb-6">
            <div className="w-4/5 border-2 border-red-400/30 rounded-md p-4">
              <h3 className="text-lg text-center">Missing Fields</h3>
              <ol>
                {missingFields.map((f) => (
                  <li>{f}</li>
                ))}
              </ol>
            </div>
          </div>
        )}
        <div>
          <div className="grid grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-white/40">Edit Bullet Points</label>
              <InputSwitch
                checked={editBulletPoints}
                onChange={(e) => setEditBulletPoints(e.value)}
                tooltip="Edit bullet points before resume is generated."
              />
            </div>
            <div className="flex flex-col items-end gap-1">
              <label className="text-sm text-white/40">Edit Prompt</label>
              <InputSwitch
                checked={editPrompt}
                onChange={(e) => setEditPrompt(e.value)}
                tooltip="Edit prompt before it is submitted."
              />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-5 mt-8">
            <div className="col-span-3 flex flex-col gap-1">
              <label className="text-sm text-white/40">Model</label>
              <CascadeSelect
                value={model}
                onChange={(e) => setModel(e.value)}
                options={availableModels}
                optionLabel="model"
                optionGroupLabel="name"
                optionGroupChildren={['models']}
                className="w-90 overflow-x-hidden"
                placeholder="Select a Model"
                style={{ minWidth: '14rem' }}
              />
            </div>
            <div className="col-span-1 flex flex-col items-end gap-1">
              <label className="text-sm text-white/40">Document Type</label>
              <SelectButton value={docType} onChange={(e) => selectDocType(e.value)} options={['pdf', 'docx']} />
            </div>
            <div className="col-span-1 flex flex-col items-end gap-1">
              <label className="text-sm text-white/40">Theme</label>
              <SelectButton
                value={darkMode ? 'Dark' : 'Light'}
                onChange={(e) => setDarkMode(e.value == 'Dark')}
                options={['Dark', 'Light']}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-6">
            <label className="text-sm text-white/40">Resume Template</label>
            <Dropdown
              value={template}
              onChange={(e) => setTemplate(e.value)}
              options={templates}
              optionValue="key"
              optionLabel="name"
              placeholder="Select a Template"
              className="w-full md:w-14rem"
            />
          </div>
        </div>
      </div>

      <div className="w-full flex justify-between mt-12">
        <Button onClick={stepperRef.current?.prevCallback} label="Back" severity="secondary" outlined />
        <Button onClick={handleNext} label="Next" outlined />
      </div>
    </div>
  );
}

import type React from 'react';
import { createContext, useEffect, useState } from 'react';
import type { ConfirmedGeneratedData, ResumeResponse } from '../../types';
import { getConfirmedInfo, getConfirmedPrompt } from '../../utils';
import { useSearchParams } from 'react-router-dom';

export type StepperStateContextType = {
  editBulletPoints: boolean;
  setEditBulletPoints: React.Dispatch<React.SetStateAction<boolean>>;
  editPrompt: boolean;
  setEditPrompt: React.Dispatch<React.SetStateAction<boolean>>;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  generatedInfo: ConfirmedGeneratedData | undefined;
  setGeneratedInfo: React.Dispatch<React.SetStateAction<ConfirmedGeneratedData | undefined>>;
  resume: ResumeResponse | undefined;
  setResume: React.Dispatch<React.SetStateAction<ResumeResponse | undefined>>;
  step: StepperStep;
  setStep: React.Dispatch<React.SetStateAction<StepperStep>>;
};

export const StepperStateContext = createContext<StepperStateContextType>({
  editBulletPoints: true,
  setEditBulletPoints: (val) => {
    console.log(val);
  },
  editPrompt: true,
  setEditPrompt: (val) => {
    console.log(val);
  },
  prompt: '',
  setPrompt: (val) => {
    console.log(val);
  },
  generatedInfo: undefined,
  setGeneratedInfo: (val) => {
    console.log(val);
  },
  resume: undefined,
  setResume: (val) => {
    console.log(val);
  },
  step: 'jobInfo',
  setStep: (val) => {
    console.log(val);
  },
});

export const stepperStateMap = {
  jobInfo: 0,
  settings: 1,
  editPrompt: 2,
  editResume: 3,
  download: 4,
};

export type StepperStep = keyof typeof stepperStateMap;

export function useStepperState() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [step, setStep] = useState<StepperStep>((searchParams.get('step') as StepperStep) ?? 'jobInfo');
  const [editBulletPoints, setEditBulletPoints] = useState(true);
  const [editPrompt, setEditPrompt] = useState(true);
  const savedPrompt = getConfirmedPrompt();
  const [prompt, setPrompt] = useState(savedPrompt);
  const [resume, setResume] = useState<ResumeResponse | undefined>();

  useEffect(() => {
    searchParams.set('step', step);
    setSearchParams(searchParams);
  }, [step]);

  const savedConfirmedInfo = getConfirmedInfo();
  const [generatedInfo, setGeneratedInfo] = useState<ConfirmedGeneratedData | undefined>(savedConfirmedInfo);

  return {
    editBulletPoints,
    setEditBulletPoints,
    editPrompt,
    setEditPrompt,
    prompt,
    setPrompt,
    generatedInfo,
    setGeneratedInfo,
    resume,
    setResume,
    step,
    setStep,
  };
}

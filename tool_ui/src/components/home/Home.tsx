import { useRef } from 'react';
import type SocketClient from '../../socketClient';
import { WebsocketResponseEvent, type ConfirmedGeneratedData } from '../../types';
import { Stepper } from 'primereact/stepper';
import { ApiClient } from '../../apiClient';
import { StepTwo } from './generate_steps/StepTwo';
import { StepOne } from './generate_steps/StepOne';
import { Link } from 'react-router-dom';
import { StepperPanel } from 'primereact/stepperpanel';
import { StepperStateContext, stepperStateMap, useStepperState } from './useStepperState';
import { StepThree } from './generate_steps/StepThree';
import { StepFour } from './generate_steps/StepFour';
import { StepFive } from './generate_steps/StepFive';
import { setConfirmedInfo, setConfirmedPrompt } from '../../utils';
import { Button } from 'primereact/button';

export function Home({ socket }: { socket: SocketClient }) {
  const stepperState = useStepperState();
  const stepperRef = useRef<Stepper | null>(null);

  socket.on(WebsocketResponseEvent.JobCompleted, async () => {
    const filePath = await ApiClient.getResume();
    stepperState.setResume(filePath);
  });

  socket.on(WebsocketResponseEvent.ConfirmPrompt, (data: string) => {
    if (stepperState.step == 'editPrompt') {
      setConfirmedPrompt(data);
      stepperState.setPrompt(data);
    }
  });

  socket.on(WebsocketResponseEvent.ConfirmInfo, (data: ConfirmedGeneratedData) => {
    if (stepperState.step == 'editResume') {
      stepperState.setGeneratedInfo(data);
    }
  });

  const onRestart = () => {
    stepperState.setStep('jobInfo');
    stepperState.setGeneratedInfo(undefined);
    stepperState.setPrompt('');
    setConfirmedInfo(null);
    setConfirmedPrompt('');
  };

  return (
    <StepperStateContext.Provider value={stepperState}>
      <div className="py-8 text-end text-lg">
        <Link className="hover:text-white/50" to="/edit">
          Edit
        </Link>
      </div>
      <div className="bg-darkish pt-4 px-4 pb-8 rounded-md overflow-x-hidden w-full mt-6">
        <div className="flex flex-row justify-between items-center py-6 ">
          <h2 className="text-3xl font-semibold">Generate Resume</h2>
          <Button onClick={onRestart} label="Restart" severity="danger" className="h-8" outlined />
        </div>
        <Stepper
          ref={stepperRef}
          linear
          activeStep={stepperStateMap[stepperState.step]}
          headerPosition="top"
          className="border-1 border-[#424b57] rounded-md"
        >
          <StepperPanel header="Job Information">
            <StepOne stepperRef={stepperRef} />
          </StepperPanel>
          <StepperPanel header="Settings">
            <StepTwo stepperRef={stepperRef} socket={socket} />
          </StepperPanel>
          {stepperState.editPrompt && (
            <StepperPanel header="Edit Prompt">
              <StepThree stepperRef={stepperRef} socket={socket} />
            </StepperPanel>
          )}
          {stepperState.editBulletPoints && (
            <StepperPanel header="Edit Resume">
              <StepFour stepperRef={stepperRef} socket={socket} />
            </StepperPanel>
          )}
          <StepperPanel header="Download">
            <StepFive stepperRef={stepperRef} />
          </StepperPanel>
        </Stepper>
      </div>
    </StepperStateContext.Provider>
  );
}

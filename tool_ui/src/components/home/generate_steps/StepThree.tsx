import type { Stepper } from 'primereact/stepper';
import { useContext, useEffect, type RefObject } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { StepperStateContext, useStepperState } from '../useStepperState';
import { Button } from 'primereact/button';
import { WebsocketRequestEvent, WebsocketResponseEvent } from '../../../types';
import type SocketClient from '../../../socketClient';
import { setConfirmedPrompt } from '../../../utils';

export function StepThree({ stepperRef, socket }: { stepperRef: RefObject<Stepper | null>; socket: SocketClient }) {
  const { prompt, setPrompt } = useContext(StepperStateContext);

  const { setStep } = useStepperState();
  useEffect(() => {
    setStep('editPrompt');
  }, []);

  socket.on(WebsocketResponseEvent.GenerationQueued, () => {
    stepperRef.current?.nextCallback();
  });

  const handleNext = () => {
    socket.emit(WebsocketRequestEvent.ConfirmedPrompt, prompt);
  };

  return (
    <div>
      <div className="w-full py-8 flex flex-col items-center space-y-6 bg-darkish rounded-md">
        <p>This is the prompt that will be used to generate your resume's information. Feel free to make some edits!</p>
        <InputTextarea
          value={prompt}
          onChange={(e) => {
            setConfirmedPrompt(e.target.value);
            setPrompt(e.target.value);
          }}
          rows={15}
          style={{ width: '90%' }}
        />
      </div>
      <div className="w-full flex justify-between mt-12">
        <Button onClick={stepperRef.current?.prevCallback} label="Back" severity="secondary" outlined />
        <Button onClick={handleNext} label="Next" outlined />
      </div>
    </div>
  );
}

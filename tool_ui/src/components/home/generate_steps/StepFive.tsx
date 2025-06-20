import type { Stepper } from 'primereact/stepper';
import { useContext, useEffect, type RefObject } from 'react';
import { Button } from 'primereact/button';
import { StepperStateContext } from '../useStepperState';

export function StepFive({ stepperRef }: { stepperRef: RefObject<Stepper | null> }) {
  const { resume, setResume, setStep } = useContext(StepperStateContext);

  useEffect(() => {
    setStep('download');
  }, []);

  if (!resume) {
    return (
      <div className="w-full text-center pt-24 text-2xl space-y-4">
        <h1>Constructing your tailored resume...</h1>
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
        <div className="w-full flex mt-24">
          <Button onClick={stepperRef.current?.prevCallback} label="Back" severity="secondary" outlined />
        </div>
      </div>
    );
  }

  const handleBack = () => {
    setResume(undefined);
    stepperRef.current?.prevCallback();
  };

  return (
    <div>
      <embed src={resume.filePath} type="application/pdf" width="100%" height="600px" />
      <div className="w-full flex mt-12">
        <Button onClick={handleBack} label="Back" severity="secondary" outlined />
      </div>
    </div>
  );
}

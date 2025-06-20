import type { Stepper } from 'primereact/stepper';
import { useContext, useEffect, type RefObject } from 'react';
import { Button } from 'primereact/button';
import { StepperStateContext, useStepperState } from '../useStepperState';

export function StepFive({ stepperRef }: { stepperRef: RefObject<Stepper | null> }) {
  const { resume, setResume } = useContext(StepperStateContext);
  const { setStep } = useStepperState();

  useEffect(() => {
    setStep('download');
  }, []);

  const download = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      {resume.filePath ? (
        resume.type === 'pdf' ? (
          <embed src={resume.filePath} type="application/pdf" width="100%" height="600px" />
        ) : (
          <div className="w-full flex flex-col items-center py-12">
            <h2 className="text-2xl pb-8">Preview is only available for PDFs</h2>
            <Button
              onClick={() => download(resume.filePath, resume.filename)}
              icon="pi pi-file-word"
              label="Download"
            />
          </div>
        )
      ) : (
        <div className="w-full text-center py-24 text-2xl space-y-4">
          <h1>Loading</h1>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
        </div>
      )}
      <div className="w-full flex mt-12">
        <Button onClick={handleBack} label="Back" severity="secondary" outlined />
      </div>
    </div>
  );
}

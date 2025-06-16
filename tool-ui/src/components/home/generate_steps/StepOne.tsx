import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useState, type FormEvent, type RefObject } from 'react';
import { getJobData, updateJobData } from '../../../utils';
import type { Stepper } from 'primereact/stepper';

export function StepOne({ stepperRef }: { stepperRef: RefObject<Stepper | null> }) {
  const [jobData, setJobData] = useState(getJobData());
  const [jobDescription, setJobDescription] = useState(jobData.job_description ?? '');

  const handleUpdateJob = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    updateJobData({ ...data, job_description: jobDescription });
    setJobData(getJobData());
    stepperRef.current?.nextCallback();
  };

  return (
    <div>
      <div className="rounded-md w-full">
        <form onSubmit={handleUpdateJob}>
          <div className="w-full px-4 py-8 flex flex-col items-center space-y-6 bg-darkish rounded-md">
            <div className="grid grid-cols-2 gap-4 w-3/4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-white/40" htmlFor="name">
                  Position
                </label>
                <InputText name="position" defaultValue={jobData.position} placeholder="Software Engineer" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-white/40" htmlFor="location">
                  Company
                </label>
                <InputText name="company" defaultValue={jobData.company} placeholder="Google" />
              </div>
            </div>
            <div className="flex flex-col gap-1 w-3/4">
              <label className="text-sm text-white/40" htmlFor="position">
                Job Description
              </label>
              <InputTextarea
                value={jobDescription}
                onChange={(e) => {
                  setJobDescription(e.target.value);
                }}
                rows={10}
                cols={30}
              />
            </div>
          </div>
          <div className="w-full flex mt-6 justify-end">
            <Button label="Next" className="w-28" outlined />
          </div>
        </form>
      </div>
    </div>
  );
}

import { InputText } from 'primereact/inputtext';
import { InfoWrapper } from '../InfoWrapper';
import { type ApplicantData } from '../../types';
import type { FormEvent } from 'react';
import { Button } from 'primereact/button';
import { updateApplicantData } from '../../utils';

export function College({
  applicantData,
  refreshApplicant,
}: {
  applicantData: ApplicantData;
  refreshApplicant: () => void;
}) {
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    updateApplicantData(data);
    refreshApplicant();
  };
  return (
    <InfoWrapper onSubmit={onSubmit} title="College">
      <div className="flex flex-col gap-1 w-3/4">
        <label className="text-sm text-white/40" htmlFor="name">
          College
        </label>
        <InputText name="college" defaultValue={applicantData.college} placeholder="Monsters University" />
      </div>
      <div className="grid grid-cols-2 gap-4 w-3/4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-white/40" htmlFor="degree">
            Degree
          </label>
          <InputText name="degree" defaultValue={applicantData.degree} placeholder="Bachelor of Science in Scaring" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-white/40" htmlFor="graduation_year">
            Graduation Year
          </label>
          <InputText name="graduation_year" defaultValue={applicantData.graduation_year} placeholder="2021" />
        </div>
      </div>
      <Button label="Submit" />
    </InfoWrapper>
  );
}

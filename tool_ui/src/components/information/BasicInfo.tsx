import { InputText } from 'primereact/inputtext';
import { InfoWrapper } from '../InfoWrapper';
import type { FormEvent } from 'react';
import { Button } from 'primereact/button';
import { type ApplicantData } from '../../types';
import { updateApplicantData } from '../../utils';

export function BasicInfo({
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
    <InfoWrapper onSubmit={onSubmit} title="Basic Info">
      <div className="grid grid-cols-2 gap-4 w-3/4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-white/40" htmlFor="name">
            Name
          </label>
          <InputText name="name" defaultValue={applicantData.name} placeholder="John Smith" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-white/40" htmlFor="location">
            Location
          </label>
          <InputText name="location" defaultValue={applicantData.location} placeholder="Boston, MA" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 w-3/4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-white/40" htmlFor="phone">
            Phone Number
          </label>
          <InputText name="phone" defaultValue={applicantData.phone} placeholder="888-888-8888" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-white/40" htmlFor="email">
            Email
          </label>
          <InputText name="email" type="email" defaultValue={applicantData.email} placeholder="john@example.com" />
        </div>
      </div>
      <Button label="Submit" />
    </InfoWrapper>
  );
}

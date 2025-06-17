import { InfoWrapper } from '../InfoWrapper';
import { Chips } from 'primereact/chips';
import { useState, type FormEvent } from 'react';
import type { Nullable } from 'primereact/ts-helpers';
import { type ApplicantData } from '../../types';
import { Button } from 'primereact/button';
import { updateApplicantData } from '../../utils';

export function ToolsAndLanguages({
  applicantData,
  refreshApplicant,
}: {
  applicantData: ApplicantData;
  refreshApplicant: () => void;
}) {
  const [tools, setTools] = useState<Nullable<string[]>>(applicantData.tools ?? []);
  const [languages, setLanguages] = useState<Nullable<string[]>>(applicantData.languages ?? []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateApplicantData({
      tools: tools?.map((tool) => tool.trim()) ?? [],
      languages: languages?.map((lang) => lang.trim()) ?? [],
    });
    refreshApplicant();
  };

  return (
    <InfoWrapper
      onSubmit={onSubmit}
      title="Tools & Languages"
      subtitle="Type in and press enter or paste comma seperated list."
    >
      <div className="flex flex-col gap-1 w-3/4">
        <label className="text-sm text-white/40" htmlFor="tools">
          Tools
        </label>
        <Chips
          className="p-fluid"
          value={tools ?? undefined}
          onChange={(e) => setTools(e.value)}
          separator=","
          allowDuplicate={false}
        />
      </div>
      <div className="flex flex-col gap-1 w-3/4">
        <label className="text-sm text-white/40" htmlFor="languages">
          Languages
        </label>
        <Chips
          className="p-fluid"
          value={languages ?? undefined}
          onChange={(e) => setLanguages(e.value)}
          separator=","
          allowDuplicate={false}
        />
      </div>
      <Button label="Submit" />
    </InfoWrapper>
  );
}

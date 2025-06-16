import { InputText } from 'primereact/inputtext';
import { InfoWrapper } from '../InfoWrapper';
import { useState, type FormEvent, type MouseEvent } from 'react';
import { type ApplicantData, type PositionPayload } from '../../types';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { addPosition, deletePosition, updatePosition } from './utils';

export function Positions({
  applicantData,
  refreshApplicant,
}: {
  applicantData: ApplicantData;
  refreshApplicant: () => void;
}) {
  const [addNew, setAddNew] = useState(false);
  const handleAddPosition = (positionData: PositionPayload) => {
    addPosition(positionData);
    setAddNew(false);
    refreshApplicant();
  };

  const handleUpdatePosition = (positionData: PositionPayload, index: number) => {
    updatePosition(positionData, index);
    refreshApplicant();
  };

  return (
    <div className="bg-darkish pt-4 px-4 pb-8 rounded-md overflow-x-hidden w-full">
      <h2 className="text-2xl font-semibold text-center mb-6">Positions</h2>
      {!applicantData.positions?.length ? (
        <Positition updateData={handleAddPosition} />
      ) : (
        <div>
          <Accordion>
            {applicantData.positions.map((p, i) => (
              <AccordionTab
                key={`${p.position}, ${p.company}`}
                header={<PositionHeader position={p} positionIndex={i} refreshApplicant={refreshApplicant} />}
              >
                <Positition updateData={(data) => handleUpdatePosition(data, i)} position={p} />
              </AccordionTab>
            ))}
          </Accordion>
          <div className="flex flex-col items-center mt-6">
            {!addNew ? (
              <Button onClick={() => setAddNew(true)} label="New Position" />
            ) : (
              <Positition updateData={handleAddPosition} />
            )}
            {addNew && (
              <Button onClick={() => setAddNew(false)} severity="danger" className="w-32" outlined label="Cancel" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PositionHeader({
  position,
  positionIndex,
  refreshApplicant,
}: {
  position: PositionPayload;
  positionIndex: number;
  refreshApplicant: () => void;
}) {
  const onDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    deletePosition(positionIndex);
    refreshApplicant();
  };

  return (
    <div className="flex justify-between items-center">
      <h2>
        {position.position}, {position.company}
      </h2>
      <Button onClick={onDelete} label="Delete" icon="pi pi-trash" severity="danger" outlined />
    </div>
  );
}

function Positition({
  position,
  updateData,
}: {
  position?: PositionPayload;
  updateData: (data: PositionPayload) => void;
}) {
  const [description, setDescription] = useState(position?.description ?? '');
  const [hasUpdated, setHasUpdated] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries()) as Omit<PositionPayload, 'description'>;

    updateData({ ...data, description });
  };

  return (
    <InfoWrapper onSubmit={onSubmit}>
      <div className="flex flex-col gap-1 w-3/4">
        <label className="text-sm text-white/40" htmlFor="position">
          Position
        </label>
        <InputText
          onChange={() => setHasUpdated(true)}
          name="position"
          defaultValue={position?.position}
          placeholder="Software Engineer"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 w-3/4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-white/40" htmlFor="company">
            Company
          </label>
          <InputText
            onChange={() => setHasUpdated(true)}
            name="company"
            defaultValue={position?.company}
            placeholder="Google"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-white/40" htmlFor="location">
            Location
          </label>
          <InputText
            onChange={() => setHasUpdated(true)}
            name="location"
            defaultValue={position?.location}
            placeholder="San Francisco, CA"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 w-3/4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-white/40" htmlFor="start">
            Start Date
          </label>
          <InputText
            onChange={() => setHasUpdated(true)}
            name="start"
            defaultValue={position?.start}
            placeholder="January 2021"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-white/40" htmlFor="end">
            End Date
          </label>
          <InputText
            onChange={() => setHasUpdated(true)}
            name="end"
            defaultValue={position?.end}
            placeholder="March 2022"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 w-3/4">
        <label className="text-sm text-white/40" htmlFor="description">
          Description
        </label>
        <InputTextarea
          value={description}
          onChange={(e) => {
            setHasUpdated(true);
            setDescription(e.target.value);
          }}
          rows={5}
          cols={30}
        />
      </div>
      {hasUpdated && <Button label="Submit" />}
    </InfoWrapper>
  );
}

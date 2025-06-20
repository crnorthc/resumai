import type { Stepper } from 'primereact/stepper';
import { useContext, useState, type ReactNode, type RefObject, type MouseEvent, useEffect } from 'react';
import { StepperStateContext, useStepperState } from '../useStepperState';
import type SocketClient from '../../../socketClient';
import { WebsocketRequestEvent, WebsocketResponseEvent, type ConfirmedGeneratedData } from '../../../types';
import { OrderList } from 'primereact/orderlist';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { setConfirmedInfo } from '../../../utils';

export function StepFour({ stepperRef, socket }: { stepperRef: RefObject<Stepper | null>; socket: SocketClient }) {
  const { generatedInfo, setGeneratedInfo } = useContext(StepperStateContext);
  const [newTool, setNewTool] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const { setStep } = useStepperState();
  useEffect(() => {
    setStep('editResume');
  }, []);

  if (!generatedInfo) {
    return (
      <div className="w-full text-center pt-24 text-2xl space-y-4">
        <h1>Generating resume information...</h1>
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
        <div className="w-full flex mt-24">
          <Button onClick={stepperRef.current?.prevCallback} label="Back" severity="secondary" outlined />
        </div>
      </div>
    );
  }

  socket.on(WebsocketResponseEvent.GenerationQueued, () => {
    stepperRef.current?.nextCallback();
  });

  const handleNext = () => {
    socket.emit(WebsocketRequestEvent.ConfirmedInfo, generatedInfo);
  };

  const updateTools = (tools: string[]) => {
    const newInfo = {
      ...generatedInfo,
      tools,
    };
    setConfirmedInfo(newInfo);
    setGeneratedInfo(newInfo);
  };

  const updateLanguages = (languages: string[]) => {
    const newInfo = {
      ...generatedInfo,
      languages,
    };
    setConfirmedInfo(newInfo);
    setGeneratedInfo(newInfo);
  };

  const addTool = () => {
    const newInfo = {
      ...generatedInfo,
      tools: [...generatedInfo.tools, newTool],
    };
    setConfirmedInfo(newInfo);
    setGeneratedInfo(newInfo);
    setNewTool('');
  };

  const deleteTool = (index: number) => {
    const originalInfo = { ...generatedInfo };
    originalInfo.tools.splice(index, 1);
    setConfirmedInfo(originalInfo);
    setGeneratedInfo(originalInfo);
  };

  const updateTool = (index: number, tool: string) => {
    const originalInfo = { ...generatedInfo };
    originalInfo.tools[index] = tool;
    setConfirmedInfo(originalInfo);
    setGeneratedInfo(originalInfo);
  };

  const addLanguage = () => {
    const newInfo = {
      ...generatedInfo,
      languages: [...generatedInfo.languages, newLanguage],
    };
    setConfirmedInfo(newInfo);
    setGeneratedInfo(newInfo);
    setNewLanguage('');
  };

  const deleteLanguage = (index: number) => {
    const originalInfo = { ...generatedInfo };
    originalInfo.languages.splice(index, 1);
    setConfirmedInfo(originalInfo);
    setGeneratedInfo(originalInfo);
  };

  const updateLanguage = (index: number, language: string) => {
    const originalInfo = { ...generatedInfo };
    originalInfo.languages[index] = language;
    setConfirmedInfo(originalInfo);
    setGeneratedInfo(originalInfo);
  };

  const handleBack = () => {
    setConfirmedInfo(null);
    setGeneratedInfo(undefined);
    stepperRef.current?.prevCallback();
  };

  return (
    <div>
      <Accordion>
        {Object.entries(generatedInfo.positions).map(([company, points]) => (
          <AccordionTab header={company} key={company}>
            <PositionList key={company} company={company} points={points} />
          </AccordionTab>
        ))}
        <AccordionTab header="Tools">
          <div className="pl-22 w-full flex justify-between mb-4">
            <InputText
              name="position"
              className="w-4/5"
              value={newTool}
              onChange={(e) => setNewTool(e.target.value)}
              placeholder="New tool"
            />
            <Button onClick={addTool} label="Add" />
          </div>
          <OrderList
            itemTemplate={(item: { value: string; index: number }) => (
              <ItemTemplate item={item} deleteItem={deleteTool} updateItem={updateTool} />
            )}
            dataKey="value"
            value={generatedInfo.tools.map((value, index) => ({
              value,
              index,
            }))}
            onChange={(e) => updateTools(e.value.map((item: { value: string; index: number }) => item.value))}
          />
        </AccordionTab>
        <AccordionTab header="Languages">
          <div className="pl-22 w-full flex justify-between mb-4">
            <InputText
              name="position"
              className="w-4/5"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="New language"
            />
            <Button onClick={addLanguage} label="Add" />
          </div>
          <OrderList
            itemTemplate={(item: { value: string; index: number }) => (
              <ItemTemplate item={item} deleteItem={deleteLanguage} updateItem={updateLanguage} />
            )}
            dataKey="value"
            value={generatedInfo.languages.map((value, index) => ({
              value,
              index,
            }))}
            onChange={(e) => updateLanguages(e.value.map((item: { value: string; index: number }) => item.value))}
          />
        </AccordionTab>
      </Accordion>
      <div className="w-full flex justify-between mt-12">
        <Button onClick={handleBack} label="Back" severity="secondary" outlined />
        <Button onClick={handleNext} label="Next" outlined />
      </div>
    </div>
  );
}

function ItemTemplate({
  item: { value, index },
  deleteItem,
  updateItem,
}: {
  item: { value: string; index: number };
  deleteItem: (index: number) => void;
  updateItem: (index: number, value: string) => void;
}): ReactNode {
  const [edit, setEdit] = useState(false);
  const [newValue, setNewValue] = useState(value);

  const onDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    deleteItem(index);
  };

  return (
    <div className="flex flex-row items-center justify-between space-x-4 z-100">
      {edit ? (
        <>
          <InputText className="w-5/6" value={newValue} onChange={(e) => setNewValue(e.target.value)} />
          <div className="flex flex-row">
            <Button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                console.log('Cancel');
                e.preventDefault();
                e.stopPropagation();
                setEdit(false);
                setNewValue(value);
              }}
              icon="pi pi-times"
              className="text-xs !mr-4 h-8"
              severity="danger"
              outlined
            />
            <Button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateItem(index, newValue);
                setEdit(false);
              }}
              icon="pi pi-check"
              severity="success"
              className="text-xs h-8"
              outlined
            />
          </div>
        </>
      ) : (
        <>
          <p className="pr-4">{value}</p>
          <div className="flex flex-row">
            <Button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => onDelete(e)}
              icon="pi pi-trash"
              className="text-xs !mr-4 h-8"
              severity="danger"
              outlined
            />
            <Button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setEdit(true);
              }}
              icon="pi pi-pencil"
              className="text-xs h-8"
              outlined
            />
          </div>
        </>
      )}
    </div>
  );
}

function PositionList({ company, points }: { company: string; points: string[] }) {
  const { generatedInfo, setGeneratedInfo } = useContext(StepperStateContext);
  const [newPoint, setNewPoint] = useState('');

  const updatePosition = (company: string, points: string[]) => {
    const originalInfo = { ...generatedInfo } as ConfirmedGeneratedData;
    originalInfo.positions[company] = points;
    setGeneratedInfo(originalInfo);
  };

  const addPoint = () => {
    const originalInfo = { ...generatedInfo } as ConfirmedGeneratedData;
    originalInfo.positions[company] = [...points, newPoint];
    setGeneratedInfo(originalInfo);
    setNewPoint('');
  };

  const deletePoint = (index: number) => {
    const originalInfo = { ...generatedInfo } as ConfirmedGeneratedData;
    originalInfo.positions[company].splice(index, 1);
    setGeneratedInfo(originalInfo);
  };

  const updatePoint = (index: number, value: string) => {
    const originalInfo = { ...generatedInfo } as ConfirmedGeneratedData;
    originalInfo.positions[company][index] = value;
    setGeneratedInfo(originalInfo);
  };

  return (
    <div>
      <div className="pl-22 w-full flex justify-between mb-4">
        <InputText
          name="position"
          className="w-4/5"
          value={newPoint}
          onChange={(e) => setNewPoint(e.target.value)}
          placeholder="New bullet point"
        />
        <Button onClick={addPoint} label="Add" />
      </div>
      <OrderList
        itemTemplate={(item: { value: string; index: number }) => (
          <ItemTemplate item={item} deleteItem={deletePoint} updateItem={updatePoint} />
        )}
        dataKey="value"
        value={points.map((value, index) => ({
          id: `${value}-${index}`,
          value,
          index,
        }))}
        onChange={(e) =>
          updatePosition(
            company,
            e.value.map((item: { value: string; index: number }) => item.value)
          )
        }
      />
    </div>
  );
}

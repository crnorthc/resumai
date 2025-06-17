import { BasicInfo } from './information/BasicInfo';
import { College } from './information/College';
import { ToolsAndLanguages } from './information/ToolsAndLanguages';
import { Positions } from './information/Positions';
import { TabMenu } from 'primereact/tabmenu';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getApplicantData } from '../utils';
import { Keys } from './information/Keys';

const MENU_ITEMS = [
  {
    label: 'Basic Info',
    className: '!bg-darkish',
    form: BasicInfo,
  },
  {
    label: 'College',
    className: '!bg-darkish',
    form: College,
  },
  {
    label: 'Tools & Languages',
    className: '!bg-darkish',
    form: ToolsAndLanguages,
  },
  {
    label: 'Positions',
    className: '!bg-darkish',
    form: Positions,
  },
  {
    label: 'Keys',
    className: '!bg-darkish',
    form: Keys,
  },
];

export function EditInfo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const savedTab = searchParams.get('tab');
  const [tab, setTab] = useState(Number(savedTab ?? 0));
  const [applicantData, setApplicantData] = useState(getApplicantData());

  const refreshApplicant = () => setApplicantData(getApplicantData());

  const CurrentTab = MENU_ITEMS[tab].form;

  return (
    <div className="">
      <div className="py-8 text-lg">
        <Link className="hover:text-white/50" to="/">
          Home
        </Link>
      </div>
      <div className="flex justify-center">
        <div className="w-fit px-8 py-4 rounded-md bg-darkish mb-12">
          <TabMenu
            activeIndex={tab}
            onTabChange={(e) => {
              setTab(e.index);
              searchParams.set('tab', `${e.index}`);
              setSearchParams(searchParams);
            }}
            model={MENU_ITEMS}
          />
        </div>
      </div>
      {<CurrentTab applicantData={applicantData} refreshApplicant={refreshApplicant} />}
    </div>
  );
}

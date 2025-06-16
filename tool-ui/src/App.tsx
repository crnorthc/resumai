import { Routes, Route } from 'react-router-dom';
import { useSocketClient } from './hooks/useSocket';
import { useApplicantId } from './hooks/useApplicantId';
import { EditInfo } from './components/EditInfo';
import { Home } from './components/home/Home';
import { useEffect, useRef } from 'react';
import { WebsocketResponseEvent } from './types';
import { Toast } from 'primereact/toast';
import { setConfirmedInfo, setConfirmedPrompt } from './utils';

function App() {
  const clientId = useApplicantId();
  const socket = useSocketClient(clientId);
  const toastRef = useRef<Toast | null>(null);

  useEffect(() => {
    socket?.on(WebsocketResponseEvent.ApplicantDataExpired, () => {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Session Expired',
        detail: 'Your data was cleared from the server. You will need to restart the process',
        life: 3000,
      });
    });
    setConfirmedInfo(null);
    setConfirmedPrompt('');
  }, [socket]);

  return (
    <>
      <Toast ref={toastRef} position="top-right" />
      <div className="flex justify-center w-screen">
        <div className="max-w-[1050px] w-full">
          {!socket ? (
            <div>Loading</div>
          ) : (
            <div>
              <Routes>
                <Route path="/edit" element={<EditInfo />} />
                <Route path="/" element={<Home socket={socket} />} />
              </Routes>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;

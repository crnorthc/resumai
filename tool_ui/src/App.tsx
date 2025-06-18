import { Routes, Route } from 'react-router-dom';
import { useSocketClient } from './hooks/useSocket';
import { useApplicantId } from './hooks/useApplicantId';
import { EditInfo } from './components/EditInfo';
import { Home } from './components/home/Home';
import { useEffect } from 'react';
import { WebsocketResponseEvent } from './types';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { setConfirmedInfo, setConfirmedPrompt } from './utils';

function App() {
  const clientId = useApplicantId();
  const socket = useSocketClient(clientId);

  useEffect(() => {
    socket?.on(WebsocketResponseEvent.ApplicantDataExpired, () => {
      toast.error('Your data was cleared from the server. You will need to restart the process');
    });
    setConfirmedInfo(null);
    setConfirmedPrompt('');
  }, [socket]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} theme="dark" transition={Bounce} />
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

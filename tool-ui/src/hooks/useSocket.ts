import { useEffect, useRef, useState } from "react";
import SocketClient from "../socketClient";


export function useSocketClient(clientId: string | null) {
    const [socket, setSocket] = useState<SocketClient | null>(null);
    const initialized = useRef(false);

    useEffect(() => {
        if (clientId && !initialized.current) {
            const instance = SocketClient.getInstance();
            instance.connect(clientId);
            setSocket(instance);
            initialized.current = true;
        }
    }, [clientId]);

    return socket;
}
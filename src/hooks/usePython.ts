import { useState, useEffect, useCallback } from 'react';

export default function usePython() {
  const [isReady, setIsReady] = useState(false);
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    const pyWorker = new Worker('/pyodideWorker.js');
    
    // Listen for the specific 'ready' signal from our updated worker
    pyWorker.onmessage = (event) => {
      if (event.data.type === 'ready') {
        setIsReady(true);
      }
    };
    
    setWorker(pyWorker);
    return () => pyWorker.terminate();
  }, []);

  // Updated to accept a direct command string and a reset flag
  const runScript = useCallback((code: string, cmd: string = "", reset: boolean = false) => {
    return new Promise((resolve, reject) => {
      if (!worker) return reject("Worker not initialized");
      
      const id = Date.now().toString();
      const handleMessage = (event: MessageEvent) => {
        if (event.data.id === id) {
          worker.removeEventListener('message', handleMessage);
          if (event.data.type === 'result') resolve(event.data.result);
          else if (event.data.type === 'error') reject(new Error(event.data.error));
        }
      };
      
      worker.addEventListener('message', handleMessage);
      
      // Pass the code, command, and reset flag to the worker
      worker.postMessage({ code, cmd, reset, id });
    });
  }, [worker]);

  return { isReady, runScript };
}
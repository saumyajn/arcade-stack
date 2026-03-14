import { useState, useEffect, useCallback } from 'react';

export default function usePython() {
  const [isReady, setIsReady] = useState(false);
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    // Vite serves public files from the root
    const pyWorker = new Worker('/pyodideWorker.js');
    
    pyWorker.onmessage = (event) => {
      if (event.data.type === 'ready') setIsReady(true);
    };
    
    setWorker(pyWorker);
    return () => pyWorker.terminate();
  }, []);

  const runScript = useCallback((code: string, inputs: Record<string, string> = {}) => {
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
      worker.postMessage({ code, inputs, id });
    });
  }, [worker]);

  return { isReady, runScript };
}

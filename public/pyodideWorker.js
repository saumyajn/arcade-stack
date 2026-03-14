importScripts("https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js");

let pyodideReadyPromise;

async function load() {
  self.pyodide = await loadPyodide();
  self.postMessage({ type: 'ready' });
}

pyodideReadyPromise = load();

self.onmessage = async (event) => {
  const { id, code, cmd, reset } = event.data;
  await pyodideReadyPromise;
  
  try {
    let output = "";
    
    // Intercept standard output
    self.pyodide.setStdout({ batched: (msg) => { output += msg + "\n"; } });
    self.pyodide.setStderr({ batched: (msg) => { output += msg + "\n"; } });

    // INJECT INPUT: Set the global "cmd" variable so your Python scripts can read it!
    self.pyodide.globals.set("cmd", cmd || "");

    // RESTART LOGIC: If restarting the game, force the Python 'step' variable back to 0
    if (reset) {
        self.pyodide.globals.set("step", 0);
    }

    // Run the python script
    await self.pyodide.runPythonAsync(code);
    
    self.postMessage({ 
        type: 'result', 
        result: output, 
        id 
    });

  } catch (err) {
    self.postMessage({ type: 'error', error: err.message, id });
  }
};
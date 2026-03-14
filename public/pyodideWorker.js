/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

// Load Pyodide from the CDN (or local public folder if you prefer)
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js");

let pyodide = null;

async function loadEngine() {
  pyodide = await loadPyodide();
}

let pyodideReadyPromise = loadEngine();

self.onmessage = async (event) => {
  const { id, python, inputs, files } = event.data;

  try {
    await pyodideReadyPromise;

    if(files && files.length > 0){
      for(const file of files){
        pyodide.FS.writeFile(file.name, file.content);
      }
    }
    if (inputs) {
      for (const key of Object.keys(inputs)) {
        pyodide.globals.set(key, inputs[key]);
      }
    }

    let output = [];
    pyodide.setStdout({ batched: (msg) => output.push(msg) });


    await pyodide.loadPackagesFromImports(python);
    await pyodide.runPythonAsync(python);

    self.postMessage({ id, results: output.join('\n'), error: null });

  } catch (error) {
    self.postMessage({ id, results: null, error: error.message });
  }
};
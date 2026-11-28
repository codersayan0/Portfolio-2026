/* Real CPython via Pyodide; no execution on the portfolio server. */
const BASES=['https://cdn.jsdelivr.net/pyodide/v0.27.7/full/','https://unpkg.com/pyodide@0.27.7/'];
// The second mirror is an npm distribution; it may be unavailable. The primary is the official distribution.
let runtime,outputLength=0;
function output(s){if(outputLength>=40000)return;const t=String(s).slice(0,40000-outputLength);outputLength+=t.length;self.postMessage({type:'output',text:t});}
async function boot(){
 let last;
 for(const base of BASES){try{
  self.postMessage({type:'status',text:'Loading Python runtime from '+new URL(base).hostname+'…'});
  importScripts(base+'pyodide.js');
  return await loadPyodide({indexURL:base,stdout:s=>output(s+'\n'),stderr:s=>output(s+'\n')});
 }catch(e){last=e;}}
 throw Error('Could not load Python from the configured mirrors. '+String(last?.message||last));
}
self.onmessage=async ({data})=>{
 if(data.type!=='run')return;outputLength=0;
 try{if(!runtime)runtime=await boot();}catch(e){self.postMessage({type:'error',phase:'load',text:String(e.message||e)});return;}
 self.postMessage({type:'running'});
 try{
  const globals=runtime.runPython('dict()');
  try{const value=await runtime.runPythonAsync(data.code,{globals});if(value!==undefined&&value!==null){try{output(String(value)+'\n')}finally{value?.destroy?.()}}}
  finally{try{runtime.runPython('import sys; sys.stdout.flush(); sys.stderr.flush()')}finally{globals.destroy()}}
  self.postMessage({type:'done'});
 }catch(e){self.postMessage({type:'error',phase:'execution',text:String(e.message||e)});}
};

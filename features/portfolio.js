(() => {
 'use strict';
 const $=id=>document.getElementById(id), root=document.documentElement;
 const save=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
 const sync=()=>{
  const light=root.dataset.theme==='light';
  $('theme-toggle').textContent=light?'☾':'☀';$('theme-toggle').setAttribute('aria-label',light?'Switch to dark theme':'Switch to light theme');$('theme-toggle').title=light?'Dark mode':'Light mode';
  document.querySelector('meta[name="theme-color"]').content=light?'#f5f8fc':'#080811';
 };
 $('theme-toggle').addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='light'?'dark':'light';save('portfolio-theme',root.dataset.theme);sync()});
 const greeting=()=>{const h=new Date().getHours();return h<12?'Good morning':h<17?'Good afternoon':'Good evening';};
 $('time-greeting').textContent=greeting()+'! Welcome to my portfolio.';
 $('chat-welcome-open').querySelector('strong').textContent=greeting()+'! 👋';
 for(const d of document.querySelectorAll('.v6-dialog')){d.querySelector('[data-close-dialog]').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}});}
 document.querySelectorAll('[data-open-resume]').forEach(b=>b.addEventListener('click',()=>$('resume-dialog').showModal()));
 const frame=$('resume-frame'), resumeLoad=$('resume-load'), resumeStatus=$('resume-status');
 resumeLoad.addEventListener('click',()=>{if(!frame.hidden){frame.hidden=true;resumeLoad.textContent='Load original PDF preview';resumeLoad.setAttribute('aria-expanded','false');resumeStatus.textContent='';return;}if(!navigator.onLine){resumeStatus.textContent='You appear to be offline. The profile below is still available.';return;}frame.hidden=false;resumeLoad.textContent='Hide PDF preview';resumeLoad.setAttribute('aria-expanded','true');resumeStatus.textContent='Opening Google Drive preview. If it is blank or requests access, use Open PDF or contact Sayan.';if(!frame.hasAttribute('src'))frame.src='https://drive.google.com/file/d/1i4j5R1AtzNhkAkwjXx0yPxiMiK2qLnYo/preview';});
 $('resume-print').addEventListener('click',()=>{$('resume-dialog').querySelector('details').open=true;window.print()});
 document.querySelectorAll('[data-open-share]').forEach(b=>b.addEventListener('click',()=>{$('share-status').textContent='';$('share-dialog').showModal()}));
 $('copy-url').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('share-url').value);$('share-status').textContent='Link copied.'}catch{$('share-url').focus();$('share-url').select();let copied=false;try{copied=document.execCommand('copy')}catch{}$('share-status').textContent=copied?'Link copied.':'Link selected. Press Ctrl+C (or use your device’s Copy command).'}});
 if(navigator.share){$('native-share').hidden=false;$('native-share').addEventListener('click',async()=>{try{await navigator.share({title:'Sayan Mandal | Developer Portfolio',url:$('share-url').value})}catch(e){if(e.name!=='AbortError')$('share-status').textContent='Sharing unavailable. Copy the link instead.'}});}
 const samples={hello:'print("Hello from CoderSayan!")\nfor i in range(1, 6):\n    print(f"Python is running: {i}")',fibonacci:'a, b = 0, 1\nfor _ in range(12):\n    print(a, end=" ")\n    a, b = b, a\nprint()',data:'from statistics import mean, median\nscores = [82, 95, 73, 91, 88]\nprint("Mean:", mean(scores))\nprint("Median:", median(scores))\nprint("Range:", min(scores), max(scores))',algorithm:'def binary_search(items, target):\n    lo, hi = 0, len(items) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if items[mid] == target:\n            return mid\n        if items[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1\n\nprint(binary_search([2, 4, 7, 12, 19], 12))'};
 const code=$('python-code'),output=$('python-output'),status=$('python-status'),run=$('python-run'),stopButton=$('python-stop');let worker=null,timer,busy=false;
 const setBusy=v=>{busy=v;run.disabled=v;stopButton.disabled=!v};
 const append=t=>{if(output.textContent.length<40000)output.textContent=(output.textContent+t).slice(0,40000);output.scrollTop=output.scrollHeight};
 function finish(t){clearTimeout(timer);setBusy(false);status.textContent=t;}
 function stop(t){worker?.terminate();worker=null;finish(t);}
 function reset(){code.value=samples[$('python-example').value];} reset();
 $('python-download').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([code.value],{type:'text/x-python;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='main.py';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);});
 $('python-example').addEventListener('change',reset);$('python-reset').addEventListener('click',reset);$('python-clear').addEventListener('click',()=>output.textContent='');stopButton.addEventListener('click',()=>stop('Stopped. Runtime will reload on next run.'));
 run.addEventListener('click',()=>{if(busy)return;output.textContent='';if(location.protocol==='file:'){append('Open this folder using python -m http.server 8000, then visit http://localhost:8000. Or choose Save .py and run python main.py.\n');status.textContent='Local HTTP server required for browser Python.';return;}if(!navigator.onLine&&!worker){append('Python runtime is not loaded. Connect to the internet or save your code as a .py file.\n');status.textContent='Offline.';return;}setBusy(true);status.textContent='Starting Python…';try{if(!worker){worker=new Worker('features/python-worker.js');worker.onmessage=({data})=>{if(data.type==='status')status.textContent=data.text;if(data.type==='running'){status.textContent='Running…';clearTimeout(timer);timer=setTimeout(()=>stop('Execution exceeded 10 seconds.'),10000)}if(data.type==='output')append(data.text);if(data.type==='done')finish('Finished.');if(data.type==='error'){append(data.text+'\n');if(data.phase==='load'){append('Use Save .py to run your code with Python on your computer.\n');stop('Runtime unavailable. Check internet/CDN access.')}else finish('Python error. Edit your code and run again.')}};worker.onerror=()=>{append('Runtime unavailable. Check internet access and try again, or use Save .py.\n');stop('Unable to load Python.')}}timer=setTimeout(()=>stop('Runtime load timed out. Retry or use Save .py.'),120000);worker.postMessage({type:'run',code:code.value});}catch{stop('This browser could not start Python.');}});
 code.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();run.click()}if(e.key==='Tab'&&!e.shiftKey){e.preventDefault();code.setRangeText('    ',code.selectionStart,code.selectionEnd,'end')}});
 sync();
 // Keep existing icon labels usable when external asset CDNs are unavailable.
 for(const img of document.querySelectorAll('img[src^="https://"]')){
  const fallback=()=>{if(img.closest('.orb-icon')){const label=document.createElement('span');label.className='orb-fallback';label.textContent=({Python:'PY',Docker:'DK',TF:'TF',K8s:'K8',FastAPI:'API',Git:'GIT',Linux:'LX',MySQL:'SQL',GitHub:'GH',Terraform:'IaC'})[img.alt]||img.alt.slice(0,3);label.title=img.alt;img.replaceWith(label)}else if(img.closest('.tech-icon-item,.skill-chip'))img.remove()};
  img.addEventListener('error',fallback,{once:true});if(img.complete&&!img.naturalWidth)fallback();
 }
 const updateIcons=()=>root.classList.toggle('icon-fallback', ![...(document.fonts||[])].some(f=>f.family.includes('Font Awesome')&&f.status==='loaded'));
 document.fonts?.ready.then(updateIcons);document.fonts?.addEventListener('loadingdone',updateIcons);
})();

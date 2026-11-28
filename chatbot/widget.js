(() => {
 const $=id=>document.getElementById(id), panel=$('sayan-chat'), launch=$('chat-launch'), close=$('chat-close'), log=$('chat-log'), form=$('chat-form'), input=$('chat-input'), send=$('chat-send'), status=$('chat-status'), reset=$('chat-reset');
 if(!panel||!launch)return;
 let modelPromise=null, previous='', busy=false, epoch=0;
 const welcome=$('chat-welcome'); let welcomeTimer, welcomeStart;
 function hideWelcome(){clearTimeout(welcomeStart);clearTimeout(welcomeTimer);welcome.hidden=true;}
 function showWelcome(){if(panel.hidden){welcome.hidden=false;welcomeTimer=setTimeout(hideWelcome,10000);}}
 welcomeStart=setTimeout(showWelcome,1200);
 $('chat-welcome-close').addEventListener('click',hideWelcome);
 $('chat-welcome-open').addEventListener('click',()=>setOpen(true));
 function load(){if(window.PORTFOLIO_CHAT_MODEL)return Promise.resolve(window.PORTFOLIO_CHAT_MODEL);if(!modelPromise)modelPromise=fetch('chatbot/model.json').then(r=>{if(!r.ok)throw Error('Model unavailable');return r.json()}).catch(e=>{modelPromise=null;throw e});return modelPromise;}
 function message(role,text,links=[]){const item=document.createElement('div');item.className='chat-message chat-message--'+role;const body=document.createElement('p');body.textContent=text;item.append(body);if(links.length){const row=document.createElement('div');row.className='chat-links';for(const l of links){if(!/^(https:\/\/|mailto:|#[a-z-]+$)/i.test(l.url))continue;const a=document.createElement('a');a.href=l.url;a.textContent=l.label+' ↗';if(l.url.startsWith('https:')){a.target='_blank';a.rel='noopener noreferrer'}else if(l.url.startsWith('#'))a.addEventListener('click',()=>setOpen(false,false));row.append(a)}item.append(row)}log.append(item);while(log.children.length>50)log.firstElementChild.remove();log.scrollTop=log.scrollHeight;return item;}
 function setOpen(open,focus=true){panel.hidden=!open;launch.setAttribute('aria-expanded',String(open));if(open){hideWelcome();load().catch(()=>{});if(focus)input.focus();}else if(focus)launch.focus();}
 function setBusy(v){busy=v;send.disabled=v;input.disabled=v;panel.querySelectorAll('[data-question]').forEach(b=>b.disabled=v);}
 function greeting(){const h=new Date().getHours();const hello=h<12?'Good morning':h<17?'Good afternoon':'Good evening';message('bot',hello+'! 👋 Welcome to Sayan’s portfolio. I’m his local portfolio assistant. Ask me about his projects, skills, education, internships, or resume.');}
 greeting();launch.addEventListener('click',()=>setOpen(panel.hidden));close.addEventListener('click',()=>setOpen(false));panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();setOpen(false)}});
 reset.addEventListener('click',()=>{epoch++;previous='';log.replaceChildren();greeting();setBusy(false);status.textContent='Local trained model · No API key';input.focus()});
 async function ask(raw){const q=raw.trim().slice(0,500);if(!q||busy)return;const current=epoch;message('user',q);input.value='';setBusy(true);const typing=message('bot','Thinking…');let result, local;
  try{const model=await load();local=PortfolioChatEngine.answer(model,q,previous);result=local;
  }catch{result={id:'unknown',answer:'The portfolio model could not load. Please refresh or visit the Contact section.',links:[{label:'Contact',url:'#contact'}]};}
  if(current!==epoch)return;typing.remove();message('bot',result.answer,result.links);previous=local?.id||'';setBusy(false);if(!panel.hidden)input.focus();
 }
 form.addEventListener('submit',e=>{e.preventDefault();ask(input.value)});panel.querySelectorAll('[data-question]').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.question)));
})();

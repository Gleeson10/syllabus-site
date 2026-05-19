(function(){
  const cfg = window.PATHFINDER_CONFIG || {};
  const pageContext = cfg.context || '';
  const suggestions = cfg.suggestions || [
    {label:'No idea what I want',text:'I have no idea what I want to do'},
    {label:'I like working with my hands',text:'I like working with my hands'},
    {label:'Good money, fast',text:'I want to make good money fast'},
    {label:'I love tech',text:'I love tech and computers'}
  ];
  const openingMessage = cfg.opening ||
    "Hey! I'm Pathfinder 🧭 — the career advisor school never gave you.\n\nI help students find paths that don't require a four-year degree. Spoiler: there are a lot of them.\n\nSo — what's something you actually enjoy doing, even if it seems totally random?";

  const BASE_SYSTEM = `You are Pathfinder — a friendly, slightly sarcastic AI career advisor on a website called "This Wasn't On The Syllabus", built by a high school sophomore named Tyler.

Your job: help students discover career paths that DON'T require a four-year college degree.

RESPONSE RULES — follow strictly:
- Keep responses SHORT. Max 3-4 sentences or 3 bullet points.
- One idea at a time. Never dump everything at once.
- Ask ONE follow-up question at the end to keep the conversation going.
- Casual, funny, warm — like a cool older sibling.
- When recommending a career: name, one sentence why it fits, salary range, one next step. That's it.
- Never make college sound like the only path.
- Never write more than 5 lines total.`;

  const SYSTEM = pageContext ? BASE_SYSTEM + '\n\nCURRENT PAGE CONTEXT: ' + pageContext : BASE_SYSTEM;

  // Inject CSS
  const style = document.createElement('style');
  style.textContent = `.pf-bubble{position:fixed;bottom:2rem;right:2rem;z-index:999;}.pf-btn{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#1A6FFF,#7B6FFF);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 4px 24px rgba(26,111,255,0.45);transition:transform 0.2s,box-shadow 0.2s;}.pf-btn:hover{transform:scale(1.08);box-shadow:0 6px 32px rgba(26,111,255,0.6);}.pf-label{position:absolute;right:64px;top:50%;transform:translateY(-50%);background:rgba(18,18,30,0.95);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);color:#fff;font-size:12px;font-weight:700;padding:6px 12px;border-radius:6px;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity 0.2s;font-family:'Archivo Black',sans-serif;}.pf-bubble:hover .pf-label{opacity:1;}.pf-window{position:fixed;bottom:5.5rem;right:2rem;width:390px;height:560px;background:rgba(10,10,20,0.97);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.1);border-radius:18px;box-shadow:0 24px 64px rgba(0,0,0,0.6),0 0 0 1px rgba(26,111,255,0.12);z-index:998;display:flex;flex-direction:column;overflow:hidden;transform:scale(0.9) translateY(20px);opacity:0;pointer-events:none;transition:transform 0.25s ease,opacity 0.25s ease,width 0.3s,height 0.3s,bottom 0.3s,right 0.3s,border-radius 0.3s;}.pf-window.open{transform:scale(1) translateY(0);opacity:1;pointer-events:all;box-shadow:0 24px 64px rgba(0,0,0,0.6),0 0 0 1px rgba(26,111,255,0.15);}.pf-window.dragging{box-shadow:0 24px 64px rgba(0,0,0,0.6),0 0 0 1px rgba(26,111,255,0.3);}.pf-window.fullscreen{width:calc(100vw - 4rem);height:calc(100vh - 4rem);bottom:2rem;right:2rem;border-radius:18px;}.pf-header{padding:1rem 1.2rem;border-bottom:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;gap:10px;flex-shrink:0;background:rgba(18,18,30,0.5);}.pf-header-icon{width:36px;height:36px;background:linear-gradient(135deg,#1A6FFF,#7B6FFF);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;}.pf-header-name{font-family:'Archivo Black',sans-serif;font-size:14px;color:#fff;letter-spacing:0.2px;}.pf-header-status{font-size:11px;color:rgba(255,255,255,0.35);display:flex;align-items:center;gap:4px;margin-top:1px;}.pf-header-status::before{content:'';width:6px;height:6px;border-radius:50%;background:#22c55e;display:inline-block;}.pf-header-actions{margin-left:auto;display:flex;gap:6px;}.pf-icon-btn{background:none;border:none;color:rgba(255,255,255,0.3);font-size:15px;cursor:pointer;padding:5px;line-height:1;transition:color 0.15s;border-radius:4px;}.pf-icon-btn:hover{color:#fff;background:rgba(255,255,255,0.07);}.pf-messages{flex:1;overflow-y:auto;padding:1.2rem;display:flex;flex-direction:column;gap:14px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.08) transparent;}.pf-msg{display:flex;gap:8px;align-items:flex-start;max-width:85%;}.pf-msg.user{align-self:flex-end;flex-direction:row-reverse;max-width:80%;}.pf-avatar{width:28px;height:28px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:13px;background:linear-gradient(135deg,#1A6FFF,#7B6FFF);margin-top:2px;}.pf-msg.user .pf-avatar{background:rgba(255,255,255,0.1);}.pf-bubble-inner{font-size:13px;line-height:1.65;padding:10px 14px;border-radius:14px;max-width:100%;font-family:'Inter',sans-serif;}.pf-msg.ai .pf-bubble-inner{background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.85);border-radius:4px 14px 14px 14px;border:1px solid rgba(255,255,255,0.07);}.pf-msg.user .pf-bubble-inner{background:linear-gradient(135deg,#1A6FFF,#7B6FFF);color:#fff;border-radius:14px 4px 14px 14px;}.pf-cursor{color:#7EB3FF;font-size:11px;animation:pfBlink 0.7s infinite;margin-left:1px;}@keyframes pfBlink{0%,100%{opacity:1;}50%{opacity:0;}}.pf-typing{display:flex;gap:8px;align-items:center;}.pf-typing-dots{display:flex;gap:4px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.07);padding:10px 14px;border-radius:4px 14px 14px 14px;}.pf-typing-dots span{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.3);animation:pfDot 1.2s infinite;}.pf-typing-dots span:nth-child(2){animation-delay:0.2s;}.pf-typing-dots span:nth-child(3){animation-delay:0.4s;}@keyframes pfDot{0%,60%,100%{opacity:0.3;transform:translateY(0);}30%{opacity:1;transform:translateY(-3px);}}.pf-suggestions{display:flex;flex-wrap:wrap;gap:6px;padding:0 1rem 0.8rem;flex-shrink:0;}.pf-suggestion{background:rgba(26,111,255,0.08);border:1px solid rgba(26,111,255,0.2);color:#7EB3FF;font-size:11px;font-weight:500;padding:5px 11px;border-radius:999px;cursor:pointer;font-family:'Inter',sans-serif;transition:background 0.15s;white-space:nowrap;}.pf-suggestion:hover{background:rgba(26,111,255,0.18);}.pf-input-area{padding:0.8rem 1rem;border-top:1px solid rgba(255,255,255,0.07);display:flex;gap:8px;align-items:flex-end;flex-shrink:0;}.pf-input{flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:9px 13px;font-size:13px;color:#fff;font-family:'Inter',sans-serif;resize:none;outline:none;line-height:1.5;max-height:100px;transition:border-color 0.15s;}.pf-input::placeholder{color:rgba(255,255,255,0.22);}.pf-input:focus{border-color:rgba(26,111,255,0.5);}.pf-send{width:36px;height:36px;background:linear-gradient(135deg,#1A6FFF,#7B6FFF);border:none;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity 0.15s;font-size:14px;color:#fff;}.pf-send:disabled{opacity:0.35;cursor:not-allowed;}.pf-send:not(:disabled):hover{opacity:0.82;}.pf-resize-handle{position:absolute;width:16px;height:16px;z-index:10;opacity:0;transition:opacity 0.15s;}.pf-window:hover .pf-resize-handle{opacity:1;}@property --pf-angle{syntax:"<angle>";initial-value:0deg;inherits:false;}.pf-glow-ring{position:fixed;border-radius:20px;pointer-events:none;z-index:997;opacity:0;transition:opacity 0.4s;--pf-angle:0deg;animation:pfAngleSpin 5s linear infinite;}.pf-glow-ring.visible{opacity:1;}.pf-glow-ring::before{content:'';position:absolute;inset:-2px;border-radius:21px;background:conic-gradient(from var(--pf-angle),transparent 55%,rgba(26,111,255,0.55) 72%,rgba(167,139,250,0.65) 82%,rgba(34,211,238,0.45) 90%,transparent 100%);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;padding:1.5px;}@keyframes pfAngleSpin{to{--pf-angle:360deg;}}`;
  document.head.appendChild(style);

  // Inject HTML
  const suggestionsHTML = suggestions.map(s =>
    `<button class="pf-suggestion" onclick="pfSuggest('${s.text.replace(/'/g,"\\'")}')">${s.label}</button>`
  ).join('');

  const widget = document.createElement('div');
  widget.className = 'pf-bubble';
  widget.id = 'pfBubble';
  widget.innerHTML = `
    <div class="pf-window" id="pfWindow">
      <div class="pf-header">
        <div class="pf-header-icon">🧭</div>
        <div>
          <div class="pf-header-name">Pathfinder</div>
          <div class="pf-header-status">AI Career Advisor</div>
        </div>
        <div class="pf-header-actions">
          <button class="pf-icon-btn" id="pfFullscreenBtn" title="Fullscreen">⛶</button>
          <button class="pf-icon-btn" id="pfClose" title="Close">✕</button>
        </div>
      </div>
      <div class="pf-messages" id="pfMessages"></div>
      <div class="pf-suggestions" id="pfSuggestions">${suggestionsHTML}</div>
      <div class="pf-input-area">
        <textarea class="pf-input" id="pfInput" placeholder="What are you into? Tell Pathfinder..." rows="1"></textarea>
        <button class="pf-send" id="pfSend">➤</button>
      </div>
      <div class="pf-resize-handle" id="pfResizenw" data-dir="nw" style="top:0;left:0;cursor:nw-resize;"></div>
      <div class="pf-resize-handle" id="pfResizene" data-dir="ne" style="top:0;right:0;cursor:ne-resize;"></div>
      <div class="pf-resize-handle" id="pfResizesw" data-dir="sw" style="bottom:0;left:0;cursor:sw-resize;"></div>
      <div class="pf-resize-handle" id="pfResizese" data-dir="se" style="bottom:0;right:0;cursor:se-resize;"></div>
      <div class="pf-resize-edge" data-dir="w" style="position:absolute;top:16px;bottom:16px;left:0;width:6px;cursor:w-resize;z-index:10;"></div>
      <div class="pf-resize-edge" data-dir="e" style="position:absolute;top:16px;bottom:16px;right:0;width:6px;cursor:e-resize;z-index:10;"></div>
      <div class="pf-resize-edge" data-dir="s" style="position:absolute;bottom:0;left:16px;right:16px;height:6px;cursor:s-resize;z-index:10;"></div>
    </div>
    <button class="pf-btn" id="pfBtn">🧭</button>
    <div class="pf-label">Pathfinder</div>
  `;
  document.body.appendChild(widget);

  // Wire up logic
  const pfWindow = document.getElementById('pfWindow');
  const pfBtn = document.getElementById('pfBtn');
  const pfClose = document.getElementById('pfClose');
  const pfFullscreenBtn = document.getElementById('pfFullscreenBtn');
  const pfMessages = document.getElementById('pfMessages');
  const pfInput = document.getElementById('pfInput');
  const pfSend = document.getElementById('pfSend');
  const pfSuggestions = document.getElementById('pfSuggestions');
  let pfOpen=false, pfLoading=false, pfStarted=false, pfIsFullscreen=false;
  let pfHistory=[];

  // Move window out of bubble so it can be dragged independently
  document.body.appendChild(pfWindow);

  // Glow ring — sits behind the window and tracks its position/size
  const pfGlowRing = document.createElement('div');
  pfGlowRing.className = 'pf-glow-ring';
  document.body.appendChild(pfGlowRing);

  function syncGlowRing(){
    const r = pfWindow.getBoundingClientRect();
    pfGlowRing.style.top = r.top+'px'; pfGlowRing.style.left = r.left+'px';
    pfGlowRing.style.width = r.width+'px'; pfGlowRing.style.height = r.height+'px';
  }

  pfBtn.addEventListener('click',()=>{
    pfOpen=!pfOpen;
    pfWindow.classList.toggle('open',pfOpen);
    if(pfOpen&&!pfStarted){pfStarted=true;setTimeout(()=>pfTypeMessage(openingMessage),400);}
    if(pfOpen){setTimeout(()=>pfInput.focus(),300); setTimeout(()=>{syncGlowRing();pfGlowRing.classList.add('visible');},300);}
    else{pfGlowRing.classList.remove('visible');}
  });
  pfClose.addEventListener('click',()=>{pfOpen=false;pfWindow.classList.remove('open');pfGlowRing.classList.remove('visible');});
  pfFullscreenBtn.addEventListener('click',()=>{
    pfIsFullscreen=!pfIsFullscreen;
    pfWindow.classList.toggle('fullscreen',pfIsFullscreen);
    pfFullscreenBtn.textContent=pfIsFullscreen?'⊡':'⛶';
    pfFullscreenBtn.title=pfIsFullscreen?'Exit fullscreen':'Fullscreen';
  });

  // Drag to move
  const pfHeader = pfWindow.querySelector('.pf-header');
  pfHeader.style.cursor='grab';
  let dragging=false, dragOffX=0, dragOffY=0, hasDragged=false;

  function startDrag(clientX, clientY){
    if(pfIsFullscreen) return;
    if(!hasDragged){
      const r=pfWindow.getBoundingClientRect();
      pfWindow.style.bottom='auto'; pfWindow.style.right='auto';
      pfWindow.style.top=r.top+'px'; pfWindow.style.left=r.left+'px';
      hasDragged=true;
    }
    dragging=true;
    const r=pfWindow.getBoundingClientRect();
    dragOffX=clientX-r.left; dragOffY=clientY-r.top;
    pfHeader.style.cursor='grabbing';
    pfWindow.style.transition='opacity 0.25s ease,transform 0.25s ease';
    pfWindow.classList.add('dragging');
  }
  function moveDrag(clientX, clientY){
    if(!dragging) return;
    let x=clientX-dragOffX, y=clientY-dragOffY;
    x=Math.max(0,Math.min(x,window.innerWidth-pfWindow.offsetWidth));
    y=Math.max(0,Math.min(y,window.innerHeight-pfWindow.offsetHeight));
    pfWindow.style.left=x+'px'; pfWindow.style.top=y+'px';
    syncGlowRing();
  }
  function endDrag(){ dragging=false; pfHeader.style.cursor='grab'; pfWindow.classList.remove('dragging'); }

  pfHeader.addEventListener('mousedown',e=>{if(e.target.closest('.pf-icon-btn'))return; startDrag(e.clientX,e.clientY);});
  document.addEventListener('mousemove',e=>{if(dragging)moveDrag(e.clientX,e.clientY); if(resizing)doResize(e.clientX,e.clientY);});
  document.addEventListener('mouseup',()=>{endDrag(); if(resizing)endResize();});
  pfHeader.addEventListener('touchstart',e=>{if(e.target.closest('.pf-icon-btn'))return; startDrag(e.touches[0].clientX,e.touches[0].clientY);},{passive:true});
  document.addEventListener('touchmove',e=>{if(dragging)moveDrag(e.touches[0].clientX,e.touches[0].clientY); if(resizing)doResize(e.touches[0].clientX,e.touches[0].clientY);},{passive:true});
  document.addEventListener('touchend',()=>{endDrag(); if(resizing)endResize();});

  // 4-corner resize
  const MIN_W=280, MIN_H=320;
  let resizing=false, resizeDir='', resizeStartX=0, resizeStartY=0, resizeStartW=0, resizeStartH=0, resizeStartL=0, resizeStartT=0;
  function startResize(dir, clientX, clientY){
    if(pfIsFullscreen) return;
    if(!hasDragged){
      const r=pfWindow.getBoundingClientRect();
      pfWindow.style.bottom='auto'; pfWindow.style.right='auto';
      pfWindow.style.top=r.top+'px'; pfWindow.style.left=r.left+'px';
      hasDragged=true;
    }
    resizing=true; resizeDir=dir;
    resizeStartX=clientX; resizeStartY=clientY;
    resizeStartW=pfWindow.offsetWidth; resizeStartH=pfWindow.offsetHeight;
    const r=pfWindow.getBoundingClientRect();
    resizeStartL=r.left; resizeStartT=r.top;
    pfWindow.style.transition='opacity 0.25s ease,transform 0.25s ease';
    pfWindow.classList.add('dragging');
  }
  function doResize(clientX,clientY){
    const dx=clientX-resizeStartX, dy=clientY-resizeStartY;
    let w=resizeStartW, h=resizeStartH, l=resizeStartL, t=resizeStartT;
    if(resizeDir.includes('e')) w=Math.max(MIN_W, Math.min(resizeStartW+dx, window.innerWidth-resizeStartL-8));
    if(resizeDir.includes('s')) h=Math.max(MIN_H, Math.min(resizeStartH+dy, window.innerHeight-resizeStartT-8));
    if(resizeDir.includes('w')){
      w=Math.max(MIN_W, resizeStartW-dx);
      l=Math.min(resizeStartL+dx, resizeStartL+resizeStartW-MIN_W);
      l=Math.max(0,l);
    }
    if(resizeDir.includes('n')){
      h=Math.max(MIN_H, resizeStartH-dy);
      t=Math.min(resizeStartT+dy, resizeStartT+resizeStartH-MIN_H);
      t=Math.max(0,t);
    }
    pfWindow.style.width=w+'px'; pfWindow.style.height=h+'px';
    pfWindow.style.left=l+'px'; pfWindow.style.top=t+'px';
    syncGlowRing();
  }
  function endResize(){ resizing=false; resizeDir=''; pfWindow.classList.remove('dragging'); }
  document.querySelectorAll('.pf-resize-handle, .pf-resize-edge').forEach(h=>{
    h.addEventListener('mousedown',e=>{e.preventDefault();e.stopPropagation();startResize(h.dataset.dir,e.clientX,e.clientY);});
    h.addEventListener('touchstart',e=>{e.stopPropagation();startResize(h.dataset.dir,e.touches[0].clientX,e.touches[0].clientY);},{passive:true});
  });
  pfInput.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();pfSendMessage();}});
  pfInput.addEventListener('input',()=>{pfInput.style.height='auto';pfInput.style.height=Math.min(pfInput.scrollHeight,100)+'px';});
  pfSend.addEventListener('click',pfSendMessage);

  window.pfSuggest=function(text){
    pfInput.value=text;
    pfSuggestions.style.display='none';
    pfSendMessage();
  };

  async function pfSendMessage(){
    const text=pfInput.value.trim();
    if(!text||pfLoading)return;
    pfSuggestions.style.display='none';
    pfAppend('user',text);
    pfInput.value='';pfInput.style.height='auto';
    pfHistory.push({role:'user',content:text});
    pfLoading=true;pfSend.disabled=true;
    const typing=pfShowTyping();
    try{
      const res=await fetch('/api/chat',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-sonnet-4-5',max_tokens:400,system:SYSTEM,messages:pfHistory})
      });
      const data=await res.json();
      if(!res.ok){pfRemoveTyping(typing);pfTypeMessage('API error: '+(data.error||JSON.stringify(data)));pfLoading=false;pfSend.disabled=false;return;}
      const reply=data.content.filter(b=>b.type==='text').map(b=>b.text).join('\n');
      pfRemoveTyping(typing);
      pfHistory.push({role:'assistant',content:reply});
      pfTypeMessage(reply);
    }catch(e){
      pfRemoveTyping(typing);
      pfTypeMessage('Something went wrong — try again! 😅');
    }
    pfLoading=false;pfSend.disabled=false;
  }

  function pfTypeMessage(text){
    const msg=document.createElement('div');
    msg.className='pf-msg ai';
    const av=document.createElement('div');
    av.className='pf-avatar';av.textContent='🧭';
    const bub=document.createElement('div');
    bub.className='pf-bubble-inner';
    msg.appendChild(av);msg.appendChild(bub);
    pfMessages.appendChild(msg);
    pfMessages.scrollTop=pfMessages.scrollHeight;
    let i=0;
    const speed=18;
    function type(){
      if(i<text.length){
        bub.innerHTML=pfFormat(text.slice(0,i+1))+'<span class="pf-cursor">▋</span>';
        i++;pfMessages.scrollTop=pfMessages.scrollHeight;
        setTimeout(type,speed);
      } else {
        bub.innerHTML=pfFormat(text);
        pfMessages.scrollTop=pfMessages.scrollHeight;
        pfInput.focus();
      }
    }
    type();
  }

  function pfAppend(role,text){
    const msg=document.createElement('div');
    msg.className=`pf-msg ${role}`;
    const av=document.createElement('div');
    av.className='pf-avatar';av.textContent=role==='ai'?'🧭':'👤';
    const bub=document.createElement('div');
    bub.className='pf-bubble-inner';
    bub.innerHTML=pfFormat(text);
    msg.appendChild(av);msg.appendChild(bub);
    pfMessages.appendChild(msg);
    pfMessages.scrollTop=pfMessages.scrollHeight;
  }

  function pfFormat(text){
    return text
      .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
      .replace(/^[•\-] (.+)$/gm,'<li style="margin-left:1rem;margin-bottom:3px;">$1</li>')
      .replace(/\n\n/g,'<br><br>').replace(/\n/g,'<br>');
  }

  function pfShowTyping(){
    const t=document.createElement('div');
    t.className='pf-typing';
    t.innerHTML=`<div class="pf-avatar">🧭</div><div class="pf-typing-dots"><span></span><span></span><span></span></div>`;
    pfMessages.appendChild(t);pfMessages.scrollTop=pfMessages.scrollHeight;return t;
  }
  function pfRemoveTyping(el){if(el&&el.parentNode)el.parentNode.removeChild(el);}
})();

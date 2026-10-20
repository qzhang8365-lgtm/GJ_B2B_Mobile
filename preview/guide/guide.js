const feedback=document.querySelector('.feedback');
const say=(t,ms)=>{feedback.textContent=t;clearTimeout(say.t);say.t=setTimeout(()=>feedback.textContent='',ms)};
const copy=async(text,ok)=>{try{await navigator.clipboard.writeText(text);say(ok,2500)}catch{say('复制失败，请选择文字手动复制',4000)}};

/* 入口 Prompt */
document.querySelectorAll('[data-copy-target]').forEach(b=>b.addEventListener('click',()=>copy(document.getElementById(b.dataset.copyTarget).textContent,'已复制')));

/* 页签组（角色 / 任务）：各组独立，方向键切换，复制本组当前面板的 Prompt */
document.querySelectorAll('[data-tabs]').forEach(box=>{
  const tabs=[...box.querySelectorAll('[role=tab]')];
  const select=(i,focus)=>{tabs.forEach((t,j)=>{const on=i===j;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!on});if(focus)tabs[i].focus()};
  tabs.forEach((t,i)=>{t.addEventListener('click',()=>select(i));t.addEventListener('keydown',e=>{const k={ArrowDown:1,ArrowRight:1,ArrowUp:-1,ArrowLeft:-1}[e.key];if(k){e.preventDefault();select((i+k+tabs.length)%tabs.length,true)}})});
  const cp=box.querySelector('[data-copy-prompt]');
  if(cp)cp.addEventListener('click',()=>{const p=box.querySelector('[role=tabpanel]:not([hidden]) .prompt-text');if(p)copy(p.textContent,'Prompt 已复制')});
});

/* 页内链接：页面嵌在规范站 iframe 中（高度随内容撑开），滚动交给父页面 */
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const el=document.querySelector(a.getAttribute('href'));if(!el)return;e.preventDefault();
  try{const f=window.frameElement;if(f){const top=f.getBoundingClientRect().top+el.getBoundingClientRect().top+window.parent.scrollY-72;window.parent.scrollTo({top,behavior:'smooth'});return}}catch{}
  el.scrollIntoView({behavior:'smooth'})}));

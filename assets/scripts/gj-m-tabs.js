/* Accessible prototype interaction. Attach to an existing tablist with linked panels. */
(function(){
 function init(root){root.querySelectorAll('[role="tablist"]').forEach(list=>{
  if(list.dataset.tabsReady)return;list.dataset.tabsReady='true';
  const all=()=>[...list.querySelectorAll('[role="tab"]')];
  function activate(tab,focus){if(tab.disabled)return;all().forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;const panel=root.getElementById(t.getAttribute('aria-controls'));if(panel)panel.hidden=!active});if(focus)tab.focus();const left=tab.offsetLeft-list.offsetLeft;if(left<list.scrollLeft)list.scrollLeft=left;else if(left+tab.offsetWidth>list.scrollLeft+list.clientWidth)list.scrollLeft=left+tab.offsetWidth-list.clientWidth;list.dispatchEvent(new CustomEvent('gj:tabchange',{bubbles:true,detail:{label:tab.textContent.trim(),id:tab.id}}))}
  list.addEventListener('click',e=>{const t=e.target.closest('[role="tab"]');if(t&&list.contains(t))activate(t,false)});
  list.addEventListener('keydown',e=>{const tabs=all().filter(t=>!t.disabled),i=tabs.indexOf(e.target);if(i<0)return;let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;else if(e.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();activate(tabs[next],true)});
 });}
 window.GJTabs={init};
})();

/* Prototype Markdown subset for the AI chat styles (Figma 955:474 对话流 + 1097:8 Markdown 内容组件).
 * 支持：标题 H1–H3、段落、加粗、链接、行内代码、来源引用 [^1] / [^link]、无序 / 有序列表（两级嵌套）、任务列表、
 * 引用块、代码块、表格、分割线、图片 + 图注。不是完整 CommonMark/GFM；原始 HTML 一律转义，链接与图片只接受 http(s) 地址。
 */
(function(scope){
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function safeURL(value){try{const u=new URL(value,'https://example.invalid/');return /^https?:$/.test(u.protocol)&&u.host!=='example.invalid'?value:null}catch{return null}}
 function inline(value){let result='',i=0;const re=/`([^`\n]+)`|\*\*([^*\n]+)\*\*|\[([^\]\n]+)\]\(([^\s)]+)\)|\[\^(\d+|link)\]/g;let m;while((m=re.exec(value))){result+=esc(value.slice(i,m.index));
  if(m[3]&&m.index>0&&value[m.index-1]==='!'){result+=esc(m[0]);i=re.lastIndex;continue}
  if(m[1])result+='<code>'+esc(m[1])+'</code>';
  else if(m[2])result+='<strong>'+inline(m[2])+'</strong>';
  else if(m[5]==='link')result+='<a class="gj-m-ai-citation is-link" href="#source-link" aria-label="查看引用链接"><span></span></a>';
  else if(m[5])result+='<a class="gj-m-ai-citation" href="#source-'+m[5]+'" aria-label="查看来源 '+m[5]+'"><span>'+m[5]+'</span></a>';
  else{const url=/^#/.test(m[4])?m[4]:safeURL(m[4]);result+=url?'<a href="'+esc(url)+'"'+(url[0]==='#'?'':' target="_blank" rel="noopener noreferrer"')+'>'+esc(m[3])+'</a>':esc(m[3])}
  i=re.lastIndex}return result+esc(value.slice(i))}
 const cells=line=>line.trim().replace(/^\|/,'').replace(/\|$/,'').split('|').map(x=>x.trim());
 const itemRe=/^(\s*)([-*+]|\d+\.)\s+(.*)$/;
 const track='<div class="gj-m-ai-table-track" aria-hidden="true"><span></span></div>';
 const isTable=(lines,i)=>lines[i].includes('|')&&i+1<lines.length&&/^\|?\s*:?-{3,}/.test(lines[i+1])&&cells(lines[i+1]).every(c=>/^:?-{3,}:?$/.test(c));
 const blockStart=/^(?:#{1,6}\s|\s*[-*+]\s|\s*\d+\.\s|\s*(?:---+|\*\*\*+)\s*$|```|\s*>|!\[)/;
 function render(text){const lines=String(text).replace(/\r\n?/g,'\n').split('\n');let out='',i=0;
  /* 列表：同一缩进为同级；更深缩进的列表项作为上一项的子列表（建议最多两级）；“- [ ] / - [x]”为任务项 */
  function list(base){const ordered=/\d/.test(lines[i].match(itemRe)[2]),items=[];
   while(i<lines.length){const line=lines[i],m=line.match(itemRe);
    if(m&&m[1].length===base&&/\d/.test(m[2])===ordered){let t=m[3],task=null;const k=!ordered&&t.match(/^\[([ xX])\]\s+(.*)$/);if(k){task=k[1]!==' ';t=k[2]}items.push({t,task,extra:''});i++;continue}
    if(m&&m[1].length>base&&items.length){items[items.length-1].extra+=list(m[1].length);continue}
    if(!m&&items.length&&/^ {2,}\S/.test(line)){items[items.length-1].extra+='<p>'+inline(line.trim())+'</p>';i++;continue}
    break}
   const tag=ordered?'ol':'ul',task=items.some(x=>x.task!==null);
   return '<'+tag+(task?' class="is-task"':'')+'>'+items.map(x=>x.task===null?'<li>'+inline(x.t)+x.extra+'</li>'
    :'<li class="gj-m-ai-task'+(x.task?' is-done':'')+'"><span class="gj-m-checkbox'+(x.task?' is-checked':'')+'" role="img" aria-label="'+(x.task?'已完成':'未完成')+'"><span class="gj-m-checkbox-icon"></span></span><span class="gj-m-ai-task-text">'+inline(x.t)+'</span>'+x.extra+'</li>').join('')+'</'+tag+'>'}
  while(i<lines.length){const line=lines[i];if(!line.trim()){i++;continue}let m;
   if((m=line.match(/^```\s*([\w+#.-]*)/))){const lang=m[1],code=[];i++;while(i<lines.length&&!/^```/.test(lines[i]))code.push(lines[i++]);i++;
    out+='<div class="gj-m-ai-code gj-m-ai-table-scroll" tabindex="0" role="region" aria-label="'+(lang?esc(lang)+' ':'')+'代码，可左右滚动">'+(lang?'<div class="gj-m-ai-code-lang">'+esc(lang)+'</div>':'')+'<pre><code>'+esc(code.join('\n'))+'</code></pre></div>'+track;continue}
   if((m=line.match(/^(#{1,6})\s+(.*)$/))){out+='<h'+m[1].length+'>'+inline(m[2])+'</h'+m[1].length+'>';i++;continue}
   if(/^\s*(---+|\*\*\*+)\s*$/.test(line)){out+='<hr>';i++;continue}
   if(/^\s*>/.test(line)){const q=[];while(i<lines.length&&/^\s*>/.test(lines[i]))q.push(lines[i++].replace(/^\s*>\s?/,''));out+='<blockquote><p>'+q.map(inline).join('<br>')+'</p></blockquote>';continue}
   if((m=line.match(/^!\[([^\]\n]*)\]\(([^\s)]*)\)\s*$/))){const url=safeURL(m[2]);
    out+='<figure class="gj-m-ai-figure"><div class="gj-m-image gj-m-image-16x9'+(url?'':' is-error')+'">'+(url?'<img src="'+esc(url)+'" alt="'+esc(m[1])+'" loading="lazy" referrerpolicy="no-referrer">':'<span class="gj-m-ai-sr">'+esc(m[1]||'图片')+'</span>')+'</div>'+(m[1]?'<figcaption>'+inline(m[1])+'</figcaption>':'')+'</figure>';i++;continue}
   if(isTable(lines,i)){const head=cells(line);i+=2;out+='<div class="gj-m-ai-table-scroll" tabindex="0" role="region" aria-label="数据表格，可左右滚动"><table><thead><tr>'+head.map(c=>'<th scope="col"><span class="gj-m-ai-cell">'+inline(c)+'</span></th>').join('')+'</tr></thead><tbody>';while(i<lines.length&&lines[i].includes('|')&&lines[i].trim()){const row=cells(lines[i++]);out+='<tr>'+head.map((_,n)=>'<td><span class="gj-m-ai-cell">'+inline(row[n]||'')+'</span></td>').join('')+'</tr>'}out+='</tbody></table></div>'+track;continue}
   if(itemRe.test(line)&&/^\s*(?:[-*+] |\d+\. )/.test(line)){out+=list(line.match(itemRe)[1].length);continue}
   const p=[line];i++;while(i<lines.length&&lines[i].trim()&&!blockStart.test(lines[i])&&!isTable(lines,i))p.push(lines[i++]);out+='<p>'+p.map(inline).join('<br>')+'</p>';
  }return out}
 /* 横向滚动指示条（表格、代码块）：按可视宽度 / 内容宽度设置长度，滚动时同步位置；内容放得下时隐藏。图片加载失败时显示占位。 */
 function bind(root){root=root||document;root.querySelectorAll('.gj-m-ai-table-scroll').forEach(sc=>{const track=sc.nextElementSibling;if(!track||!track.classList.contains('gj-m-ai-table-track')||sc.dataset.gjBound)return;sc.dataset.gjBound='1';
  const upd=()=>{const max=sc.scrollWidth-sc.clientWidth;track.classList.toggle('is-static',max<=1);const w=sc.clientWidth/sc.scrollWidth;track.style.setProperty('--w',(w*100)+'%');track.style.setProperty('--x',(max>0?sc.scrollLeft/max*(1-w)*100:0)+'%')};
  sc.addEventListener('scroll',upd,{passive:true});const W=sc.ownerDocument.defaultView;if(W.ResizeObserver)new W.ResizeObserver(upd).observe(sc);upd()});
  /* 表格单元格最多 4 行：超出时按 20 递增该格宽度，直到不超过 4 行（列宽随之加宽，表格放不下时横滑） */
  const cellsToFit=[...root.querySelectorAll('.gj-m-ai-cell')].filter(c=>!c.dataset.gjFit);
  const fit=c=>{c.dataset.gjFit='1';const W=c.ownerDocument.defaultView,lh=parseFloat(W.getComputedStyle(c).lineHeight)||22;let w=c.getBoundingClientRect().width,n=0;while(c.getBoundingClientRect().height>lh*4+1&&n++<60){w+=20;c.style.maxWidth=w+'px';c.style.minWidth=w+'px'}};
  cellsToFit.forEach(fit);const fonts=(root.ownerDocument||root).fonts;if(fonts&&fonts.ready)fonts.ready.then(()=>cellsToFit.forEach(fit));
  root.querySelectorAll('.gj-m-ai-figure img').forEach(img=>{if(img.dataset.gjBound)return;img.dataset.gjBound='1';const fail=()=>img.parentNode.classList.add('is-error');if(img.complete&&!img.naturalWidth)fail();else img.addEventListener('error',fail)})}
 scope.GJAIMarkdown={render,bind,escape:esc};
})(typeof window==='undefined'?globalThis:window);

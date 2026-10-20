/* 页面模式公共构件：只拼装已登记组件（gj-m-*）与语义间距，不定义新组件。示例数据为虚构。 */
(()=>{
const ROOT=new URL('../../',document.currentScript.src).href;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* 组件写法统一由 references/components/<id>/mapping.json 的 templates 渲染（唯一来源，见 assets/scripts/gj-m-markup.js）。
 * 本文件只做参数整理，不再手写组件 HTML；页面级容器（pk-*）除外。 */
const M=window.GJMarkup;if(!M||!window.GJ_M_TEMPLATES)throw new Error('kit.js 需要先加载 assets/scripts/gj-m-markup.js 与 gj-m-templates.js');
M.root=ROOT;const R=(c,n,d)=>M.render(c,n,d);
const icon=(n,s,cls)=>R('_shared','icon',{name:n,size:s||'',cls:cls||''});

/* 导航 */
const navbar=(t,right)=>R('navbar','navbar',{back:true,title:t,right:right||''});
const navAction=(n,label,data)=>R('navbar','action',{icon:n,label,attrs:data?' '+data:''});
/* 页签：kind primary | secondary | round | rectangle | segment */
const tabs=(labels,sel,o={})=>R('tabs','tabs',{label:o.label||'内容分类',kind:o.kind||'primary',line:o.line||'',size:o.size||'',scroll:!!o.scroll,inset:!!o.inset,items:labels.map((l,i)=>({text:Array.isArray(l)?l[0]:l,badge:Array.isArray(l)?l[1]:0,selected:i===sel,tabindex:i===sel?0:-1}))});

/* 展示 */
const tag=(t,c='blue',o={})=>R('tag','tag',{text:t,color:c,small:!!o.small,filled:!!o.filled,line:!!o.line});
const textBtn=(t,o={})=>R('text-button','textButton',{text:t,size:o.size===undefined?'small':o.size,blue:o.blue!==false,arrow:!!o.arrow,disabled:!!o.dis,cls:o.cls||'',lead:o.lead||'',attrs:o.data?' '+o.data:''});
/* 卡片：o={title,sub,icon,right:'arrow'|'more'|html,lv2,bar} */
const cardHead=(o)=>{const lv2=!!o.lv2;const right=o.right==='arrow'?R('card','arrow',{}):o.right==='more'?textBtn('查看更多',{blue:false,data:`data-more="${esc(o.title)}"`}):(o.right||'');
  return R('card','header',{lv2,title:o.title,icon:!lv2&&o.icon?o.icon:'',bar:!!o.bar,right})};
/* o.cls：页面附加类；o.content：不分头部 / 内容区的自定义内容（如勾选卡片） */
const card=(o,body,attrs='')=>R('card','card',{id:o.id||'',cls:o.cls||'',attrs:attrs?' '+attrs:'',head:o.title?cardHead(o):'',sub:o.sub||'',hasBody:body!=null,body:body==null?'':body,content:o.content||''});
const group=(title,body,o={})=>R('card','group',{header:cardHead(Object.assign({title,lv2:1,bar:o.bar!==false},o)),body});
const info=(rows,cls='gj-m-info-list-inline gj-m-info-list-plain')=>R('info-list','list',{cls,rows:rows.map(([l,v])=>({label:l,value:v==null||v===''?'--':v}))});
const trend=(k,t)=>k?R('metric','trend',{kind:k,label:k==='rise'?'上涨 ':k==='decline'?'下跌 ':'',text:t}):'';
const tiles=(items,gray=true)=>R('metric','tiles',{items:items.map(([l,v,u,k,t])=>({label:l,num:v==null?'--':v,unit:u&&v!=null?u:'',gray,empty:v==null,trend:v==null?'':trend(k,t)}))});
const metrics=(items,n)=>R('metric','grid',{n3:n===3,items:items.map(([v,l,tone])=>({num:v,label:l,tone:tone||''}))});
const progress=(rows)=>R('chart','progress',{rows:rows.map(([n,v,t],i)=>({name:n,value:v,text:t,series:i+1}))});
/* 横排进度列表（Progress default=default, style=bar）：名称 — 条形 — 数值，单色 */
const progressInline=(rows)=>R('chart','progressInline',{rows:rows.map(([n,v,t])=>({name:n,value:v,text:t}))});
/* 可展开横排进度列表：rows=[[名称,百分比,数值文本,[明细对象名…]]]，open=展开项名称 */
const progressExpand=(rows,open)=>R('chart','progressExpand',{rows:rows.map(([n,v,t,items])=>{const can=!!(items&&items.length),on=can&&open===n;return {name:n,value:v,text:t,can,open:on,hint:can?(on?'，收起明细':'，展开明细'):'',items:items||[]}})});
/* 纵向时间轴（Steps 纵向 + 时间）：items=[{time,title,desc,state,extra}] */
const timeline=(items,label='记录',o={})=>R('steps','timeline',{label,size:o.size||'',items:items.map(s=>({state:s.state||'finish',time:s.time,title:s.title,desc:s.desc||'',extra:s.extra||''}))});
const gridnav=(items,cols=4)=>R('gridnav','gridnav',{cols,items:items.map(([l,n])=>({label:l,icon:n}))});

/* 录入 */
const label=(t,o={})=>R('form','label',{id:o.id||'',text:t,required:!!o.req,desc:o.desc||''});
const formItem=(o,ctl)=>R('form','item',{key:o.k||'',label:label(o.t,o),control:ctl,error:o.err||''});
const select=o=>R('select','select',{date:!!o.date,error:!!o.err,label:o.t,key:o.k||'',value:o.value||'',placeholder:o.ph||'请选择'});
const textarea=o=>R('input','textareaCount',{placeholder:o.ph||'请输入',label:o.t,max:o.max||200,key:o.k||'',value:o.value||'',count:(o.value||'').length});
/* 选项胶囊：single 用 radio 语义，否则 checkbox 语义 */
const chips=(opts,sel,o={})=>R('selection-list','chips',{role:o.single?'radiogroup':'group',label:o.t||'',key:o.k||'',items:opts.map(t=>{const on=Array.isArray(sel)?sel.includes(t):sel===t;return {text:t,state:o.single?`role="radio" aria-checked="${on}"`:`aria-pressed="${on}"`}})});
const radios=(opts,sel,o={})=>R('radio','group',{label:o.t||'',key:o.k||'',name:o.k||'r',items:opts.map(t=>({text:t,checked:t===sel}))});
/* 按钮组选择（Button 多层级组合 案例 2）：Medium 按钮宽度随文字、左对齐换行，间距 8；未选 Tertiary，选中 Secondary-pressed（aria-pressed）。single 为单选（role=radio）。size:'large' 仅设计指定时用 */
const choices=(opts,sel,o={})=>R('button','choices',{large:o.size==='large',role:o.single?'radiogroup':'group',label:o.t||'',key:o.k||'',single:!!o.single,items:opts.map(t=>{const on=Array.isArray(sel)?sel.includes(t):sel===t;return {text:t,on,state:o.single?`role="radio" aria-checked="${on}"`:`aria-pressed="${on}"`}})});
/* 按钮组选择的点击切换；返回当前选中值数组 */
function wireChoices(root,cb){root.querySelectorAll('[data-btns]').forEach(g=>{const single=!!g.dataset.single;const bs=[...g.querySelectorAll('.gj-m-button')];
  const set=(b,on)=>{b.classList.toggle('gj-m-button-secondary',on);b.classList.toggle('is-pressed',on);b.classList.toggle('gj-m-button-tertiary',!on);b.setAttribute(single?'aria-checked':'aria-pressed',on)};
  bs.forEach(b=>b.addEventListener('click',()=>{if(single)bs.forEach(x=>set(x,x===b));else set(b,b.getAttribute('aria-pressed')!=='true');
    cb&&cb(g.dataset.btns,bs.filter(x=>x.classList.contains('is-pressed')).map(x=>x.dataset.v))}))})}
/* o.html：含链接的文字（协议勾选），此时不输出 aria-label */
const checkbox=(t,o={})=>R('checkbox','checkbox',{cls:o.cls||'',checked:!!o.on,disabled:!!o.dis,attrs:o.data?' '+o.data:'',aria:o.html?'':(o.aria||t),text:o.html?'':(t||''),labelHtml:o.html||''});
/* 单行输入：o={type,ph,value,aria,attrs,size,line,err,clear(默认 true),suffix} */
const input=o=>R('input','input',{type:o.type||'text',attrs:o.attrs?' '+o.attrs:'',placeholder:o.ph||'',value:o.value||'',label:o.aria||o.ph||'',size:o.size||'',line:!!o.line,error:o.err||'',clear:o.clear!==false,disabled:!!o.dis,suffix:o.suffix||''});
const inputAction=btn=>R('input','action',{button:btn});
/* 月历：o={year,title,days:[…]}，字段见 datepicker.calendar */
const calendar=o=>R('datepicker','calendar',o);
const legend=(items,cls)=>R('chart','legendList',{cls:cls||'',items:items.map(x=>Object.assign({series:0,color:'',mark:''},x))});
/* 列表：items 为 listItem 拼接；listItem o={link,prefix,label,text(HTML),desc(HTML),extra(HTML),action,disabled,attrs} */
const listItem=o=>R('listbar','item',Object.assign({link:false,prefix:'',label:'',desc:'',extra:'',action:'',disabled:false,attrs:''},o,{attrs:o.attrs?' '+o.attrs:''}));
const list=(items,o={})=>R('listbar','list',{items,card:!!o.card,cls:o.cls||''});
/* size：large（默认）/ medium / small；Medium 为基座默认尺寸，不输出尺寸类 */
const button=(t,kind='primary',o={})=>{const sz=o.size||'large';return R('button','button',{text:t,level:kind,size:sz==='medium'?'':sz,block:!!o.block,submit:!!o.submit,disabled:!!o.dis,attrs:o.data?' '+o.data:'',icon:o.icon||''})};
/* 固定底栏：内部为表单操作区（等分，间距 12）或自定义内容 */
const bar=(inner)=>`<div class="pk-bar">${inner}</div>`;
const actions=(btns)=>R('button','actions',{buttons:btns.join('')});

/* 反馈 */
const loading=(text,ic='icf_system_loading',state='loading',cls='')=>R('loading','loading',{text,icon:ic,state,cls});
/* 居中对话框：o={id,title,message,icon,footer(按钮 HTML)}；外层定位遮罩由页面提供 */
const dialog=o=>R('dialog','dialog',{id:o.id||'dlg',title:o.title,message:o.message||'',icon:o.icon||'',footer:o.footer||''});
const EMPTY={search:['未找到相关内容','请调整搜索条件后重试'],empty:['暂无内容','当前暂无可展示内容'],network:['网络连接异常','请检查网络后重新加载'],error:['加载失败','数据加载出错，请稍后重试'],permission:['暂无访问权限','请联系管理员申请权限']};
const empty=(type,o={})=>{const v=EMPTY[type];return `<div class="pk-empty">${R('empty','empty',{type,title:o.title||v[0],desc:o.desc||v[1],action:o.action?button(o.action,'primary',{size:'medium',data:`data-empty="${type}"`}):''})}</div>`};
const notice=(t,tone='alert',ic='icf_system_info',small)=>R('notice','notice',{text:t,tone,icon:ic,small:!!small});
const skel=(lines=[60,90,75])=>R('skeleton','lines',{lines:lines.map((w,i)=>({w,tail:i===lines.length-1}))});
const skelCards=(n=3)=>Array.from({length:n},()=>card({content:skel([40,100,85,60])},null,'aria-busy="true"')).join('');
function toast(doc,t){let host=doc.getElementById('pk-toast');if(!host){host=doc.createElement('div');host.id='pk-toast';doc.body.appendChild(host)}
  clearTimeout(toast.a);clearTimeout(toast.b);host.innerHTML=R('notice','toast',{text:t});
  const el=host.firstElementChild;toast.a=setTimeout(()=>{el.classList.add('is-leaving');toast.b=setTimeout(()=>{if(host.firstElementChild===el)host.innerHTML=''},200)},2600)}
/* 页签键盘与选中切换（tablist 内） */
function wireTabs(root,onSel){root.querySelectorAll('.gj-m-tabs').forEach(tl=>{const ts=[...tl.querySelectorAll('.gj-m-tab')];
  const set=(i,focus)=>{ts.forEach((t,j)=>{t.setAttribute('aria-selected',j===i);t.tabIndex=j===i?0:-1});if(focus)ts[i].focus();ts[i].scrollIntoView({block:'nearest',inline:'nearest'});onSel&&onSel(tl,i)};
  ts.forEach((t,i)=>{t.addEventListener('click',()=>set(i));t.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();set((i+(e.key==='ArrowRight'?1:ts.length-1))%ts.length,true)}})})})}
/* textarea 计数 */
function wireTextarea(root){root.querySelectorAll('.gj-m-textarea textarea').forEach(t=>{const c=t.parentElement.querySelector('.gj-m-textarea-count');const max=+t.dataset.max;t.addEventListener('input',()=>{c.textContent=t.value.length+'/'+max;t.parentElement.classList.toggle('is-over',t.value.length>max)})})}

/* 所有模式共用的页面骨架样式（页面级取值只用语义间距） */
const CSS=`[hidden]{display:none!important}html,body{background:var(--ds-background-background)}
.pk-page{min-height:100vh;display:flex;flex-direction:column;background:var(--ds-background-background)}
.pk-top{position:sticky;top:0;z-index:10;background:var(--ds-background-container)}
.pk-body{flex:1 1 auto;display:flex;flex-direction:column;gap:var(--space-card-l1-gap);padding:var(--space-12) var(--space-page-margin-x) calc(var(--space-24) + var(--safe-bottom,0px))}
.pk-page.has-bar .pk-body{padding-bottom:calc(.64rem + var(--space-24) + var(--safe-bottom,0px))}
.pk-bar{position:fixed;left:0;right:0;bottom:0;z-index:20;padding:var(--space-12) var(--space-page-margin-x) calc(var(--space-12) + var(--safe-bottom,0px));background:var(--ds-background-container);box-shadow:0 -1px 0 var(--ds-border-default)}
.pk-empty{flex:1 0 auto;display:flex;align-items:center;justify-content:center;padding:var(--space-24) 0}
.pk-mod-title{margin:var(--space-12) 0 0;color:var(--ds-text-primary);font-size:var(--ds-type-h4-cn-s-font-size);line-height:var(--ds-type-h4-cn-s-line-height);font-weight:var(--ds-type-h4-cn-s-font-weight)}
.pk-note{margin:0;color:var(--ds-text-tiatery);font-size:var(--ds-type-p5-cn-r-font-size);line-height:var(--ds-type-p5-cn-r-line-height)}
.pk-more{display:flex;justify-content:center}
.pk-tags{display:flex;flex-wrap:wrap;gap:var(--space-inline-tag-gap-max);margin-top:var(--space-8)}
.pk-num{font-variant-numeric:tabular-nums}
/* 列表条目（卡片内的对象摘要）：标题行 + 描述 + 元信息 */
.pk-entry{display:flex;flex-direction:column;gap:var(--space-4);padding:var(--space-12) 0;box-shadow:inset 0 -1px 0 var(--ds-border-default);color:inherit;text-decoration:none}
.pk-entry:first-child{padding-top:0}.pk-entry:last-child{padding-bottom:0;box-shadow:none}
.pk-entry-head{display:flex;align-items:center;gap:var(--space-8);min-width:0}
.pk-entry-title{flex:1 1 auto;min-width:0;margin:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:var(--ds-text-primary);font-size:var(--ds-type-h4-cn-s-font-size);line-height:var(--ds-type-h4-cn-s-line-height);font-weight:var(--ds-type-h4-cn-s-font-weight)}
.pk-entry-head>.gj-m-tag,.pk-entry-time{flex:none}
.pk-entry-time{color:var(--ds-text-tiatery);font-size:var(--ds-type-p5-cn-r-font-size);line-height:var(--ds-type-p5-cn-r-line-height);font-variant-numeric:tabular-nums}
.pk-entry-desc{margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;color:var(--ds-text-secondary);font-size:var(--ds-type-p3-cn-r-font-size);line-height:var(--ds-type-p3-cn-r-line-height)}
.pk-entry-meta{display:flex;align-items:center;flex-wrap:wrap;gap:var(--space-8);color:var(--ds-text-tiatery);font-size:var(--ds-type-p5-cn-r-font-size);line-height:var(--ds-type-p5-cn-r-line-height)}
.pk-entry-meta .is-alert{color:var(--ds-feedback-error-rise)}
.pk-block{color:var(--ds-text-secondary);font-size:var(--ds-type-p3-cn-r-font-size);line-height:var(--ds-type-p3-cn-r-line-height)}
.gj-m-toast-layer{position:fixed}`;

window.GJKit={ROOT,esc,icon,navbar,navAction,tabs,tag,textBtn,card,cardHead,group,info,trend,tiles,metrics,progress,progressInline,progressExpand,timeline,gridnav,label,formItem,select,textarea,chips,choices,wireChoices,radios,checkbox,input,inputAction,calendar,legend,listItem,list,button,bar,actions,loading,dialog,empty,notice,skel,skelCards,toast,wireTabs,wireTextarea,CSS};
})();

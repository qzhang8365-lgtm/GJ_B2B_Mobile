/* 页面模式 · 列表 + 搜索 / 筛选。示例数据为虚构，仅用于展示结构与状态。 */
(()=>{
/* 按脚本自身位置解析 Skill 根目录：本脚本也会被合并展示页（preview/patterns/index.html）引用，不能按页面地址算 */
const ROOT=new URL('../../../',document.currentScript.src).href;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SURN='张李王陈刘杨赵黄周吴徐孙朱马胡郭林何高罗';const GIVEN=['一鸣','明轩','浩然','思远','欣然','雅琪','子涵','嘉怡','俊杰','诗涵','宇航','梓萱'];
const ORG=['上海国泰投资有限公司','深圳华信资产管理','北京中科创投','杭州远景私募基金','苏州金桥实业','南京恒信集团'];
const STATUS=[['正常','green'],['待跟进','orange'],['休眠','grey']];
const DATA=Array.from({length:28},(_,i)=>{const org=i%3===1;const st=STATUS[(i*7)%3];return {name:org?ORG[i%ORG.length]:SURN[i%SURN.length]+GIVEN[i%GIVEN.length],id:'KH2023'+String(1000+i*37).slice(-4),type:org?'机构客户':'个人客户',risk:'R'+(1+(i*3)%5),status:st[0],tone:st[1],asset:Math.round((i*733)%9000+120),last:28-i,av:1+i%3}});
const FILTERS=[{k:'type',t:'客户类型',o:['全部','个人客户','机构客户']},{k:'risk',t:'风险等级',o:['全部','R1','R2','R3','R4','R5']},{k:'status',t:'客户状态',o:['全部','正常','待跟进','休眠']},{k:'sort',t:'排序',o:['最近联系','资产从高到低']}];
const PAGE=10;

function rows(st){let r=DATA.filter(d=>(!st.q||d.name.includes(st.q)||d.id.includes(st.q))&&(!st.f.type||d.type===st.f.type)&&(!st.f.risk||d.risk===st.f.risk)&&(!st.f.status||d.status===st.f.status));
  if(st.f.sort==='资产从高到低')r=r.slice().sort((a,b)=>b.asset-a.asset);return r}
/* 组件写法统一由各组件 mapping.json 的 templates 渲染（唯一来源，见 assets/scripts/gj-m-markup.js）；本文件只拼装页面容器（lf-*）与数据。 */
const M=window.GJMarkup;if(!M||!window.GJ_M_TEMPLATES)throw new Error('list-filter.js 需要先加载 assets/scripts/gj-m-markup.js 与 gj-m-templates.js');
M.root=ROOT;const R=(c,n,d)=>M.render(c,n,d);
const hi=(t,q)=>{if(!q)return esc(t);const i=t.indexOf(q);return i<0?esc(t):esc(t.slice(0,i))+R('searchbar','highlight',{text:q})+esc(t.slice(i+q.length))};
const avatar=n=>R('listbar','avatar',{src:`${ROOT}assets/images/avatar/person-${n}.svg`});
const tag=(t,c,m)=>R('tag','tag',{text:t,color:c,small:!m});
const item=(d,q)=>R('listbar','item',{link:true,attrs:` data-go="${esc(d.name)}"`,prefix:avatar(d.av),text:hi(d.name,q),desc:`${hi(d.id,q)} · ${esc(d.type)} · ${esc(d.risk)}`,extra:tag(d.status,d.tone)});
const card=(d,q)=>R('card','link',{cls:'lf-card',attrs:` data-go="${esc(d.name)}"`,
  head:R('card','header',{titleHtml:hi(d.name,q),right:tag(d.status,d.tone,1)}),sub:`${hi(d.id,q)} · 最近联系 ${d.last} 天前`,hasBody:true,
  body:R('info-list','list',{cls:'gj-m-info-list-plain',rows:[{label:'客户类型',value:esc(d.type)},{label:'风险等级',value:esc(d.risk)},{label:'总资产（万元）',value:`<span class="lf-num">${d.asset.toLocaleString('zh-CN')}</span>`}]})});
const skeleton=n=>`<div class="lf-skel" aria-busy="true">${Array.from({length:n},()=>`<div class="lf-skel-row">${R('skeleton','lines',{avatar:true,layout:'list',lines:[{w:60},{w:85,tail:true}]})}</div>`).join('')}</div>`;
const EMPTY={search:['未找到相关内容','请调整搜索条件后重试','清除筛选'],empty:['暂无数据','当前暂无可展示内容',''],network:['网络连接异常','请检查网络后重新加载','重新加载'],permission:['暂无访问权限','请联系管理员申请权限','']};
const empty=(type,action)=>{const v=EMPTY[type];return `<div class="lf-empty">${R('empty','empty',{type,title:v[0],desc:v[1],action:action&&v[2]?R('button','button',{text:v[2],level:'primary',attrs:` data-empty="${type}"`}):''})}</div>`};
const loading=(text,name,state)=>R('loading','loading',{text,icon:name,state});
const navbar=t=>R('navbar','navbar',{back:true,title:t});
const search=q=>`<div class="lf-search">${R('searchbar','search',{placeholder:'搜索客户名称或编号',value:q})}</div>`;
const trig=(f,v,open)=>{const act=f.k==='sort'?v!=='最近联系':!!v;const label=act&&f.k!=='sort'?v:(f.k==='sort'?v:f.t);return {text:label,active:act,open:!!open,key:f.k}};
const sel=(f,cur)=>R('selection-list','single',{label:f.t,items:f.o.map(t=>({text:t,on:(cur||(f.k==='sort'?'最近联系':'全部'))===t}))});
const filterBar=st=>R('filter','filter',{items:FILTERS.map(f=>trig(f,st.f[f.k]||(f.k==='sort'?'最近联系':''),st.open===f.k)),panel:st.open?sel(FILTERS.find(f=>f.k===st.open),st.f[st.open]):''});
const fab=R('floating-button','fab',{cls:'lf-fab',hidden:true,label:'回到顶部',icon:'icf_Arrow_up',attrs:' data-top'});
const TABS=[['首页','icf_system_home'],['客户','icf_user_idcard'],['消息','icf_contact_message'],['我的','icf_user_user']];
const tabbar=R('tabbar','tabbar',{items:TABS.map(([l,n],i)=>({label:l,icon:n,iconOn:n+'-fill',active:i===1}))});

/* 页面 html：o={nav,tab,style:'list'|'card',state:'normal'|'loading'|'search'|'empty'|'network'|'permission',summary,q,f,open,shown,tail} */
function page(o){const st={q:o.q||'',f:o.f||{},open:o.open||''};const all=rows(st);let body='',top='';
  if(o.state==='permission')body=empty('permission');
  else{top=`<div class="lf-sticky">${search(st.q)}${filterBar(st)}</div>`;
    if(o.state==='loading')body=skeleton(6);
    else if(o.state==='network')body=empty('network',1);
    else if(o.state==='empty')body=empty('empty');
    else{const list=o.state==='search'?[]:all;
      if(!list.length)body=empty('search',Object.values(st.f).some(v=>v&&v!=='最近联系'));
      else{const n=Math.min(list.length,o.shown||PAGE);const items=list.slice(0,n);
        const sum=o.summary&&(st.q||Object.values(st.f).some(v=>v&&v!=='最近联系'))?`<p class="lf-summary">共 ${list.length} 个结果</p>`:'';
        const tail=o.tail==='error'?`<button type="button" class="lf-tail lf-retry" data-retry>加载失败，点击重试</button>`:n<list.length?`<div class="lf-tail">${loading('加载数据中...','icf_system_loading','loading')}</div>`:`<p class="lf-tail lf-end">没有更多了</p>`;
        body=sum+(o.style==='card'?`<div class="lf-cards">${items.map(d=>card(d,st.q)).join('')}</div>`:R('listbar','list',{items:items.map(d=>item(d,st.q)).join('')}))+tail}}}
  return `<div class="lf-page${o.tab?' has-tab':''}">${o.nav?navbar(o.title||'我的客户'):''}${top}<main class="lf-body">${body}</main>${fab}${o.tab?tabbar:''}</div>`}

const CSS=`[hidden]{display:none!important}html,body{background:var(--ds-background-background)}.page{min-height:100%}
.lf-page{min-height:100vh;display:flex;flex-direction:column;background:var(--ds-background-background)}
.lf-page.has-tab{padding-bottom:calc(.56rem + var(--safe-bottom,0px))}
.lf-sticky{position:sticky;top:0;z-index:10;background:var(--ds-background-container)}
.lf-search{padding:var(--space-8) var(--space-page-margin-x);background:var(--ds-background-container)}
.lf-body{flex:1 1 auto;display:flex;flex-direction:column;padding-bottom:var(--safe-bottom,0px)}
.lf-summary{margin:0;padding:var(--space-12) var(--space-page-margin-x) var(--space-8);font-size:.12rem;line-height:.18rem;color:var(--ds-text-tiatery)}
.lf-cards{display:flex;flex-direction:column;gap:var(--space-card-l1-gap);padding:var(--space-12) var(--space-page-margin-x) 0}
.lf-num{font-variant-numeric:tabular-nums}
.lf-tail{display:flex;justify-content:center;width:100%;margin:0;padding:var(--space-16) var(--space-page-margin-x);border:0;background:none;font-size:.12rem;line-height:.18rem;color:var(--ds-text-tiatery);font-family:inherit}
.lf-retry{cursor:pointer;min-height:44px;align-items:center}
.lf-empty{flex:1 0 auto;display:flex;align-items:center;justify-content:center;padding:var(--space-24) var(--space-page-margin-x)}
.lf-skel{background:var(--ds-background-container)}
.lf-skel-row{padding:var(--space-12) var(--space-page-margin-x);box-shadow:inset 0 -1px 0 var(--ds-border-default)}
.lf-page.has-tab .lf-fab{--gj-m-fab-offset-y:.56rem}
.gj-m-tabbar{position:fixed;left:0;right:0;bottom:0;z-index:20}`;

/* 交互：搜索、筛选、滚动加载、回到顶部、空状态操作 */
function wire(doc,o,onChange){const W=doc.defaultView;
  const input=doc.querySelector('.gj-m-search input');let t;
  if(input){input.addEventListener('input',()=>{clearTimeout(t);t=W.setTimeout(()=>onChange({q:input.value.trim(),shown:PAGE,open:''},true),250)});
    doc.querySelector('.gj-m-search-clear').addEventListener('pointerdown',e=>e.preventDefault());
    doc.querySelector('.gj-m-search-clear').addEventListener('click',()=>{input.value='';onChange({q:'',shown:PAGE},true)})}
  doc.querySelectorAll('.gj-m-filter-item').forEach(b=>b.addEventListener('click',()=>onChange({open:o.open===b.dataset.k?'':b.dataset.k})));
  const mask=doc.querySelector('.gj-m-filter-mask');if(mask)mask.addEventListener('click',()=>onChange({open:''}));
  doc.querySelectorAll('.gj-m-filter-panel .gj-m-selection-item').forEach(b=>b.addEventListener('click',()=>{const v=b.dataset.v;const f=Object.assign({},o.f);f[o.open]=(v==='全部')?'':v;onChange({f,open:'',shown:PAGE})}));
  doc.querySelectorAll('[data-empty="search"]').forEach(b=>b.addEventListener('click',()=>onChange({f:{},q:'',shown:PAGE})));
  doc.querySelectorAll('[data-empty="network"]').forEach(b=>b.addEventListener('click',()=>onChange({state:'normal'})));
  doc.querySelectorAll('[data-retry]').forEach(b=>b.addEventListener('click',()=>onChange({tail:''})));
  const fabG=doc.querySelector('.lf-fab');
  W.addEventListener('scroll',()=>{const y=W.scrollY;if(fabG)fabG.hidden=y<W.innerHeight*0.9;
    const tail=doc.querySelector('.lf-tail .gj-m-loading');if(tail&&!o._busy){const r=tail.getBoundingClientRect();if(r.top<W.innerHeight){o._busy=1;W.setTimeout(()=>onChange({shown:(o.shown||PAGE)+PAGE},false,true),600)}}},{passive:true});
  doc.querySelectorAll('[data-top]').forEach(b=>b.addEventListener('click',()=>W.scrollTo({top:0,behavior:'smooth'})));
  doc.querySelectorAll('[data-go]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const s=document.getElementById('feedback');if(s)s.textContent='点击「'+a.dataset.go+'」：进入客户详情（原型不跳转）。'}));
}

window.GJListFilter={page,CSS,wire,PAGE};
})();

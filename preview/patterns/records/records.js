/* 页面模式 · 日历 + 记录时间轴。结构参考「零售银行渠道经营工作台」04-06 历史拜访记录、11 拜访记录二级页、首页渠道拜访模块，组件全部换为 gj-m-*。数据虚构。 */
(()=>{
const K=window.GJKit;
const TODAY=new Date(2026,9,16);
const DOT={visit:'var(--ds-feedback-warning)',event:'var(--ds-primitive-purple-p06)'};
const TYPE={visit:['拜访','orange'],event:['活动','purple']};
const pad=n=>String(n).padStart(2,'0');const key=(y,m,d)=>`${y}-${pad(m+1)}-${pad(d)}`;
/* 记录：日期 → 条目 */
const REC={};
/* 拜访：对象、达成合作（标签）、需求 + 满足状态；活动：类型、起止时间、参与与开户 */
const add=(d,r)=>{(REC[d]=REC[d]||[]).push(r)};
const NEED_TONE={'已满足':'green','未满足':'orange','无法满足':'grey'};
add('2026-10-16',{t:'visit',time:'09:42',title:'中国银行东城根支行',who:'行长李明、理财经理王芳',deal:['客户线索','晨夕会宣导'],need:'AUM / 存款',st:'已满足'});
add('2026-10-16',{t:'event',time:'14:00',end:'16:00',title:'东城营业部 · 财富沙龙',kind:'财富沙龙',people:32,open:5});
add('2026-10-14',{t:'visit',time:'15:20',title:'建设银行建国路支行',who:'副行长陈刚',deal:['客户线索'],need:'联合营销政策支持',st:'未满足'});
add('2026-10-09',{t:'visit',time:'10:15',title:'工商银行景阳支行',who:'副行长刘洋',deal:[],need:'信用卡推广资源',st:'已满足'});
add('2026-10-09',{t:'event',time:'16:00',end:'17:00',title:'高新营业部 · 晨夕会宣导',kind:'晨夕会宣导',people:18,open:0});
add('2026-10-21',{t:'event',time:'10:00',end:'11:30',title:'春熙路营业部 · 投教讲座',kind:'投教讲座',people:26,plan:1});
add('2026-10-03',{t:'visit',time:'11:30',title:'农业银行天府支行',who:'理财经理赵磊',deal:['资源互换'],need:'代发工资合作',st:'无法满足'});
add('2026-09-28',{t:'visit',time:'10:30',title:'招商银行春熙路支行',who:'行长孙莉',deal:[],need:'',st:''});

const filt=(list,f)=>(list||[]).filter(r=>!f||r.t===f);
function calendar(y,m,sel,f){const first=new Date(y,m,1),startW=first.getDay(),days=new Date(y,m+1,0).getDate();const rows=Math.ceil((startW+days)/7)*7;const cells=[];
  for(let i=0;i<rows;i++){const d=new Date(y,m,1-startW+i),out=d.getMonth()!==m;const k=key(d.getFullYear(),d.getMonth(),d.getDate());const r=out?[]:filt(REC[k],f);const today=+d===+TODAY,on=!out&&k===sel;
    cells.push({num:d.getDate(),date:k,disabled:out,today,selected:on,pressed:on,range:'',label:`${d.getMonth()+1}月${d.getDate()}日${today?'，今天':''}${r.length?'，'+r.length+'条记录':''}`,dots:[...new Set(r.map(x=>x.t))].map(t=>DOT[t])})}
  return K.calendar({year:false,title:`${y} - ${pad(m+1)}`,days:cells})}
const legend=f=>K.legend(Object.entries(TYPE).filter(([k])=>!f||f===k).map(([k,[t]])=>({text:t,color:DOT[k]})),'rc-legend');
/* 字段用统一文本行（字段名：值），不用信息列表；拜访的达成合作为标签行，需求行右侧放满足状态 */
const line=(l,v)=>`<p class="rc-line">${l}：${v}</p>`;
const body=r=>r.t==='visit'
  ?line('拜访对象',K.esc(r.who))+(r.deal.length?`<div class="pk-tags rc-tags">${r.deal.map(t=>K.tag(t,'blue')).join('')}</div>`:'')+(r.need?`<div class="rc-line rc-need"><span>需求：${K.esc(r.need)}</span>${r.st?K.tag(r.st,NEED_TONE[r.st],{small:1,line:1}):''}</div>`:'')
  :line('活动类型',K.esc(r.kind))+line('活动时间',`${r.time}–${r.end}`)+line(r.plan?'报名人数':'参与人数',r.plan?`${r.people} 人`:`${r.people} 人${r.open?`，开户 ${r.open} 户`:''}`);
const item=r=>({time:r.time,title:`${K.tag(TYPE[r.t][0],TYPE[r.t][1],{small:1,filled:1})} <a href="javascript:void 0" class="rc-link" data-go="${K.esc(r.title)}">${K.esc(r.title)}</a>`,extra:`<div class="rc-body">${body(r)}</div>`});

/* o={state, y, m, sel:'YYYY-MM-DD', f:''|'visit'|'event'} */
function page(o={}){const y=o.y??2026,m=o.m??9,sel=o.sel||'2026-10-16',f=o.f||'';
  const top=`<div class="pk-top">${K.navbar('拜访记录',K.navAction('icf_system_filter','筛选员工','data-staff'))}${K.tabs(['全部','拜访','活动'],f==='visit'?1:f==='event'?2:0,{kind:'round',size:'medium',label:'记录类型',inset:1})}</div>`;
  let body;
  if(o.state==='loading')body=K.card({content:K.skel([30,100,100,100,100,100])},null,'aria-busy="true"')+K.skelCards(1);
  else if(o.state==='network')body=K.empty('network',{action:'重新加载'});
  else{const [yy,mm,dd]=sel.split('-').map(Number);const list=filt(REC[sel],f);const inMonth=yy===y&&mm-1===m;
    const cal=K.card({},calendar(y,m,sel,f)+legend(f));
    const head=`<h2 class="pk-mod-title" id="rc-day">${inMonth?`${mm} 月 ${dd} 日`:'未选择日期'}${list.length?` · ${list.length} 条`:''}</h2>`;
    const rec=!inMonth?K.card({},`<p class="pk-note rc-none">请在日历中选择日期</p>`):list.length?K.card({},`<div class="rc-tl">${K.timeline(list.map(item),mm+'月'+dd+'日记录',{size:'large'})}</div>`):K.card({},`<div class="rc-none"><p class="pk-note">当日暂无${f?TYPE[f][0]:''}记录</p>${+new Date(yy,mm-1,dd)>=+TODAY?K.button('新建拜访','secondary',{size:'small',data:'data-go="我要拜访"'}):''}</div>`);
    body=cal+head+rec}
  return `<div class="pk-page">${top}<main class="pk-body">${body}</main></div>`}

const CSS=K.CSS+`

.rc-legend{justify-content:center;margin-top:var(--space-8)}
.pk-mod-title{margin:var(--space-12) 0 0}
.pk-mod-title+.gj-m-card{margin-top:calc(var(--space-module-title-gap) - var(--space-card-l1-gap))}
.rc-none{display:flex;flex-direction:column;align-items:center;gap:var(--space-12);padding:var(--space-16) 0;text-align:center}
.rc-link{color:inherit;text-decoration:none}



.rc-body{display:flex;flex-direction:column;gap:var(--space-4);margin-top:var(--space-4)}
.rc-line{margin:0;color:var(--ds-text-secondary);font-size:var(--ds-type-p3-cn-r-font-size);line-height:var(--ds-type-p3-cn-r-line-height)}
.rc-tags{margin:var(--space-4) 0}
.rc-need{display:flex;align-items:center;justify-content:space-between;gap:var(--space-8)}
.rc-need>.gj-m-tag{flex:none}
`;

function wire(doc,o,onChange){const y=o.y??2026,m=o.m??9;
  doc.querySelectorAll('.gj-m-calendar-nav').forEach(b=>b.addEventListener('click',()=>{const d=new Date(y,m+(+b.dataset.nav),1);onChange({y:d.getFullYear(),m:d.getMonth()})}));
  doc.querySelectorAll('.gj-m-calendar-day:not(:disabled)').forEach(b=>b.addEventListener('click',()=>onChange({sel:b.dataset.date,_scroll:1})));
  K.wireTabs(doc.querySelector('.pk-top')||doc,(tl,i)=>onChange({f:['','visit','event'][i]}));
  doc.querySelectorAll('[data-empty]').forEach(b=>b.addEventListener('click',()=>onChange({state:'normal'})));
  doc.querySelectorAll('[data-go]').forEach(a=>a.addEventListener('click',()=>K.toast(doc,'进入「'+a.dataset.go+'」（原型不跳转）')));
  doc.querySelectorAll('[data-staff]').forEach(a=>a.addEventListener('click',()=>K.toast(doc,'打开员工筛选弹层（原型不展开）')));
  if(o._scroll){delete o._scroll;const h=doc.getElementById('rc-day');const W=doc.defaultView;if(h){const r=h.getBoundingClientRect();if(r.bottom>W.innerHeight-120)W.scrollTo({top:W.scrollY+r.top-doc.querySelector('.pk-top').offsetHeight-12,behavior:'smooth'})}}
}
window.GJRecords={page,CSS,wire};
})();

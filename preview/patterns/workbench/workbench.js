/* 页面模式 · 工作台首页（锚点页签 + 模块卡片）。结构参考「零售银行渠道经营工作台」01 员工版首页 / 06 团队版首页，组件全部换为 gj-m-*。数据虚构。 */
(()=>{
const K=window.GJKit;
const MODS=[['focus','重点关注'],['channel','我的渠道'],['visit','渠道拜访'],['tools','常用工具']];
const FOCUS={report:[['新上报','red','建设银行建国路支行','网点暂不愿继续推进开户活动','李明','06-29','紧急'],['新上报','red','工商银行景阳支行','客户经理反馈竞品权益力度更高','王芳','06-29','普通'],['跟进中','blue','招商银行春熙路支行','支行临时取消本周联合活动','孙莉','06-28','紧急']],
  overdue:[['未拜访','orange','中国银行武侯支行','超过 35 天未拜访，近期渠道活动参与度下降','王芳','已超时 15 天'],['生日提醒','blue','建设银行建国路支行','关键人生日提醒超过 10 天未跟进','孙莉','已超时 13 天']]};
const PERIOD={week:[['银行渠道新增资产','318','万','rise','21%'],['银行渠道新增有效户','42','户','rise','8%'],['银行渠道新增开户数','23','户','flat','持平'],['名下渠道数','8','个'],['银行渠道经营积分','1,240','分','rise','8%']],
  month:[['银行渠道新增资产','1,904','万','rise','18%'],['银行渠道新增有效户','244','户','rise','9%'],['银行渠道新增开户数','107','户','decline','3%'],['名下渠道数','8','个'],['银行渠道经营积分','6,350','分','rise','11%']]};
const PROC={week:[['6','拜访次数'],['2','活动次数'],['17','需求总数'],['3','需求未满足']],month:[['47','拜访次数'],['14','活动次数'],['79','需求总数'],['9','需求未满足']]};
const STAR=[['五星',40,'2 家',['中国银行东城根支行','东城营业部']],['四星',80,'4 家',['工商银行景阳支行','建设银行建国路支行','招商银行春熙路支行','高新营业部']],['三星',60,'3 家',['农业银行天府支行','交通银行红星路支行','春熙路营业部']],['二星',20,'1 家',['邮储银行玉林支行']],['一星',0,'0 家',[]]];
const TOOLS=[['渠道新增','building'],['渠道流转','transactionProgress'],['渠道变更','processNodes'],['数据看板','data'],['拜访记录','day'],['需求管理','demand'],['知识库','study'],['全部功能','menu']];

/* 标签按层级选样式（PR-012）：上报需求两级——紧急程度 filled、状态 default；超时关注只有一级——类型 default */
const URG={'紧急':'red','普通':'grey'};
const entry=([t,c,name,desc,who,when,urg],alert)=>`<a class="pk-entry" href="javascript:void 0" data-go="${K.esc(name)}"><div class="pk-entry-head">${alert?K.tag(t,c,{small:1}):''}<p class="pk-entry-title">${K.esc(name)}</p>${alert?'':K.tag(t,c,{small:1})}</div><p class="pk-entry-desc">${K.esc(desc)}</p><div class="pk-entry-meta">${urg?K.tag(urg,URG[urg],{small:1,filled:1}):''}<span>${who}</span><span class="${alert?'is-alert':''}">${when}</span></div></a>`;
function focusCard(o){const list=FOCUS[o.focus||'report'];const body=o.focusEmpty?`<p class="pk-note pk-center">暂无需要关注的事项</p>`:`<div>${list.slice(0,3).map(e=>entry(e,o.focus==='overdue')).join('')}</div><div class="pk-more">${K.textBtn('查看全部 '+(list.length+2)+' 条',{arrow:1,data:'data-more="重点关注"'})}</div>`;
  return K.card({id:'m-focus',title:'重点关注'},`<div class="wb-stack">${K.tabs(['上报需求 5','超时关注 5'],o.focus==='overdue'?1:0,{kind:'round',size:'medium',label:'关注类型'})}${body}</div>`,'data-mod="focus"')}
function channelCard(o){const p=o.period||'week';
  if(o.modError)return K.card({id:'m-channel',title:'我的渠道'},`<div class="wb-err"><p class="pk-note">数据加载失败</p>${K.textBtn('重新加载',{data:'data-reload'})}</div>`,'data-mod="channel"');
  return K.card({id:'m-channel',title:'我的渠道',sub:'数据截至 '+(p==='week'?'本周':'本月')+' · 每日 9:00 更新'},`<div class="wb-stack">${K.tabs(['本周','本月'],p==='week'?0:1,{kind:'segment',size:'medium',label:'统计周期'})}${K.tiles(PERIOD[p])}${K.group('过程跟进',K.metrics(PROC[p]))}${K.group('渠道星级分布',K.progressExpand(STAR,o.star===undefined?'五星':o.star))}</div>`,'data-mod="channel"')}
function visitCard(){return K.card({id:'m-visit',title:'渠道拜访'},`<div class="wb-stack">${K.button('我要拜访 · 立即打卡','primary',{block:1,icon:'icf_map_location',data:'data-go="我要拜访"'})}${K.group('今日拜访',K.timeline([{time:'09:42',title:'中国银行东城根支行',desc:'拜访对象：行长李明、理财经理王芳',extra:`<div class="pk-tags">${K.tag('客户线索','blue')}${K.tag('晨夕会宣导','orange')}</div>`},{time:'14:00',title:'东城营业部 · 财富沙龙',desc:'活动类型：财富沙龙 · 参与 32 人',state:'process'}],'今日拜访'),{right:'more'})}</div>`,'data-mod="visit"')}
const toolsCard=()=>K.card({id:'m-tools',title:'常用工具'},K.gridnav(TOOLS,4),'data-mod="tools"');

/* o={state:'normal'|'loading'|'error', tab, focus:'report'|'overdue', period, modError, focusEmpty} */
function page(o={}){const top=`<div class="pk-top">${o.nav!==false?K.navbar('渠道经营工作台',K.navAction('icf_system_bell','消息通知')):''}${K.tabs(MODS.map(m=>m[1]),o.tab||0,{kind:'primary',line:'fixed',scroll:MODS.length>4,label:'工作台模块',inset:1})}</div>`;
  let body;
  if(o.state==='loading')body=K.skelCards(3);
  else if(o.state==='error')body=K.empty('network',{action:'重新加载'});
  else body=focusCard(o)+channelCard(o)+visitCard()+toolsCard();
  return `<div class="pk-page">${top}<main class="pk-body">${body}</main></div>`}

const CSS=K.CSS+`
.wb-stack{display:flex;flex-direction:column;gap:var(--space-card-l1-section-gap)}
/* WB-4：页签与标题、条目视觉各 8。基座的页签条上下 8 内边距只用来容纳热区，在卡片内已用负外边距抵消；这里再把标题间距 12、段落间距 16 收到 8 */.wb-stack>.gj-m-tabs[data-kind=round]{margin-top:calc(-1 * (var(--space-8) + var(--space-4)));margin-bottom:calc(-1 * var(--space-16))}
.wb-stack>.gj-m-tabs[data-kind=segment]{width:100%}
.pk-center{text-align:center;padding:var(--space-16) 0}
.wb-err{display:flex;flex-direction:column;align-items:center;gap:var(--space-8);padding:var(--space-16) 0}
.gj-m-card{scroll-margin-top:var(--wb-top,96px)}`;

/* 交互：锚点页签 ↔ 滚动位置，周期切换，关注类型切换 */
function wire(doc,o,onChange){const W=doc.defaultView;const top=doc.querySelector('.pk-top');if(!top)return;
  const H=()=>top.getBoundingClientRect().height;doc.documentElement.style.setProperty('--wb-top',(H()+12)+'px');
  const main=top.querySelector('.gj-m-tabs');const mainTabs=[...main.querySelectorAll('.gj-m-tab')];let lock=0;
  const setMain=i=>{mainTabs.forEach((t,j)=>{t.setAttribute('aria-selected',j===i);t.tabIndex=j===i?0:-1});mainTabs[i].scrollIntoView({block:'nearest',inline:'center'})};
  K.wireTabs(doc,(tl,i)=>{
    if(tl===main){const el=doc.getElementById('m-'+MODS[i][0]);if(el){lock=Date.now();o.tab=i;W.scrollTo({top:el.getBoundingClientRect().top+W.scrollY-H()-12,behavior:'smooth'})}}
    else if(tl.dataset.kind==='segment')onChange({period:i?'month':'week'});
    else if(tl.dataset.kind==='round')onChange({focus:i?'overdue':'report'})});
  W.addEventListener('scroll',()=>{if(Date.now()-lock<700)return;const y=H()+24;let cur=0;
    MODS.forEach(([k],i)=>{const el=doc.getElementById('m-'+k);if(el&&el.getBoundingClientRect().top<=y)cur=i});
    if(W.innerHeight+W.scrollY>=doc.documentElement.scrollHeight-2)cur=MODS.length-1;
    if(cur!==o.tab){o.tab=cur;setMain(cur)}},{passive:true});
  doc.querySelectorAll('[data-expand]:not(:disabled)').forEach(b=>b.addEventListener('click',()=>{const n=b.dataset.expand;onChange({star:b.getAttribute('aria-expanded')==='true'?'':n})}));
  doc.querySelectorAll('[data-reload],[data-empty]').forEach(b=>b.addEventListener('click',()=>onChange({modError:false,state:'normal'})));
  doc.querySelectorAll('[data-go],[data-more]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();K.toast(doc,'进入「'+(a.dataset.go||a.dataset.more)+'」（原型不跳转）')}));
  doc.querySelectorAll('.gj-m-navbar-action:not(.gj-m-navbar-back)').forEach(b=>b.addEventListener('click',()=>K.toast(doc,'打开消息通知（原型不跳转）')));
}
window.GJWorkbench={page,CSS,wire};
})();

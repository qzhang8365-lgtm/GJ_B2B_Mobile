/* 页面模式 · 批量处理列表。结构参考「零售银行渠道经营工作台」07-3 超时关注、07-1 上报需求，组件全部换为 gj-m-*。数据虚构。 */
(()=>{
const K=window.GJKit;
const DATA=[
  ['a','未拜访','orange','中国银行武侯支行','超过 35 天未拜访，近期渠道活动参与度下降','王芳',15,0],
  ['b','需求未满足','blue','中国银行东城根支行','三方存管推广需求标记为紧急，行长催促中','李明',14,0],
  ['c','生日提醒','blue','建设银行建国路支行','关键人生日提醒超过 10 天未跟进','孙莉',13,0],
  ['d','网点降级','red','招商银行春熙路支行','渠道有效户新增连续两月低于均值，平台提示关注星级变化','陈佳',12,1],
  ['e','降级预警','orange','农业银行天府支行','渠道活跃度下降，连续两月有效户转化偏低','赵磊',11,1],
  ['f','未拜访','orange','工商银行景阳支行','超过 30 天未拜访','王芳',9,0]];

/* o={state, f:0全部|1待提醒|2已提醒, sel:{id:true}, done:{id:true}, sort:'desc'|'asc'} */
function rows(o){const done=o.done||{};let r=DATA.map(d=>({id:d[0],type:d[1],c:d[2],name:d[3],desc:d[4],who:d[5],days:d[6],done:d[7]||done[d[0]]}));
  if(o.f===1)r=r.filter(x=>!x.done);if(o.f===2)r=r.filter(x=>x.done);if(o.sort==='asc')r=r.slice().reverse();return r}
const item=(x,on)=>K.card({cls:'bt-item'+(x.done?' is-done':''),content:K.checkbox('',{on:on&&!x.done,dis:x.done,data:`data-id="${x.id}"`,aria:'选择 '+x.name})+`<a class="bt-main" href="javascript:void 0" data-go="${K.esc(x.name)}"><div class="pk-entry-head">${K.tag(x.type,x.c,{small:1,filled:1})}<p class="pk-entry-title">${K.esc(x.name)}</p>${x.done?K.tag('今日已提醒','grey',{small:1}):K.tag('待提醒','red',{small:1})}</div><p class="pk-entry-desc">${K.esc(x.desc)}</p><div class="pk-entry-meta"><span>${x.who}</span><span class="is-alert">已超时 ${x.days} 天</span></div></a>`});

function page(o={}){const f=o.f||0,sel=o.sel||{};const list=rows(o);const avail=list.filter(x=>!x.done);const n=avail.filter(x=>sel[x.id]).length;
  const top=`<div class="pk-top">${K.navbar('超时关注')}<div class="bt-tools">${K.tabs(['全部','待提醒','已提醒'],f,{kind:'round',size:'medium',label:'提醒状态',inset:1})}${K.textBtn('',{size:'large',blue:false,cls:'gj-m-text-button-tertiary bt-sort',lead:K.icon('icf_Arrow_transfer1','','bt-sort-ic'),data:`aria-label="按超时天数${o.sort==='asc'?'升序':'降序'}排序" data-sort`})}</div></div>`;
  let body,barHtml='';
  if(o.state==='loading')body=K.skelCards(4);
  else if(o.state==='network')body=K.empty('network',{action:'重新加载'});
  else if(!list.length)body=K.empty('empty',{title:f===2?'暂无已提醒事项':'暂无超时事项',desc:f===2?'今日提醒过的事项会显示在这里':'所有渠道都在跟进节奏内'});
  else{body=`<p class="pk-note">共 ${list.length} 项 · 按超时天数${o.sort==='asc'?'从少到多':'从多到少'}</p>`+list.map(x=>item(x,sel[x.id])).join('');
    if(avail.length){const all=n===avail.length,part=n>0&&!all;barHtml=K.bar(`<div class="bt-bar">${K.checkbox('全选',{on:all,data:`data-all${part?' data-ind="1"':''}`})}<span class="pk-note bt-count">已选 ${n} 项</span>${K.button(n?`一键提醒（${n}）`:'一键提醒','primary',{dis:!n,data:'data-remind'})}</div>`)}}
  return `<div class="pk-page${barHtml?' has-bar':''}">${top}<main class="pk-body">${body}</main>${barHtml}</div>`}

const CSS=K.CSS+`
.bt-tools{display:flex;align-items:center}
.bt-tools .gj-m-tabs{flex:1 1 auto;min-width:0}
.bt-sort-ic{transform:rotate(90deg)}
.bt-sort{flex:none;margin:0 var(--space-page-margin-x) 0 var(--space-4)}
.bt-item{flex-direction:row;align-items:flex-start;gap:var(--space-12)}
.bt-item>.gj-m-checkbox{flex:none;margin-top:.01rem}
.bt-main{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:var(--space-4);color:inherit;text-decoration:none}
.bt-bar{display:flex;align-items:center;gap:var(--space-12)}
.bt-count{flex:1 1 auto}
.bt-bar .gj-m-button{flex:none;min-width:1.40rem}`;

function wire(doc,o,onChange){o.sel=o.sel||{};const W=doc.defaultView;
  const ind=doc.querySelector('[data-ind]');if(ind)ind.indeterminate=true;
  K.wireTabs(doc.querySelector('.pk-top')||doc,(tl,i)=>onChange({f:i,sel:{}}));
  doc.querySelectorAll('input[data-id]').forEach(c=>c.addEventListener('change',()=>{const sel=Object.assign({},o.sel);sel[c.dataset.id]=c.checked;onChange({sel})}));
  const all=doc.querySelector('input[data-all]');if(all)all.addEventListener('change',()=>{const sel={};if(all.checked)rows(o).filter(x=>!x.done).forEach(x=>sel[x.id]=true);onChange({sel})});
  const s=doc.querySelector('[data-sort]');if(s)s.addEventListener('click',()=>onChange({sort:o.sort==='asc'?'desc':'asc',sel:{}}));
  const r=doc.querySelector('[data-remind]');if(r)r.addEventListener('click',()=>{const ids=Object.keys(o.sel).filter(k=>o.sel[k]);const done=Object.assign({},o.done);ids.forEach(k=>done[k]=true);onChange({done,sel:{},_toast:`已提醒 ${ids.length} 位负责人`})});
  doc.querySelectorAll('[data-empty]').forEach(b=>b.addEventListener('click',()=>onChange({state:'normal'})));
  doc.querySelectorAll('[data-go]').forEach(a=>a.addEventListener('click',()=>K.toast(doc,'进入「'+a.dataset.go+'」详情（原型不跳转）')));
  if(o._toast){K.toast(doc,o._toast);delete o._toast}
}
window.GJBatch={page,CSS,wire};
})();

/* 页面模式 · 详情 + 底部操作。结构参考「零售银行渠道经营工作台」03-2 / 07-2 需求详情、04-07 拜访详情，组件全部换为 gj-m-*。数据虚构。 */
(()=>{
const K=window.GJKit;
const STATUS=['已满足','未满足','无法解决'];
const TONE={'新上报':'red','跟进中':'blue','已满足':'green','未满足':'orange','无法解决':'grey','已归档':'grey'};
const LOG=[{time:'06-30 10:20',title:'王芳 标记为跟进中',desc:'已与支行行长沟通，约定下周提供方案'},{time:'06-29 09:42',title:'李明 上报需求',desc:'来源：渠道拜访'}];

/* o={state:'normal'|'loading'|'network', mode:'edit'|'review'|'archived', status, saved, note, dirty} */
function page(o={}){const mode=o.mode||'edit';const cur=o.status||'未满足';const head=K.navbar('需求详情');let body,barHtml='';
  if(o.state==='loading')body=K.skelCards(3);
  else if(o.state==='network')body=K.empty('network',{action:'重新加载'});
  else{const shown=mode==='archived'?'已归档':mode==='review'?'新上报':(o.saved||'未满足');
    const summary=K.card({title:'建设银行建国路支行',right:K.tag(shown,TONE[shown],{line:1}),sub:'李明 记录于 2026-06-29 09:42'},
      K.info([['所属网点','建设银行建国路支行'],['需求类型','AUM / 存款提升'],['紧急程度',K.tag('紧急','red',{filled:1})],['需求描述','三方存管推广，需提供开户优惠方案及专项话术支持，行长要求本月内给到'],['达成合作',`${K.tag('客户线索','blue')} ${K.tag('晨夕会宣导','orange')}`]].map(([l,v])=>[l+'：',v])));
    const plan=K.card({title:'解决方案',right:K.textBtn('案例库检索',{arrow:1,data:'data-go="案例库"'})},`<p class="gj-m-card-l2 pk-block">提供三方存管专项开户礼包方案，附赠积分；同时提供标准话术手册及产品介绍材料，计划本周送达。</p>`);
    const log=K.card({title:'处理记录'},K.timeline((o.extraLog||[]).concat(LOG),'处理记录'));
    let edit='';
    if(mode==='edit')edit=K.card({title:'更新需求状态'},`<div class="dt-form">${K.formItem({t:'需求状态',req:1,k:'status'},K.radios(STATUS,cur,{t:'需求状态',k:'status'}))}${K.formItem({t:'处理说明',desc:'选填',k:'note'},K.textarea({t:'处理说明',ph:'补充处理进展或原因',value:o.note||'',max:200,k:'note'}))}</div>`);
    const tip=mode==='archived'?K.notice('该需求已于 07-02 归档，仅可查看。','plain','icf_system_info',1):'';
    body=tip+summary+plan+edit+log;
    if(mode==='edit')barHtml=K.bar(K.actions([K.button('取消','tertiary',{data:'data-cancel',dis:!o.dirty}),K.button('保存更新','primary',{data:'data-save',dis:!o.dirty})]));
    else if(mode==='review')barHtml=K.bar(K.actions([K.button('归档','tertiary',{data:'data-archive'}),K.button('标记跟进','primary',{data:'data-follow'})]));}
  return `<div class="pk-page${barHtml?' has-bar':''}"><div class="pk-top">${head}</div><main class="pk-body">${body}</main>${barHtml}</div>`}

const CSS=K.CSS+`

`;

function wire(doc,o,onChange){const W=doc.defaultView;K.wireTextarea(doc);
  const base=o.saved||'未满足';
  doc.querySelectorAll('[data-radios="status"] input').forEach(c=>c.addEventListener('change',()=>{const v=c.value;const note=(doc.querySelector('textarea')||{}).value||'';onChange({status:v,note,dirty:v!==base||!!note.trim()})}));
  const ta=doc.querySelector('textarea[data-k="note"]');if(ta)ta.addEventListener('input',()=>{const d=(o.status||base)!==base||!!ta.value.trim();o.note=ta.value;if(d!==!!o.dirty){o.dirty=d;doc.querySelectorAll('[data-save],[data-cancel]').forEach(b=>b.disabled=!d)}});
  const q=(s,f)=>{const b=doc.querySelector(s);if(b)b.addEventListener('click',f)};
  q('[data-cancel]',()=>onChange({status:base,note:'',dirty:false}));
  q('[data-save]',e=>{const b=e.currentTarget;b.disabled=true;b.querySelector('span').textContent='保存中...';W.setTimeout(()=>{const v=o.status||base;onChange({saved:v,status:v,note:'',dirty:false,extraLog:[{time:'刚刚',title:'我 更新为'+v,desc:(ta&&ta.value.trim())||'',state:'process'}].concat(o.extraLog||[]),_toast:'已保存'})},600)});
  q('[data-archive]',()=>onChange({mode:'archived',_toast:'已归档'}));
  q('[data-follow]',()=>onChange({mode:'edit',saved:'未满足',_toast:'已标记为跟进中'}));
  q('[data-empty]',()=>onChange({state:'normal'}));
  doc.querySelectorAll('[data-go]').forEach(a=>a.addEventListener('click',()=>K.toast(doc,'进入「'+a.dataset.go+'」（原型不跳转）')));
  if(o._toast){K.toast(doc,o._toast);delete o._toast}
}
window.GJDetail={page,CSS,wire};
})();

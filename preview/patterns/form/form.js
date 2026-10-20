/* 页面模式 · 分组表单提交。结构参考「零售银行渠道经营工作台」04-02～04-05 我要拜访（定位、选择网点、必填未完成提示），组件全部换为 gj-m-*。数据虚构。 */
(()=>{
const K=window.GJKit;
const WHO=['行长','经办','主任','理财经理','大堂经理','其他'];
const NEED=['三方存管','AUM / 存款','信用卡','养老金','产品销售','贷款'];
const DEAL=['客户线索','资源互换','活动展开','晨夕会宣导'];
const MET=['已满足','未满足','无法满足'];
const REQ=[['site','拜访网点'],['date','拜访时间'],['who','拜访对象'],['need','银行需求'],['met','需求是否满足']];

/* o={loc:'ok'|'locating'|'fail', v:{site,date,who[],need[],deal[],met,note}, err:{}, submitted} */
function locCard(o){const loc=o.loc||'ok';
  if(loc==='locating')return K.card({},K.loading('正在获取当前位置...','icf_system_loading','loading','fm-loc'));
  if(loc==='fail')return `${K.notice('定位失败，请检查定位权限后重试，或在下方手动选择网点。','warning','icf_system_info',1)}`;
  return K.list(K.listItem({prefix:K.icon('icf_map_location-fill','24','fm-loc-ic'),text:'东城根街网点',desc:'成都市锦江区东城根街 · 精度约 18 m',extra:K.textBtn('重新定位',{data:'data-relocate'})}),{card:1,cls:'fm-loc-card'})}
function page(o={}){const v=o.v||{},e=o.err||{};
  const base=K.card({title:'拜访信息'},`<div class="fm-form">${K.formItem({t:'拜访网点',req:1,k:'site',err:e.site},K.select({t:'拜访网点',k:'site',ph:'请选择网点',value:v.site||(o.loc==='fail'?'':'东城根街网点'),err:e.site}))}${K.formItem({t:'拜访时间',req:1,k:'date',err:e.date},K.select({t:'拜访时间',k:'date',date:1,ph:'选择日期',value:v.date||'2026-10-16',err:e.date}))}${K.formItem({t:'拜访对象',req:1,desc:'可多选',k:'who',err:e.who},K.choices(WHO,v.who||[],{t:'拜访对象',k:'who'}))}</div>`);
  const need=K.card({title:'需求挖掘'},`<div class="fm-form">${K.formItem({t:'银行需求',req:1,desc:'可多选',k:'need',err:e.need},K.choices(NEED,v.need||[],{t:'银行需求',k:'need'}))}${K.formItem({t:'需求描述',desc:'选填',k:'note'},K.textarea({t:'需求描述',ph:'补充需求背景、时间要求等',value:v.note||'',max:200,k:'note'}))}${K.formItem({t:'需求是否满足',req:1,k:'met',err:e.met},K.radios(MET,v.met||'',{t:'需求是否满足',k:'met'}))}</div>`);
  const deal=K.card({title:'达成合作'},K.formItem({t:'合作内容',desc:'选填，可多选',k:'deal'},K.choices(DEAL,v.deal||[],{t:'合作内容',k:'deal'})));
  const n=Object.keys(e).length;
  const top='';
  const body=o.submitted?K.card({},`<div class="fm-done"><img src="${K.ROOT}assets/icons/glassicon/png/success.png" alt="" class="fm-done-img"><p class="fm-done-title">打卡成功</p><p class="pk-note">东城根街网点 · 2026-10-16 14:27</p>${K.button('查看拜访记录','secondary',{size:'medium',data:'data-go="拜访记录"'})}</div>`)
    :top+locCard(o)+base+need+deal;
  const barHtml=o.submitted?'':K.bar(K.actions([K.button('保存草稿','tertiary',{data:'data-draft'}),K.button('提交打卡','primary',{data:'data-submit'})]));
  return `<div class="pk-page${barHtml?' has-bar':''}"><div class="pk-top">${K.navbar('我要拜访')}</div><main class="pk-body">${body}</main>${barHtml}</div>`}

const CSS=K.CSS+`

.fm-loc-card{margin:0}
.fm-loc-ic{color:var(--ds-text-blue)}
.fm-loc{justify-content:flex-start}
.fm-done{display:flex;flex-direction:column;align-items:center;gap:var(--space-8);padding:var(--space-24) 0}
.fm-done-img{width:.64rem;height:.64rem}
.fm-done-title{margin:var(--space-8) 0 0;font-size:var(--ds-type-h3-cn-s-font-size);line-height:var(--ds-type-h3-cn-s-line-height);font-weight:var(--ds-type-h3-cn-s-font-weight)}
.fm-done .gj-m-button{margin-top:var(--space-16)}`;

const SITES=['东城根街网点','中国银行东城根支行','工商银行景阳支行'];
function wire(doc,o,onChange0){const onChange=(p,f)=>{if(f)p._focus=f;onChange0(p)};const W=doc.defaultView;K.wireTextarea(doc);o.v=o.v||{};const v=o.v;
  const recheck=k=>{if(o.err&&o.err[k]){const ok=Array.isArray(v[k])?v[k].length:!!v[k];if(ok){const err=Object.assign({},o.err);delete err[k];onChange({err},k);return true}}return false};
  K.wireChoices(doc,(k,vals)=>{v[k]=vals;recheck(k)});
  doc.querySelectorAll('[data-radios] input').forEach(r=>r.addEventListener('change',()=>{v[r.name]=r.value;recheck(r.name)}));
  doc.querySelectorAll('.gj-m-select').forEach(s=>s.addEventListener('click',()=>{const k=s.dataset.sel;if(k==='site'){const cur=v.site||(o.loc==='fail'?'':'东城根街网点');v.site=SITES[(SITES.indexOf(cur)+1)%SITES.length]}else v.date='2026-10-16';
    if(!recheck(k))onChange({},k);K.toast(doc,k==='site'?'实际为底部选择弹层，原型直接切换':'实际为日历弹层，原型直接回填')}));
  const ta=doc.querySelector('textarea[data-k="note"]');if(ta)ta.addEventListener('input',()=>{v.note=ta.value});
  const q=(s,f)=>{const b=doc.querySelector(s);if(b)b.addEventListener('click',f)};
  q('[data-relocate]',()=>{onChange({loc:'locating'});W.setTimeout(()=>onChange({loc:'ok'}),900)});
  q('[data-draft]',()=>K.toast(doc,'草稿已保存'));
  q('[data-submit]',()=>{const site=v.site||(o.loc==='fail'?'':'东城根街网点');const err={};REQ.forEach(([k,t])=>{const val=k==='site'?site:k==='date'?(v.date||'2026-10-16'):v[k];if(!(Array.isArray(val)?val.length:val))err[k]='请选择'+t});
    if(Object.keys(err).length)onChange({err,_toast:`还有 ${Object.keys(err).length} 项必填未完成`},'__first');else onChange({submitted:true,err:{}})});
  doc.querySelectorAll('[data-go]').forEach(a=>a.addEventListener('click',()=>K.toast(doc,'进入「'+a.dataset.go+'」（原型不跳转）')));
  if(o._focus==='__first'){const f=doc.querySelector('[aria-invalid=true],.gj-m-input-message');if(f){const item=f.closest('.gj-m-form-item');const top=doc.querySelector('.pk-top').getBoundingClientRect().height;W.scrollTo({top:item.getBoundingClientRect().top+W.scrollY-top-60});const t=item.querySelector('button,input');if(t)t.focus({preventScroll:true})}}
  delete o._focus;if(o._toast){K.toast(doc,o._toast);delete o._toast}
}
window.GJForm={page,CSS,wire};
})();

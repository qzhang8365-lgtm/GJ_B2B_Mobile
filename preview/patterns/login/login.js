/* 页面模式 · 登录（小程序 / H5）。来源：端到端验证「国金智慧签」登录页，设计方 2026-10-19 确认为模式。组件全部为 gj-m-*，数据虚构；验证码固定 123456。 */
(()=>{
const K=window.GJKit,R=K.ROOT;
const agreeHtml=(on,left)=>`<div class="lg-agree${left?' is-left':''}">${K.checkbox('',{cls:'gj-m-checkbox-agree',on,data:'data-agree',html:'我已阅读并同意<a href="javascript:void 0" data-doc="用户协议">《用户协议》</a><a href="javascript:void 0" data-doc="隐私协议">《隐私协议》</a>'})}</div>`;
const field=(o)=>`<div class="lg-field">${K.input({attrs:o.attrs,ph:o.ph,value:o.value,aria:o.aria,err:o.err,suffix:o.suffix})}</div>`;
const dialog=`<div class="lg-layer">${K.dialog({id:'ag',title:'请阅读并同意协议',message:'登录前请阅读并同意《用户协议》《隐私协议》。',footer:K.button('不同意','tertiary',{data:'data-disagree'})+K.button('同意并继续','primary',{data:'data-consent'})})}</div>`;

/* o={view:'entry'|'account', agreed, prompt, acc, code, accErr, codeErr, sent(倒计时秒数，演示用)} */
function page(o={}){const v=o.view||'entry';let html;
  if(v==='entry')html=`<div class="lg-brand"><img src="${R}assets/images/gj-logo-mark.png" alt=""><span>国金智慧签</span></div>
    <div class="lg-hero"><div class="lg-art"><img src="${R}assets/icons/glassicon/png/fileaccess.png" alt=""></div><h1>国金智慧签</h1><p>文件在线签署与验签</p></div>
    <div class="lg-actions">${K.button('快捷登录','primary',{block:1,data:'data-quick'})}${K.button('手机号 / 邮箱登录','tertiary',{block:1,data:'data-account'})}</div>${agreeHtml(o.agreed)}`;
  else{const sent=o.sent>0;const suffix=K.inputAction(K.textBtn(sent?`重新获取（${o.sent}s）`:'获取验证码',{size:'',dis:sent,data:'data-code'}));
    html=`${K.navbar('')}<form class="lg-form" novalidate><h1>手机号 / 邮箱登录</h1>${field({attrs:'inputmode="email" autocomplete="username" data-acc',ph:'请输入手机号 / 邮箱',aria:'手机号或邮箱',value:o.acc,err:o.accErr})}${field({attrs:'inputmode="numeric" autocomplete="one-time-code" maxlength="6" data-vcode',ph:'请输入验证码',aria:'验证码',value:o.code,err:o.codeErr,suffix})}
      ${K.button('登录','primary',{block:1,submit:1,dis:!(o.acc&&o.code),data:'data-login'})}</form>${agreeHtml(o.agreed,1)}`}
  return `<div class="lg-page">${html}${o.prompt?dialog:''}</div>`}

const CSS=K.CSS+`
html,body{background:var(--ds-background-container)}
.lg-page{min-height:100vh;display:flex;flex-direction:column;background:var(--ds-background-container)}
.lg-brand{display:flex;align-items:center;gap:var(--space-8);height:44px;padding:0 var(--space-page-margin-x)}
.lg-brand img{width:.28rem;height:.28rem;object-fit:contain}
.lg-brand span{font-size:var(--ds-type-h4-cn-s-font-size);line-height:var(--ds-type-h4-cn-s-line-height);font-weight:var(--ds-type-h4-cn-s-font-weight)}
.lg-hero{flex:1 1 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-16);min-height:3rem;padding:var(--space-24) var(--space-page-margin-x) var(--space-48)}
.lg-art{display:flex;align-items:center;justify-content:center;width:1.8rem;height:1.8rem;background:radial-gradient(circle closest-side at 50% 45%,var(--ds-background-bt-b10) 0%,transparent 100%)}
.lg-art img{width:1.28rem;height:1.28rem;object-fit:contain}
.lg-hero h1,.lg-form h1{margin:0;font-size:var(--ds-type-h2-cn-s-font-size);line-height:var(--ds-type-h2-cn-s-line-height);font-weight:var(--ds-type-h2-cn-s-font-weight)}
.lg-hero p{margin:calc(var(--space-8) - var(--space-16)) 0 0;color:var(--ds-text-tiatery);font-size:var(--ds-type-p3-cn-r-font-size);line-height:var(--ds-type-p3-cn-r-line-height)}
.lg-actions{display:flex;flex-direction:column;gap:var(--space-12);padding:0 var(--space-page-margin-x)}
.lg-agree{display:flex;justify-content:center;padding:var(--space-16) var(--space-page-margin-x) calc(var(--space-40) + var(--safe-bottom,0px))}
.lg-agree.is-left{justify-content:flex-start}
.lg-form{display:flex;flex-direction:column;padding:var(--space-24) var(--space-page-margin-x) 0}
.lg-form h1{margin-bottom:var(--space-24)}
.lg-field{margin-bottom:var(--space-16)}
.lg-form>.gj-m-button{margin-top:var(--space-8)}
.lg-layer{position:fixed;inset:0;z-index:30}`;

const kind=v=>/^1\d{10}$/.test(v)?'phone':/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)?'mail':null;
const mask=v=>kind(v)==='phone'?v.slice(0,3)+'****'+v.slice(7):v.replace(/^(.).*(@.*)$/,'$1***$2');
function wire(doc,o,onChange){const q=s=>doc.querySelector(s);let after=null;
  const need=fn=>{if(o.agreed)fn();else{after=fn;onChange({prompt:true,_after:fn})}};
  if(o._after)after=o._after;
  doc.querySelectorAll('[data-agree]').forEach(c=>c.addEventListener('change',()=>onChange({agreed:c.checked})));
  doc.querySelectorAll('[data-doc]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();K.toast(doc,'打开《'+a.dataset.doc+'》（原型不跳转）')}));
  const p=q('[role=dialog]');if(p){p.focus();q('[data-disagree]').addEventListener('click',()=>onChange({prompt:false,_after:null}));
    q('[data-consent]').addEventListener('click',()=>{const fn=after;onChange({prompt:false,agreed:true,_after:null});if(fn)setTimeout(()=>fn(doc.defaultView.document),0)})}
  const ok=d=>K.toast(d||doc,'登录成功，进入首页（原型不跳转）');
  const quick=q('[data-quick]');if(quick)quick.addEventListener('click',()=>need(d=>{K.toast(d||doc,'已获取微信绑定手机号');setTimeout(()=>ok(d),900)}));
  const ac=q('[data-account]');if(ac)ac.addEventListener('click',()=>onChange({view:'account'}));
  const back=q('.gj-m-navbar-back');if(back)back.addEventListener('click',()=>onChange({view:'entry',accErr:'',codeErr:''}));
  const acc=q('[data-acc]'),code=q('[data-vcode]'),btn=q('[data-login]'),gc=q('[data-code]');if(!acc)return;
  const sync=()=>{btn.disabled=!(acc.value.trim()&&code.value.trim())};
  doc.querySelectorAll('.gj-m-input-clear').forEach(c=>{c.addEventListener('pointerdown',e=>e.preventDefault());c.addEventListener('click',()=>{const i=c.parentElement.querySelector('input');i.value='';sync();i.focus()})});
  const setErr=(inp,msg)=>{const w=inp.parentElement,f=w.parentElement;let m=f.querySelector('.gj-m-input-message');w.classList.toggle('is-error',!!msg);inp.setAttribute('aria-invalid',!!msg);
    if(msg){if(!m){m=doc.createElement('div');m.className='gj-m-input-message';m.setAttribute('role','alert');f.appendChild(m)}m.textContent=msg}else if(m)m.remove()};
  acc.addEventListener('input',()=>{o.acc=acc.value;setErr(acc);sync()});
  code.addEventListener('input',()=>{code.value=code.value.replace(/\D/g,'');o.code=code.value;setErr(code);sync()});
  gc.addEventListener('click',()=>{const v=acc.value.trim();if(!kind(v)){setErr(acc,v?'请输入正确的手机号或邮箱':'请输入手机号或邮箱');acc.focus();return}
    let n=60;gc.disabled=true;const W=doc.defaultView;const t=W.setInterval(()=>{n--;gc.textContent=`重新获取（${n}s）`;if(n<=0){W.clearInterval(t);gc.disabled=false;gc.textContent='重新获取'}},1000);gc.textContent=`重新获取（${n}s）`;
    K.toast(doc,'验证码已发送至 '+mask(v));code.focus()});
  q('.lg-form').addEventListener('submit',e=>{e.preventDefault();const v=acc.value.trim();
    if(!kind(v)){setErr(acc,'请输入正确的手机号或邮箱');acc.focus();return}
    if(code.value!=='123456'){setErr(code,'验证码错误，请重新输入');code.focus();return}
    need(d=>ok(d))});
}
window.GJLogin={page,CSS,wire};
})();

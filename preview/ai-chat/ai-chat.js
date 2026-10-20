/* Documentation-only examples. All business content and quantities below are illustrative. */
const initial=`以下为**排版示例**，展示 AI 回复如何组织信息。可通过[项目资料](#source-1)查看相关内容。

| 指标 | 本期 | 同比 | 说明 |
| --- | --- | --- | --- |
| 已完成事项 | 12 | +20.0% | 示例数据 |
| 待确认事项 | 3 | -25.0% | 示例数据 |
| 下一阶段 | 评审 | — | 示例状态 |

## 一、重点事项
正文使用统一行高，长内容随页面展开，不在气泡内部截断。

- **资料整理**
  已归纳项目背景与相关记录，具体结论以正式资料为准。[^1][^2][^link]
- **下一步安排**
  明确参与角色后再安排评审。

1. 确认资料完整性
2. 核对待办与责任人

> 结论以正式资料为准，示例内容仅用于展示排版。

---
**说明：**本段内容用于展示，不代表真实业务进展。`;
const assetRoot=new URL('../../',location.href);
const A=p=>new URL(p,assetRoot).href;
const icon=(name,size=20)=>`<span class="gj-icon gj-icon-${size}" style="--gj-icon:url('${A('assets/icons/iconfont/'+name+'.svg')}')" aria-hidden="true"></span>`;
const disclaimer='本页面所输出的内容均基于人工智能大模型的深度思考逻辑生成，相关内容或数据来源于公开信息或第三方人工智能大模型，可能出现错误或遗漏，国金证券无法保证所生成内容的真实性、准确性和可靠性。页面内容仅供参考，不构成您采取任何行动或投资决策的依据，请理性认识和使用人工智能技术。';
const notice=`<details class="gj-m-ai-notice"><summary><span>${disclaimer}</span><span class="gj-icon gj-icon-16" aria-hidden="true"></span></summary></details>`;
const identity=role=>`<div class="gj-m-ai-identity">${role==='user'?'<span class="gj-m-ai-name">用户</span>':''}<img class="gj-m-ai-avatar" src="${A('assets/images/ai-chat/'+(role==='user'?'user':'agent')+'.png')}" alt="">${role==='agent'?'<span class="gj-m-ai-name">Agent</span>':''}</div>`;
const status=state=>{const names={think_inspector:'思考中',finished:'思考完成',error:'思考出错'};return state==='none'?'':`<div class="gj-m-ai-status" data-state="${state}" role="status">${state==='finished'?`<img src="${A('assets/images/ai-chat/finished.svg')}" alt="" width="20" height="20">`:icon(state==='error'?'icf_system_close':'icf_system_loading')}${names[state]}</div>`};
// Public progress samples supplied by the application, not model-internal reasoning.
const processSteps=['已接收本次项目进展整理请求，正在核对用户提供的资料与任务范围。','已完成资料分类，正在整理本期完成事项、待确认问题与下一阶段安排，并保留对应来源。','正在核对各项内容与引用关系，生成便于阅读的项目进展摘要。'];
const summary=`<div class="gj-m-ai-think" aria-label="思考过程">${processSteps.map(t=>`<div class="gj-m-ai-think-step"><div class="gj-m-ai-think-rail" aria-hidden="true"><span class="gj-m-ai-think-dot"></span><span class="gj-m-ai-think-line"></span></div><p>${t}</p></div>`).join('')}</div>`;
const time=value=>`<time class="gj-m-ai-time">${value}</time>`;
const preset=`<section class="gj-m-ai-preset" aria-label="推荐问题"><div class="gj-m-ai-preset-title">你可以这样说：</div>${['帮我整理本周项目进展，并列出待确认事项。','下周二上午安排一次项目评审，需要通知相关同事。'].map(q=>`<button type="button" class="gj-m-ai-preset-item" data-action="ask" data-q="${q}">${icon('icf_contact_chat1-fill')}<span>${q}</span></button>`).join('')}</section>`;
const actions=o=>`<div class="gj-m-ai-actions" aria-label="回复操作">${[['like','赞同','icf_system_thumbup',1],['dislike','不赞同','icf_system_thumbdown',1],['copy','复制回复','icf_system_copy'],['refresh','重新生成','icf_system_refresh']].map(([a,l,i,t])=>`<button type="button" data-action="${a}" aria-label="${l}"${t?' aria-pressed="false"':''}>${t?'<span class="gj-icon gj-icon-20" aria-hidden="true"></span>':icon(i)}</button>`).join('')}<button type="button" data-action="more" aria-label="更多">${icon('icf_system_more')}</button><button type="button" class="gj-m-ai-source" data-action="source" aria-label="查看来源"><span class="gj-m-ai-source-avatars" aria-hidden="true">${[1,2,3].map(()=>`<img src="${A('assets/images/ai-chat/user.png')}" alt="">`).join('')}</span>来源</button>${o.info?`<button type="button" class="gj-m-ai-info" data-action="info" aria-label="查看 AI 生成说明">内容由AI生成...${icon('icf_Arrow_caret-down',16)}</button>`:''}</div>`;
function bubble(md,extra='',tail=''){return `<article class="gj-m-ai-bubble">${extra}<div class="gj-m-ai-markdown">${GJAIMarkdown.render(md)}</div>${tail}</article>`}
const say=t=>{const f=document.getElementById('feedback');if(f)f.textContent=t};
function mount(id,html){const el=document.getElementById(id);el.addEventListener('phone:ready',({detail:{doc}})=>{
  GJAIMarkdown.bind(doc);
  doc.addEventListener('click',async e=>{
    const a=e.target.closest('a');if(a&&a.getAttribute('href').startsWith('#')){e.preventDefault();say(a.classList.contains('gj-m-ai-citation')?'引用来源为示例，真实业务点击后进入对应来源详情。':'关键词链接为示例，真实业务点击后进入关联页面。');return}
    const b=e.target.closest('[data-action]');if(!b)return;const action=b.dataset.action;
    if(action==='copy'){try{await navigator.clipboard.writeText(document.getElementById('markdown').value);say('已复制回复 Markdown。')}catch{say('复制不可用，请从右侧文本框选择并复制。')}}
    else if(action==='ask'){say('已选择推荐问题：'+b.dataset.q+'（演示，不发送）')}
    else if(['like','dislike'].includes(action)){const on=b.getAttribute('aria-pressed')!=='true';b.parentNode.querySelectorAll('[data-action=like],[data-action=dislike]').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed',String(on));say((on?(action==='like'?'已赞同':'已不赞同'):'已取消评价')+'（本地示意，未提交数据）。')}
    else say(({share:'分享',refresh:'重新生成',more:'更多操作（分享、朗读等收在这里）',source:'查看来源',info:'AI 生成说明'})[action]+'：当前为样式演示，未连接业务服务。')})
  });return GJPhone.mount(el,{width:375,widths:[],height:'auto',fit:true,html,css:'.page{background:var(--ds-background-background)}',background:'var(--ds-background-background)'})}
const chat=content=>`<div class="gj-m-ai-chat">${content}</div>`;
mount('typography',chat(bubble('## 内容标题\n这是一段**加粗强调**与普通正文的组合。段落采用16/28排版，帮助阅读多行回复。\n\n可点击[关键词链接](#source-1)查看关联内容。')));
mount('lists',chat(bubble('- **资料核对**\n  按业务主题归纳资料，保留原始出处。[^1]\n- **要点整理**\n  对重要结论补充来源。[^2][^link]\n\n1. 确认范围\n2. 核对结论')));
mount('table',chat(bubble('| 指标 | 本期 | 同比 | 来源说明 |\n| --- | --- | --- | --- |\n| 示例指标A | 128.6 | +12.4% | 示例资料，说明文字过长时在单元格内自动换行 |\n| 示例指标B | 32.1 | +8.7% | 示例资料 |\n| 示例指标C | 42.8% | +1.6pct | 示例资料 |')));
mount('anatomy',chat(`${preset}<section class="gj-m-ai-turn is-user">${identity('user')}<div class="gj-m-ai-stack"><div class="gj-m-ai-user">请整理项目进展。</div>${time('10:23')}</div></section><section class="gj-m-ai-turn is-user">${identity('user')}<div class="gj-m-ai-stack"><div class="gj-m-ai-user">请帮我把本周项目进展整理成摘要，列出已完成事项、待确认问题和下周安排，并标注资料来源。</div>${time('10:25')}</div></section>`));
mount('agentState',chat(`<section class="gj-m-ai-turn">${identity('agent')}${status('think_inspector')}${status('finished')}${status('error')}</section><section class="gj-m-ai-message">${identity('agent')}<div class="gj-m-ai-stack">${bubble('已整理**本周项目进展**，共 3 项已完成、1 项待确认。[^1]',status('finished'))}${time('10:26')}</div></section>`));
mount('headings',chat(bubble('# 一级标题 H1\n## 二级标题 H2\n### 三级标题 H3\n正文中的字段名使用行内代码，例如 `market_value`；[查看完整资料](#source-1)。\n\n> 引用内容使用浅蓝底与品牌蓝左线，正文保持正常字号，不用斜体。')));
mount('codeblock',chat(bubble('```json\n{\n  "symbol": "000001",\n  "status": "draft",\n  "note": "代码不换行，超出容器时左右滑动查看"\n}\n```')));
mount('nested',chat(bubble('- 一级要点：资料已归档\n  - 二级说明：缩进 16，空心圆点\n  - 二级说明：最多建议两级\n- 一级要点：待安排评审\n\n- [x] 完成资料整理\n- [ ] 核对关键指标口径\n- [ ] 补充风险提示')));
mount('figure',chat(bubble('![图1：示例趋势图（来源：示例资料）](#)\n\n图片地址无效或加载失败时显示占位，图注写在 `![图注](地址)` 的方括号内。')));
mount('supplement',chat(bubble('本段为正文补充说明。\n\n---\n**说明：**补充提示与正文分层展示。',status('finished')+summary,notice)));
const $=id=>document.getElementById(id);
const textarea=$('markdown');textarea.value=initial;let stage,timer;
function render(){const av=$('avatars').checked,ts=$('timestamps').checked;
  const html=chat(`${$('preset').checked?preset:''}<section class="gj-m-ai-turn is-user">${av?identity('user'):''}<div class="gj-m-ai-stack"><div class="gj-m-ai-user">${GJAIMarkdown.escape($('ask').value.trim()||'请整理项目进展与下一步安排。')}</div>${ts?time('10:23'):''}</div></section><section class="gj-m-ai-message">${av?identity('agent'):''}<div class="gj-m-ai-stack">${bubble(textarea.value,status($('thinkState').value)+($('summary').checked?summary:''),$('notice').checked?notice:'')}${ts?time('10:24'):''}</div>${actions({info:$('info').checked})}</section>`);
  if(stage)stage.setHTML(html);else stage=mount('conversation',html)}
['summary','avatars','timestamps','thinkState','preset','notice','info'].forEach(id=>$(id).addEventListener('change',render));
textarea.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(render,250)});
$('ask').addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(render,250)});
$('reset').addEventListener('click',()=>{textarea.value=initial;$('ask').value='请整理项目进展与下一步安排。';render();say('已恢复示例内容。')});
render();

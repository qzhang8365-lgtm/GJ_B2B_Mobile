# 业务组件 · 220 员工端（移动端）

结构化写法见 [`mapping.json`](mapping.json)，图标见 `references/icons/business-manifest.json`（scope `220` / `share`）。原型基座类名，不代表真实前端组件库 API。

## 定位

归类在 220 员工端，其它业务可以直接复用，也可以参考它们做变体（换文案、颜色模式、图标）。做变体时沿用同一结构、尺寸与 Token，不另起一套样式。

## 章节标题 `.gj-m-section-title`

- 3 × 16 竖条（圆角 2，Brand/GJ_Blue）+ H4_CN-S 16/24 Text/Primary，间距 8。
- 用于卡片内的小节标题（如“资金状况”），下方内容间距 12。

## 客户标签 `.gj-m-client-label`

- 展示客户关键数据：数值 H5_CN-S 14/22 Text/blue，说明 P5_CN-R 12/18 Text/Secondary（超出省略）。
- 容器宽 100，内边距 7/10，圆角 6，Background/Background；横向间距 8，一行最多 3 个。
- 数据由 AI 生成时右上角加 `icon_ai`（16，距顶、距右各 4）；非 AI 数据不加。

## 待办事项

- 通知汇总 `.gj-m-todo-summary`：类型圆点 6（任务 Chart/CH01、消息 Chart/CH02、机会 Chart/CH03）+ 类型名 14 Medium Text/Secondary + 数量 H4_CN-S，项内 8、项间 24。
- 列表行 `.gj-m-todo-item`：高 46，上下 12，元素间距 8，底线 Border/default；左侧圆点 6（默认 Feedback/error&rise）；标题 H5_CN-S 单行省略；右侧二选一：小号实底标签（紧急 red、必做 blue，间距 8）或说明文字 P5_CN-R Text/Tiatery；末尾右箭头 20 Text/Tiatery（基座内置）。整行可点击，用 `<a>` 或 `<button>`。

## 客户动态卡片 `.gj-m-dynamic-card`

- 圆角 8，内边距 30/12/10/12，纵向间距 4；客户行为 Background/BT_B10，平台推送 `.is-push` Background/BT_O10；卡片间距 12。
- 左上角来源标签：高 24，内边距 3/6，圆角 8/0/8/0；客户行为蓝色渐变（#0085FF→#205FFF）、平台推送橙色渐变（#FF7D00→#FF9B3B），文字 P5_CN-R 白色。
- 首行时间与动作 H5_CN-S、业务类型 P3_CN-R，间距 11；描述 P3_CN-R 14/22，均为 Text/Primary，完整换行。

## APP 触达卡片 `.gj-m-reach-card`

- 圆角 8，内边距 16，纵向间距 10；蓝色（业务办理）#EDF6FF→白渐变 + 1px Background/BT_B15；橙色 `.is-advisor`（专属顾问推荐）#FFF7EF→白 + 1px Background/BT_O15。
- 分享人行：`icon_recommand` / `icon_recommand_red` 24 + 14/22 文字（姓名加粗），蓝 Primitive/DeepBlue/DB08、橙 Primitive/Orange/O09，间距 4。
- 标题 H3_CN-S 18/26 Text/Primary。底行左侧中号 Default 标签（蓝 / 橙，超出省略），右侧中号主按钮：蓝色常规圆角 8；`.is-advisor` 内主按钮自动改为国金红全圆角。
- 蓝色卡片可带右上角角标 `.gj-m-reach-card-ribbon`（如“业务办理”，Background/BT_B10 底，H7_CN-S Brand/GJ_Blue）。

## 任务步骤条 `.gj-m-task-steps`

- 每段一个阶段，段宽均分；段高 12，首段左圆角 4、末段右圆角 4，中间段为箭头形（深度约 4.3，不随宽度拉伸），首末形状按位置自动。
- 进度色：0% Background/Secondary，1–99% `.is-partial` Primitive/Blue/B04，100% `.is-done` Primitive/Blue/B06。
- 当前段 `.is-active`：阶段名 H4_CN-S Text/Primary + 下箭头 `icf_Arrow_arrow-down-large`（F0B9，Figma 名 icf_Arrow_rotate_down）16 Text/blue，百分比 H4_CN-S Text/blue；其它段阶段名与百分比 P5_CN-R Text/Tiatery。
- 阶段名不超过 4 个汉字；段数建议 3–6。

## 分享面板 `.gj-m-share-*`

- 放在底部弹层（`.gj-m-popup-panel.gj-m-popup-dialog`，标题居中 + 关闭）的 `.gj-m-popup-body.gj-m-share-body` 内。
- 分享项宽 70：图标 44 + 名称 P3_CN-R 14/22 Text/Primary，间距 4。渠道用品牌图标（`<img>`，不改色）；功能操作用浅灰底 Background/Background + 28 图标 Text/Secondary。
- 4 项以内用 `.is-even` 等分一行（间距 24）；渠道与功能同时出现时分两行，项间 8、行间 20，超出横向滑动（第二行露出半个项提示可滑）。
- 渠道在前、功能在后；渠道顺序固定为微信好友、微信朋友圈、QQ、企业微信，按业务开放的渠道取子集。可选底部说明 `.gj-m-share-hint`（P3_CN-R Text/Tiatery，距分享项 20）。
- 复制链接、转发用图标库 `icf_file_link-line`、`icf_system_share`；保存长图、保存图片、生成 PDF、群发及四个渠道图标在业务图标 scope `share`。

## 待确认

- BZ-001：Figma 待办“必做”标签选的是 purple 变体但填色为蓝色，基座按蓝色实现。
- BZ-002：Figma 步骤条末段 0% 用了未绑定的 #EEEEEF，基座统一为 Background/Secondary。
- BZ-003：Figma APP 触达卡片标题为未绑定 #000，基座用 Text/Primary。

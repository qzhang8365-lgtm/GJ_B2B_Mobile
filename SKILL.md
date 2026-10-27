---
name: gj-b2b-mobile-design-system
description: 为国金内部员工使用的 B 端移动端产品生成或检查页面、组件选型与高保真原型。适用于管理、项目跟踪、表单和人事流程等移动端任务；不适用于 PC 端规范、面向消费者的产品或推断真实前端组件库 API。
---

# 国金 B 端移动端设计系统

## 范围与边界

服务于产品经理的原型生成与规范化，以及前端开发所需的设计说明、组件覆盖检查和页面还原。业务包括内部管理平台、项目跟踪、表单填写和人事流程。优先支持移动网页/H5；每次任务仍须确认实际运行容器与目标设备。iOS、Android 原生界面或其他容器的专属规则须另有依据，不将 H5 规则直接套用。

规范和 Figma 组件以 375×812 的 1 倍逻辑画板为设计基准；交付时按目标屏宽适配，不能把设计画板宽度当作固定页面宽度。生成 H5 页面或原型代码时先读 `references/quick-reference.md`（换算、间距、控件高度、圆角、字号下限、固定栏与容器的结论数值）；需要原因、例外或完整表格时再读 `references/h5-sizing-and-adaptation.md`（rem/px 换算、安全区、宽度分档与预览规则）；涉及控件高度细节时读 `references/h5-control-sizing.md`，涉及卡片与圆角时读 `references/h5-radius-and-containers.md`，涉及 320–359 宽度时再读 `references/h5-small-screen.md`。

不用于 PC 页面、消费者产品、无依据的品牌重设计，也不把原型 HTML/CSS 或示意组件名称当成真实前端组件库 API。

## 设计依据

- **Figma 设计源**：从[移动端设计规范](https://www.figma.com/design/KCpwE2Lh1yCGQ86y8ckYFN/%E3%80%90%E7%A7%BB%E5%8A%A8%E7%AB%AF%E3%80%91%E6%96%B0%E7%89%88B%E7%AB%AF%E8%AE%BE%E8%AE%A1%E8%A7%84%E8%8C%83%EF%BC%88%E5%BB%BA%E8%AE%BE%E4%B8%AD%EF%BC%89?node-id=11-1610&t=q9r8eX4PXrTJKHn7-1)的相关节点核实视觉值、变量、组件变体与状态。该规范仍在建设中；仅将实际可访问、可核实的内容视为已确认依据，不从 PC 端移植尺寸或组件规则。
- **已提取的本地资料**：第一期基础 Token 位于 `references/tokens/`，保留 Figma 原名、来源与确认状态；按当前任务涉及的类别定点读取，不一次加载全部资料。组件资料见 `references/components/inventory.json`（各组件的 schema / mapping / rules / audit 及待确认项），原型基座为 `assets/styles/gj-b2b-mobile-components.css` 的 `gj-m-*` 类。页面模式见 `references/patterns/`：机器可读的选择依据在 `page-pattern-metadata.json`，通用约定在 `README.md`，各模式骨架与状态在对应 `.md`；7 个模式均已确认。
- **具体业务设计稿**：确定该业务的内容、流程、信息优先级和有证据的实例级差异；不自动改写通用组件定义。与通用规范冲突时记录节点和差异，先核实是否为已批准例外。
- **实现代码与真实前端组件库**：目前没有代码仓库或已确认的前端组件库 API。后续组件提取和实现可能由前端开发完成；届时由实际代码决定可用组件、属性、事件、版本及技术约束。本 skill 不创建或预设组件库。

来源冲突时，先核对平台、版本、节点和适用场景；仍无法判定则标记“待确认”并列出冲突证据。Figma 不证明代码 API，后续实现代码也不自动成为设计规范。不要以 PC 端规则、相似组件或单张截图填补缺口。

## 第 0 步：升级自检

正式工作前，在本 Skill 根目录默认执行 `bash scripts/check-update.sh`。无 Bash、断网或失败均继续任务；含 `.git` 的开发仓库直接跳过。12 小时内只检查一次，可用 `--force` 强制检查、`--check-only` 仅提示（会记录检查时间）。

输出“已更新到”后，重新读取更新后的 `SKILL.md` 与当前任务所需资料并继续当前任务，不重复第 0 步。输出“发现新版本但未自动升级”时，只需简短告知用户，不中断任务。

本地版本只读 `package.json`；最新版取移动端 GitHub Releases latest。更新前核验 ZIP 内版本与 Tag，整目录替换并保留 `node_modules`，旧版备份至 `~/.cache/gj-b2b-mobile-design-skill/`。

## 页面生成流程

按顺序执行；每一步只读该步需要的资料。全部资料的用途与读取顺序见 `references/library-index.json`。

1. **准备**：确认任务类型（生成新页面 / 按参考稿重做 / 检查已有页面 / 组件选型）、运行容器（小程序原生 / H5 / web-view，决定是否自绘导航、viewport 是否加 `maximum-scale=1`）、角色、核心任务、业务数据、交付形式与必须覆盖的状态。未知项标“待确认”，先做能做的部分。有业务设计稿或参考截图时，列出其页面、导航结构与业务流程，作为内容依据，不照搬其组件样式。 按PR-033优先还原参考稿的信息结构、字段及组件数量；不自行添加头像、字段或装饰组件。匿名化只替换真实值，不扩展结构。缺失内容标待确认，结构增补需用户授权。
参考稿任务在选模式之前按PR-034保存区域树与边界清单（内容、顺序、字段、操作、通栏/缩进分隔），再匹配组件；生成后逐项对照并记录差异，不能以自动检查通过替代结构还原验收。

2. **选页面模式**：读 `references/patterns/page-pattern-metadata.json`，按 `match` 关键词与 `notFor` 选模式（多页应用可组合多个模式，按 `howToMatch` 的说明组织一级页与二级页；容器、适配与文案的通用约定见 `common`）；再读选中模式的 `.md` 取骨架、状态与已确认取值。没有匹配的模式时，按页面生成规则与组件规则组合，并在交付中说明。
3. **查页面生成规则**：读 `references/page-rules.md`（设计方审查沉淀，优先于组件 rules.md），重点核对选中模式与组件涉及的条目。
4. **查组件写法**：按 `references/components/inventory.json` 的 `scenes`（需求关键词）与 `notFor`（不适用时改用什么）定位组件，读该组件的 `mapping.json`：`markup` 取可复制写法，`composition` / `pageRules` 定用法，`accessibility` 定可访问属性，`pending` 列出需标注的待确认项。只有用法存疑时再读 `rules.md`，需要完整尺寸或状态矩阵时再读 `schema.json`。字段说明见 `references/components/MAPPING.md`（含页面基础写法）。
5. **生成**：按 MAPPING.md 的页面基础写法引入 Token 与基座样式；尺寸、间距、圆角与字号下限按 `references/quick-reference.md`，页面级间距用语义间距变量；图标只用图标库资源。示意实现明确标为原型。生成完成后运行 `node scripts/embed-icons.cjs <页面>`：把页面用到的图标 SVG 与图片（文件图标、空状态、头像、Logo 等）写进页面本身，打开后图标由 CSS 遮罩换成内嵌 SVG、图片换成页面内数据、内阴影描边换成等宽 border（视觉不变；Figma「网页导入」不支持 CSS 遮罩与内阴影描边、读不到本地图片，不做这步图标、文件图标和组件描边会丢失）。验证页、原型页默认在顶部加手机状态栏示意（9:41、信号、电池，吸顶、背景跟随顶部导航，页面里吸顶的导航与页签下移到状态栏下方）；交付真实 H5 代码时加 `--no-statusbar` 去掉（系统自带状态栏）。数字字体 GJTypeDisplay 需在使用 Figma 的电脑上安装（`assets/fonts/`），否则导入后数字回退为其他字体。直接改写同一份文件，页面改动后重新运行。
6. **验收**：按 `references/generation-verification.md` 执行：运行 `node scripts/verify-page.cjs <页面>` 直到阻断项为 0，逐个触发交互并在各状态下复查，逐条人工核对页面生成规则，按模板写交付报告。

设计方对产出的修改意见：先改页面；判断是否适用于同类场景，适用的写入 `page-rules.md`（新编号），涉及组件的同步更新组件 `rules.md`、`mapping.json` 与基座。

## 图标

图标库与 PC 端完全一致，资源在 `assets/icons/`。图标清单唯一入口为 `references/icons/index.json`；普通图标的分类与 line/fill 风格按 manifest 和字体映射判断，不按名称后缀猜测。保留文件名、调用名、Unicode、CSS 类与兼容别名。查找时先读 `references/icons/index.json` 判断类型（General / Effect / File / Motion），再打开对应 manifest 解析资源路径；不得使用 Emoji、临时 Unicode、CSS 手绘或未登记名称。General Icon 用 `.gj-icon` + `--gj-icon`（`assets/styles/gj-b2b-mobile-components.css`，尺寸类以 rem 书写），颜色继承文字色；其余类型按原文件引用。小屏功能图标下限见 `references/h5-small-screen.md`。

毛玻璃 / Effect Icon 必须优先使用 `assets/icons/glassicon/png/` 下已渲染完成的高清 PNG，按 `references/icons/glass-manifest.json` 的 `png` 字段查找。网页展示、宫格入口及后续页面生成均遵循此规则；保留完整透明画布与留白，按组件尺寸等比显示，不裁切、不改色。SVG 仅作源资产，旧版根目录 PNG 不再用于页面展示。

## 组件

组件资料按 `inventory.json`（定位、状态、待确认项）→ `mapping.json`（写法与用法，结构见 `references/components/MAPPING.md`）→ `rules.md`（为什么这样用）→ `schema.json`（完整尺寸与状态矩阵）的顺序按需读取。存在未关闭的 audit 待确认项时在产出中标注；inventory 的 `status.pending` 由 `python3 scripts/sync-inventory.py` 从各 audit.md 生成，改动审计后重新运行。原型代码使用基座类（如 `.gj-m-button`），组件内图标一律取自图标库，颜色跟随组件文字色。未登记的组件不自行编造样式，按“待确认”处理。组件规则或写法调整时，`rules.md`、`mapping.json` 与基座 CSS 同步修改，不只改页面私有样式；`mapping.json` 的 `templates`（无模板时为 `markup`）是写法的唯一来源，预览站拼装函数与页面模式由它渲染；改模板后运行 `node scripts/build-markup.cjs`，再运行 `node scripts/check-mapping.cjs`。在 Figma 中新建或改名组件、或在审计中给出命名建议时，按 `references/figma-naming.md`：普通组件用 `xx_xx`，不带 `/`；单元放在 `组件名_item/单元名` 下。

## 已确认的底部导航生成约束

生成底部导航时，若包含代表系统默认进入页面的主要入口（如“主页”“Home”“首页”“工作台”），必须放在第一项，即最左侧。若包含当前用户个人信息、账户或个人主页入口（如“我的”“账户”“个人中心”），必须放在最后一项，即最右侧；按业务语义识别。入口数量、权限或其它入口顺序变化后仍须满足。默认主要入口最左，个人入口最右，其余入口按业务优先级稳定排列在中间。按实际默认页面识别主入口，不因候选名称创建多个主入口；没有此类入口时不额外创建。详细规则见 `references/components/tabbar/rules.md`。

## 基础 Token 按需读取

需要生成 H5 代码时，先读 `references/tokens/token-contract.md`，按统一包 `references/tokens/gj-b2b-mobile.tokens.json` 的明确映射调用 `assets/styles/gj-b2b-mobile-tokens.css`。源数据更新后执行 `python3 scripts/build-tokens.py` 和 `python3 scripts/validate-tokens.py`；不手改编译产物。

涉及阴影、背景模糊或 Effect Styles 时，先读 `references/tokens/effects.md`，再查 `styles.json` 的 `effectStyles`；引用核对范围见 `references/tokens/effects-audit.json`。

先读 `references/tokens/USAGE.md` 判断来源等级与限制，再按任务读取 `colors.json`（原始色板、语义色与别名）、`typography.json`（完整文字样式）、`dimensions.json`（间距与圆角）或 `styles.json`（渐变和通用效果）。遇到同名样式、业务稿差异或缺失值时查 `references/tokens/pending-confirmation.md`。当前 Figma 变量只有 `Mobile` 模式；H5 宽度分档以 `references/h5-sizing-and-adaptation.md` 为准，不臆造其他主题或设计值。

H5 实现以 `references/quick-reference.md` 为起点，细节以 `references/h5-sizing-and-adaptation.md` 为准；Token JSON 中的 px 是 Figma 原始数值。页面级间距使用该文档的九档阶梯；页面、卡片层级与元素间距优先使用其中“语义间距”的 `--space-<token>` 变量（源数据 `references/tokens/spacing-semantic.json`）并按校验规则自查；多列排布参考该文档的“栅格”（`--ds-grid-*`），组件内部尺寸按 Figma 实例还原。控件高度依 `references/h5-control-sizing.md` 选档，已绑定 `control-*` 的节点使用同名 CSS 变量；除不缩放项外，其他设计尺寸写入页面代码前按设计值 ÷ 100 换算为 rem。不要把 MCP 返回的示意 px 样式直接交付。

H5 中西文跟随系统字体，不把 Figma Text Style 中记录的具体字体家族直接写入字体栈；保留样式的字重、字号、行高和字间距。数字样式使用 GJTypeDisplay（`assets/fonts/`，已由 Token CSS 的 `@font-face` 加载，失败时回退系统字体）；授权已确认，可随包分发、无使用限制（2026-10-20）。

## 数字字体的场景选择

先读 `references/tokens/numeric-font-usage.md`。组件已规定是否使用数字字体时，以组件规则为优先。其它场景：股票代码、基金代码、金融产品代码，以及独立呈现的重要数据、金额、价格、百分比、涨跌幅等字段优先使用 GJTypeDisplay；文章、卡片标题、摘要、标签、“为您找到 x 条信息”等文本内数字及日期不优先使用数字字体，随所在文本使用系统字体，不拆出数字单独套用。

## 生成后自检

按 `references/generation-verification.md` 验收，只对实际产出的页面与可运行状态作结论；无法运行或没有来源的项目列为“未验证/待确认”，不写成已通过。

- **自动检查**：`node scripts/verify-page.cjs <页面> --container <h5|webview|miniprogram>`，默认 375 / 320 / 768 三个宽度（基准、小屏、大屏各一）；阻断项（溢出、字号 < 10、缺可访问名称、非登记图标、资源加载失败等）必须为 0，提示项逐条判断。
- **交互实测**：逐个触发页面支持的选择、输入、浮层、异步状态，在各状态下复查；弹层关闭后焦点回到触发控件。
- **人工核对**：逐条对照 `page-rules.md`：卡片层级（PR-016）、间距按视觉边缘只算一次（PR-007 / 013）、组件选档与标签风格（PR-001 / 002 / 005 / 009 / 012）、操作位置与顶部区域高度（PR-017 / 018）、对象信息头紧凑不换行（PR-020）、空状态居中（PR-015）、左右并列信息优先等行且避免右侧更多行（PR-024，核对窄屏与长值）；导航与容器、信息层级。 图表分层高度（PR-022）：默认绘图166不等于整卡上限，检查空详情与导航热区是否撑高布局。
- **金融数字**：行情、金额等数值用 `font-variant-numeric: tabular-nums`，以实际字体检查宽度与刷新跳动。
- **交付报告**：用 generation-verification.md 的模板，写明实测宽度、操作与结果、待确认与未验证项。

## 缺失信息与资料扩展

每个“待确认”项写明问题、已查询的链接/节点/文件及其结果、对当前产出的影响。不得编造 Token 名称或数值、组件属性、交互行为、接口和业务数据；临时示意内容须明确标注。

后续获得真实组件规则和页面模式后，再按实际内容存入 `references/` 的聚焦文件，并在本入口补充按需读取入口。新增文件要记录来源、适用平台、确认状态及与实现代码的关系；不创建空白目录、索引或占位文件。

## 维护基座、模板与预览站（所有维护者共用）

- **移动端发版约定**：`package.json` 的 `version` 是唯一版本号来源。版本使用 `X.Y.Z`，移动端仓库为 `https://github.com/qzhang8365-lgtm/GJ_B2B_Mobile`；Release Tag 为 `vX.Y.Z`，ZIP 为 `gj-b2b-mobile-design-skill-vX.Y.Z.zip`，包内顶层目录同名（去掉 `.zip`）。Tag、文件名、包内 `package.json` 的版本必须一致。包内必须含 `SKILL.md`、`package.json`、`scripts/check-update.sh`，不含 `.git`、`node_modules`、`.update-check`。经确认后执行既有发布流程，上传对应 ZIP 并将 Release 设为 Latest；更新脚本不读取 `preview/downloads`。

改基座 CSS、组件模板、Token，或新增 / 修改组件页、模式页、端到端示例时，统一按以下规矩，不另起写法：
- **同一来源**（page-rules PR-025）：组件外观只来自基座与 mapping 模板；页面只写布局、组合与 Token 文字样式。缺的能力补进基座 + mapping + rules，不在页面改写 `.gj-m-*`，不自己画卡片、标签、按钮、导航栏、列表行。
- **预览站不用 fetch / XHR**：数据经 `preview/_data/*.js` 用 `<script>` 引入（双击打开也能看）。
- **改完重新生成**：模板 → `node scripts/build-markup.cjs`；基座 → `python3 scripts/build-docs-controls.py`、`python3 scripts/build-preview-data.py`；Token → `python3 scripts/build-tokens.py`（会连带预览数据）。并更新引用处的 `?v=` 版本号。
- **交付前检查**：`node scripts/check-mapping.cjs`、`node scripts/check-preview-source.cjs`（阻断项为 0）；生成页面另按上文“生成后自检”跑 `verify-page.cjs`。`build-release.py` 打包前会自动校验生成产物。
- **不增加包体**：验证截图、过程记录放在 `planning/` 或本地，不放进 `references/`、`assets/`、`preview/`。

## 组件预览页的审计展示规则

设计源待确认、审计编号与差异处理记录不展示在组件网页上；保留于本地audit.md、schema与inventory。需要用户确认的项目通过当前聊天逐条给出问题、当前处理及建议，由用户逐个关闭；关闭后将已确认结论沉淀为组件规则。预览页仅展示组件结构、状态、用法、交互和面向使用者的规范。

图标资源更新后运行 `python3 scripts/sync-icon-resources.py` 和 `python3 scripts/build-preview-data.py`；按需重新执行已有原型的 `embed-icons.cjs`，同步字体二进制与引用缓存版本。兼容资源来源见图标审计，不删除旧 delete-fill（F080）；其 Figma 来源已确认为节点 `5396:3700`。

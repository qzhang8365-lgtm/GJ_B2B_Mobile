# 第一期基础 Token 使用说明

来源：[移动端 Figma 文件](https://www.figma.com/design/KCpwE2Lh1yCGQ86y8ckYFN/?node-id=11-1610)，只读提取。`colors.json`、`dimensions.json`、`typography.json`、`styles.json` 保存 Figma 本地变量与样式的原名、ID、值、单位、模式及来源；`pending-confirmation.md` 记录冲突。A 类表示**已命名的本地变量或样式**，不等于已验证发布到团队库。

## 按需读取

- H5 实现读取 [Token 编译契约](token-contract.md)，使用统一机器包 `gj-b2b-mobile.tokens.json` 和 `../../assets/styles/gj-b2b-mobile-tokens.css`。该包保留移动端来源并提供明确的 CSS 映射；原始 Token JSON 用于追溯和重新编译。

- 效果样式先读 [effects.md](effects.md)，原始参数见 `styles.json.effectStyles`，引用证据见 `effects-audit.json`。当前 6 个 Effect Styles 无模式、无变量绑定；下文 `Mobile` 单模式仅指变量集合，不代表样式具有主题模式。

- 选色时先查 `colors.json` 中的语义色，再沿 `aliasOf` 查 `Primitive/` 原始色板。`value` 是 `Mobile` 模式下解析出的颜色；非别名项保留 Figma 的 0–1 RGBA 原值。不要仅因两个颜色值相同就替换其语义名称。
- 排版时按使用场景选择 `typography.json` 的**整套** Text Style，保留其原始字体家族、字重、字号、行高和字间距；不要只取字号后统一套用行高。当前 Figma 正文样式名称为 `P1-CN-R`、`P2_CN-R` 至 `P6_CN-R`，数字样式为 `N1`–`N8_NUM-S/M`（新增 14/22 与 12/18px 两档）；以 style ID 对应的当前属性为准，不能沿用规范画板上的旧名称。文件中未发现独立的字体族/字号 Variables，文字规范以本地 Text Styles 承载。H5 中西文实际字体跟随系统字体，不在字体栈写死具体字体名；Figma 记录的 PingFang SC 仍是来源数据，不应直接复制到 H5 字体栈。`GJTypeDisplay` 字体文件（Regular/Medium/Bold）已从 PC 端 skill 同步到 `assets/fonts/`，由 `gj-b2b-mobile-tokens.css` 的 `@font-face` 加载，`--ds-font-family-numeric` 为 `GJTypeDisplay, var(--ds-font-family-ui)`，加载失败时回退系统字体。
- 行情、金额、价格、涨跌幅等连续刷新或纵向对齐的数字，在对应文字样式之外加 `font-variant-numeric: tabular-nums`；检查实际加载字体的数字宽度与刷新表现，避免列表滚动或数值变化时左右跳动。该 CSS 排版要求不改写 Figma Text Style 的源数据。
- 间距、圆角查 `dimensions.json`；当前 Figma Interval 原始值为 4、8、12、16、20、24、32、40、48px，名称保留 Figma 原样。H5 页面级间距使用 [`../h5-sizing-and-adaptation.md`](../h5-sizing-and-adaptation.md) 定义的同一九档阶梯；40px 用于明显分隔的大区块。卡片层级与嵌套圆角见 [`../h5-radius-and-containers.md`](../h5-radius-and-containers.md)。控件高度变量另见 `controls.json`，选档与同名 CSS 引用规则见 [`../h5-control-sizing.md`](../h5-control-sizing.md)；组件内部其他尺寸按 Figma 组件库还原。渐变、阴影和模糊查 `styles.json`，保留 Figma 原始参数；栅格样式查同文件的 `gridStyles`，用法见 [`../h5-sizing-and-adaptation.md`](../h5-sizing-and-adaptation.md) 的“栅格”。当前只存在 `Mobile` 单一模式，不生成暗色或其他主题覆盖。
- 规范和组件以 375×812 的 1 倍逻辑画板为设计基准。H5 代码使用 [`../h5-sizing-and-adaptation.md`](../h5-sizing-and-adaptation.md) 的换算、安全区和预览规则；本目录 JSON 中的 px 保留 Figma 原始数值。页面左右边距由设计方 2026-10-08 确认统一为 16px（`page-margin-x`）；Figma 布局说明（`227:5744`）中“部分密集或二三级页面 12px”的描述不再采用。页面、卡片与元素的语义间距见 `spacing-semantic.json` 与 [`../h5-sizing-and-adaptation.md`](../h5-sizing-and-adaptation.md) 的“语义间距”；它们是设计方确认值，不是 Figma 变量。

## 来源分级与边界

- **A 已命名**：本地变量及样式见四个 JSON。变量集合名为 `Collection 1`，模式为 `Mobile`；发布状态未验证。
- **B 局部值**：业务画板、组件实例或规范示意中未绑定变量/样式的数值，只作为该位置的证据，不上升为全局 Token。未绑定基础变量的业务画板不纳入本期基础 Token 一致性审计。
- **C 冲突/未知**：见 `pending-confirmation.md`。当前数字文字样式已改为唯一名称；规范页仍有旧说明，使用时以本地 Text Style 属性和已确认的设计方说明为准。

`Components/control-*` 八个数值变量已单独记录于 `controls.json`；这只是尺寸变量清单，不是组件属性契约或前端 API。不要从单页截图、PC Token 或惯例补充未在当前 Interval 阶梯中的间距档、边框粗细或主题值；H5 断点按 `../h5-sizing-and-adaptation.md` 使用。

## 图表色顺序（2026-10-15 用户确认）

Chart/CH01–CH10依次绑定移动端Primitive：Blue/B06、Purple/P06、Cyan/C05、Pink/PK05、DeepBlue/DB07、Green/G04、Blue/B05、Yellow/Y04、Sky/S07、Pink/PK04。顺序与用户提供PC截图一致，色值仍由移动端原始色定义，不复制PC数值。Figma Mobile模式、本地colors.json与编译产物同步。

## 数字字体场景选择

先遵循组件对数字字体的明确规定，其余场景按 [数字字体使用场景](numeric-font-usage.md) 执行：股票/基金/金融产品代码、独立的重要数据/金额/价格/百分比/涨跌幅等字段优先使用GJTypeDisplay；文章、卡片标题、摘要、标签、结果数量句式中的数字以及日期随文本使用系统字体，不优先使用数字字体。

# Tag Figma 审计（移动端）

来源：Figma `948:6243`（Tags），2026-10-09 只读检查，未修改 Figma。组件集：Tag_small `948:6308`（66 = 11 色 × 3 风格 × 2 形状）、Tag_middle `948:6484`（88 = 11 色 ×（3 风格 + filled 带图标）× 2 形状）、CornerTag `948:6683`（20 = 2 尺寸 × 5 色 × 图标有无）、circleTag `948:6441`（14 = 7 字 × 2 状态）。

## 已核对一致

- **尺寸**：Tag_middle 高 24（绑定 `Components/control-XS`）、左右 8、gap 4、文字 H7_CN-S 12/18；带图标 filled 左右 6、图标 12。Tag_small 高 20（`control-XXS`）、左右 4、文字 H8_CN-S 10/14。
- **颜色**：底色绑定 `Background/BG_*`、`Background/Container`、`Chart/CH*`；filled 文字 `Text/reversal`；line 描边 0.6 INSIDE。
- **图标**：Tag_middle 与 CornerTag 的图标实例为本地 `icf_business_stock`，对应图标库同名 SVG；颜色与文字一致。
- **边角标签**：渐变使用本地样式 极客蓝 / 国金红 / 国金紫 / 高端金渐变，黑色为 `Background/MK_60`；圆角 8/0/8/0；文字 P5_CN-R / P6_CN-R、`Text/reversal`。
- **圆形标签**：20×20 圆形，H8_CN-S；默认 `Background/Secondary` + `Text/Tiatery`，active `Primitive/Blue/B03` + `Primitive/Blue/B08`。

## 待确认

| 编号 | 问题 | 当前处理 |
| --- | --- | --- |
| TAG-M-001 ✅ 已关闭（2026-10-09） | 页面规格文字为“高度 16、单字宽 16、左右间距 4、圆角 3、字号 10 行高 15”，与组件（Small 20 / Medium 24、圆角 4、10/14 与 12/18）不一致。 | 设计方确认以组件为准（Small 20 / Medium 24、圆角 4、10/14 与 12/18）；页面规格文字由设计方按下方建议更新。 |
| TAG-M-002 ✅ 已关闭（2026-10-09） | 同色同风格下，矩形与圆形变体文字色不一致：yellow Default（Small 矩形 CH05，其余 Y07）、yellow line（矩形 CH05，圆形 Y07）、cyan Default（矩形 C07，圆形 C06）、orange line（Medium 圆形 O07，其余 CH04）。 | 设计方确认以组件为准；基座取矩形变体的值（yellow Default 取多数 Y07）。 |
| TAG-M-003 ✅ 已关闭（2026-10-09） | 绑定不统一：Tag_small 矩形圆角 4 未绑定、圆形 14 / 28 未绑定（Tag_middle 分别绑 `Radius-XS`、`Radius-full`）；green 在 Tag_small 绑 `Primitive/Green/G06`、Tag_middle 绑 `Chart/CH03`（同值）；cyan line 描边 CH06 #22D3EE 与文字 C06 #06B6D4 不同色。 | 设计方确认以组件为准；基座按 Tag_middle 变量实现，视觉一致。 |
| TAG-M-004 ✅ 已关闭（2026-10-09） | 边角标签“高端金渐变”为 Figma 本地样式，尚未进入移动端 Token 库。 | 已从 Figma 只读提取（`S:cebca2d1…`）补入 `references/tokens/styles.json`，重新生成 Token：`--ds-gradient-cebca2d10361`；基座 `.gj-m-corner-tag-gold` 改用该变量，颜色页渐变区同步显示。 |
| TAG-M-005 ✅ 已关闭（2026-10-09） | 4 个组件集 description 均为空；颜色名 `ddeepblue` 疑似拼写。 | 设计方手动补充说明（建议文字见下方）；类名使用 deepblue。 |
| TAG-M-007 ⏸ 设计方自行在 Figma 修改（2026-10-15） | Figma 标签颜色变体绑定 Chart/CH 变量。图表色顺序调整后，色名与色值不再对应：orange 显示粉（CH04=PK05）、red 显示紫（CH02=P06）、yellow 显示深蓝（CH05=DB07）、green 显示浅青（CH03=C05）等。 | 站点已按色名重新绑定对应色系（red→Feedback/error&rise、green→Feedback/success&decline、orange→Feedback/warning、其余取同名基础色），颜色顺序不变。Figma 由设计方后续自行改绑。 |
| TAG-M-006 ✅ 已关闭（2026-10-09） | 规则要求边角标签“圆角与卡片一致”，但组件固定 8/0/8/0，无尺寸或圆角选项。 | 设计方确认以组件为准：默认 8；基座保留 `--gj-m-corner-radius` 供圆角 8 以外的容器对齐。 |

## 记录（不影响实现）

- Tag_small 只有 Size=small 一个取值；Tag_middle 无 Size 属性。基座以 Medium 为基础类、Small 为修饰类。
- circleTag 以“字”为变体（7 个市场），基座改为任意单字 + `is-active`。
- 标签无交互状态与 Prototype。

## 基座渲染核对

### 2026-10-09 浏览器核对

- 方法：独立测试页按 H5 根字号规则渲染全部组合，视口 375（1rem=100px）与 320（1rem=85.33px）各一轮。
- 常规标签：2 尺寸 × 11 色 × 3 风格 × 2 形状，另加 Medium filled 带图标（共 154 种）；核对高度、左右内边距、字号（不低于 10px）、字重、圆角（矩形 4 / 圆形全圆）、底色、文字色、line 0.6px 描边、图标尺寸与**图标色 = 文字色**。
- 边角标签：2 尺寸 × 5 色 × 图标有无；核对高度、内边距、圆角 8/0/8/0、渐变底、白字、字号字重、图标色。圆形标签：默认 / active 的尺寸、圆形、底色、文字色、字号。
- 结果：每个视口 1436 项，0 项不通过；无 404。

## 建议的 Figma 说明（供设计方复制，Claude 不修改 Figma）

- **常规标签规格文字（替换页面“常规标签”说明）**：适配 375px 界面。尺寸：Medium 高 24，左右内边距 8，字号 12 / 行高 18；Small 高 20，左右内边距 4，字号 10 / 行高 14；字重 Semibold。圆角：矩形 4，圆形全圆角。图标 12，仅用于 filled，图标与文字间距 4。常规标签字数建议不超过 6 个汉字。
- **Tag_middle**：常规标签（Medium）：高 24，左右内边距 8（带图标 6），文字 12/18 Semibold。风格 Default 浅底深字、filled 实底白字、line 白底 0.6 描边；形状 rectangle 圆角 4 / round 全圆角；11 种颜色按语义选用。icon=true 仅用于 filled，图标取自图标库、颜色跟随文字。标签只做展示，文字建议不超过 6 个汉字。
- **Tag_small**：常规标签（Small）：高 20，左右内边距 4，文字 10/14 Semibold；风格、形状、颜色与 Tag_middle 一致，用于空间紧凑处。标签只做展示，文字建议不超过 6 个汉字。
- **CornerTag**：边角标签：贴在卡片或图片左上角，左上、右下圆角与容器圆角一致（默认 8），右上、左下直角；容器圆角大于等于 12 时不建议使用，不得遮挡任何可见信息。Regular 高 24（12/18）/ Small 高 20（10/16），左右内边距 6；颜色为极客蓝、国金红、国金紫、高端金渐变与黑色 60%，可带 12 图标。
- **circleTag**：圆形标签：20×20 圆形单字，文字 10/14 Semibold，用于展示客户在各证券市场的开户情况（港 / 北 / 三 / 创 / 科 / 期 / 融）。灰色 Default 表示未开通，蓝色 active 表示已开通（点亮）；7 个市场按固定顺序成组展示，间距 4。

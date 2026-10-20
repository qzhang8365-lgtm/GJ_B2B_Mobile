# Floating Button Figma 审计（移动端）

来源：Figma `1157:5100`（`2.floatingbutton` 组件集，页面 `Mobile_按钮Button` `11:1610`），2026-10-09 只读检查，未修改 Figma。组件集 4 个变体：`2 color（default / blue）× 2 direction（to_top / to_bottom）`。页面内未找到该组件的用法说明或实例。

## 已核对一致

- **尺寸**：4 个变体均为 48×48，图标 28 居中（2026-10-09 由 32 改为 28），圆角 48。
- **投影**：均使用本地效果样式 `Shadow_center`（0 0 15 · #000 10%），与 Token `--ds-effect-shadow-center` 一致。
- **default**：底色绑定本地 `Background/Container`（#FFFFFF），图标绑定 `Text/Tiatery`（#8D96A3）。
- **blue**：图标绑定 `Text/reversal`（#FFFFFF）。
- **图标来源**：`icf_Arrow_up`、`icf_Arrow_down` 均为本地图标组件，对应图标库同名 SVG。

## 待确认

| 编号 | 问题 | 当前处理 |
| --- | --- | --- |
| FAB-M-001 ✅ 已关闭（2026-10-09） | blue 底色为未绑定的 #1677FF。 | 设计方确认使用品牌蓝 #2B73FF，将在 Figma 绑定 `Button/Primary/Bg-default`；基座已使用 `--ds-button-primary-bg-default`。 |
| FAB-M-002 ✅ 已关闭（2026-10-09） | 只有 default 一种状态。 | 设计方确认加按下态并沿用按钮做法：default 叠加 `Background/Hover_2`（黑 3%），blue 底色换 `Button/Primary/Bg-pressed`；不加禁用态。基座已实现。 |
| FAB-M-003 ✅ 已关闭（2026-10-09） | 偏移与间距 Figma 未定义。 | 设计方确认：距右侧 16（页面边距）、距底部 24 + 底部安全区、多个按钮间距 12；有 TabBar 或底部操作栏时底部偏移加上栏高。 |
| FAB-M-004 ✅ 已关闭（2026-10-09） | 组件集 description 为空；无图标实例交换属性。 | 设计方决定不加换图标属性，只补说明；新增、发帖、下载等用法以 rules.md 为准，图标从图标库换取。建议说明见下方。 |

## 记录（不影响实现）

- 圆角 48、内边距 8、图标 28 均未绑定变量；圆角按圆形实现（`--Radius-full`）。
- 无 Prototype 交互。

## 基座渲染核对

### 2026-10-09 浏览器核对

- 方法：独立测试页按 H5 根字号规则渲染 2 种配色 × 4 种图标（含 to_top / to_bottom），视口 375 与 320 各一轮。
- 核对项：尺寸 48、内边距 8、圆形、底色、图标色、投影（0 0 15 · 黑 10%）、图标尺寸 32、**图标颜色 = 配色前景色**、图标居中、点击热区 ≥ 44、定位容器右侧与底部偏移。
- 结果：每个视口 96 项，0 项不通过；无 404。预览页“位置”示例在手机框内为真实 fixed 定位，可滚动并点击回到顶部 / 到达底部。

### 2026-10-09 按下态核对

- 新增按下态（FAB-M-002）：375 / 320 各 104 项（含 default 叠加黑 3%、blue 底色 #1F63F0），0 项不通过；展示页“配色与方向”增加 pressed 示例。

## 建议的 Figma 说明（供设计方复制，Claude 不修改 Figma）

- **2.floatingbutton**：悬浮按钮：固定在界面右下方、带投影的圆形按钮（48×48，图标 28）。to_top / to_bottom 用于页面过长时回到顶部或到达底部；也可换用图标库图标承载新增、发帖、下载等页面级操作。default 用于辅助操作，blue 用于页面主推操作。距右 16、距底 24 + 安全区，多个按钮纵向间距 12；有 TabBar 时上移。按下：default 叠加黑 3%，blue 底色加深。

### 2026-10-09 图标尺寸更新

- Figma 4 个变体图标改为 28×28（居中，位置 10,10）；基座 `.gj-m-fab > .gj-icon` 改为 0.28rem。blue 底色仍为未绑定 #1677FF，待设计方按 FAB-M-001 结论绑定 `Button/Primary/Bg-default`。

### 2026-10-09 Figma 收尾复核

- 组件集说明文字已按建议更新并核对一致。
- blue 两个变体底色已绑定 `Button/Primary/Bg-default`（#2B73FF），与基座一致。

# Text Button Figma 审计（移动端）

来源：Figma `1158:2359`（`Text_Button` 组件集，页面 `Mobile_按钮Button` `11:1610`），2026-10-09 只读检查，未修改 Figma。组件集 36 个变体，正好覆盖 `3 Size × 4 State × 3 Icon`。属性：`size`、`state`、`icon`、`Label#1158:1`（文本）、`ButtonIcon#1158:0`（实例交换）。

## 已核对一致

- **颜色**：同一 State 下三档尺寸、三种图标位置的文字色一致；全部绑定本地 `Text/*` 变量（Secondary / Primary / blue / disable）。
- **图标颜色**：24 个含图标变体中，图标填充与文字色全部一致，均绑定同一 `Text/*` 变量。
- **图标来源**：所有图标实例主组件为本地 `icf_system_search`，对应图标库 `assets/icons/iconfont/icf_system_search.svg`。
- **尺寸**：Large 24 高、图标 20；Medium 22 高、图标 16；Small 18 高、图标 12；无内边距、无背景、无描边。
- **图标与文字间距**：内部框 gap 4，三档一致（未绑定变量，等于 `Interval/space-4`）。

## 待确认

| 编号 | 问题 | 当前处理 |
| --- | --- | --- |
| TBTN-M-001 ✅ 已关闭（2026-10-09） | 组件集 description 为空。 | 原写在 Button 组件集上的 Textbutton 描述即本组件说明，设计方确认并要求补充点击热区；建议文字见 button/audit.md“建议的 Figma 说明”。 |
| TBTN-M-002 ✅ 已关闭（2026-10-09） | 存在 hover 状态，而移动端 Button 没有。 | 设计方确认移动端不要 hover，将从 Figma 删除 hover 变体；基座与展示页已去掉 hover，状态为 default / pressed / disabled。 |
| TBTN-M-003 ✅ 已关闭（2026-10-09） | 文字样式混用远程 Body 与本地 P5_CN-R。 | 设计方已在 Figma 全部改绑本地 P2_CN-R / P3_CN-R / P5_CN-R，复核一致。 |
| TBTN-M-004 ✅ 已关闭（2026-10-09） | 组件无背景，但设有圆角（Large / Medium 8，Small 6 绑远程 `圆角/md`）。 | 设计方确认圆角无意义，将在 Figma 去掉；基座不实现圆角，仅键盘聚焦轮廓使用 `--Radius-XS`。 |
| TBTN-M-005 ✅ 已关闭（2026-10-09） | 外层 gap：Left_Icon 0、Right_Icon 4，实际间距由内层 gap 4 决定。 | 设计方确认不影响显示，直接关闭；基座按 4 实现。 |

## 记录（不影响实现）

- Figma 组件集默认 Size 为 Large；基座与 Button 一致以 Medium 为基础类（见 mapping.json）。
- 无 Icon_Only 变体；无 Prototype 交互，pressed 由 `:active` 承担。

## 基座渲染核对

### 2026-10-09 浏览器核对

- 方法：独立测试页按 H5 根字号规则渲染全部 36 个组合（3 Size × 4 State × 3 Icon），视口 375（1rem=100px）与 320（1rem=85.33px）各一轮；hover 用真实鼠标悬停触发，pressed 用 `.is-pressed`。
- 核对项：高度 = 行高、无内边距、字号（不低于 12px）、字重、文字色、无背景、无描边、透明度、图标尺寸、**图标颜色 = 文字颜色**、图标与文字间距 4、图标垂直居中、点击热区 ≥ 44×44。
- 结果：每个视口 444 项，0 项不通过；无 404、无脚本错误。模拟触屏设备时 `(hover: hover)` 不成立，hover 色不会出现。

### 2026-10-09 Figma 更新后复核

- 组件集现为 54 个变体：3 size × 3 state（default / pressed / disabled，hover 已删除）× 3 icon × 2 Style（grey / blue）。
- grey 按下态由 `Text/blue` 改为 `Text/Primary`；新增 blue：默认 / 按下 / 禁用分别绑定 `Button/Primary/Bg-default`、`Bg-pressed`、`Bg-disable`。图标颜色均与文字一致。基座已同步（基础类 = grey，`-blue` = blue）。
- 仍未变化：Large / Medium 圆角 8、Small 圆角绑定远程 `圆角/md`（TBTN-M-004）；外层 gap Left_Icon 0 / Right_Icon 4（TBTN-M-005）；description 仍为空（建议文字见 button/audit.md）。
- 浏览器复核：54 个组合（含 Style）在 375 / 320 各 666 项，0 项不通过；状态矩阵改为 grey / blue × 三档尺寸 × 三种状态，交互演示新增 Style 选择。

### 2026-10-09 Figma 收尾复核

- 组件集说明文字已按建议更新并核对一致。
- 54 个变体圆角已全部去掉（0，无变量绑定），与基座一致。

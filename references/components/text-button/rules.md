# Text Button 文字按钮（移动端）

来源：Figma `1158:2359`（页面 `Mobile_按钮Button`），2026-10-09 只读提取。结构化数据见 [`schema.json`](schema.json)，类名对应见 [`mapping.json`](mapping.json)，审计见 [`audit.md`](audit.md)。原型基座：`assets/styles/gj-b2b-mobile-components.css` 的 `.gj-m-text-button`（不代表真实前端组件库 API）。

## 用途

无背景、无描边的轻量操作，用于“查看详情”“更多”“展开”、卡片或列表行内的次要操作。需要明确操作权重或作为页面主操作时改用 [Button](../button/rules.md)。

## 尺寸

| 尺寸 | 高度 | 文字样式 | 图标 | 图标与文字间距 |
| --- | ---: | --- | ---: | ---: |
| Large | 24 | P2_CN-R 16/24 | 20 | 4 |
| Medium（基础类） | 22 | P3_CN-R 14/22 | 16 | 4 |
| Small | 18 | P5_CN-R 12/18 | 12 | 4 |

- 无内边距，高度等于文字行高；字重 Regular。
- 字号不低于 12px（`h5-small-screen.md`）。
- 与 Button 或其他文字按钮并排时保持同档。

## 样式与状态

移动端只有 default、pressed、disabled，没有 hover。Style 分 grey（基础类）与 blue（`.gj-m-text-button-blue`）：

| Style | default | pressed | disabled |
| --- | --- | --- | --- |
| grey | `Text/Secondary` #475467 | `Text/Primary` #101828 | `Text/disable` #B8C0CC |
| blue | `Button/Primary/Bg-default` #2B73FF | `Button/Primary/Bg-pressed` #1F63F0 | `Button/Primary/Bg-disable` #9CC0FF |

- grey 用于一般轻量操作；blue 用于需要强调的链接式操作（如“查看全部”）。

## 图标

- 只从图标库选取（`references/icons/index.json` → General/iconfont），用 `.gj-icon` + `--gj-icon` 引用；不得自绘、Emoji 或库外资源。Figma 默认 `icf_system_search`。
- **图标颜色始终与文字颜色一致**，所有尺寸与状态均使用 `currentColor`，不单独设色。
- 只有左图标、右图标两种位置，没有纯图标形态；纯图标操作使用 Button 的 Icon_Only。
- 跳转、展开类操作常用右侧箭头（如 `icf_Arrow_right`），新增、筛选等动作类常用左侧图标。

## 交互与排版

- 视觉上无容器内边距，但实际点击热区至少 44×44px（设计方 2026-10-09 确认），通过伪元素扩展，不改变视觉尺寸；相邻文字按钮之间留足间距，避免热区重叠。
- 文字不省略、不换行。

## 2026-10-20 统一来源：预览站页面私有写法收进基座
预览站（组件页、模式页）展示的组件只用基座 + mapping 模板，与 skill 生成同一来源；以下写法原先只写在预览页里，现已进入基座，生成页面直接使用，不在页面重复写。
- 三级文字色 `.gj-m-text-button-tertiary`：页签行 / 筛选行右侧辅助图标按钮（PR-014），按下变主文字色。

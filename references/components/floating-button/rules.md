# Floating Button 悬浮按钮（移动端）

来源：Figma `1157:5100`（页面 `Mobile_按钮Button`），2026-10-09 只读提取；用途说明来自设计方 2026-10-09 的说明（Figma 中暂无用法文档）。结构化数据见 [`schema.json`](schema.json)，类名对应见 [`mapping.json`](mapping.json)，审计见 [`audit.md`](audit.md)。原型基座：`.gj-m-fab` 与定位容器 `.gj-m-fab-group`（不代表真实前端组件库 API）。

## 用途

- 固定在界面右下方，带投影呈悬浮状态。
- 主要用于页面内容过长时快捷回到顶部（`to_top`）或到达底部（`to_bottom`）。
- 根据需要也可承载新增内容、发帖、下载等页面级高频操作，图标从图标库换取。
- 不承载需要文字说明的操作，不用于表单提交；同一页面的悬浮按钮不超过两个。

## 规格

| 项 | 值 |
| --- | --- |
| 尺寸 | 48×48，圆形 |
| 图标 | 28，居中 |
| 投影 | `Shadow_center`（0 0 15 · 黑 10%），`--ds-effect-shadow-center` |
| default | 白底 `Background/Container`，图标 `Text/Tiatery` |
| blue | 品牌蓝底，图标 `Text/reversal`（白） |
| 按下 | default 叠加 `Background/Hover_2`（黑 3%）；blue 底色换 `Button/Primary/Bg-pressed`（沿用按钮做法，无禁用态） |

- 回到顶部、到达底部等辅助性操作用 default；页面主推的新增、发帖等操作用 blue。
- 图标只从图标库选取，用 `.gj-icon` 引用；图标颜色随配色变化（currentColor），不单独设色。方向类分别用 `icf_Arrow_up` / `icf_Arrow_down`。
- 纯图标按钮必须提供 `aria-label`（如“回到顶部”）。

## 位置

- 右下角固定，`.gj-m-fab-group` 纵向排列多个按钮。距右侧 16（页面边距）、距底部 24 + 底部安全区、多个按钮间距 12（设计方 2026-10-09 确认）。
- 页面有底部 TabBar 或固定操作栏时，底部偏移需加上栏高，不得遮挡栏内操作。
- 不遮挡页面关键内容；列表末尾留出足够空白，避免最后一项被按钮盖住。

## 交互

- 回到顶部按钮在页面滚动超过一屏左右后出现，回到顶部后隐藏；具体触发距离待确认。
- 点击后平滑滚动到目标位置。
- 实际热区至少 44×44px。

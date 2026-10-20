# Slider Figma 审计（移动端）

来源：Figma 页面 `滑块Slider` `1822:16186`。2026-10-14 只读提取。

## 处理记录

- 2026-10-14 设计方授权由 Claude 修改：表单页的 `Form-item/slider`（`Property 1=title / disabled`）与 `Form-item/slider_rule` 移到本页，合并为 `Slider`（1832:49），属性 `Type=Continuous / Step`、`State=Default / Disabled`；新增 `Type=Step, State=Disabled`（整体 40%）。`Form_slider`、`Form_slider_rule` 中的实例自动指向新组件，图层名改为 `Slider`。

## 已核对一致

- 轨道 8 / 圆角 4，`Background/Secondary` 与 `Brand/GJ_Blue`；滑块 28，`Background/Container` + `shadow_small`。
- 刻度：标签 P3 `Text/Tiatery`，当前档 `Text/Primary`；刻度线 `Border/secondary`。
- 禁用：整体 40%。

## 待确认

| 编号 | 问题 | 当前处理 |
| --- | --- | --- |
| SL-M-001 ✅ 已定并落地（2026-10-16） | 刻度滑块由固定宽度的矩形拼成，标签与刻度位置不随档数和宽度变化；`Form_slider` 标题行间距 38 为固定值。 | 刻度段改为自动布局并填充宽度，`Form_slider` 标题行改为标题填充、数值自适应。 2026-10-15：plain 禁用文字已改回 Text/Primary，保留整行 40%。indicator 类型的列表项源组件（如 58:4789）已不在画布上，无法修改，见 SL-M-009。 2026-10-16：决定 B：选择列表整行 40%，文字保持原色。 |
| SL-M-002 ✅ 已修复（2026-10-15） | 刻度滑块没有已选段着色，与连续滑块不同。 | 刻度滑块不着色，网站保持一致。 2026-10-15：居中变体的勾已换为 icf_system_check。 |

## 基座渲染核对

### 2026-10-14 浏览器核对

- 375：轨道、滑块、刻度与标签位置与 Figma 一致；热区高 44。
- 交互：方向键与点击均可调整，数值、当前档文字与读屏文字同步更新；禁用 40%。
- 320：页面无横向滚动。

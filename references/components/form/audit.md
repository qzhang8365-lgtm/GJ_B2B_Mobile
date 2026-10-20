# Form Figma 审计（移动端）

来源：Figma 页面 `表单Form` `155:2401`，组件说明 `1011:209`。2026-10-14 只读提取。

## 已核对一致

- 表单项：上内边距 12，标题与控件间距 8，控件 L 40；标题 H5-CN-S `Text/Secondary`，星号 `Feedback/error&rise`，说明 P3 `Text/Tiatery`。
- 控件均为对应组件的实例：`input`、`Select`、`Datepicker`、`switch`。
- 表单卡：内边距 16，标题 H4-CN-S，与内容间距 12。

## 待确认

| 编号 | 问题 | 当前处理 |
| --- | --- | --- |
| FM-M-001 ✅ 已关闭（2026-10-14） | 滑块：文件里没有滑块页。`Form-item/slider`、`Form-item/slider_rule` 是独立的录入控件，`Form_slider`、`Form_slider_rule` 是表单行。 | 设计方授权由 Claude 修改：`Form-item/slider`、`Form-item/slider_rule` 移到「滑块Slider」页，合并为 `Slider`（1832:49，`Type=Continuous / Step` × `State=Default / Disabled`），`Form_slider`、`Form_slider_rule` 引用自动更新。 |
| FM-M-002 ✅ 已关闭（2026-10-14） | 命名：`Form-item/title` 应为单元 `Form_item/Title`；`Form_switch` 属性 `switch=Default / small` 应为 `Size=Default / Small`；`Form_input` 属性首字母大写，`Form_select`、`Form_dateselect` 为小写；滑块属性 `Property 1=title / disabled` 无意义。 | `Form_select`、`Form_dateselect` 属性改为 `Required / Filled / Disabled / Error`；`Form_switch` 属性改为 `Size=Default / Small`。 |
| FM-M-003 ✅ 已关闭（2026-10-14） | 同一表单内控件样式不一致：`Form_input` 用输入框描边式（`Background/Container` + `Border/secondary`），`Form_select`、`Form_dateselect` 用填充式（`Background/Background` + `Border/default`）。 | `Form_input` 已改为填充式，表单内控件统一。网站同步。 |
| FM-M-004 ✅ 已关闭（2026-10-14） | 错误提示不一致（承接 SE-M-011）：输入框在控件下方 4、P5 12/18；选择器、日期在下方 8、P4 13/20。 | Select 组件错误提示改为下方 4、`P5_CN-R`；表单内错误提示全部统一。网站基座 `.gj-m-select-message` 同步。 |
| FM-M-005 ✅ 已关闭（2026-10-14） | `Form_input` 的错误、禁用变体外层多了右内边距 12（控件宽 331，其他 343），错误变体间距 10。 | 已去掉多余内边距，控件统一 343。 |
| FM-M-006 ✅ 已关闭（2026-10-14） | `Form_switch` 标题与开关间距 15（非 Token），Default 宽 340、small 宽 343。 | 间距改为 12，宽度统一 343。网站同步为 12。 |
| FM-M-007 ✅ 已关闭（2026-10-14） | `Form_slotcard` 底色 `#ffffff` 未绑定变量。 | 已绑定 `Background/Container`。 |
| FM-M-008 ✅ 已关闭（2026-10-14） | 标题提示图标 15（图标规格应为 16）；`Text-Required` 属性只有 false，无实际作用。 | 图标改为 16，已删除 `Text-Required`。 |
| FM-M-009 ⏸ 不处理（2026-10-14，设计方） | `Form_dateselect` 有 12 个变体，含“禁用 + 错误”组合；`Form_select` 只有 8 个，没有这类组合。 | 保留现状；网站禁用时不显示错误。 |

## 基座渲染核对

### 2026-10-14 浏览器核对

- 375：表单项间距、标题样式、错误提示、开关项与 Figma 一致；提示图标热区 44。
- 交互：空表提交显示 3 条错误并聚焦第一项，提示“还有 3 项未完成”；输入后错误即时消失；全部填写后提交成功。
- 320：页面无横向滚动。

2026-10-14 设计方调整：表单项顶部留白 12 → 16（Form_input / Form_select / Form_dateselect，高 86）；开关项同步改为顶部 16、底部 0（高 44 / 38）。网站同步。

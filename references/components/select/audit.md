# Select Figma 审计（移动端）

来源：Figma 页面 `选择器Select` `155:2402`：`Select` `907:3644`（State default / filled / active / disabled / error × Size L / M × Style default / stroke，20 变体）、`Picker_view` `158:2359`、`Picker_popup` `158:2542`，组件说明 `1004:42`；弹层头部引用 `弹窗Popover` 页 `modal_item/panel-header` `58:4611`。2026-10-12 只读检查。

## 设计方已处理（2026-10-12，上传前，经授权由 Claude 在 Figma 内执行）

- `select_basic` 更名 `Select`，删除 icon=false 的 16 个变体，改用布尔属性 `Show Icon` 控制前缀图标；15 个引用实例（选择器页、表单Form 页）换到新变体且外观不变。变体命名统一为 `State / Size / Style`。
- `ietm/PickerView` → `Picker_view`（`Columns=1|2`），`picker_popup` → `Picker_popup`。
- 列表、胶囊、确认弹层类组件移到新页面 `列表 Selection List`（见 selection-list/audit.md）。
- 变体网格重排（行 = State，列 = Size × Style），消除重叠。

## 已核对一致

- L：高 40，内边距 8/12，间距 4，圆角 `Radius-MD`，P2 16/24，图标 20；M：高 32，内边距 8，圆角 `Radius-SM`，P3 14/22，图标 16；箭头区左 12。
- 填充式 `Background/Background` + `Border/default`；描边式 `Background/Container` + `Border/secondary`；active `Border/focused` + caret-up。
- 前缀图标与箭头 `Text/Tiatery`；占位 `Text/disable`；已选 `Text/Primary`。
- Picker：视口 284，行 42，P2 16/24 `Text/Primary`，选中带 top 126、上下 1px `Border/default`；Columns=2 各 188。
- error（2026-10-12 设计方新增）：描边 `Border/error`，其余同 filled（`Text/Primary`，底色随 Style），箭头朝下；文本属性 `Error message`：框下方 4，P4_CN-R 13/20 `Feedback/error&rise`（L 变体总高 68、M 60）。
- 弹层头部：高 52，内边距 10/12，标题 P2 16/24 `Text/Primary`，关闭 `icf_system_close-md` 24 `Text/Tiatery`。

## 待确认

| 编号 | 问题 | 当前处理 |
| --- | --- | --- |
| SE-M-001 ✅ 已定并落地（2026-10-16） | 禁用态组件 40% 不透明度，文字图层又叠了一次 40%，实际只剩 16%。 | 基座整体 40%（与输入框、列表一致）。建议删除文字图层上的 40%。 2026-10-15：禁用态占位文字的 40% 已去掉，只保留整体 40%。 2026-10-16：决定 B：选择器整体 40%，文字不再叠加。 |
| SE-M-002 ✅ 已定并落地（2026-10-16） | 占位文字用 `Text/disable`，输入框、搜索栏的占位为 `Text/Tiatery`。 | 基座按 Figma 用 `Text/disable`。建议确认是否统一为 `Text/Tiatery`。 2026-10-15：见决策清单「选择器占位文字颜色」。 2026-10-16：决定 A：占位文字统一 Text/Tiatery。网站选择器与日期选择器占位已改；Figma Select 4 个 default 变体已改绑。 |
| SE-M-003 ✅ 已关闭（2026-10-15） | 箭头实例名 `icf_Arrow_caret-down` / `caret-up`，矢量 13.28×7.64，与图标库 `icf_Arrow_down` / `icf_Arrow_up` 相同；图标库同名 `caret-down` 文件是上下双三角（排序图标）。 | 基座用 `icf_Arrow_down` / `icf_Arrow_up`（2026-10-12 设计方指出曾误用小号 `down-sm`，已改）。建议 Figma 换为 `icf_Arrow_down` / `up`，或核对图标库命名。 2026-10-15：复核：Figma 图标页的 icf_Arrow_caret-down（21:25）即 iconfont 的 icf_Arrow_down（单箭头），Figma 的 icf_Arrow_down 是带杆箭头；属图标库命名映射差异，选择器无需改。 |
| SE-M-004 ✅ 已关闭（2026-10-12） | `Select`、`Picker_view`、`Picker_popup` 组件 description 为空。 | 已填写。 |
| SE-M-005 ✅ 已修复（2026-10-15） | Picker 选中带高 40，行高 42，带的下边线落在行内 2px 处。 | 基座选中带按 42。建议带高改为 42。 2026-10-15：Picker 选中带高度已改为 42。 |
| SE-M-006 ✅ 已修复（2026-10-15） | Picker 上下渐隐为未绑定的纯白渐变；遮罩为未绑定的黑色 55%（无对应 MK 变量）。 | 渐隐用 mask 实现（不依赖底色）；遮罩暂取 `Background/MK_60`。建议遮罩绑定 MK_60（或确认取值）。 2026-10-15：遮罩已绑定 Background/MK_60；上下渐隐为渐变色标，Figma 不支持绑定变量，仅记录。 |
| SE-M-007 ✅ 已定并落地（2026-10-16） | `Picker_popup` 只有关闭按钮，没有确定 / 取消；组件说明却写“确认前保留临时选择，取消不提交”。 | 演示按“滑动即选中，关闭收起”。需确认 Picker 是否补确认操作。 2026-10-15：见决策清单「Picker 是否需要确认按钮」。 2026-10-16：决定 A：Picker 头部改为「取消 / 保存」（Figma Dialog_item/Panel_header save=true，设计方已建），Picker_popup 已替换；滑动只改临时值，保存才提交，取消或点遮罩放弃。网站新增 .gj-m-popup-header-action / .gj-m-popup-cancel / .gj-m-popup-save，选择器页演示已改。 |
| SE-M-009 ✅ 已关闭（2026-10-12） | 新增的 error 变体箭头用的是 `icf_Arrow_caret-up`（展开态的朝上箭头），error 是收起状态。 | 已改为 caret-down。 |
| SE-M-010 ✅ 已关闭（2026-10-12） | Figma 没有错误提示文字的样式。 | error 变体已加 `Error message`；基座新增 `.gj-m-select-message` 按 Figma 实现。 |
| SE-M-011 ✅ 已关闭（2026-10-14） | 选择器错误提示为下方 8、P4 13/20，输入框错误提示为下方 4、P5 12/18，同一表单内会不一致。 | 设计方授权修改 Select 组件：错误变体间距 4、提示改 `P5_CN-R`，与输入框一致；网站同步。 |
| SE-M-008 ✅ 已定并落地（2026-10-16） | 弹层顶部圆角：Picker_popup 为 8，Selection Sheet 为 16。 | 基座分别实现（`.gj-m-popup-panel-sm` 为 8）。建议统一。 2026-10-15：见决策清单「底部弹层顶部圆角」。 2026-10-16：决定 A：底部弹层顶部圆角统一 16（Radius-XL）。网站 .gj-m-popup-panel-sm 不再改圆角；Figma Picker_popup 面板已绑定 Radius-XL。 |

## 说明

- 底部弹层（遮罩、面板、头部、底部操作区）基座暂定义在 Select 段（`.gj-m-popup*`），弹窗 Popover 上架时迁移过去。

## 基座渲染核对

### 2026-10-12 浏览器核对

- 方法：独立测试页按 H5 根字号规则渲染，视口 375 与 320；预览页交互演示另测弹层开合与回填。
- 375：L 高 40、圆角 8、左右 12、16 号，填充底 #F5F7FA、描边 #EBEEF2；前缀与箭头 20、#8D96A3；占位 #B8C0CC；M 高 32、圆角 6、14 号、描边式白底、长结果省略；三个 M 并排各 109 无溢出；Picker 高 284、行 42、选中带 126、双列各 188；弹层头部 52、遮罩 60%、关闭 24 热区 44。
- 320：等比缩放，M 视觉高 27.3、热区 44；无横向溢出。
- 交互：Picker 打开即定位当前值，滚到第 4 项回填“私募基金”、关闭后保留；选择列表点“公募基金”回填并关闭；禁用时不打开；页面无脚本错误。

2026-10-14 Figma 命名规范调整（设计方确认）：普通组件用 `xx_xx`，不带 `/`；构成组件的单元放在 `组件名_item/单元名` 下。本组件已按此改名。

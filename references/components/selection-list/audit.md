# Selection List Figma 审计（移动端）

来源：Figma 页面 `列表 Selection List` `58:4742`（2026-10-12 由选择器页拆出）：`Selection List/Item` `58:4766`、`Selection List` `158:1890`、`Selection List/Indicator` `170:4782`、`Choice Chip/Item` `158:1520`、`Choice Chip/Group` `158:2018`、`Selection Sheet/Confirmable` `148:1226`，组件说明 `1741:5389`。2026-10-12 只读检查。

## 设计方已处理（2026-10-12，上传前，经授权由 Claude 在 Figma 内执行）

- 原选择器页中的列表行、列表、前置标记、胶囊、确认弹层移到本页并统一命名；Item 合并为 `Type / State / Align` 9 个变体，indicator 文字关联到 `Text` 属性，删除旧 Leading 组件集。
- 组件说明画板原为固定高度 1（内容不可见），改为随内容自适应；Item 变体网格重排，消除重叠。

## 已核对一致

- 行高 46（上下 12），左右 16，P3 14/22 `Text/Primary`；选中 `Text/blue` + 尾部勾选 20（左 12）；分隔线 1px `Border/default`。
- indicator：指示器 20 + 间距 12，分隔线从文字区起；未选 2px `Border/default` 描边、`Background/Container` 底；选中 `Brand/GJ_Blue`。
- Choice Chip：高 40，内边距 6/10，全圆角，`Background/Background`，P3 居中，指示器距右 10；选中 1px `Border/focused`。Group：内边距 12/16，间距 12，grid 两列 / list 单列。
- Selection Sheet：顶部圆角 16，头部 panel-header 52，底部操作区内边距 16、间距 16，Tertiary + Primary Large。

## 待确认

| 编号 | 问题 | 当前处理 |
| --- | --- | --- |
| SL-M-001 ✅ 已定并落地（2026-10-16） | 禁用态两类做法不同且重复淡化：plain 文字 `Text/disable` 再叠 40%；indicator 整行 40% 且文字仍是 `Text/disable`。 | 基座统一为整行 40%、文字保持原色（与 ListBar 一致）。建议 Figma 去掉 `Text/disable` 或去掉 40%，两类统一。 2026-10-15：plain 禁用文字已改回 Text/Primary，保留整行 40%。indicator 类型的列表项源组件（如 58:4789）已不在画布上，无法修改，见 SL-M-009。 2026-10-16：决定 B：选择列表整行 40%，文字保持原色。 |
| SL-M-002 ✅ 已修复（2026-10-15） | 选中勾选图标：左对齐用 `icf_system_check`，居中用 `icf_system_confirm`（图标库没有该文件）。 | 基座统一 `icf_system_check`。建议居中变体换成 `icf_system_check`。 2026-10-15：居中变体的勾已换为 icf_system_check。 |
| SL-M-003 ✅ 已关闭（2026-10-15） | `Align=center, State=selected`：文字区宽 375 + 勾选区 32，超出行宽 375，勾选被挤出、文字偏左。 | 基座勾选绝对定位在右 16，文字两侧对称让位，保持居中。建议 Figma 勾选改为绝对定位。 2026-10-15：复核：勾选区已为绝对定位。 |
| SL-M-004 ✅ 已关闭（2026-10-12，设计方决定） | 指示器为矢量图形，且多选用圆形与“方形表示多选”的说明冲突。 | 取消 indicator 类型：列表内单选、多选都用尾部勾选；方形 Checkbox 只用于表单横排、协议确认与全选。网站已改。**Figma 待办**：删除 `Type=indicator` 的 3 个 Item 变体与 `Selection List Type=indicator`；`Selection List/Indicator` 仅 Choice Chip 使用；组件说明中“前置标记列表（多选）”“圆点表示单选，方形勾选框表示多选”改为新规则。 |
| SL-M-005 ✅ 已定并落地（2026-10-16） | Choice Chip：无禁用态；圆角 100 未绑定 `Radius-full`；文字为 Fill 宽，指示器绝对定位压在文字区上，长文字会被盖住。 | 基座禁用 40%；全圆角用 `Radius-full`；文字两侧各让出 34，长文案省略。建议补禁用态并绑定圆角。 2026-10-15：圆角已绑定 Radius/Radius-full；禁用态未补（待决策后补）。 2026-10-16：禁用态已补：Figma Choice Chip/Item 新增 State=disabled（整体 40%），与决策 B 一致。 |
| SL-M-006 ✅ 已修复（2026-10-15） | Selection Sheet：按钮文案是占位“按钮”；Large 按钮的高度变量绑定为 `控件/control-M`、描边为 `边框色/default`（与其他组件的变量名不一致）。 | 基座用“取消 / 确定”、Large 40。建议改文案并核对按钮实例的变量绑定。 2026-10-15：按钮已换为当前 1.Button（Large、Shape=regular），文案“取消 / 确定”。 |
| SL-M-007 ✅ 已修复（2026-10-15） | `Selection List/Indicator` 组件 description 为空。 | 已提供建议文本，待粘贴。 2026-10-15：description 已填写。 |
| SL-M-008 ✅ 已定并落地（2026-10-16） | Figma 列表末项仍显示分隔线。 | 基座末项不显示（与 ListBar 一致）。请确认。 2026-10-15：见决策清单「列表末项分隔线」。 2026-10-16：决定 A：末项不显示分隔线。Figma 三个 Selection List 变体的末项分隔线已去掉。 |

## 基座渲染核对

### 2026-10-12 浏览器核对

- 方法：独立测试页按 H5 根字号规则渲染，视口 375 与 320；预览页三处交互演示另测。
- 375：行高 46、左 16、14 号、选中 #2B73FF + 勾选 20、分隔线 #EBEEF2；指示器 20；居中项文字中心 188 = 行中心 188；胶囊高 40、两列各 166、全圆角、选中蓝色描边、长文案与指示器不重叠；弹层头部 52、圆角 16、底部按钮各 164×40；无横向溢出。
- 320：行高兜底 44；胶囊视觉 34、热区 44；无横向溢出。
- 交互：单选切换、禁用行点击无效；多选计数“已选 2 项”，前置标记时对齐选项禁用；胶囊多选 / 单选切换；确认式弹层取消不回填、再次打开恢复、确定回填“银行、证券、半导体”、点遮罩关闭；页面无脚本错误。

### 2026-10-12 取消前置标记类型

- 设计方确定：列表内单选、多选统一为尾部勾选。网站选择列表页“类型”改为“单选与多选”，状态、交互演示（选择模型：单选 / 多选）与确认式弹层示例同步改为尾部勾选；多选弹层标题注明“可多选”，“确定”后显示已选数量。

### 2026-10-15 修复时新发现

| 编号 | 问题 | 处理 |
| --- | --- | --- |
| SL-M-009 | `Selection List`（Type=indicator）里的列表项实例指向的源组件（如 `58:4789`、`58:4813`）已不在画布上，无法编辑；禁用态文字仍为 Text/disable。 | 建议设计方用当前 `Selection List/Item` 重建 indicator 类型的列表项。 |

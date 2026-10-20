# DatePicker Figma 审计（移动端）

来源：Figma 页面 `日期选择器Datepicker` `173:10016`：`Datepicker` `173:10050`（48 变体）、`calendar` `176:2315`、`calendar_range` `1016:8395`、`Datepicker_item/Date_item` `173:10128`（18 变体），组件说明 `1022:108`。2026-10-13 只读检查，未修改 Figma。

## 已核对一致

- 输入栏：L 40（内边距 8/12、间距 8、圆角 8、P2、图标 20）/ M 32（内边距 8、圆角 6、P3、图标 16）；Default `Background/Background` + `Border/default`，lined `Background/Container` + `Border/secondary`；State active `Border/focused`、error `Border/error`。日历图标与占位 `Text/disable`；范围“至” `Text/Tiatery`、间距 8。
- 日历：内边距 12、`Background/Container`；头部 36，按钮 40 × 32、图标 24 `Text/blue`，标题 H3-CN-S 18/26；星期行 45、P3、底部 `Border/default`；日期行 48、行距 4；日期 H4-CN-S 16/24。
- 日期格：current `Text/blue`；selected 48 × 48 圆角 12、`Text/reversal`；范围 `Background/BG_blue`，开始左圆角 12、结束右圆角 12，端点方块 `Brand/GJ_Blue`；disabled `Text/disable`；task 6 圆点 `Brand/GJ_red`。

## 待确认

| 编号 | 问题 | 当前处理 |
| --- | --- | --- |
| DP-M-001 ✅ 已关闭（2026-10-13，经授权由 Claude 在 Figma 内修改） | 命名混乱。 | Datepicker 改为 `Type=single / range`、`Filled=false / true`、`Style=default / stroke`、`Size`、`State`；Date_item 改为 `State`、`Task`、`Range=none / start / middle / end`（原“开始 + 结束都为 true”的变体实为结束端，已对应为 `Range=end`）。实例自动跟随。 |
| DP-M-002 ✅ 已关闭（2026-10-13，Claude 修改） | 单日选中填充绑定 `Text/blue`。 | 已改绑 `Brand/GJ_Blue`。 |
| DP-M-003 ✅ 已关闭（2026-10-13） | 输入栏宽 351。 | 已改 343。 |
| DP-M-004 ✅ 已关闭（2026-10-13） | 日历图标颜色与选择器不一致。 | 已改 `Text/Tiatery`；网站同步。 |
| DP-M-005 ✅ 已关闭（2026-10-13，Claude 修改） | 范围占位英文。 | 已改为“开始日期 至 结束日期”。 |
| DP-M-006 ✅ 已关闭（2026-10-13） | 输入栏没有禁用态。 | 已补 `State=disabled`（整体 40%）。 |
| DP-M-007 ✅ 已关闭（2026-10-13，设计方：不处理） | 年份图标 Figma 名 `icf_Arrow_arrows-left-regular`，图标库文件名 `icf_Arrow_tarrows-left-regular`。 | 不改；基座以图标库文件名为准。 |
| DP-M-008 ✅ 已关闭（2026-10-13） | 月份按钮图标实例多一层白色填充。 | 已删除。 |
| DP-M-009 ✅ 已关闭（2026-10-13，Claude 修改） | 日期格宽度与列宽不匹配。 | 设计方确定 Fill；calendar / calendar_range 中全部日期格已设为 Fill（每格 50.14）。 |
| DP-M-010 ✅ 已关闭（2026-10-13） | 日历面板的弹层形态未定义。 | 设计方指定使用底部对话弹层 Bottom Dialog（`1769:9679`，弹窗Popover 页，组件尚未上架）：拖拽条 + 日历 + “取消 / 确认”。网站已改为选好后点“确认”回填，“取消”/遮罩不提交，范围选齐两端才可确认。 |
| DP-M-014 ✅ 已关闭（2026-10-13） | 日历头部图标颜色两处不一致。 | 设计方确定灰色 `Text/Tiatery`；calendar 与 Bottom Dialog 已统一，网站同步。 |
| DP-M-015 ✅ 已关闭（2026-10-13） | 弹层圆角与按钮间距不一致。 | 设计方已改 Bottom Dialog 圆角 16 / 16；Claude 将 Selection Sheet/Confirmable 按钮间距由 16 改为 12。网站弹层按钮间距统一为 12。 |
| DP-M-016 ✅ 已关闭（2026-10-13，Claude 修改） | 单日选中 50、范围端点 48。 | 范围端点方块改为 50（与单日一致）；网站同步。 |
| DP-M-017 ✅ 已关闭（2026-10-13，Claude 修改） | 日历固定 6 行。 | calendar / calendar_range 已删除末尾整行下月日期，改为 5 行（高 379）；网站按当月需要显示 4–6 行。 |
| DP-M-011 ✅ 已关闭（2026-10-13，设计方：不需要） | 事项圆点颜色与类型的对应未定义。 | 规范不固定颜色含义，由业务自定并在页面给出图例；Figma 不补多圆点变体。网站示例图例（待办 / 已完成 / 提醒 / 会议）仅为示意。 |
| DP-M-012 ✅ 已关闭（2026-10-13，Claude 修改） | 组件说明画板高度为 1。 | 已改为随内容自适应（2638）。 |
| DP-M-013 ✅ 已关闭（2026-10-13） | 组件 description 为空。 | 4 个组件已填写。 |
| DP-M-018 ✅ 已关闭（2026-10-13） | 年份 / 月份格子用 PC 库 Button 与远程变量。 | 已改为本地 `1.Button`（Ghost / Primary，Large，114 × 50，圆角 12，P2_CN-R 16/24），变量均为本地（Background/Container、Text/Primary、Text/Tiatery、Radius-LG、Button/Primary/Bg-default、Text/reversal）。 |
| DP-M-019 ✅ 已关闭（2026-10-13） | description 复制自 calendar。 | 已改。注：文案两端带了“「」”，可删去。 |
| DP-M-020 ✅ 已关闭（2026-10-13） | 标题格式不一致。 | 年份“2024”、月份“2024-06”，已统一。 |
| DP-M-021 ✅ 已关闭（2026-10-13） | 年份 / 月份格子缺禁用态与当前态。 | 已补：禁用为实例 40% 不透明度（2031 / 十二月），当前年 / 月为 Text/blue（2026 / 十月），与网站一致。 |

## 基座渲染核对

### 2026-10-13 浏览器核对

- 375：日期格 50.14 × 48、选中方块 48 圆角 12；头部按钮热区 44；弹层高 473；输入栏同选择器尺寸。
- 交互：打开定位当前月并标记今天；下一月 / 下一年切换正确；单日点击回填并收起，再次打开定位到已选月份；范围选开始后标题提示“请选择结束日期”，点更早日期作为新开始，选结束后回填“开始 至 结束”，区间内 7 天浅蓝；“仅可选未来 30 天”禁用范围外日期；点遮罩关闭；页面无脚本错误。

### 2026-10-13 改用底部对话弹层

- 按设计方指定的 Bottom Dialog（`1769:9679`）实现：拖拽条区 20（32 × 4、圆角 2、`Border/secondary`），内容左右 16、与拖拽条间距 10，日历内边距 0；底部按钮组内边距 16、间距 12，Tertiary“取消” + Primary“确认” Large。
- 交互复测：单日未选时“确认”禁用，选中后可确认；“取消”不回填；范围只选开始时“确认”禁用，选齐后可确认并回填“开始 至 结束”；无脚本错误。

### 2026-10-13 设计方修改后复核

- 网站同步：日历头部图标与输入栏日历图标改为 `Text/Tiatery`；日期行高 50；单日选中 50 × 50、范围端点 48；区间底色 `Background/BT_B10`；事项圆点下移到 39。

### 2026-10-13 经授权在 Figma 内修改

- 设计方授权（“你帮我改Figma”）后，Claude 在 Figma 中完成：DP-M-001 属性重命名、002 选中填充改绑、005 占位文案、009 日期格 Fill、012 说明画板自适应、016 范围端点 50、017 日历 5 行；以及选择列表 Selection Sheet/Confirmable 按钮间距 12。截图核对 calendar_range 与 Date_item 正常。

# Dialog Figma 审计（移动端）

来源：Figma 页面 `弹窗Dialog`（原「弹窗Popover」）`58:5100`：`Dialog_center` `161:4250`、`Dialog_bottom` `1037:12071`、`Dialog_item/Header` `161:4104`、`Dialog_item/Panel_header` `58:4611`、`Dialog_item/Panel_bar` `313:8560`，组件说明 `1043:47`。2026-10-14 只读提取。

## 已核对一致

- 居中：Background/Container，圆角 16，上内边距 28；头部内边距 16 / 32、间距 8；标题 H2-CN-S `Text/Primary`，正文 P2 `Text/Secondary`；图标 60 `Text/blue`。
- 操作区（Modal_buttonset）：内边距 16、间距 12，Large 按钮等分。
- 底部：顶部圆角 16；拖拽条 32×4 `Border/secondary`；标题栏高 52、关闭 24 `Text/Tiatery`，Line 为 `Border/default` 下边线。与选择器、日期选择器、筛选已使用的 `.gj-m-popup` 一致。

## 待确认

| 编号 | 问题 | 当前处理 |
| --- | --- | --- |
| DL-M-001 ✅ 已关闭（2026-10-14） | 命名：页面叫「弹窗Popover」，但组件说明写明应为 Dialog（Popover 是锚定触发器的浮层）；`Modal_center`、`Bottom Dialog`（带空格）、`modal_item/*` 不符合命名规范。 | 页面改「弹窗Dialog」；组件 `Dialog_center`、`Dialog_bottom`，单元 `Dialog_item/Header`、`Dialog_item/Panel_header`、`Dialog_item/Panel_bar`。 |
| DL-M-002 ✅ 已关闭（2026-10-14） | 属性：`Title=True / false`、`Message=True / false` 大小写混用；`Bottom Dialog` 的 `Title=Default / true`；`Modal_center` 的 `style=1button / 2buttons`；`panel-header` 的 `close button`；按钮页 `Modal_buttonset` 的 `button count` / `button style`。 | `Dialog_center` `Buttons=1 / 2`；`Dialog_bottom` `Title=False / True`；`Panel_header` 关闭属性改 `Close`。 |
| DL-M-003 ✅ 已关闭（2026-10-14） | `Modal_center style=2buttons` 的主按钮是远程库组件（底色 `#2b73ff` 未绑定，文字 `文本色/reversal`、高度 `控件/control-M` 为远程变量），`1button` 用的是本地 `1.Button`。 | 已换本地 `1.Button`。 |
| DL-M-004 ✅ 已关闭（2026-10-14） | `Modal_center` 宽 373，几乎占满 375，没有左右边距。 | 面板宽改为 343，与网站左右 16 边距一致。 |
| DL-M-005 ✅ 已关闭（2026-10-14） | `panel-header` 的 `Title=false` 变体中关闭按钮在左侧（`Title=true` 在右侧）。 | 无标题时关闭按钮已在右侧。 |
| DL-M-006 ✅ 已关闭（2026-10-14） | 状态图标只有成功（`icf_system_check-circle-fill` 蓝色）。 | 设计方授权由 Claude 修改：头部新增 `Status=Default / Success / Error / Warning`（9 个新变体）：Success 绿 `Feedback/success&decline`、Error 红 `icf_system_close-circle-fill` `Feedback/error&rise`、Warning 橙 `icf_system_warning-fill` `Feedback/warning`。网站同步 `.is-success / .is-error / .is-warning`。注：图标库 `icf_system_close-circle-fill` 图形撑满 24 格，比 check / warning（20/24）略大。 |

## 基座渲染核对

### 2026-10-14 浏览器核对

- 375：居中弹窗四种头部组合、一 / 两个操作；底部弹窗无标题（拖拽条）/ 有标题（关闭 + 下边线）与 Figma 一致。
- 交互：打开后焦点进入弹窗（危险确认默认在“取消”），Tab 循环限制在弹窗内；Esc、关闭、取消结果一致，焦点回到触发按钮；可选点击遮罩关闭；内容超长只滚动正文。
- 选择器、日期选择器、筛选、选择列表页的底部弹层回归正常。
- 320：页面无横向滚动。

2026-10-14 设计方调整：状态图标 60 → 52（Default / Success 变体）。网站同步 52。Error、Warning 变体随后也改为 52（设计方）。注：Error 的图形撑满 52（其余为 43），视觉偏大，源于图标库 `icf_system_close-circle-fill` 自身没有留白；网站 SVG 留白一致，不受影响。

2026-10-15复核58:4611新增Subtitle。左对齐两条74高变体仍标Subtitle=false但副标题可见，网页按可见内容提供Subtitle=true语义。未修改Figma。

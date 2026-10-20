# Upload Figma 审计（移动端）

来源：Figma 页面 `上传Upload` `1114:815`：`Upload_Button` `1114:883`、`Upload_item/File_item` `1114:890`（12 变体），组件说明 `1117:72`。2026-10-13 只读提取。

## 已核对一致

- 文件项：高 `Components/control-L` 40、内边距 `Interval/space3` 8、间距 12、圆角 `Radius-MD` 8。
- 文件名 P2_CN-R 16/24 `Text/Primary`；文件大小 P5_CN-R 12/18 `Text/Tiatery`；删除 `icf_system_close-md` 20 `Text/Tiatery`。
- 按下（Hover）`Background/Background`；失败 `Background/BT_R8` + `Feedback/error&rise`。
- 进度条：轨道 `Background/MK_10`、进度 `Brand/GJ_Blue`，高 4 圆角 2；百分比 P4_CN-R 13/20。
- 上传按钮：Button Tertiary left_icon，Large 40 / Medium 32，图标 `icf_file_upload` 20 / 16。

## 待确认

| 编号 | 问题 | 当前处理 |
| --- | --- | --- |
| UP-M-001 ✅ 已关闭（2026-10-14） | 命名与属性：属性值 `large / medium` 小写，与 `Image_upload` 的 `Small / Medium / Large` 不一致；默认值是 medium，但说明写“移动端默认大号”。 | 已改 `size=Large / Medium`，组件名按规范为 `Upload_button`（2026-10-14）。默认值已改为 Large（2026-10-14），与网站一致。 |
| UP-M-002 ✅ 已关闭（2026-10-14） | `Upload_item/File_item` 状态名 `State5`、`State6` 含义不清（分别是 filesize=true 的 Hover、Default，与 filesize 属性重复）；移动端没有 Hover。 | 已改为 `State=Default / Error / Uploading` × filesize；按下态已删除，网站同步移除。 |
| UP-M-003 ✅ 已关闭（2026-10-14） | Button 的 left_icon 变体内边距 Large 16 / Medium 12，无图标变体 20 / 16；基座 `.gj-m-button` 统一按 20 / 16。 | 以基座 Button 为准；中号已换用 `1.Button`（内边距 16），网站不改。 |
| UP-M-004 ✅ 已关闭（2026-10-14） | 说明写“上传中允许取消”，但 Uploading 变体没有取消按钮；filesize=true 的上传中也没有百分比。 | 上传中已加取消按钮（两种 filesize 都有）。 |
| UP-M-005 ✅ 已关闭（2026-10-14） | `State=Error, filesize=true` 的文件大小用了 `Microsoft YaHei` 字体、样式 `中文/S9-CN-R`，其他变体为 PingFang `P5_CN-R`。 | 已改为 PingFang `P5_CN-R`。 |
| UP-M-006 ✅ 已关闭（2026-10-14） | 失败图标 `icf_system_close_square_fill` 不在图标库（形状为圆形）。 | 已换 `icf_system_close-circle-fill`。 |
| UP-M-007 ✅ 已关闭（2026-10-14） | 进度条是 Group + 两个固定宽度矩形（198 / 143），不随宽度自适应；Uploading 主轴对齐 CENTER，其他变体 MIN；「上传中...」未设截断。 | 进度条已设为 Fill，随宽度自适应。 |
| UP-M-008 ✅ 已关闭（2026-10-14） | 失败状态用失败原因替换了文件名，多个文件失败时分不清是哪个。 | 已改为「文件名 + 失败原因」两行，网站同步。 |
| UP-M-009 ✅ 已关闭（2026-10-15） | 文件名截断方式为尾部省略（ENDING），会丢扩展名；使用建议要求“保留扩展名并中间截断”。 | 网站拆分主名与扩展名，主名省略、扩展名保留。Figma 文本无法实现，仅记录。 2026-10-15：Figma 无法实现中间截断，网站已处理，仅记录。 |
| UP-M-010 ✅ 已关闭（2026-10-15） | 文件图标 `file/24px/*` 以 20 使用；部分路径填充未绑定变量。 | 网站用 `assets/icons/fileicon/24px-*.svg` 缩放到 20。 2026-10-15：网站使用 fileicon 资源，仅记录。 |

## 基座渲染核对

### 2026-10-13 浏览器核对

- 375：文件项高 40、内边距 8、圆角 8；按下、上传中、失败配色与 Figma 一致；删除 / 取消热区 44。
- 交互：上传 → 进度到 100% 变完成；失败模拟在 60% 变失败；上传中可取消；达到上限按钮禁用；删除后焦点回到上传按钮。
- 320：页面无横向滚动；长文件名截断后保留扩展名。

## 2026-10-13 定点复核1114:890

最新8变体已规范为Default/Pressed/Error/Uploading及filesize开关，UP-M-002源问题已修正；错误图标已为close-circle-fill（UP-M-006修正）；失败项已保留文件名及原因（UP-M-008修正）；失败大小已绑定本地P2_CN-R 16/24，旧远程字体问题UP-M-005修正，采用最新P2而非旧建议P5。基座与预览同步内部gap8、失败两行结构及颜色字号。源失败项高60，但P2 24 + gap4 + P5 18 + padding16=62，网页按真实行高自然撑高，避免裁字。此差异已于2026-10-13获用户确认关闭：保留文字行高、间距和内边距，失败项自然撑高到62，不将60宣称为精确渲染高度。未修改Figma。

2026-10-13 用户确认：失败项按内容自然撑高至62，长原因可继续增高，避免裁字；高度差异已关闭。375/320预览检查无横向溢出及脚本错误。

2026-10-13 用户确认多文件列表项上下间距4；基座gj-m-upload-list从space-12改为space-4，头部与列表间距保持。

2026-10-13 复核1114:890：各态新增图标容器，图标20、上下2。失败变体counterAxisAlignItems=MIN，图标与首行标题对齐；网站新增gj-m-upload-item-icon-slot及失败项顶对齐，列表项上下gap4与自然高度规则保留。

2026-10-13 用户要求删除文件项Pressed状态：已移除基座active/is-pressed样式、预览示例和可用状态映射。此前Pressed核对记录仅为历史证据，不再作为生成规则。

2026-10-13再次复核1114:913：13.2MB已为本地P5_CN-R 12/18，基座同步字体指标，错误色保留。

2026-10-14 Figma 命名规范调整（设计方确认）：普通组件用 `xx_xx`，不带 `/`；构成组件的单元放在 `组件名_item/单元名` 下。本组件已按此改名。

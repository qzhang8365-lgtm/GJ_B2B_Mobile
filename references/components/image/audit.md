# Image Figma 审计（移动端）

来源：Figma 页面 `图片Image` `58:1903`：`image` `58:1904`（6 变体）、`imageViewer` `58:1942`、`ImageUpload` `201:2578`，组件说明 `1039:7`。2026-10-13 只读检查，未修改 Figma；同日设计方调整后复查。

## 已核对一致

- 比例：4:3（375 × 281）、16:9（375 × 211）、1:1（375 × 375），图片填充 Fill。
- 圆角 8：正常、加载中、失败一致。
- 加载中：`Background/Background` + `icf_system_loading` 40；失败：`Background/Background` + 图标 48 `Text/disable`。
- 预览：遮罩 `Background/MK_60`，页码 `Text/reversal`。
- 上传入口：`Background/Background` + 1px 虚线 `Border/hover`，`icf_system_add` 48 `Text/disable`；Small 120 / Medium 160 / Large 240，圆角均为 8。

## 待确认

| 编号 | 问题 | 当前处理 |
| --- | --- | --- |
| IM-M-001 ✅ 已关闭（2026-10-13） | 正常与失败圆角不一致。 | 已统一为 8，网站默认圆角 8。 |
| IM-M-002 ⏸ 暂不处理（2026-10-13，设计方） | 失败占位图标是未入库的矢量。 | 网站继续用图标库 `icf_file_image`。 |
| IM-M-003 ✅ 已关闭（2026-10-13） | 预览的遮罩与图片为远程组件。 | 已改为本地 `mask`（蒙层Mask 页，填充 `Background/MK_60`）与本地 `Image`。 |
| IM-M-004 ✅ 已关闭（2026-10-13） | 上传入口属性名与尺寸。 | 已改 `size=Small / Medium / Large`（120 / 160 / 240），圆角统一 8。内边距 49 仍在，不影响尺寸，可顺手删掉。 |
| IM-M-005 ✅ 已关闭（2026-10-13，设计方确认） | 上传宫格规则。 | 根据容器宽度：扣除卡片内边距后等分三列，间距不小于 8，图片 1:1（375 屏卡片内边距 16 时每格约 109）。网站 `.gj-m-image-upload-grid` 已按此实现；组件说明里固定 96 的示意需同步。 |
| IM-M-006 ✅ 已关闭（2026-10-13） | 缺加载中状态。 | 已补 `State=Loading`（`icf_system_loading` 40），网站同步为旋转加载图标。 |
| IM-M-007 ✅ 已关闭（2026-10-13） | 命名与属性。 | 已改 `Image`（Ratio，State=Default / Loading / Error）、`Image_viewer`、`Image_upload`。 |
| IM-M-008 ✅ 已关闭（2026-10-13） | 正常图片外框圆角 12、未裁切、白色填充。 | 已改圆角 8、开启裁切、去掉填充。 |
| IM-M-009 ✅ 已关闭（2026-10-13） | 已上传缩略图没有组件、删除图标不在图标库。 | 已补 `ImageUpload_thumnail`（`1792:14847`）：删除 / 只读 / 上传入口 / 失败 / 上传中；删除改用 `icf_system_close-circle-fill`。网站同步，删除按钮底色改 `Text/Secondary`，补上传中与失败。 |
| IM-M-010 ✅ 已关闭（2026-10-13） | `ImageUpload_thumnail` 命名、状态、尺寸与失败态入口。 | 已改名 `Image_item/Upload_item`，`State=removable / readonly / add / uploading / error`；尺寸统一 96；删除偏移 8（与列间距下限一致）；上传中、失败加删除；上传中图标改 `Text/disable`。网站删除偏移同步为 8。 |

## 基座渲染核对

### 2026-10-13 浏览器核对

- 375：4:3 / 16:9 / 1:1 比例正确，圆角 8；上传入口 120 / 160 / 240，圆角 8。
- 交互：点击第 3 张进入预览显示“3 / 4”，滑到末张“4 / 4”，点击关闭后焦点回到对应缩略图；第 2 张失败时缩略图与预览都显示占位。
- 320：页面无横向滚动。

2026-10-14 Figma 命名规范调整（设计方确认）：普通组件用 `xx_xx`，不带 `/`；构成组件的单元放在 `组件名_item/单元名` 下。本组件已按此改名。

# Filter Figma 审计（移动端）

来源：Figma 页面 `筛选filter` `170:8294`：`item/dropdown_filter` `170:8300`、`dropdown_item/filter` `1026:9129`、`Filter_default` `170:8344`（8 变体）、`filter_dropdown_active` `170:8545`、全部筛选 `1787:11850`，组件说明 `1029:191`。2026-10-13 只读检查。

2026-10-13 设计方重新整理：删除 `Filter_tabs`；`item/tree_filter`、`tree_filter` 移至级联选择器页（`1792:13371` / `1792:13384`，宽度已改 375），相关审计随级联选择器处理。

## 已核对一致

- 筛选栏：高 46，`Background/Container`，底部 1px `Border/default`；fill 无内边距、触发项 Fill 等分；left 左右 16、间距 16、触发项 Hug。
- 触发项：内边距 12/0、间距 4，文字 P3_CN-R `Text/Secondary`，箭头 16 `Text/Tiatery`（设计方由 20 改 16）；展开时文字与箭头 `Text/blue`；已选文字 `Text/blue`、箭头灰。图标型 `icf_system_filter` 16。
- 展开面板：Selection List（Type=plain），行高 46，选中 `Text/blue` + 勾选，与选择列表组件一致。
- 全部筛选：Bottom Dialog（顶部圆角 16）+ panel-header + Modal_buttonset（间距 12）；组间距 20、组标题 H5-CN-S `Text/Secondary`、标题与选项间距 10、选项换行间距 8。

## 待确认

| 编号 | 问题 | 当前处理 |
| --- | --- | --- |
| FL-M-001 ✅ 已关闭（2026-10-13） | 展开态文字未绑定 `#1677FF`。 | 已改绑 `Text/blue`。 |
| FL-M-002 ✅ 已关闭（2026-10-13，沿用图标库） | 箭头实例名 `icf_Arrow_caret-down / up`，图形与图标库 `icf_Arrow_down / up` 一致（同选择器）。 | 基座用 `icf_Arrow_down / up`，不再跟踪。 |
| FL-M-003 ✅ 已关闭（2026-10-13） | 文字与图标间距 5。 | 已改 4。 |
| FL-M-004 ✅ 已关闭（2026-10-13） | 4 个条件均分时文字区只有约 37。 | 设计方改为：触发项左右内边距 0；均分栏无内边距、等分居中（4 个条件每项约 93，文字约 4 字）；左对齐栏左右 16、间距 16，并补齐 4 个条件。网站同步。 |
| FL-M-005 ✅ 已关闭（2026-10-13） | 缺“已选”状态。 | 已补 `State=selected`（箭头型与图标型）：文字 `Text/blue`、箭头 / 图标保持 `Text/Tiatery`；网站同步。 |
| FL-M-006 ✅ 已关闭（2026-10-13） | 展开面板缺多选确认。 | 已补 `Filter_panel` Type=multi-list（多选列表）、multi-chip（分组标签），底部“清空 / 确认”；网站同步，按钮文案由“重置”改“清空”。遮罩 `Background/MK_60`、面板最高 60vh 仍为网站补充。 |
| FL-M-007 ✅ 已关闭（2026-10-13） | 选项用 PC 组件库 Button。 | `Filter_sheet` 与 `Filter_panel` multi-chip 均已换本地 `1.Button` Medium（左右 16、P3_CN-R），无远程组件。 |
| FL-M-008 ✅ 已关闭（2026-10-15） | 树形末列底色不一致。 | 见 `cascader/audit.md`。 2026-10-15：已转 CA-M-007。 |
| FL-M-012 ✅ 已关闭（2026-10-13，设计方确认） | 均分栏左右内边距为 0，较长的已选值会贴近屏幕边缘。 | 设计方确认：均分不加页边距（加 16 后两侧空白过大），只有左对齐保留左右 16，与 Figma 一致。 |
| FL-M-013 ✅ 已关闭（2026-10-13） | 超过 4 个条件的做法没有对应组件。 | 设计方已补 `Filter_bar` `More=true`（Count=4, Align=left）与 `Filter_item/Filter_item` `more=true`（纯图标）。网站同步，示例改为左对齐。 |
| FL-M-014 ✅ 已关闭（2026-10-13） | `Filter_item/Filter_item` `more=true` 只有 selected、高 40。 | 已补 `State=default / open / selected`（default `Text/Tiatery`，open、selected `Text/blue`），高改 46，与网站一致。 |
| FL-M-009 ✅ 已关闭（2026-10-13） | `tree_filter` 宽 343。 | 移至级联选择器页后已改 375。 |
| FL-M-010 ✅ 已关闭（2026-10-13，经授权由 Claude 在 Figma 内修改） | 命名不统一。 | `item/dropdown_filter` + `dropdown_item/filter` 合并为 `Filter_item/Filter_item`（Type=arrow / icon，State=default / open / selected）；`Filter_default` → `Filter_bar`（Count=1–4，Align=fill / left）；`filter_dropdown_active` → `Filter_panel`（Type=single / multi-list / multi-chip）；`Filter_Bottom Dialog` → `Filter_sheet`；说明画板改名“Filter 组件说明”、标题改“Filter”。级联选择器页引用的实例仍正常关联。 |
| FL-M-011 ✅ 已关闭（2026-10-13，设计方：不需要） | description 为空、说明画板高度 1。 | 不处理。 |
| FL-M-015 ✅ 已关闭（2026-10-16） | 均分 4 项都是 4 字时两端留白约 9，不足 16 页边距。 | 设计方改为：均分也留左右 16 页边距，在内容区内等分；网站基座已改。Figma 侧由设计方自行处理，不再跟踪。 |

## 基座渲染核对

### 2026-10-13 浏览器核对

- 375：筛选栏 46、列表行 46、弹层选项 32，与 Figma 一致；箭头为 `icf_Arrow_down / up`。
- 交互：切换触发项会先收起当前面板；单选选中即生效；多选点遮罩不提交、确认后触发项变 `Text/blue`（不显示数量）；全部筛选组内单选 / 多选正确，确认后入口变 `Text/blue`（设计方：不显示条件数）；收起后焦点回到触发项。
- 320：页面无横向滚动。
- 热区（2026-10-13 实测）：左对齐触发项 48 → 64 × 46，右侧筛选图标 44 × 46，弹层选项 32 → 40 高（行距 8 内不重叠），关闭 44 × 44，底部按钮 44 高，列表行 46。

2026-10-14 Figma 命名规范调整（设计方确认）：普通组件用 `xx_xx`，不带 `/`；构成组件的单元放在 `组件名_item/单元名` 下。本组件已按此改名。

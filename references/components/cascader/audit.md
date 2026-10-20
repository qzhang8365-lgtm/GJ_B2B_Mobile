# Cascader Figma 审计（移动端）

来源：Figma 页面 `级联选择器cascader` `58:4517`：`cascader-item/menu_item` `58:4532`、`cascader-menu` `58:4539`（10 变体）、`cascader-body` `1027:10681`、`Cascader_top` `1037:11552`、`Cascader_bottom` `1026:9767`、`item/tree_filter` `1792:13371`、`tree_filter` `1792:13384`，组件说明 `1031:147`。2026-10-13 只读检查，未修改 Figma。

## 已核对一致

- 路径栏：高 46，`Background/Container`；路径项左右 12，P3_CN-R `Text/Secondary`，当前 H5-CN-S `Text/blue`。
- 选项行：间距 8；胶囊高 28（`Components/control-S`）、左右 12；未选 `Background/Background` + P4_CN-R `Text/Secondary`，选中 `Background/BG_blue` + H6-CN-S `Brand/GJ_Blue`（P4 与 H6 同为 13/20，选中不跳字号）。
- 页面内：body + Selection List；底部弹层：圆角 16、panel-header + body + Selection List + 按钮组。
- 分栏级联：宽 375，行 40、内边距 8/16，第一列 88，三列底色依次 `Background/Background` / `Background/Tiatery` / `Background/Container`。

## 待确认

| 编号 | 问题 | 当前处理 |
| --- | --- | --- |
| CA-M-001 ✅ 已关闭（2026-10-15） | 底线位置与颜色。 | 2026-10-13 复查：已改为 `Cascader_item/Body` 底部 1px 描边绑定 `Border/default`，与网站一致。仅剩 `Cascader_item/Menu` `Level=tab, Count=2` 仍挂着旧效果样式 `Border Bottom`，建议去掉。 2026-10-15：复核：Menu Count=2 已无旧效果样式。 |
| CA-M-002 ✅ 已关闭（2026-10-15） | 胶囊圆角 24 未绑定变量。 | 网站用 `Radius-full`（高 28 时视觉一致）。建议绑定 `Radius/Radius-full`。 2026-10-15：复核：胶囊圆角已绑定 Radius-full。 |
| CA-M-003 ✅ 已定并落地（2026-10-16） | 路径栏首项文字距左 12、选项行左右内边距 12，与页面边距 16 不一致（筛选栏左对齐为 16）。 | 网站按 Figma 12。请确认是否统一为 16（路径栏首项左内边距 16、选项行左右 16）。 2026-10-15：见决策清单「级联选择器左右边距」。 2026-10-16：决定 A：统一 16。网站路径栏首项左内边距 16、选项行左右 16；Figma Cascader_item/Menu tab 左内边距 4（首项文字距左 16）、option 左右 16。 |
| CA-M-004 ✅ 已关闭（2026-10-15） | `cascader-body` 里的 `Filter_item/Filter_item` 默认用了 `State=open`（蓝色）。 | 网站默认 `State=default`（灰），展开 / 已选再变蓝。建议改为 default。 2026-10-15：复核：筛选入口已为 State=default。 |
| CA-M-005 ✅ 已修复（2026-10-15） | `cascader-body` 一级行外层不是自动布局：路径栏固定宽 294，`Filter_item/Filter_item` 设为 Fill，层级增多时的溢出方式没有表达。 | 网站：路径栏占满剩余宽度、横向滚动，筛选入口按内容宽度固定在右侧。建议改为自动布局（路径栏 Fill + 横向滚动，筛选 Hug）。 2026-10-15：Levels=1 一级行已改为自动布局：路径栏 Fill，筛选入口固定 81。 |
| CA-M-006 ✅ 已修复（2026-10-15） | `Cascader_sheet`（`1026:9767`）按钮用的是旧版 `1.Button`（`Shape=Default`、`Icon=none`），文案为“按钮”。 | 2026-10-13 复查：主组件已在本页。网站用“取消 / 确认”。建议换成当前 `1.Button`（`Shape=regular`），文案改“取消 / 确认”。 2026-10-15：按钮已换为当前 1.Button（Large、Shape=regular），文案“取消 / 确认”。 |
| CA-M-007 ✅ 已定并落地（2026-10-16） | 树形末列底色不一致：两级时末列 `Background/Tiatery`，三级时末列 `Background/Container`。（原筛选 FL-M-008） | 2026-10-13 复查：列图层名已改为一级 / 二级 / 三级。网站按 Figma；请确认末列是否统一为白色。 2026-10-15：见决策清单「级联树形末列底色」。 2026-10-16：决定 B：保持现状（两级末列 Background/Tiatery，三级末列 Background/Container）。 |
| CA-M-008 ✅ 已关闭（2026-10-13，经授权由 Claude 在 Figma 内修改） | 命名不统一。 | `Cascader_item/Item`（Level=tab / option，State=default / selected；文本属性 Tab Text / Option Text）、`Cascader_item/Menu`（Level=tab / option，Count=2–6）、`Cascader_item/Body`（Levels=1 / 2，Filter）、`Cascader_inline`、`Cascader_sheet`、`Cascader_item/Column_item`（Level=1 / 2 / 3，State=default / selected）、`Cascader_columns`（Levels=2 / 3）。Tab 与 Option 保留在同一组件集，用 Level 区分。 |
| CA-M-009 ✅ 已关闭（2026-10-13） | 路径栏与选项行之间空白过大。 | 选项行内边距改为 上 0 / 左右 12 / 下 12（高 40），网站同步，胶囊热区 44。 |
| CA-M-010 ✅ 已关闭（2026-10-13，经授权由 Claude 在 Figma 内修改） | 横向展开的级联命名为 Tree，与纵向缩进的树形结构容易混淆。 | 改名 `Cascader_columns`（分栏级联）、`Cascader_item/Column_item`；网站类名改为 `.gj-m-cascader-columns` / `-column` / `-column-item`。 |

## 基座渲染核对

### 2026-10-13 浏览器核对

- 375：路径项 52 × 46（热区 52 × 42，底部 4 让给胶囊热区）、胶囊 50 × 28（热区 58 × 44）、列表行 46、树形行 40，与 Figma 一致。
- 交互：切换区域清空省份与城市；切换省份清空城市；页面内选到末级即显示结果；弹层未选到末级时“确认”禁用，确认后回填，再次打开恢复路径；分栏级联选到末级显示结果，选“全部”直接完成。
- 320：页面无横向滚动。

2026-10-14 Figma 命名规范调整（设计方确认）：普通组件用 `xx_xx`，不带 `/`；构成组件的单元放在 `组件名_item/单元名` 下。本组件已按此改名。

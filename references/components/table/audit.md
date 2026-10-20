# Table Figma 审计（移动端）

来源：Figma 页面 `表格Table` `161:4399`：`1.Table_regular` `161:4723`、`2.Table_popover` `161:4532`、`4.table_column` `161:4459`（4 变体）、`5.table_header` `161:4405`（4 变体）；组件说明 `1109:53`。2026-10-14 只读提取。

2026-10-14 按 Figma 重做网站样式（替换此前版本）：补上单元格底部分割线、圆角 8 裁切、排序与说明图标、勾选列、双行同色、操作列始终固定 + 投影、弹出层投影；去掉 Figma 没有的选中行蓝底与蓝色排序图标；勾选改用 `.gj-m-checkbox`，操作改用蓝色文字按钮。

## 已核对一致

- 表头：高 48，内边距 12 / 16（2026-10-15 更新），`Table/head_bg`，P3_CN-R Text/Secondary；图标 16、与文字间距 4。
- 单元格：内边距 12 / 16，单行 46 / 双行 68（2026-10-15 更新），`Table/table_bg1`，底部 1px `Border/default`，P3_CN-R Text/Primary。
- 操作：`Text_Button` blue Medium（Button/Primary/Bg-default）；勾选：`checkbox_item/checkbox` 20。
- 弹出层表格与操作列：`Shadow_center`。

## 待确认

| 编号 | 问题 | 当前处理 |
| --- | --- | --- |
| TB-M-001 ✅ 已修复（2026-10-15） | 命名：`1.Table_regular`、`2.Table_popover`、`4.table_column`、`5.table_header` 带序号前缀、大小写不统一；表头 / 单元格是组成单元。属性 `text=singleline / Doubleline / checkbox / manage` 实际表示单元格类型，大小写混用。 | 建议：`Table_Regular`、`Table_Popover`；单元放 `table_item/header`、`table_item/cell`；属性改 `Type=single / double / checkbox / action`。 2026-10-15：已改名 Table_Regular、Table_Popover、table_item/header（Select / Sort / Icon）、table_item/cell（Type=single / double / checkbox / action）。 |
| TB-M-002 ✅ 已定并落地（2026-10-16） | `2.Table_popover` 组件无圆角，组件说明里的弹出层示例是圆角卡片。 | 网站与普通表格一致用圆角 8。确认弹出层是否加圆角。 2026-10-15：见决策清单「表格弹出层圆角」。 2026-10-16：决定 A：Table_Popover 加圆角 8（Radius-MD）并裁切内容。 |
| TB-M-003 ✅ 已定并落地（2026-10-16） | 分割线变量：有 `Table/border`、`Table/divider`（N05），但单元格底线绑的是 `Border/default`（N04）；`Table/table_bg2`（N02）未使用。 | 网站按组件用 `Border/default`。确认 Table 专用变量是否废弃或用于别处（如斑马纹）。 2026-10-15：见决策清单「Table 专用变量」。 2026-10-16：决定 B：保留 Table 专用变量，用于斑马纹等表格专属场景；单元格底线仍用 Border/default。 |
| TB-M-004 ✅ 已关闭（2026-10-14） | 排序图标。 | 图标库已有 `icf_Arrow_caret`（F07B）、`caret-up`（F07D）、`caret-down`（F07F）：未排序 caret（Text/Tiatery），升序 caret-up、降序 caret-down（Text/Secondary，图标自带另一方向 20% 透明）。 |
| TB-M-005 ✅ 已关闭（2026-10-14） | 操作列是否固定。 | 设计方：始终固定操作列。网站操作列 `th/td.gj-m-table-op` 始终吸附右侧并带 Shadow_center。 |
| TB-M-006 ✅ 已关闭（2026-10-14） | 表头勾选形式。 | 设计方：表头不需要单独变体，按 checkbox 组件变体（未选 / 选中 / 半选）设置。网站用 `.gj-m-checkbox`。 |
| TB-M-007 ✅ 已关闭（2026-10-14） | 勾选列表头变体。 | 同 TB-M-006，不需要。 |

## 基座渲染核对

### 2026-10-14 浏览器核对

- 375：表头 48；单行单元格 46、双行 68（含勾选列和文字按钮的行，不因控件撑高）；底部分割线、圆角 8、操作列固定；投影只在有内容被遮住时出现（完整展示、滑到最右时无投影）；排序图标三态正确。
- 交互：排序升序 → 降序 → 取消；勾选单行 / 全选 / 半选，上方出现批量操作；表头说明图标点击提示；「切换」打开弹出层表格（60% 蒙层），选择后关闭并回到触发按钮，Esc 可关闭；更多字段时横向滚动，操作列始终固定。
- 320：页面无横向滚动。

2026-10-19 个股诊断验证：tbody中的行标题th误用表头48高度与灰底，导致正文单行48而非46。已将表头样式收敛至thead th，并使tbody th与td背景/底线一致，保留scope=row语义。

2026-10-19设计方进一步确认：表头48为旧错误值，现已统一为46；schema、mapping、基座和预览说明同步修正。上文48相关记录仅为历史实测，不再作为当前规范。

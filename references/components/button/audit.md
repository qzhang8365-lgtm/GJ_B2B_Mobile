# Button Figma 审计（移动端）

来源：Figma `161:6274`（`1.Button`，页面 `Mobile_按钮Button` `11:1610`），2026-10-08 只读检查，未修改 Figma。组件集 288 个变体，正好覆盖 `4 Level × 3 Size × 3 State × 4 Icon × 2 Shape`。

## 已核对一致

- **颜色**：以 Medium / Left_Icon / regular 为基准，逐一比对 288 个变体的背景、描边、文字、透明度。除 72 个 Icon_Only 变体本来没有文字外，无差异。
- **图标颜色**：216 个含图标变体中，图标填充与文字颜色（Icon_Only 与同层级参考色）全部一致，0 处不一致。
- **图标来源**：所有图标实例的主组件均为本地 `icf_system_search`（Figma 页面“图标icon”），与图标库 `assets/icons/iconfont/icf_system_search.svg` 同名对应。
- **尺寸**：同一 Size × Icon × Shape 组合下，各 Level / State 的高度、宽度、内边距、圆角、文字字号与行高、图标尺寸一致。
- **描边**：144 个有描边的变体均为 INSIDE、1px；实现用 inset box-shadow，不占内边距。Ghost 的描边宽度为 0。
- **图标与文字间距**：内部框 gap 4，三档一致（未绑定变量，数值等于 `Interval/space-4`）。

## 待确认

| 编号 | 问题 | 当前处理 |
| --- | --- | --- |
| BTN-M-001 ✅ 已关闭（2026-10-09） | 组件集 description 写的是 Textbutton 的说明。 | 设计方确认：该描述属于文字按钮（无容器内边距、背景和描边，高度由行高决定），并要求补充点击热区；已并入 Text Button 规则（热区 ≥ 44×44）。Button 组件集应换成自己的说明，建议文字见下方“建议的 Figma 说明”。 |
| BTN-M-002 ✅ 已关闭（2026-10-09） | Small 圆角 Figma 为 6，原控件尺寸圆角规则为 4。 | 设计方确认以 Figma 为准：Small 改为 6（`--Radius-SM`），控件尺寸圆角规则同步为 Small 6 / Medium 6 / Large 8，圆角页与 h5-radius-and-containers.md、h5-control-sizing.md 已更新。 |
| BTN-M-003 ✅ 已关闭（2026-10-09 复核） | 变量绑定混用远程库。 | 复核 288 个变体：已无远程变量绑定，文字样式全部为本地 P2 / P3 / P5_CN-R。 |

| BTN-M-004 ✅ 已关闭（2026-10-09） | Tertiary 描边远程 `边框色/default`（#D7DCE3）与本地 Border/default（#EBEEF2）同名不同值。 | 设计方已在 Figma 改绑本地 `Border/secondary`（#D7DCE3），默认 / 按下 / 禁用三态相同；按下态不再换 `Border/hover`，基座已同步。Ghost 多余描边已在 Figma 删除。 |
| BTN-M-005 ✅ 已关闭（2026-10-09） | 改绑后 pill 圆角误变为与 regular 相同。 | 设计方已改回，pill 现绑定本地 `Radius/Radius-full`（999）；基座改用 `--Radius-full`，视觉与原 24 一致（按钮高度 ≤ 40，均为两端全圆）。 |

## 记录（不影响实现）

- Shape=pill 绑定 `Radius/Radius-full`（999）；早期为未绑定的 24。
- Small Icon_Only 的上下内边距为 5、左右 16，宽高固定 28，图标居中显示不受影响；基座按正方形居中实现。
- 文字样式字体记录为 PingFang SC / Microsoft YaHei；H5 按系统字体实现。
- 组件无 Prototype 交互；pressed 由代码 `:active` 承担。

## 基座渲染核对

### 2026-10-08 浏览器核对

- 方法：在预览页交互演示的 iframe 中逐个渲染 288 个组合（4 Level × 3 Size × 3 State × 4 Icon × 2 Shape），视口 375（1rem=100px）与 320（1rem=85.33px）各一轮，读取计算值与 Figma 期望值比对。
- 核对项：高度（Large 实际不低于 40px）、左右内边距、圆角（含 pill 24）、字号（Medium/Small 不低于 12px）、字重、背景、pressed 叠色、文字色、描边颜色与 1px、透明度、图标尺寸、**图标颜色 = 文字颜色**、图标与文字间距 4、纯图标正方形且图标居中、点击热区 ≥ 44×44。
- 结果：每个视口 3672 项，0 项不通过；页面无 404、无脚本错误。
- 期间修正：Tertiary 描边改为 `--ds-border-secondary`（见 BTN-M-004）；`--gj-icon` 相对路径会按样式表位置解析，预览页改为绝对地址，用法写入基座注释；手机舞台 body 默认文字改为 14/22，避免继承根字号 100px 撑高行盒。

### 2026-10-09 通栏与按钮组核对

- 新增 `.gj-m-button-block` 与 `.gj-m-button-group`（-large / -small / -equal / -vertical），依据 Figma 312:2295 实例：组合间距 8 / 12 / 4，弹窗双按钮 Large 等分间距 12，底部面板双按钮竖排 Large 间距 12。
- 视口 375 与 320 各 11 项：通栏宽度等于容器宽度、三档间距、换行后纵向间距、等分宽度相等且总宽等于容器、纵向撑满与间距、无横向溢出，0 项不通过。按钮 288 组合复核 0 项不通过。

### 2026-10-09 Figma 改绑后复核

- 重新只读提取 288 个变体：Tertiary 描边改为本地 `Border/secondary`，按下态描边与默认相同（此前为 `Border/hover`），基座已改；Ghost 描边已删除（无描边、宽 0）。尺寸、内边距、圆角与此前一致（Small 圆角 6）。
- 基座按新值复核 288 组合（375 / 320）。

### 2026-10-09 Figma 收尾复核

- 组件集说明文字已按建议更新并核对一致。

### 2026-10-15 修复时新发现

| 编号 | 问题 | 处理 |
| --- | --- | --- |
| BT-M-006 | 旧版 `1.Button`（`13:1720`，Shape=Default / round）已不在画布上，但仍有实例引用；其文字字体为 Microsoft YaHei（文件中不可用）。 | 级联选择器、选择列表弹层的按钮已换为当前 `1.Button`（161:6274）。建议设计方排查其它页面里剩余的旧实例。 |

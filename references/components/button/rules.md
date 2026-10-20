# Button 按钮（移动端）

来源：Figma `161:6274`（页面 `Mobile_按钮Button`），2026-10-08 只读提取。属性、尺寸与颜色的结构化数据见 [`schema.json`](schema.json)，Figma 属性与原型类名对应见 [`mapping.json`](mapping.json)，审计记录见 [`audit.md`](audit.md)。原型基座：`assets/styles/gj-b2b-mobile-components.css` 的 `.gj-m-button`（不代表真实前端组件库 API）。

## 层级

- **Primary**：主操作，品牌蓝填充、白字。
- **Secondary**：次操作，白底、蓝色描边与蓝字。
- **Tertiary**：弱操作，白底、中性描边（#D7DCE3，`Border/secondary`）与主文字色。
- **Ghost**：最轻操作，浅灰底（`Background/Background`）、无描边。Figma 中存在描边颜色绑定但宽度为 0，不能据此生成可见边框。

## 尺寸

| 尺寸 | 高度 | 左右内边距 | 圆角 | 文字样式 | 图标 | 纯图标宽度 |
| --- | ---: | ---: | ---: | --- | ---: | ---: |
| Large | 40（`--control-L`） | 20 | 8（`--Radius-MD`） | P2_CN-R 16/24 | 20 | 40 |
| Medium（默认） | 32（`--control-M`） | 16 | 6（`--Radius-SM`） | P3_CN-R 14/22 | 16 | 32 |
| Small | 28（`--control-S`） | 12 | 6（`--Radius-SM`） | P5_CN-R 12/18 | 12 | 28 |

- 图标与文字间距 4（三档一致）。文字字重均为 Regular。
- 圆角按[控件尺寸圆角](../../h5-radius-and-containers.md)规则取值：Small 与 Medium 为 6、Large 为 8（2026-10-09 设计方确认 Small 以 Figma 为准，BTN-M-002 已关闭）。
- Shape=pill 时为全圆角（`Radius/Radius-full`，999），其余尺寸不变。
- 高度、主操作下限与同排同档规则见 [`h5-control-sizing.md`](../../h5-control-sizing.md)；主操作按钮实际高度至少 40px。

## 状态

移动端只有 default、pressed、disabled，没有 hover。

| 层级 | pressed | disabled |
| --- | --- | --- |
| Primary | 背景换 `Button/Primary/Bg-pressed` | 背景换 `Button/Primary/Bg-disable`，文字仍为白色 |
| Secondary | 叠加 `Background/Hover`（蓝 5%） | 整体透明度 40% |
| Tertiary | 叠加 `Background/Hover_2`（黑 3%），描边不变（`Border/secondary`） | 文字换 `Text/disable`，描边不变 |
| Ghost | 叠加 `Background/Hover_2`（黑 3%） | 整体透明度 40% |

各层级的 disabled 表现不同，按上表分别实现，不统一套用透明度。

## 图标

- 图标只从图标库选取（`references/icons/index.json` → General/iconfont），用 `.gj-icon` + `--gj-icon` 引用；不得自绘、不得使用 Emoji 或库外资源。Figma 的 ButtonIcon 实例交换默认值为 `icf_system_search`。
- **图标颜色始终与按钮文字颜色一致**，包括所有层级、状态与 Icon_Only。实现上图标使用 `currentColor`，不单独设色。
- 图标位置：Left_Icon 在文字前，Right_Icon 在文字后；Icon_Only 只显示图标，按钮为正方形，必须提供 `aria-label`，图标含义不清时改用图标加文字。

## 交互与排版

- 实际点击热区至少 44×44px，通过伪元素扩展，不改变视觉尺寸。
- 按钮文字不省略、不换行；空间不足时调整按钮组（`h5-small-screen.md`）。
- 并排按钮间距：`--space-btn-gap`（8）；底部双按钮：`--space-btn-gap-footer`（12）。同一行按钮同档。
- 无背景、无描边的轻量操作（查看详情、展开等）使用 [Text Button](../text-button/rules.md)，不用 Ghost 代替。
- 固定在右下角的回到顶部 / 到达底部、新增等页面级图标操作使用 [Floating Button](../floating-button/rules.md)。

## 通栏与按钮组

来源：Figma `312:2295`（按钮使用规范）。Figma 中没有独立组件，属于 Button 的排布方式，基座提供以下类，页面不要另写宽度与间距：

| 场景 | 类名 | 说明 |
| --- | --- | --- |
| 通栏按钮 | `.gj-m-button-block` | 撑满所在容器，容器宽度由页面边距决定 |
| 按钮组合 | `.gj-m-button-group` | 横向、纵向间距 8，可换行 |
| 大按钮组合 | `+ .gj-m-button-group-large` | 间距 12 |
| 小按钮组合 | `+ .gj-m-button-group-small` | 间距 4 |
| 弹窗双按钮 | `+ -large -equal` | 一行等分，间距 12 |
| 底部面板双按钮竖排 | `+ -large -vertical` | 纵向撑满，间距 12，次操作在上、主操作在下 |

- 间距可按场景调整；调整时覆盖 `--gj-m-btn-group-gap`，取值使用间距 Token。
- 筛选行等选中态组合（多层级组合案例）同样使用按钮组，Small 按钮在该案例中间距为 8。

## 2026-10-16 设计决策：按钮组合作为多选
- 卡片 / 表单内的多选首选按钮组合：默认 Medium，按钮宽度随文字，整组左对齐、放不下换行，横纵间距 8；未选 Tertiary，选中 Secondary-pressed（`.gj-m-button-secondary.is-pressed` + `aria-pressed`）。设计师指定时可用 Large（间距 12），避免 Small。不按固定列数等宽排布，避免长文字溢出。

## 2026-10-20 统一来源：预览站页面私有写法收进基座
预览站（组件页、模式页）展示的组件只用基座 + mapping 模板，与 skill 生成同一来源；以下写法原先只写在预览页里，现已进入基座，生成页面直接使用，不在页面重复写。
- 选项按钮 `.gj-m-button-option`：标题 + 说明两行的大按钮，用于流程二选一（按钮组合使用 Figma 312:2295 示例）；高度随内容、左对齐。

## 2026-10-20 操作按钮场景选档（PR-031）

卡片内普通操作优先Medium（32）；紧凑卡片与标题/信息同行用Small（28）。Large（40）主要用于大卡片通栏重点操作、底部保存/草稿/上一步/下一步/提交和弹窗底部确认操作。普通上传、查看不因需要点击就升级Large。沿用基座44热区，尺寸不是点击热区。表单多选按钮组仍按PR-009。

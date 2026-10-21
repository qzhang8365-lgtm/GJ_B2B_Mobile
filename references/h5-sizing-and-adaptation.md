# H5 尺寸与适配基准

来源：设计方在本项目中确认的 H5 实施规则。适用于生成的 H5 页面及原型代码；Figma 设计 Token 的原始值仍保留在 `tokens/`，不要把换算后的代码值回写为 Figma 原值。

## 画板、容器与 viewport

- 设计基准为 375×812、1 倍逻辑画板。页面画板与 Figma 组件库以 375px 宽为基准；评审图可采用 2 倍绘制或输出。
- 基准首屏可视高度可按 `812 - 44（状态栏）- 34（底部安全区）` 估算，但页面不得依赖固定首屏高度布局。
- 默认运行于 App WebView；顶部状态栏和导航栏由原生提供，普通 H5 页面不重复绘制。沉浸式全屏页由原生注入 `--safe-top`。
- 页面包含：

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
```

## 单位与换算

```css
html { font-size: min(calc(100vw / 3.75), 120px); }
.page { width: 100%; }
@media (min-width: 960px) {
  .page { max-width: 960px; margin-inline: auto; }
}
```

375px 宽时 `1rem = 设计稿 100px`；屏宽达到 450px 时根字号封顶为 120px，字号、间距、圆角和组件高度不再放大，页面宽度仍可流式增长。仅 ≥960px 时内容区限制为 960px 并居中。内容区尺寸、间距、字号、圆角以及图片显示尺寸均用 `rem = 375 基准设计稿 px ÷ 100`。例如 16px → `0.16rem`，8px → `0.08rem`。设计正文通常为 14–16px；小屏实际字号下限按 [`h5-small-screen.md`](h5-small-screen.md) 分类执行，输入框须至少 16px。所有 `max()` 字号声明前先写纯 rem 降级值。

H5 中西文跟随运行设备的系统字体；字体栈不写死 PingFang SC、Arial 等具体字体名。可继承容器字体或使用 `system-ui` 通用族。Figma Text Style 的字体家族留在源数据中用于追溯，代码实现仍需保留相应字重、字号、行高与字间距。数字样式使用 GJTypeDisplay（`assets/fonts/`，`@font-face` 已在 Token CSS 中声明），加载失败回退系统字体；H5 场景授权范围待确认。

下列内容以设计稿数值直接使用 `px`，不参与缩放：

- 分割线、边框为 `1px`；确需极细线时可用 `0.5px` 或 `transform: scaleY(0.5)`。
- 系统级高度：导航栏 `44px`、底部 TabBar `49px`。
  - 自绘 H5 底部导航采用已确认的组件值：内容高 56（375 基准），按 `0.56rem` 适配，实际热区至少 44×44px；原生 TabBar 仍使用系统高度。底部设备安全区另算，不包含在内容高 56 中（2026-10-09 用户确认，详见 `components/tabbar/rules.md`）。
- 最小点击区域为 `44×44px`。
- 根字号上限 `120px`、≥960px 时内容区上限 `960px`。字号实际下限按类别见 `h5-small-screen.md`；10px 仅是辅助文字的下限。

Figma 组件库、Figma MCP、Dev Mode 标注和页面设计稿中的尺寸都先按上述规则处理；MCP 生成的代码只供结构参考。规则覆盖 CSS 文件、`<style>`、内联 style，以及 JS 设置的尺寸。JS 写样式时使用 rem 字符串，如 `el.style.height = '0.8rem'`。JS 若必须计算实际像素（如滚动距离、动画位移），从根字号换算，不能写死设计稿 px：

```js
const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
const px = (designPx / 100) * rem;
```

Canvas/SVG 绘制尺寸按同一公式换算；Canvas 位图缓冲区再乘 `devicePixelRatio` 保持清晰。位图资源导出 @2x 与 @3x，不使用 1 倍图；图标优先 SVG。资源像素尺寸不决定页面显示尺寸。

## 页面级间距阶梯

H5 页面布局以 4 为基础单位，只从下列阶梯选取页面级间距；这些是代码中使用的 rem 值，Figma 的原始 `Interval/*` 数值仍以 `tokens/dimensions.json` 为准。

```css
:root {
  --space-4: 0.04rem;
  --space-8: 0.08rem;
  --space-12: 0.12rem;
  --space-16: 0.16rem;
  --space-20: 0.20rem;
  --space-24: 0.24rem;
  --space-32: 0.32rem;
  --space-40: 0.40rem;
  --space-48: 0.48rem;
}
```

设计稿的页面级间距若不在阶梯内，按相邻值就近取整，例如 18→16、22→24；等距时依据元素关系和同层级一致性选择。关系越紧密间距越小，同一页面同一层级保持一致。常见参考：4–8 用于图标与文字、标题与副标题；12–16 用于列表项和卡片内部信息分组；20–32 用于卡片或模块之间；40 用于需要明显分隔的大区块，如结果页主体与详情、表单与提交按钮、正文与风险提示区；48 用于页面首尾留白、空状态。可按内容密度选择，不将例子视为强制映射。

### 语义间距

设计方 2026-10-08 确认以下语义间距，源数据为 [`tokens/spacing-semantic.json`](tokens/spacing-semantic.json)，编译为 `--space-<token>`，值以 `var()` 引用上面的九档阶梯。页面与卡片布局优先使用语义变量，不直接写阶梯值。

| 层级 | Token | 值 (px) | 用途 |
| --- | --- | --- | --- |
| 页面 | `page-margin-x` | 16 | 页面左右边距 |
| 页面 | `module-gap` | 24 | 不同模块之间 |
| 页面 | `module-title-gap` | 12 | 模块标题 → 下方卡片 |
| 0级卡片 | `card-l0-margin-x` | 0 | 左右外边距为 0，宽度撑满页面（`--space-card-l0-margin-x: 0`） |
| 0级卡片 | `card-l0-padding` | 16 | 0级卡片内边距，与一级卡片相同 |
| 一级卡片 | `card-l1-padding` | 16 | 一级卡片内边距 |
| 一级卡片 | `card-l1-gap` | 12 | 同类一级卡片之间 |
| 一级卡片 | `card-l1-title-gap` | 12 | 卡片标题 → 内容 |
| 一级卡片 | `card-l1-section-gap` | 16 | 卡片内分区之间 |
| 二级卡片 | `card-l2-padding` | 12 | 二级卡片内边距 |
| 二级卡片 | `card-l2-gap` | 8 | 二级卡片之间 |
| 二级卡片 | `card-l2-title-gap` | 8 | 标题 → 内容 |
| 二级卡片 | `card-l2-section-gap` | 12 | 分区之间 |
| 三级块 | `block-l3-padding` | 8 | 格子、标签块内边距 |
| 三级块 | `block-l3-gap` | 8 | 三级块之间 |
| 元素 · 垂直 | `stack-tight` | 4 | 强绑定：标题+副标题、数字+说明 |
| 元素 · 垂直 | `stack-default` | 8 | 同组元素：label-value 行、列表行（二级卡片内可用 4） |
| 元素 · 水平 | `inline-icon-gap` | 4 | 图标与文字 |
| 元素 · 水平 | `inline-tag-gap` | 4–8 | 标签与标签（`--space-inline-tag-gap-min` / `-max`） |
| 元素 · 水平 | `btn-gap` | 8 | 并排按钮 |
| 元素 · 水平 | `btn-gap-footer` | 12 | 底部双按钮 |

0级卡片用于页面内容信息过于密集、需要承载更多内容的场景：卡片宽度撑满页面（不使用 `page-margin-x`），内边距 16，圆角 `Radius/Radius-XL`（16px，见 [`h5-radius-and-containers.md`](h5-radius-and-containers.md)）。

校验规则：

- 同组间距 < 组间距 ≤ 容器内边距。
- 每嵌套一层降一档（16 → 12 → 8）。
- 有背景或描边的卡片，外间距可以小于内边距；无边界的平铺列表，组间距必须明显大于组内间距。

页面左右边距固定使用 `--space-page-margin-x`（16px，即 `--space-16`），不随页面设计调整；在 320–359 小屏下按 `h5-small-screen.md` 的实际最小边距规则兜底。组件内部尺寸依 Figma 组件库如实还原，不受页面级阶梯约束；控件高度按 [`h5-control-sizing.md`](h5-control-sizing.md) 的变量与组合规则处理。Figma `Interval` 的 40px 已纳入上述页面级阶梯，按大区块分隔语义选用。

## 栅格

Figma 本地 Grid Styles（2026-10-08 只读提取，源数据见 `tokens/styles.json` 的 `gridStyles`），均为 375 基准的列栅格，Stretch 对齐，左右边距 16（与 `page-margin-x` 一致）。编译为 `--ds-grid-<n>-count / -gutter / -offset`。

| Figma 名称 | 列数 | 槽宽 | 边距 | 375 下单列宽 |
| --- | ---: | ---: | ---: | ---: |
| Grid 2 | 2 | 16 | 16 | 163.5 |
| Grid 3 | 3 | 12 | 16 | 106.33 |
| Grid 4 | 4 | 12 | 16 | 76.75 |
| Grid 5 | 5 | 12 | 16 | 59 |
| Grid 6 | 6 | 8 | 16 | 50.5 |

槽宽均取自间距阶梯。样式 description 为空，宽屏下的列数变化未在栅格样式中定义，沿用上文宽度分档规则。

## 安全区与布局

```css
:root {
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}
```

- 仅自绘导航或沉浸式全屏页在顶部使用 `padding-top: var(--safe-top)`；普通 WebView 页面由原生承担顶部区域。部分 Android WebView 的 `env()` 可能为 0，由原生注入 `--safe-top` 覆盖。
- 底部固定按钮栏或 TabBar 使用 `padding-bottom: calc(<按 rem 换算的原值> + var(--safe-bottom))`；滚动内容末尾至少预留 `padding-bottom: var(--safe-bottom)`。
- 软键盘弹起时检查输入框与提交操作仍可见可达；输入框字号必须使用 `font-size: max(0.16rem, 16px)`（前置 `font-size: 0.16rem` 降级），不能把小屏下的 `0.16rem` 误认为实际 16px。
- 横向使用 flex/grid 自适应，不写死页面总宽度；不用固定 `height` 撑满屏幕，需要时用 `min-height: 100vh` 或 `100dvh`。

## 宽度分档与元素行为

| 档位 | 逻辑宽度 | 布局策略 |
| --- | --- | --- |
| 小屏 | 320–359px | 等比缩小并执行 [`h5-small-screen.md`](h5-small-screen.md) 的结构兜底。 |
| 标准 | 360–449px | 纯等比缩放，按 375 基准设计还原。 |
| 大屏 | 450–599px | 尺寸封顶，宽度流式撑满。 |
| 宽屏 | 600–959px | 尺寸封顶，宽度流式并按下文改为多列。 |
| 超宽 | ≥960px | 内容区最大 960px，居中；卡片列表改为三列。 |

≥450px 时，页面背景、标题栏、搜索栏、Tab 栏、列表、卡片容器及底部固定栏背景随页面根容器撑满。固定按钮栏和 TabBar 宽度也跟随根容器；≥960px 时同样最大 960px 并居中。下列内容在流式容器内限制自身宽度：

| 元素 | 最大宽度 | 排布 |
| --- | --- | --- |
| 通栏主按钮 | `3.43rem` | 底栏背景撑满，按钮居中。 |
| 表单区域（输入框、选择器） | `4.5rem` | 表单整体居中或左对齐，依页面结构确定。 |
| 正文段落（协议、说明、资讯） | `6rem` | 保持可读行宽。 |
| Dialog | `3.2rem` | 始终居中。 |
| Toast | `3rem` | 始终居中。 |

Banner 和图片用 `aspect-ratio` 保持比例，并设最大高度；Banner 建议不超过 `2rem`，不得拉伸变形或无限增高。Tab 数量 ≤5 时均分；宽屏下若单项宽度超过 `1.2rem`，改为左对齐且每项固定宽度。

≥600px 时，宫格入口每行最多 5 列（按 2026-10-09 更新的 gridnav/rules.md），图标尺寸不变；卡片列表改为两列，≥960px 时改为三列。行情、持仓、流水等普通列表保持单列，行宽撑满并用 flex 分配信息列。Bottom Sheet 改为居中弹窗，最大宽度 `4.5rem`。列表加详情等左右分栏本期不做，宽屏仍维持单列。

折叠屏展开或折叠后，布局必须由 CSS 随宽度响应；不得仅在页面加载时读取一次宽度决定布局。图表、Canvas、吸顶位置等 JS 尺寸计算须监听 `resize` 并重算。切换时保留当前滚动位置和页面状态，不重新加载。

小屏结构调整统一放在 `@media (max-width: 359px)`，并在 320×568 下完成自检；详见 [`h5-small-screen.md`](h5-small-screen.md)。

## 代码检查与评审预览

生成后检查 CSS、内联 style 和 JS 中所有 `px` 字面量，按**用途**核验，而非只看数字。可保留的固定业务值：边框/极细线 `0.5/1px`，系统高度与热区 `44/49px`，根字号上限 `120px`；小屏 `max()` 下限仅限已确认的 `4/10/12/16/20/28px`，Dialog 左右最小边距为 `24px`，主操作按钮实际高度下限为 `40px`。`320/359/360/450/600/960px` 只用于响应式宽度条件；`960px` 另可作为超宽容器最大宽度。其他设计尺寸改为 rem 或从根字号计算。`0px` 只作为 `env()` 安全区回退值。该审计只针对业务页面；独立评审外壳采用固定预览画框。

需要评审预览时，额外生成 `preview.html`，页面本身仍按 375 逻辑宽度开发，预览外壳可用 375×812 画框和 2 倍 `zoom`：

```html
<div style="width:375px; height:812px; zoom:2; margin:0 auto; overflow:hidden;">
  <iframe src="page.html" style="width:375px; height:812px; border:0;"></iframe>
</div>
```

截图使用 viewport 375×812、`deviceScaleFactor: 2`，输出 750px 宽图。预览放大不得反向改变业务页面的尺寸值。

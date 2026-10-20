# H5 小屏兜底（320–359 逻辑宽度）

来源：设计方确认的小屏实施规则。尺寸先由 rem 等比缩小；结构调整统一放入 `@media (max-width: 359px)`。优先级为信息完整、可点击、视觉还原。允许换行、堆叠与组件内部横向滚动；不得重叠、挤压变形或使页面整体横向溢出。

## 字号与数字

每个 `max()` 声明前先写同属性的纯 rem 值作为降级：

```css
.helper { font-size: 0.10rem; font-size: max(0.10rem, 10px); }
.body { font-size: 0.14rem; font-size: max(0.14rem, 12px); }
.input { font-size: 0.16rem; font-size: max(0.16rem, 12px); } /* M 为 0.14rem */
.large-number { font-size: 0.24rem; font-size: max(0.24rem, 20px); }
```

辅助文字（设计 10–11px）至少 10px；正文（设计 12–14px）至少 12px；输入文字按设计字号（L 16、M 14），与正文同样至少 12px；iOS 聚焦放大按页面类型处理：小程序原生页面不受影响；H5 / web-view 页面在 viewport 加 `maximum-scale=1`（2026-10-19 设计方确认，取代原 16px 兜底）。其他文字直接使用 rem。大号金融数字（设计 ≥24px）至少 20px，布局预留“亿”级长度。

金额、价格、涨跌幅、代码等金融数值使用 `font-variant-numeric: tabular-nums`，并核对实际字体中的数字是否等宽；不得以省略号截断，也不得在数值中间折行。溢出时按顺序：

1. 由统一数据格式化函数处理：≥1 万显示“万”，≥1 亿显示“亿”，保留 2 位小数；不在 CSS 中伪造缩写。
2. 数值容器 `flex: 1; min-width: 0`，标签侧 `flex-shrink: 0`。
3. 仍放不下则整段数值移到标签下方；数字本身 `white-space: nowrap`。

## 文本、横向行与间距

| 元素 | 小屏处理 |
| --- | --- |
| 列表或卡片标题 | 单行省略：`overflow: hidden; text-overflow: ellipsis; white-space: nowrap`。 |
| 描述、摘要 | 最多 2 行：`display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden`。 |
| 按钮文字 | 不省略、不换行；空间不足时调整按钮组。 |
| Tag | 不省略；容器 `flex-wrap: wrap`，最多显示 2 行，超出隐藏。 |
| 股票/基金名称 | 名称可单行省略，代码须完整显示。 |

所有省略号元素的父级 flex 子项设置 `min-width: 0`。左右键值行使用标签 `flex-shrink: 0; max-width: 40%`，值侧 `flex: 1; min-width: 0; text-align: right`。多列数据行先标记列优先级；小屏把最低优先级列移到名称下方作为第二行，不删除。列宽可按 `flex: 2 / 1.5 / 1.5` 分配，不得用固定 rem 列宽相加超过 `3.43rem`。

行内间距下限 `max(0.08rem, 4px)`；页面左右边距下限 `max(0.16rem, 12px)`。两者也须在 `max()` 前声明纯 rem 降级值。

## 按钮、宫格、Tab 与筛选

- 两个并排按钮的文字总长超过 8 个汉字时改为上下堆叠，主按钮在上。三个及以上并排按钮统一改为上下堆叠，或改为“主按钮 + 更多”。
- 底部固定栏左侧信息与右侧按钮并存时，按钮 `flex-shrink: 0`，信息区 `flex: 1; min-width: 0` 且允许换行。所有可点击元素实际热区至少 44×44px，可通过 padding 或伪元素扩大。
- 宫格标签不超过 4 个汉字；原 5 列宫格在小屏改为 4 列：`grid-template-columns: repeat(4, 1fr)`。图标下限 `max(0.32rem, 28px)`，前面保留纯 rem 降级值。
- Tab ≤4 个时均分；≥5 个或任一文字超过 4 个汉字时横向滚动，`overflow-x: auto`、隐藏滚动条、单项不压缩，并将当前项自动滚动到可视区。
- 下拉筛选条件超过 3 个时改为“筛选”按钮与弹出面板。

## 表单、图像与浮层

- 左右排列的表单标签宽 `0.9rem`；标签超过 5 个汉字时改为上下排列。输入框右侧单位或验证码按钮 `flex-shrink: 0`，输入框 `flex: 1; min-width: 0`。
- 验证码倒计时按钮为最长文案（如“重新获取(60s)”）预留宽度，避免倒计时中布局跳动。
- 功能图标下限 `max(0.20rem, 16px)`，前面保留纯 rem 降级值；图片按比例缩放。装饰性插图可缩小 20% 或隐藏，优先保留核心内容。
- Dialog 最大宽 `3.2rem`，同时由外层保留左右各至少 24px 边距，必要时缩小弹窗实际宽度；按钮文字总长超过 8 个汉字时上下排列。若视口同时属于矮屏，还需执行对应高度分档规则；该规则尚未提供，不能自行补造。

## 320×568 自检

- 页面整体无横向滚动：`document.documentElement.scrollWidth <= document.documentElement.clientWidth`。
- 无文字重叠或元素溢出容器；金融数值无省略号、无中间折行；按钮文字完整显示。
- 输入框计算后字号至少 12px，H5 页面 viewport 含 `maximum-scale=1`；所有可点击元素实际热区至少 44×44px。

# 移动端 Token 编译契约

参考 PC 端的“来源文件 → 统一机器包 → CSS 产物”组织方式。本包由移动端现有提取数据与设计方确认的 H5 规则独立编译，不读取 PC 数据。

## 产物与重建

- [gj-b2b-mobile.tokens.json](gj-b2b-mobile.tokens.json)：统一机器包。按 `color.primitive`、`color.semantic`、`dimension`、`typography.styles`、`effect`、`gradient` 查询；保留 Figma 原名、原值、ID、来源、发布状态，补充 CSS 名称和实现值。`$schema` 是本项目格式标识，不是远程 JSON Schema 地址。
- [gj-b2b-mobile-tokens.css](../../assets/styles/gj-b2b-mobile-tokens.css)：颜色、尺寸、完整文字样式及效果类。独立加载，无组件 CSS 依赖。
- `colors.json`、`dimensions.json`、`controls.json`、`typography.json`、`styles.json`：权威源数据。编译不会修改这些文件。
- `scripts/build-tokens.py`：仅使用 Python 标准库；更新源文件后重建。派生产物不手改。

在 skill 根目录执行：

```sh
python3 scripts/build-tokens.py
python3 scripts/validate-tokens.py
```

校验涵盖别名缺失与循环、名称碰撞、源值保留、rem 换算、颜色别名解析、字体指标、效果层、渐变矩阵和产物是否过期。来源 SHA-256 写入统一包；编译不重新抓取 Figma。

## 命名与调用

| 类别 | 编译规则 |
| --- | --- |
| 颜色 | `--ds-` 加 Figma 路径的小写短横线形式；语义别名输出 `var()`，同时记录解析值。优先使用语义色。 |
| 间距 | `--space-4` 至 `--space-48` 的已确认九档；`Interval/space12` 显式映射 `--space-12`，源名保留。语义间距来自 `spacing-semantic.json`，编译为 `--space-<token>`（如 `--space-card-l1-padding`），值为 `var(--space-N)`；区间值输出 `-min` / `-max` 两个变量。 |
| 圆角 | 保留叶名称大小写，如 `--Radius-XL`。 |
| 控件高度 | 完全保留源数据的 `cssVariable`，如 `--control-XL`；用于 `min-height`。 |
| 文字 | `--ds-type-*` 指标与 `.gj-mobile-type-*` 完整样式类。 |
| 栅格 | `--ds-grid-<n>-count`（整数）、`-gutter`、`-offset`（rem）；名称取 Figma 样式名的小写短横线形式，如 `Grid 2` → `--ds-grid-2-*`。 |
| 效果 | `--ds-effect-*` 及 `.gj-mobile-effect-*`；复合效果用对应类整体应用。 |
| 渐变 | `--ds-gradient-` 加 style key 前 12 位，避免中文音译和名称修正造成碰撞；用原始名称查 JSON 获得确切变量名。 |

调用方读取 `cssVariable`、`cssVariables` 或 `cssClass`，不要再次推算名称。当前只有变量集合的 Mobile 模式，无暗色覆盖。Effect Styles 的模式为 null。

## H5 接入

加载 CSS 后按[尺寸与适配规则](../h5-sizing-and-adaptation.md)设置页面根字号：

```css
html { font-size: min(calc(100vw / 3.75), 120px); }
body { font-family: var(--ds-font-family-ui); }
button, input, select, textarea { font-family: inherit; }
```

产物只提供 Token 与 opt-in 样式类。页面根容器、固定栏、安全区和响应式结构按该规则接入。所有设计长度已按 px ÷ 100 转为 rem；`bottom border` 的 -1px 偏移按分割线例外保留。原始 JSON 中仍记录设计 px。Radius-full 的 999 原值编译为 9.99rem。

- 中西文使用 `system-ui, sans-serif`。数字字体资源未确认，`--ds-font-family-numeric` 暂引用系统字体；以后有经确认的字体资源再覆盖，不生成虚构字体 URL 或 `@font-face`。
- 文字样式的字重、行高、字间距整体保留。Semibold → 600、Medium → 500、Regular → 400、Bold → 700 是 CSS 字重映射。百分比字间距转 em。
- 辅助文字应用 10px 实际下限；小屏正文与大号数字按已确认规则应用 12/20px 下限，均先提供纯 rem 声明。源字号和行高仍保留，系统字体放大与长内容需页面核验。
- 输入文字加 `.gj-mobile-input-text`，实际字号至少 16px；该类只提供输入字体要求，完整控件样式由页面决定。
- 数字样式类包含 `tabular-nums`；使用其他文字样式展示行情、金额时可加 `.gj-mobile-tabular-nums`。
- `paragraphSpacing` 输出独立变量，在多段落容器中用于段间距，不能把段落间距自动加到每个文字节点外边距。

## 效果与渐变边界

`glass` 同时输出 `box-shadow` 与 `backdrop-filter`（含 WebKit 前缀）。Figma 的 showShadowBehindNode 保留为来源属性；CSS box-shadow 的遮挡效果还需结合节点背景核验。效果不自动绑定卡片层级。

线性渐变使用 SVG data URI，通过 Figma gradientTransform 的逆矩阵保留归一化坐标、色标和透明度，避免把非轴向渐变简化为近似角度。调用方式为 `background-image: var(对应变量)`，需要时设置 `background-size: 100% 100%` 和 `background-repeat: no-repeat`。部署 CSP 须允许该图片资源形式；若不允许，应将同一 SVG 输出为独立资源再接入。

## 当前完成范围与未验证项

已编译 112 个原始色、123 个语义/品牌色、25 个尺寸（含控件）、30 个文字样式、6 个效果、9 个渐变。已通过源码与派生产物一致性检查及 320/375/450/600/960 宽度的换算检查。

已完成桌面 Chrome 五档视口的字体、颜色、渐变与玻璃模糊核验，见 [浏览器验证报告](browser-validation/REPORT.md)。Safari、移动端 WebView、系统字体放大和真机验证仍未完成；团队库发布状态、数字字体资源等仍见 [pending-confirmation.md](pending-confirmation.md)。本包不含组件 API、状态契约或页面布局实现。

# H5 控件尺寸与组合

来源：设计方确认的控件尺寸规则；8 个 `Components/control-*` 变量已在[结构化源数据](tokens/controls.json)中按当前 Figma 本地变量 ID、名称和值记录。本文件规定 H5 的选档和实现方式，不是前端组件库 API。

## 优先级与基本约束

- 已有 Figma 组件优先按组件库实例还原。需要调整尺寸或组件库尚未覆盖时，从 `control-*` 阶梯选取；控件高度不使用阶梯外的数值。
- Figma 节点绑定了 `Components/control-*` 变量时，代码必须使用**同名且大小写一致**的 CSS 变量，如 `min-height: var(--control-M)`；不得改写成 `0.32rem`。`--control-XL` 与 `--control-xl` 是不同名称。
- 控件高度使用 `min-height`，不写固定 `height`，以容纳系统字体放大。同一页面同一类控件高度保持一致。
- 可点击控件即使视觉高度低于 44px，实际热区也至少 44×44px；通过 padding 或伪元素扩展，且不改变 Figma 视觉高度。

```css
:root {
  --control-XXS: 0.20rem;
  --control-XS: 0.24rem;
  --control-S: 0.28rem;
  --control-M: 0.32rem;
  --control-ML: 0.36rem;
  --control-L: 0.40rem;
  --control-XL: 0.44rem;
  --control-XXL: 0.48rem;
}
```

| 档位 | 375 基准值 | 用途参考 |
| --- | ---: | --- |
| `control-XXS` | 20px | 展示标签 S、角标。 |
| `control-XS` | 24px | 展示标签 M、文字按钮。 |
| `control-S` | 28px | 基础按钮 S、列表或卡片内紧凑操作与输入。 |
| `control-M` | 32px | 基础按钮 M、卡片内操作、页面搜索框及筛选。 |
| `control-ML` | 36px | 不与其他控件组合的独立控件，如分段控制器。 |
| `control-L` | 40px | 基础按钮 L、页面主操作和表单输入。 |
| `control-XL` | 44px | 登录、开户、确认交易等关键主操作及配套输入。 |
| `control-XXL` | 48px | 营销或活动主 CTA、底部固定栏强调按钮。 |

用途是参考，可按场景选择；名称和值不得自行改动。控件圆角随尺寸取值：Small 6、Medium 6、Large 8（XL/XXL 同 L），见 [`h5-radius-and-containers.md`](h5-radius-and-containers.md) 的“控件尺寸圆角”。

## 按钮、输入与标签

- 按钮默认选用 Figma 基础按钮 S/M/L。需要 XL/XXL 时沿用基础按钮 L 的视觉样式，仅扩展高度；内边距与字号按 Figma 中 L/M 的比例关系同步调整，未核实具体比例前不猜数值。同页只保留一个主操作高度，不混用 L/XL/XXL 三种主按钮高度。
- 主操作按钮实际高度至少 40px，例如 L 档使用 `min-height: max(var(--control-L), 40px)`；若使用其他档位，替换为其确切变量名。宽屏 ≥450px 时通栏主按钮最大宽 `3.43rem` 且居中，底栏背景撑满。
- 关键表单输入框或选择器参考 `control-L/XL`，与该页主按钮同档；页面搜索框和筛选区输入参考 `control-M`；列表或卡片内紧凑输入参考 `control-S`。输入文字按所选尺寸的设计字号（L 16、M 14），不再强制 16px；iOS 聚焦放大按页面类型处理：小程序原生页面不受影响；H5 / web-view 页面在 viewport 加 `maximum-scale=1`（2026-10-19 设计方确认，取代原 16px 兜底）。
- 展示型标签只用 S=`control-XXS`（20px）或 M=`control-XS`（24px），不生成更高的展示型标签；同一行并列标签同档。可点击筛选标签 Chip 按按钮处理，默认 `control-M`，实际点击热区至少 44×44px。

## 组合

同一行并排的输入框与按钮、按钮与按钮、下拉与输入框使用同一档位。输入框内部的后缀按钮、搜索或清除图标属于内部布局，不受同排同档限制。小屏组合放不下时，输入框 `flex: 1; min-width: 0`，按钮 `flex-shrink: 0`，不改变控件高度；必要的结构堆叠按 [`h5-small-screen.md`](h5-small-screen.md) 执行。

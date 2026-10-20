# Effect Styles 使用说明

2026-09-30 从移动端 Figma 只读获取。完整原始参数见 [styles.json](styles.json) 的 `effectStyles`；定点引用证据见 [effects-audit.json](effects-audit.json)。6 个命名本地样式属于 A 类，发布状态未验证。2026-10-08 Figma 中 glass 背景模糊由 4 改为 40，已重新核对并编译，其余样式未变。以下数值为 375 基准设计 px，颜色透明度为便于阅读的约数；精确浮点值以 JSON 为准。

| Figma 原名 | 效果 | 偏移 x / y | 模糊半径 | 颜色 / 透明度 |
| --- | --- | --- | --- | --- |
| Shadow_center | 外阴影 | 0 / 0 | 15 | 黑 / 10% |
| Shadow_down | 外阴影 | 0 / 8 | 20 | RGB 约 123,135,159 / 10% |
| glass | 背景模糊 + 内阴影 | 内阴影 0.2 / 0.1 | 背景 40；内阴影 1 | 内阴影白 / 60% |
| bottom border | 内阴影 | 0 / -1 | 0 | #EEEEEE / 100% |
| shadow_small | 外阴影 | 0 / 0 | 8 | 黑 / 10% |
| Innershadow_small | 内阴影 | 0 / 0 | 2 | 黑 / 5% |

所有阴影 spread 为 0，blendMode 为 NORMAL；各效果均 visible。保留原始名称、大小写、效果顺序和 `showShadowBehindNode` 等参数；`glass` 必须作为两层效果整体读取，背景模糊不能替换为内容模糊。

## 选用与换算

- 以目标组件或设计稿的实际 style ID 选用，不能仅凭名称把某一阴影定为所有卡片的默认效果。六个样式 description 均为空，尚无统一的场景分配说明。
- Effect Styles 本身没有 `Mobile` 或暗色模式，当前效果也没有绑定变量。JSON 的 `mode`、`theme` 为 null；不要从文件所属移动端或变量集合模式推导样式的主题覆盖。
- H5 长度按[尺寸规则](../h5-sizing-and-adaptation.md)转换：设计 px ÷ 100 为 rem，RGBA 与透明度保持原值。换算后的 rem 只用于代码，不回写为 Figma 原值。分割线用途按已确认的 1px 不缩放规则处理；`bottom border` 是内阴影样式，不能据此创建全局边框宽度 Token。
- 代码调用：单层效果用 `box-shadow: var(--ds-effect-*)` 或对应 `.gj-mobile-effect-*` 类；`glass` 用 `.gj-mobile-effect-glass` 整体应用 box-shadow 与 backdrop-filter（类中已含 `-webkit-` 前缀），不要只取其中一层。
- `glass` 样式只定义效果，不包含面板填充。背景模糊只对半透明表面背后的内容生效，填充色与透明度按设计稿节点取值；背后为纯色时模糊不可见，不能据此判断样式失效。
- 未绑定样式的局部效果属于 B 类，仅在对应节点使用；不因数值接近就替换为上述样式，不新增全局效果档位。

## 核对范围

本次检查卡片页 `58:791`、弹窗页 `58:5100` 和业务组件页 `192:8826`。前两页未检出带效果的节点；业务组件页有 7 处命名样式引用（Shadow_center 5 处、Shadow_down 2 处），style ID 均有效且效果参数完全对应。另有 7 处未绑定效果样式的节点，仅存为局部来源证据，遵循未绑定业务画板不参与基础 Token 审计的范围约定。

6 个样式的名称、ID 无重复，与此前本地参数无变化。其余四种样式的实例应用、其他页面、团队库发布与 H5 实际渲染尚未验证。

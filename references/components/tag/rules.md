# Tag 标签（移动端）

来源：Figma `948:6243`（Tags），2026-10-09 只读提取。结构化数据见 [`schema.json`](schema.json)，类名对应见 [`mapping.json`](mapping.json)，审计见 [`audit.md`](audit.md)。原型基座：`.gj-m-tag`、`.gj-m-corner-tag`、`.gj-m-circle-tag`（不代表真实前端组件库 API）。

## 用途

展示内容本身的属性、状态、类别或营销信息；也可在大量内容需要按类型筛选时作为类别标识。标签只做展示，不承载操作，可点击的筛选项使用按钮（见按钮“多层级组合”）。

## 常规标签

| 尺寸 | 高度 | 左右内边距 | 文字 | 图标 |
| --- | ---: | ---: | --- | ---: |
| Medium（默认） | 24 | 8（带图标 6） | H7_CN-S 12/18 | 12，仅 filled |
| Small | 20 | 4 | H8_CN-S 10/14 | — |

- 风格：Default 浅底深字（最常用）、filled 实底白字（强调）、line 白底细描边（弱化或与浅底区分）。
- 形状：rectangle 圆角 4；round 全圆角。同一区域保持同一形状。
- 颜色 11 种：blue、orange、red、grey、yellow、cyan、sky、deepblue、purple、pink、green。按语义选用（如红色风险或上涨、绿色完成或下跌、橙色警示、灰色中性），同一列表内同一含义保持同色。
- 颜色按色名绑定对应色系，不绑定图表色：blue→Text/blue，red→Feedback/error&rise，green→Feedback/success&decline，orange→Feedback/warning，grey→Text/Secondary，其余取同名色系基础色。
- 文字建议不超过 6 个汉字，不换行、不省略。字号不低于 10px。
- 图标只从图标库取用，只配合 filled 使用，颜色跟随文字。

## 边角标签

- 贴在卡片或图片左上角，左上、右下圆角与容器圆角一致（默认 8），右上、左下为直角。
- 容器圆角大于等于 12 时不建议使用边角标签。
- 不得遮挡任何可见信息。
- 尺寸 Regular 24 / Small 20；颜色为极客蓝、国金红、国金紫、高端金渐变与黑色 60%；可带 12 的图标。

## 圆形标签

- 20×20 圆形单字，用于展示客户在各证券市场的开户情况：港（港股通）、北（北交所）、三（新三板）、创（创业板）、科（科创板）、期（期货）、融（融资融券）。
- 灰色（Default）表示未开通该市场账户，蓝色（active）表示已开通（“点亮”）。
- 成组展示，7 个市场按固定顺序排列、间距 4，未开通的也保留显示，不只列出已开通的。

## 2026-10-16 设计决策：尺寸选用
- 空间足够时默认用 **Medium**（24）。
- **Small**（20）用于：与任何文字同行（标题行、正文行、列表行右侧状态、时间轴标题内的类型），或标签较多、可能超过两行时。单独成行或作为字段值独占位置时用 Medium。
- 一级卡片标题右侧的状态标签仍按卡片规则用 Medium，二级标题用 Small。

## 2026-10-16 设计决策：按层级数选风格（default 优先）
- 只有一级标签用 default；两级时第一级 filled、第二级 default；三级时依次 filled、default、line。同一列表内同一角色的标签风格一致。详见 `references/page-rules.md` PR-012。

## 2026-10-20 背景优先规则（PR-030）

非白色承载背景（含浅灰二级卡片）上的标签统一使用filled实底风格，mapping传filled=true，语义色和Small/Medium选档不变。本条优先于“一级标签default”的规则；白底仍按层级选择default/filled/line。

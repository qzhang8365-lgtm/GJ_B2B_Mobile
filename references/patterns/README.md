# 页面模式 Page Patterns（移动端）

页面模式描述「一类页面由哪些已登记组件、按什么顺序与间距组合、各状态如何呈现」。它不是新组件：模式里出现的每个元素都必须是 `references/components/` 已提取的组件或 `references/h5-*.md` 的页面级规则。

## 来源等级

- 2026-10-16 起建立。Figma 尚无完整业务页面画板可作依据（「【业务组件】220 移动端」页为业务组件，按用户决定暂不纳入基础组件）。
- 因此每个模式都由**已确认的组件规则 + 页面级间距 / 安全区规则组合推导**，状态为 `derived`（原型推导，待设计确认）。
- 2026-10-16 起，页面结构另参考同事基于旧版组件库搭建的业务项目「零售银行渠道经营工作台」（整体风格与页面结构认可，组件已过时）：只借鉴页面区域顺序与卡片信息结构，组件一律换为当前 `gj-m-*`。各模式文件写明参考的画板编号。
- 模式文件里逐条标注依据（组件规则文件或 h5 文档）；没有依据的取值单列在「待确认」，不写成规范。设计方确认后状态改为 `confirmed`。

## 使用方式

1. 先按任务判断页面类型，读 `index.json` 选模式，再读对应 `.md`。
2. 按模式的「页面骨架」排列区域，组件内部规格以各组件 `rules.md` 为准，模式不重复定义。
3. 按模式的「状态」逐一实现首次加载、空、异常等状态；「待确认」项在产出中标注。
4. 业务稿与模式冲突时以已批准的业务稿为准，并记录差异。

## 通用约定（所有模式）

| 项 | 规则 | 依据 |
| --- | --- | --- |
| 页面底色 | Background/Background；内容块（列表、卡片、表单组）为 Background/Container | 各组件 `rules.md`（列表、卡片为 Container 底） |
| 左右边距 | `--space-page-margin-x`（16），小屏按 `h5-small-screen.md` 兜底 | `h5-sizing-and-adaptation.md` 语义间距 |
| 模块间距 | `--space-module-gap`（24）；模块标题 → 内容 `--space-module-title-gap`（12） | 同上 |
| 顶部导航 | App WebView 默认由原生提供；仅容器不提供时用 Navbar（44，不缩放） | `components/navbar/rules.md` |
| 底部 | 一级页面可有 TabBar（App 已有原生 TabBar 时不绘制），不与底部主操作重叠；固定底栏时正文预留栏高与安全区 | `components/tabbar/rules.md`、`h5-sizing-and-adaptation.md` |
| 首屏 | 不依赖固定首屏高度；内容末尾预留 `var(--safe-bottom)` | `h5-sizing-and-adaptation.md` |
| 加载 | 结构明确的首次加载用骨架屏；已有内容的刷新用 Loading，保留原内容 | `components/skeleton`、`components/loading` |
| 空与异常 | 按原因选 Empty 类型（搜索无结果 / 网络异常 / 加载错误 / 无权限 / 暂无内容），最多一个主操作 | `components/empty/rules.md` |
| 轻提示 | 操作结果、刷新失败用 Toast，3 秒消失 | `components/notice` / `components/loading/rules.md` |
| 吸顶区 | 导航 + 页签 / 搜索 / 筛选作为一个整体吸顶（白底）；正文在其下滚动 | 推导，见各模式待确认 |
| 固定底栏 | 白底，上下 12、左右 16 + 底部安全区，顶部 1px Border/default；内放表单操作区（L 按钮等分，间距 12）或批量操作；正文底部预留栏高 | `components/form/rules.md`（操作区固定在底部），容器样式见 detail.md DT-3 |
| 对象摘要条目 | 卡片内的业务对象列表：小号标签 + 标题 H4 16/24 单行省略 → 描述 P3 14/22 最多两行 → 元信息 P5 12/18 三级文字；超时等风险用红字 | 推导，见 workbench.md WB-2 |

预览实现的公共拼装函数在 `preview/patterns/kit.js`（只拼装已登记组件，不是组件 API）。

## 确认状态

- 2026-10-16：6 个模式（workbench、list-filter、detail、form、records、batch）经设计方逐页审查并修正后全部确认为 `confirmed`；原待确认项按当前做法执行。审查中沉淀的通用规则见 `references/page-rules.md`。
- 2026-10-19：新增「登录」模式（login），来自端到端验证「国金智慧签」登录页，设计方确认为 `confirmed`。

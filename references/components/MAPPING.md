# 组件映射 mapping.json 结构（移动端 v2）

每个组件目录下的 `mapping.json` 回答一个问题：**这个 Figma 组件在原型里怎么写**。结构对齐 PC 端 `gj-design-skill/component-mapping/v1`，并为移动端增加 `markup`（可直接复制的写法）与 `pageRules`（相关页面生成规则）。

生成页面时的读取顺序：`inventory.json` 定位组件 → **`mapping.json` 的 `markup` 取写法、`composition` / `pageRules` 定用法** → 有疑问时再读 `rules.md`（为什么这样用）与 `schema.json`（完整尺寸与状态矩阵）。

原型基座类名（`gj-m-*`）只用于原型，不代表真实前端组件库 API。

## 字段

| 字段 | 必填 | 内容 |
| --- | --- | --- |
| `$schema` | 是 | 固定 `gj-design-skill/mobile-component-mapping/v2` |
| `component` | 是 | 组件 id，与 `inventory.json` 一致 |
| `figmaComponent` | 是 | Figma 组件名与节点 |
| `prototypeClass` | 是 | 根类名 |
| `propertyMap` | 是 | Figma 属性 → 原型写法（类名、属性或结构） |
| `valueMap` | 有枚举时 | Figma 取值 → 具体类名 / 属性值，含尺寸数值 |
| `tokenMap` | 是 | 部件.状态.属性 → Figma 变量（CSS 变量） |
| `assetMap` | 有图标时 | 部件 → 图标资源路径与颜色规则 |
| `runtimeMap` | 是 | 部件 → 选择器，便于核对与定位 |
| `templates` | 常用组件 | 参数化模板 `{tpl, example | examples, params}`：组件写法的唯一来源。`build-markup.cjs` 用 `example` 渲染出同名 `markup`；有 `examples`（`{markup 键: 参数}`）时逐个渲染写回，一个模板覆盖多个尺寸 / 变体，并打包成 `assets/scripts/gj-m-templates.js` 供预览站与原型运行时使用 |
| `markup` | 是 | 写法片段：至少包含默认态，以及常用变体与状态；与 `templates` 同名的片段由模板生成，不手改 |
| `interactionMap` | 有交互时 | 状态如何触发、如何表现 |
| `accessibility` | 是 | 元素、角色、可访问名称、状态属性 |
| `composition` | 有约束时 | 组合与布局约束、布局类名 |
| `pageRules` | 有相关规则时 | 相关 `page-rules.md` 编号与一句话摘要 |
| `pending` | 有未关闭审计项时 | 审计编号与对产出的影响 |

## 页面基础写法

片段依赖页面先引入 Token 与基座样式，并设置根字号与盒模型（基座不全局设置 box-sizing，缺少时 `width:100%` + 内边距的组件会溢出）：

```html
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">  <!-- H5 / web-view 页面有输入框时加 maximum-scale=1（小于 375 宽时 L 输入也会低于 16） -->
<link rel="stylesheet" href="{ROOT}assets/styles/gj-b2b-mobile-tokens.css">
<link rel="stylesheet" href="{ROOT}assets/styles/gj-b2b-mobile-components.css">
<style>
html{font-size:min(calc(100vw / 3.75),120px)}
*{box-sizing:border-box}
body{margin:0;font-size:.14rem;line-height:.22rem;font-family:var(--ds-font-family-ui);color:var(--ds-text-primary);background:var(--ds-background-background)}
</style>
```

## 唯一来源与一致性检查

`templates`（没有模板的组件则是 `markup`）是组件写法的唯一来源。模板语法为 Mustache 子集（`{{x}}` 转义、`{{{x}}}` 原样、`{{#x}}…{{/x}}` 循环或条件、`{{^x}}…{{/x}}` 取反），渲染器 `assets/scripts/gj-m-markup.js` 在浏览器与 Node 中通用：页面引入 `gj-m-markup.js` 与 `gj-m-templates.js` 后，`GJMarkup.root` 设为到 Skill 根目录的相对路径，用 `GJMarkup.render(组件, 模板名, 参数)` 输出 HTML。改模板后运行 `node scripts/build-markup.cjs`（更新 markup 与打包文件）。预览页、页面模式脚本（`preview/patterns/kit.js` 与各模式 js，已全部改为调用模板，不再手写组件 HTML）与端到端示例都应与之一致：修改基座 CSS、mapping、预览页或 kit.js 后运行 `node scripts/check-mapping.cjs`。它会渲染全部片段（检查资源、脚本错误、类名是否存在于基座），并对比各页面实际用到的 `gj-m-*` 类与同一组件内部的父子结构，列出未收录或已偏离的写法。`fromPreview_*` 片段是该脚本从预览页补录的真实渲染写法。

## markup 约定

- 路径写 `{ROOT}assets/...`，`{ROOT}` 替换为页面到 Skill 根目录的相对路径（如 `planning/e2e/` 下为 `../../`）。
- 图标统一 `<span class="gj-icon" style="--gj-icon:url('{ROOT}assets/icons/iconfont/<名称>.svg')" aria-hidden="true"></span>`，名称取自 `references/icons/` 登记资源。
- 片段只含组件本身；页面级间距、外层容器按 `page-rules.md` 与页面模式处理。
- 文案为示例，替换为业务内容。

## 维护

- 新增或修改组件写法后，把全部 `markup` 片段在 375 / 320 实际渲染一遍，确认无溢出（横滑轨道除外）、无缺失资源、无报错。
- 2026-10-19：47 个组件全部升级为 v2；内容来自基座 CSS、组件 rules / schema 与预览页实际渲染的结构，没有依据的字段不填。

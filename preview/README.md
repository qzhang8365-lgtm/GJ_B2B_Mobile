# 移动端规范站 preview/

人工浏览与验收用的规范站，版式沿用 PC 规范站（`国金B端设计skill（PC）/preview`），设计值只来自移动端 Token。Agent 生成页面时不需要读这里，读 `SKILL.md` 与 `references/`。

## 启动

直接双击 `preview/index.html` 打开（`file://`），或从 **skill 根目录** 起静态服务：

```bash
python3 -m http.server 8000   # 在 国金B端设计skill（移动端）/ 下执行
# 打开 http://localhost:8000/preview/
```

部署时同样需要带上 `preview/`、`assets/`、`references/`。

### 数据来源（2026-10-20 统一）

浏览器禁止 `file://` 页面用 fetch / XHR 读本地文件，所以预览站**不允许出现 fetch / XMLHttpRequest**，一律用 `<script>` 引入数据（与 `assets/scripts/gj-m-templates.js` 同一机制）：

| 数据 | 引入方式 | 生成 |
| --- | --- | --- |
| Token（颜色、字体、布局、圆角、样式效果页） | `../_data/tokens.js` → `GJ_PREVIEW_DATA.tokens` | `scripts/build-preview-data.py`，源 `references/tokens/gj-b2b-mobile.tokens.json` |
| 分割线变体 | `../_data/divider.js` → `GJ_PREVIEW_DATA.divider` | 同上，源 `references/components/divider/source.json` |
| 动效图标 Lottie | `../_data/motion.js` → `GJ_PREVIEW_DATA.motion`（`animationData`，不用 lottie 的 `path`） | 同上，源 `assets/icons/animation/*.json` |
| 发布包信息（总览页） | `../_data/release.js` → `GJ_PREVIEW_DATA.release` | `scripts/build-release.py` |
| 图标 SVG 源码（图标页复制 / 下载） | 点击时按需插入 `<script src="assets/icons/icon-content.js">` | 静态资产 |

图标用 CSS mask 引用 svg 文件，`file://` 下也会被拦截：`phone-stage.js` 在 `file://` 下按需加载 `assets/icons/icon-content.js` 与 `_data/icon-rules.js`，把 svg 地址换成内嵌 data URI（http 打开时不加载、不改动）。没有用到预览框的页面也要引入 `phone-stage.js`，图标才能兜底。

新页面要用 JSON 数据时：在 `build-preview-data.py` 里加一项输出，页面用 `<script>` 引入；不要写 fetch。改了数据源后运行 `python3 scripts/build-preview-data.py`，发布前 `--check`。`preview/_data/` 只供预览站使用，生成页面时不要读取。

## 结构

| 文件 | 作用 |
| --- | --- |
| `index.html` | 外壳：顶栏、端别切换、左侧导航、内容 iframe。导航目录在文件内 `catalog`。 |
| `site.css` | 站点版式变量 `--docs-*`（px 固定，与 PC 一致），不属于设计 Token。 |
| `docs.css` | 文档版式（移植自 PC `component-docs.css`）＋ 状态标记 ＋ 交互演示布局 ＋ 手机预览框样式。 |
| `phone-stage.js` | 手机预览框 `GJPhone.mount()`。示例在独立 iframe 中按 H5 规则设置根字号（375 宽 1rem = 100px，≥450 封顶 120px），可切 320/375/450/600/960 宽度；示例固定 1 倍显示，不提供倍率切换，`widths:[]` 时整条工具栏隐藏。**组件页不用手机框**：参照 PC 端，示例分面板横排，每块用 `GJPhone.swatch(el,{html,css,height:'auto'})` 按 375 基准（1rem = 100px）嵌入，透明背景、按内容撑高；多宽度对比只用于布局等基础规范页。 |
| `_template/` | 组件页模板，不进入导航。 |
| `color/` | 颜色页，数据来自 `_data/tokens.js`（由 `references/tokens/gj-b2b-mobile.tokens.json` 生成）。 |
| `_data/` | 预览数据脚本，由 `scripts/build-preview-data.py` / `build-release.py` 生成，勿手改。 |
| `icons/` | 站点外壳用图标。 |

为什么示例必须放在预览框里：移动端尺寸 Token 以 rem 书写，文档页根字号是 16px，直接渲染会整体缩小约 1/6。颜色这类不含 rem 的内容可以直接放在文档页。

## 组件接入流程（每个组件一轮）

1. **提取**：从用户提供的移动端 Figma 节点只读获取变体、状态、文字、图标与 Token 绑定，保存原始证据；缺失信息记为待确认，不从 PC 端移植。
2. **基座**：在 `assets/styles/gj-b2b-mobile-components.css` 追加该组件的 `.gj-m-*` 段落，只用移动端 Token 与 rem。
3. **预览页**：复制 `_template/` 为 `preview/<component>/`，按 PC 组件页的章节（变体与尺寸 / 状态 / 交互演示 / 选用规则）填写，示例全部经 `GJPhone.mount()` 渲染。页面只展示规范与示例；Figma 来源、核对范围、待确认项等审计信息记录在 `references/`，不上页面。
4. **验证**：在 375 基准与 320 小屏核验，再按组件类型检查宽屏、长文案、输入与滚动；记录验证结果。
5. **上架**：在 `index.html` 的 `catalog` 中加入导航项。组件状态（已提取 / 待确认 / 预览已验证 / 已发布）在 `references/` 中分开记录，待确认项不算通过。

组件族（如按钮下的文字按钮、悬浮按钮）与颜色页一致：放在父组件的同一页面，每个子组件一张大卡片（`<article class="docs-sheet" id="子组件id">`），导航用 `anchor` 指向卡片；子组件的脚本、`data-demo` 与控件 id 加前缀，避免冲突。

交互演示区与 PC 端一致：`.lab` 使用浅灰底 `--ds-background-background` 加 1px 虚线边框 `--ds-border-secondary`，示例按 375 基准嵌入其中。

并排的浅灰面板（`.panel.gray`）高度会被同行最高的一块撑齐，面板内的示意图在标签下方的剩余空间里垂直居中，不贴顶。

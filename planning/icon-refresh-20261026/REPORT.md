# 图标资源更新验收报告

## 资源结论

- PC 与移动端普通图标均为 **382 枚：line 240、fill 142**，共 13 个分类。
- `references/icons/index.json` 是唯一入口，普通图标清单只由 `manifest.json` 维护；分类与风格以 manifest 和 line/fill 字体映射为准，不按名称后缀推断。
- 两端 382 项均存在 SVG、字体映射、catalog 记录与复制/下载源码；源码缓存与当前 SVG 逐项一致。
- 既有 231 个 line 与 140 个 fill 的名称、Unicode、codepoint、CSS 类均未改变；历史兼容别名继续由 `ICON_NAME_ALIASES` 解析，不进入主清单重复计数。
- `icf_system_delete-fill` 继续保留 U+F080 / `gj-fill-icf-system-delete-fill`；Figma 来源已确认为节点 `5396:3700`（ICO-008 已关闭）。

## 浏览器实测

在 Chromium 中分别以 HTTP 打开 PC 与移动端 Icon 页，完成以下验收：

- 页面显示 382 / 13，Line 与 Fill 筛选分别返回 240 / 142。
- 382 枚图标全部取得对应字体类和非空字形；line/fill 字体均加载成功。
- `volume` 搜索返回音量与静音的 line/fill 四枚；视觉上音量、静音差异清晰。
- `file-zip` 搜索返回四枚压缩文件图标；line 图标保持空心，拉链细节可见，fill 图标保持实心结构。
- 历史别名 `icf_system_delete_back` 可检索到正式 `delete-back` / `delete-back-fill` 项。
- 详情显示 style、Unicode 和 CSS class；复制 SVG 成功。
- 普通图标 SVG / PNG、File 图标 SVG / PNG、Glass 图标 SVG 均可下载，文件非空且名称正确。
- 两端控制台报错、页面异常、失败请求和 HTTP 4xx/5xx 均为 0。

## 自动校验

- 两端 `sync-icon-resources.py --check` 通过：382、line 240、fill 142、System 审计镜像 117。
- 移动端 `build-preview-data.py --check` 与 `validate-tokens.py` 通过。
- PC `build-coverage.mjs --check` 与 `validate-tokens.mjs` 通过。
- PC Figma 导入工作台的内嵌区块已按最新资源重建并通过 `embed-icons.cjs --check`；移动端 8 个已内嵌 E2E 页面均通过检查。

## 待确认

当前图标资源审计无待确认项。

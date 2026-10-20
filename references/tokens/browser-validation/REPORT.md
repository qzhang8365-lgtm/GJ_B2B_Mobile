# Token 浏览器验证

2026-10-14 复跑：数字样式按 Figma 最新 Text Style 更新（N1 36/52、N2 32/48、N3 24/36、N4 20/30、N5 18/26、N6 16/24、N7 14/22、N8 12/18；S=Bold、M=Medium），重新编译后 5 个视口无溢出、无 JS 异常，GJType 500/700 已加载。fixture、results.json 与截图已更新。

日期：2026-10-08（glass 背景模糊由 4 改为 40；GJType 字体文件从 PC 端同步并接入 `@font-face`；重新编译后复跑）。环境：Linux 无头 Chromium 141.0.7390.37，deviceScaleFactor = 2；此前一次为 macOS 无头 Chrome 154.0.8037.58。使用当前编译 CSS，Figma 文件未修改。

## 结果

| 逻辑宽度 | 根字号 | 输入字号 | 页面横向溢出 | 数字等宽 |
| --- | --- | --- | --- | --- |
| 320 | 85.3333px | 16px | 无 | 通过 |
| 375 | 100px | 16px | 无 | 通过 |
| 450 | 120px | 19.2px | 无 | 通过 |
| 600 | 120px | 19.2px | 无 | 通过 |
| 960 | 120px | 19.2px | 无 | 通过 |

- 235 个颜色的浏览器计算值与源值匹配（RGB 浮点量化容差 <1/255；透明度容差 <0.005）。
- 30 个文字样式的字号、字重与对应视口规则匹配；截图中中西文及数字正常显示，未见重叠。数字样式字体为 `GJType, system-ui, sans-serif`，5 个视口中 GJType 500/700 均为 loaded（400 未被移动端样式使用，按需不加载）；0–9 各重复 8 次的字符串测量宽度一致。
- 6 个效果均有非空 box-shadow；glass 的 backdrop-filter 为 `blur(0.4rem)`，计算值 320 宽 34.13px、375 宽 40px、≥450 宽 48px，随 rem 缩放；截图中条纹背景被充分模糊、前景文字保持清晰。bottom border 底边可见。
- 9 个渐变 data URI 均被浏览器解析并可见；透明白渐变放在灰蓝背景上检查，方向相反、透明端能显露背景。非轴向渐变在不同宽高比容器中正常显示。
- 5 个视口均无 JS 页面异常（results.json 中 errors 为空），输入可聚焦。颜色、文字与渐变的源数据本次未变；首次核验完成 1550 项浏览器计算值断言，无失败。

本次未发现需要修改 Token 编译器的渲染问题。核验页仅用于展示 Token；其网格、背景和文字不定义新的业务规范。尺寸样本采集了计算宽度，但其中 Radius-full 被测试容器 max-width 限制，不能以样本条宽度验证圆角值。

## 可查看的证据

- [核验页快照](fixture.html)（包含本次编译 CSS，供复现该次结果）
- [原始浏览器数据](results.json)
- [320 宽首屏](overview-320.png)、[375 宽首屏](overview-375.png)、[450 宽首屏](overview-450.png)、[600 宽首屏](overview-600.png)、[960 宽首屏](overview-960.png)
- [完整文字样式截图](typography-375.png)、[效果截图](effects-375.png)、[渐变截图](gradients-375.png)

重跑：在项目根目录执行 `node scripts/verify-token-browser.cjs`。需要 Playwright；可用 `PLAYWRIGHT_MODULE` 指定其模块路径，`CHROME_EXECUTABLE` 指定 Chrome 路径。脚本重新读取当前产物、生成快照、截图和计算值，不启动公开服务。

## 未验证范围

- Safari、Android/iOS WebView 和真机软键盘、安全区、输入聚焦缩放。
- 系统字体放大与辅助技术；本次仅验证正常字体设置。
- GJType H5 场景的授权范围待确认；未与 Figma 数字字形做逐像素比对。
- 没有与 Figma 导出图做逐像素差分；结论是浏览器渲染与已提取参数的核验，不是设计截图完全一致认证。
- 业务页面滚动、表单交互、金融数值刷新与布局状态，以及全透明节点下 showShadowBehindNode 的细节。

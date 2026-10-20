# Figma 组件命名规范（移动端）

2026-10-14 设计方确认。

- Figma 组件名里的 `/` 会在组件库中变成文件夹层级，层级越深，选组件时点击越多。
- **普通组件**：用 `xx_xx`，不带 `/`。例：`Filter_bar`、`Cascader_sheet`、`Image_viewer`、`Upload_button`、`Picker_popup`。
- **单元（只用来拼组件、不单独选用的部件）**：放在 `组件名_item/单元名` 下，在组件库里收起来。例：`Filter_item/Filter_item`、`Cascader_item/Column_item`、`Image_item/Upload_item`、`Upload_item/File_item`、`tabs_item/primary_tab`、`Datepicker_item/Date_item`。
- 不在组件名里用空格，单词之间用 `_`。
- 审计里给改名建议时按本规范，不再建议 `组件/子组件` 的写法。

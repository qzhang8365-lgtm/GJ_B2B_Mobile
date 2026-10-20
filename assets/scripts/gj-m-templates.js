/* 由 scripts/build-markup.cjs 从各组件 mapping.json 的 templates 生成，请勿手改。 */
window.GJ_M_TEMPLATES = {
 "_shared": {
  "icon": "<span class=\"gj-icon{{#size}} gj-icon-{{size}}{{/size}}{{#cls}} {{cls}}{{/cls}}\" style=\"--gj-icon:url('{ROOT}assets/icons/iconfont/{{name}}.svg')\" aria-hidden=\"true\"></span>"
 },
 "avatar": {
  "person": "<span class=\"gj-m-avatar gj-m-avatar-circle\"><img alt=\"\" src=\"{ROOT}assets/images/avatar/person-1.svg\" onerror=\"this.parentNode.classList.add('is-default')\"></span>"
 },
 "button": {
  "button": "<button type=\"{{#submit}}submit{{/submit}}{{^submit}}button{{/submit}}\" class=\"gj-m-button{{#size}} gj-m-button-{{size}}{{/size}} gj-m-button-{{level}}{{#iconOnly}} gj-m-button-icon-only{{/iconOnly}}{{#pill}} gj-m-button-pill{{/pill}}{{#pressed}} is-pressed{{/pressed}}{{#block}} gj-m-button-block{{/block}}\"{{#disabled}} disabled{{/disabled}}{{{attrs}}}>{{#icon}}<span class=\"gj-icon\" style=\"--gj-icon:url('{ROOT}assets/icons/iconfont/{{icon}}.svg')\" aria-hidden=\"true\"></span>{{/icon}}{{text}}</button>",
  "choices": "<div class=\"gj-m-button-group{{#large}} gj-m-button-group-large{{/large}}\" role=\"{{role}}\" aria-label=\"{{label}}\" data-btns=\"{{key}}\"{{#single}} data-single=\"1\"{{/single}}>{{#items}}<button type=\"button\" class=\"gj-m-button{{#large}} gj-m-button-large{{/large}} {{#on}}gj-m-button-secondary is-pressed{{/on}}{{^on}}gj-m-button-tertiary{{/on}}\" {{{state}}} data-v=\"{{text}}\">{{text}}</button>{{/items}}</div>",
  "actions": "<div class=\"gj-m-form-actions\">{{{buttons}}}</div>"
 },
 "card": {
  "card": "<section class=\"gj-m-card{{#cls}} {{cls}}{{/cls}}\"{{#id}} id=\"{{id}}\"{{/id}}{{{attrs}}}>{{#head}}<div class=\"gj-m-card-head\">{{{head}}}{{#sub}}<p class=\"gj-m-card-subtitle\">{{sub}}</p>{{/sub}}</div>{{/head}}{{#hasBody}}<div class=\"gj-m-card-body\">{{{body}}}</div>{{/hasBody}}{{{content}}}</section>",
  "header": "<div class=\"gj-m-card-header{{#lv2}} gj-m-card-header-h2{{/lv2}}\">{{#icon}}<span class=\"gj-icon gj-m-card-icon\" style=\"--gj-icon:url('{ROOT}assets/icons/iconfont/{{icon}}.svg')\" aria-hidden=\"true\"></span>{{/icon}}{{#bar}}<span class=\"gj-m-card-bar\" aria-hidden=\"true\"></span>{{/bar}}{{#lv2}}<h4 class=\"gj-m-card-title\">{{#titleHtml}}{{{titleHtml}}}{{/titleHtml}}{{^titleHtml}}{{title}}{{/titleHtml}}</h4>{{/lv2}}{{^lv2}}<h3 class=\"gj-m-card-title\">{{#titleHtml}}{{{titleHtml}}}{{/titleHtml}}{{^titleHtml}}{{title}}{{/titleHtml}}</h3>{{/lv2}}{{{right}}}</div>",
  "arrow": "<span class=\"gj-m-card-arrow\" aria-hidden=\"true\"><span class=\"gj-icon\" style=\"--gj-icon:url('{ROOT}assets/icons/iconfont/icf_Arrow_right.svg')\" aria-hidden=\"true\"></span></span>",
  "group": "<div class=\"gj-m-card-group\">{{{header}}}{{{body}}}</div>",
  "link": "<a class=\"gj-m-card{{#cls}} {{cls}}{{/cls}}\" href=\"javascript:void 0\"{{{attrs}}}>{{#head}}<div class=\"gj-m-card-head\">{{{head}}}{{#sub}}<p class=\"gj-m-card-subtitle\">{{{sub}}}</p>{{/sub}}</div>{{/head}}{{#hasBody}}<div class=\"gj-m-card-body\">{{{body}}}</div>{{/hasBody}}</a>",
  "level2": "<div class=\"gj-m-card-l2\"{{{attrs}}}>{{{content}}}</div>",
  "record": "<div class=\"gj-m-card-l2 gj-m-card-record\">{{{header}}}<div class=\"gj-m-card-record-fields\">{{{fields}}}</div>{{#actions}}<div class=\"gj-m-card-record-actions\">{{{actions}}}</div>{{/actions}}</div>",
  "selectionDialog": "<section class=\"gj-m-card gj-m-card-selection\"><div class=\"gj-m-card-selection-head\">{{{header}}}</div>{{{list}}}<div class=\"gj-m-popup-footer\">{{{actions}}}</div></section>",
  "sectioned": "<section class=\"gj-m-card gj-m-card-sectioned\"{{#id}} id=\"{{id}}\"{{/id}}><div class=\"gj-m-card-summary\">{{{header}}}<div class=\"gj-m-card-record-fields\">{{{summary}}}</div></div>{{#sections}}<div class=\"gj-m-card-section-divider\"><div class=\"gj-m-divider gj-m-divider-plain\" role=\"separator\"></div></div>{{{content}}}{{/sections}}</section>"
 },
 "chart": {
  "progress": "<ul class=\"gj-m-chart-progress-list\">{{#rows}}<li class=\"gj-m-chart-progress-item\"><div class=\"gj-m-chart-progress-head\"><span class=\"gj-m-chart-progress-name\">{{name}}</span><span class=\"gj-m-chart-progress-value\">{{text}}</span></div><div class=\"gj-m-chart-progress gj-m-chart-progress-lg\" role=\"progressbar\" aria-valuenow=\"{{value}}\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-label=\"{{name}} {{text}}\"><div class=\"gj-m-chart-progress-bar gj-m-chart-s{{series}}\" style=\"--v:{{value}}\"></div></div></li>{{/rows}}</ul>",
  "progressInline": "<ul class=\"gj-m-chart-progress-list gj-m-chart-progress-list-inline\">{{#rows}}<li class=\"gj-m-chart-progress-item\"><span class=\"gj-m-chart-progress-name\">{{name}}</span><div class=\"gj-m-chart-progress\" role=\"progressbar\" aria-valuenow=\"{{value}}\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-label=\"{{name}} {{text}}\"><div class=\"gj-m-chart-progress-bar\" style=\"--v:{{value}}\"></div></div><span class=\"gj-m-chart-progress-value\">{{text}}</span></li>{{/rows}}</ul>",
  "progressExpand": "<ul class=\"gj-m-chart-progress-list gj-m-chart-progress-list-inline is-expandable\">{{#rows}}<li class=\"gj-m-chart-progress-item\"><button type=\"button\" class=\"gj-m-chart-progress-toggle\" data-expand=\"{{name}}\"{{#can}} aria-expanded=\"{{open}}\"{{/can}}{{^can}} disabled{{/can}} aria-label=\"{{name}} {{text}}{{hint}}\"><span class=\"gj-m-chart-progress-name\">{{name}}</span><span class=\"gj-m-chart-progress\" aria-hidden=\"true\"><span class=\"gj-m-chart-progress-bar\" style=\"--v:{{value}}\"></span></span><span class=\"gj-m-chart-progress-value\">{{text}}</span>{{#can}}<span class=\"gj-m-chart-progress-caret\" aria-hidden=\"true\"></span>{{/can}}{{^can}}<span></span>{{/can}}</button>{{#open}}<ul class=\"gj-m-chart-progress-detail\">{{#items}}<li><a class=\"gj-m-chart-progress-detail-item\" href=\"javascript:void 0\" data-go=\"{{.}}\"><span>{{.}}</span><span class=\"gj-icon\" style=\"--gj-icon:url('{ROOT}assets/icons/iconfont/icf_Arrow_right.svg')\" aria-hidden=\"true\"></span></a></li>{{/items}}</ul>{{/open}}</li>{{/rows}}</ul>",
  "legendList": "<div class=\"gj-m-chart-legend{{#cls}} {{cls}}{{/cls}}\">{{#items}}<span class=\"gj-m-legend{{#series}} gj-m-chart-s{{series}}{{/series}}\"{{#color}} style=\"--gj-m-legend-color:{{color}}\"{{/color}}><span class=\"gj-m-legend-mark{{#mark}} is-{{mark}}{{/mark}}\" aria-hidden=\"true\"></span>{{text}}</span>{{/items}}</div>",
  "plotViewport": "<svg id=\"{{id}}\" class=\"gj-m-chart-line-svg\" viewBox=\"0 0 {{width}} {{#height}}{{height}}{{/height}}{{^height}}166{{/height}}\" style=\"display:block;width:100%;height:{{#heightRem}}{{heightRem}}{{/heightRem}}{{^heightRem}}1.66{{/heightRem}}rem\" role=\"img\" aria-label=\"{{label}}\"></svg>",
  "rangeNavigator": "<div data-chart-navigator style=\"position:relative;height:.16rem\"><input id=\"{{id}}\" type=\"range\" min=\"{{min}}\" max=\"{{max}}\" value=\"{{value}}\" aria-label=\"{{label}}\" style=\"position:absolute;left:0;top:50%;transform:translateY(-50%);width:100%;height:44px;margin:0;accent-color:var(--ds-text-blue)\"></div>"
 },
 "checkbox": {
  "checkbox": "<label class=\"gj-m-checkbox{{#cls}} {{cls}}{{/cls}}\"><input type=\"checkbox\" class=\"gj-m-checkbox-input\"{{#checked}} checked{{/checked}}{{#disabled}} disabled{{/disabled}}{{{attrs}}}{{#aria}} aria-label=\"{{aria}}\"{{/aria}}><span class=\"gj-m-checkbox-icon\" aria-hidden=\"true\"></span>{{#text}}<span class=\"gj-m-checkbox-label\">{{text}}</span>{{/text}}{{#labelHtml}}<span class=\"gj-m-checkbox-label\">{{{labelHtml}}}</span>{{/labelHtml}}</label>"
 },
 "datepicker": {
  "calendar": "<div class=\"gj-m-calendar\"><div class=\"gj-m-calendar-header\">{{#year}}<button type=\"button\" class=\"gj-m-calendar-nav\" data-nav=\"-12\" aria-label=\"上一年\"><span class=\"gj-icon\" aria-hidden=\"true\"></span></button>{{/year}}<button type=\"button\" class=\"gj-m-calendar-nav\" data-nav=\"-1\" aria-label=\"上一月\"><span class=\"gj-icon\" aria-hidden=\"true\"></span></button><div class=\"gj-m-calendar-title\" aria-live=\"polite\">{{title}}</div><button type=\"button\" class=\"gj-m-calendar-nav\" data-nav=\"1\" aria-label=\"下一月\"><span class=\"gj-icon\" aria-hidden=\"true\"></span></button>{{#year}}<button type=\"button\" class=\"gj-m-calendar-nav\" data-nav=\"12\" aria-label=\"下一年\"><span class=\"gj-icon\" aria-hidden=\"true\"></span></button>{{/year}}</div><div class=\"gj-m-calendar-week\" aria-hidden=\"true\"><span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span></div><div class=\"gj-m-calendar-days\">{{#days}}<button type=\"button\" class=\"gj-m-calendar-day{{#today}} is-today{{/today}}{{#selected}} is-selected{{/selected}}{{#range}} {{range}}{{/range}}\" data-date=\"{{date}}\"{{#disabled}} disabled{{/disabled}} aria-label=\"{{label}}\"{{#pressed}} aria-pressed=\"true\"{{/pressed}}><span>{{num}}</span>{{#dots.length}}<span class=\"gj-m-calendar-dots\" aria-hidden=\"true\">{{#dots}}<i style=\"--gj-m-dot:{{.}}\"></i>{{/dots}}</span>{{/dots.length}}</button>{{/days}}</div></div>"
 },
 "dialog": {
  "dialog": "<div class=\"gj-m-dialog\"><div class=\"gj-m-dialog-panel\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"{{id}}T\"{{#message}} aria-describedby=\"{{id}}M\"{{/message}} tabindex=\"-1\"><div class=\"gj-m-dialog-header\">{{#icon}}<span class=\"gj-icon gj-m-dialog-icon is-{{icon}}\" aria-hidden=\"true\"></span>{{/icon}}<h2 class=\"gj-m-dialog-title\" id=\"{{id}}T\">{{title}}</h2>{{#message}}<p class=\"gj-m-dialog-message\" id=\"{{id}}M\">{{message}}</p>{{/message}}</div><div class=\"gj-m-dialog-footer\">{{{footer}}}</div></div></div>"
 },
 "empty": {
  "empty": "<div class=\"gj-m-empty\"><img class=\"gj-m-empty-image\" alt=\"\" src=\"{ROOT}assets/images/empty/{{type}}.svg\"><div class=\"gj-m-empty-copy\"><p class=\"gj-m-empty-title\">{{title}}</p><p class=\"gj-m-empty-description\">{{desc}}</p></div>{{{action}}}</div>"
 },
 "file-list": {
  "file": "<ul class=\"gj-m-file-list\"><li class=\"gj-m-file-list-item\"><span class=\"gj-m-file-list-icon\"><img alt=\"\" src=\"{ROOT}assets/icons/fileicon/{{icon}}.svg\"></span><span class=\"gj-m-file-list-content\"><span class=\"gj-m-file-list-name\" title=\"{{name}}\"><span class=\"gj-m-file-list-base\">{{base}}</span><span class=\"gj-m-file-list-ext\">{{ext}}</span></span><span class=\"gj-m-file-list-info\"><span>{{info}}</span><span>{{size}}</span></span></span><span class=\"gj-m-file-list-actions\">{{{actions}}}</span></li></ul>",
  "action": "<button type=\"button\" class=\"gj-m-file-list-action\" aria-label=\"{{label}}\"{{{attrs}}}><span class=\"gj-icon\" style=\"--gj-icon:url('{ROOT}assets/icons/iconfont/{{icon}}.svg')\" aria-hidden=\"true\"></span></button>"
 },
 "filter": {
  "filter": "<div class=\"gj-m-filter\"><div class=\"gj-m-filter-bar{{#left}} gj-m-filter-bar-left{{/left}}\" role=\"toolbar\" aria-label=\"筛选条件\">{{#items}}<button type=\"button\" class=\"gj-m-filter-item{{#active}} is-active{{/active}}\" aria-expanded=\"{{open}}\"{{#key}} data-k=\"{{key}}\"{{/key}}><span class=\"gj-m-filter-item-text\">{{text}}</span><span class=\"gj-icon\" aria-hidden=\"true\"></span></button>{{/items}}</div>{{#panel}}<div class=\"gj-m-filter-mask\"></div><div class=\"gj-m-filter-panel\">{{{panel}}}</div>{{/panel}}</div>"
 },
 "floating-button": {
  "fab": "<div class=\"gj-m-fab-group{{#cls}} {{cls}}{{/cls}}\"{{#hidden}} hidden{{/hidden}}><button class=\"gj-m-fab{{#blue}} gj-m-fab-blue{{/blue}}\" type=\"button\" aria-label=\"{{label}}\"{{{attrs}}}><span class=\"gj-icon\" style=\"--gj-icon:url('{ROOT}assets/icons/iconfont/{{icon}}.svg')\" aria-hidden=\"true\"></span></button></div>"
 },
 "form": {
  "label": "<span class=\"gj-m-form-label\"{{#id}} id=\"{{id}}\"{{/id}}><span class=\"gj-m-form-label-text\">{{text}}</span>{{#required}}<span class=\"gj-m-form-required\" aria-label=\"必填\">*</span>{{/required}}{{#desc}}<span class=\"gj-m-form-desc\">({{desc}})</span>{{/desc}}</span>",
  "item": "<div class=\"gj-m-form-item\" data-k=\"{{key}}\">{{{label}}}{{{control}}}{{#error}}<div class=\"gj-m-input-message\" role=\"alert\">{{error}}</div>{{/error}}</div>"
 },
 "gridnav": {
  "gridnav": "<nav class=\"gj-m-gridnav\" data-columns=\"{{cols}}\" aria-label=\"功能导航\">{{#items}}<button type=\"button\" class=\"gj-m-gridnav-item\" data-go=\"{{label}}\"><img src=\"{ROOT}assets/icons/glassicon/png/{{icon}}.png\" alt=\"\" draggable=\"false\"><span class=\"gj-mobile-type-p5-cn-r\">{{label}}</span></button>{{/items}}</nav>"
 },
 "info-list": {
  "list": "<dl class=\"gj-m-info-list {{cls}}\">{{#rows}}<div class=\"gj-m-info-item\"><dt class=\"gj-m-info-label\">{{label}}</dt><dd class=\"gj-m-info-value\">{{{value}}}</dd></div>{{/rows}}</dl>"
 },
 "input": {
  "textareaCount": "<label class=\"gj-m-textarea\"><textarea rows=\"3\" placeholder=\"{{placeholder}}\" aria-label=\"{{label}}\" data-max=\"{{max}}\" data-k=\"{{key}}\">{{value}}</textarea><span class=\"gj-m-textarea-count\">{{count}}/{{max}}</span></label>",
  "input": "<label class=\"gj-m-input{{#size}} gj-m-input-{{size}}{{/size}}{{#line}} gj-m-input-line{{/line}}{{#error}} is-error{{/error}}\"><input type=\"{{type}}\"{{{attrs}}}{{#placeholder}} placeholder=\"{{placeholder}}\"{{/placeholder}}{{#value}} value=\"{{value}}\"{{/value}} aria-label=\"{{label}}\"{{#error}} aria-invalid=\"true\"{{/error}}{{#disabled}} disabled{{/disabled}}>{{#clear}}<button type=\"button\" class=\"gj-m-input-clear\" aria-label=\"清除\"><span class=\"gj-icon\" style=\"--gj-icon:url('{ROOT}assets/icons/iconfont/icf_system_close-circle-fill.svg')\" aria-hidden=\"true\"></span></button>{{/clear}}{{{suffix}}}</label>{{#error}}<div class=\"gj-m-input-message\" role=\"alert\">{{error}}</div>{{/error}}",
  "action": "<span class=\"gj-m-input-divider\" aria-hidden=\"true\"></span><span class=\"gj-m-input-action\">{{{button}}}</span>"
 },
 "listbar": {
  "item": "{{#link}}<a class=\"gj-m-list-item{{#disabled}} is-disabled{{/disabled}}\" href=\"javascript:void 0\"{{{attrs}}}>{{/link}}{{^link}}<div class=\"gj-m-list-item{{#disabled}} is-disabled{{/disabled}}\"{{#disabled}} aria-disabled=\"true\"{{/disabled}}{{{attrs}}}>{{/link}}{{#prefix}}<span class=\"gj-m-list-item-prefix\">{{{prefix}}}</span>{{/prefix}}<span class=\"gj-m-list-item-content\"><span class=\"gj-m-list-item-main\">{{#label}}<span class=\"gj-m-list-item-label\">{{label}}</span>{{/label}}<span class=\"gj-m-list-item-text\">{{{text}}}</span>{{#desc}}<span class=\"gj-m-list-item-desc\">{{{desc}}}</span>{{/desc}}</span>{{#extra}}<span class=\"gj-m-list-item-extra\">{{{extra}}}</span>{{/extra}}{{#action}}<span class=\"gj-m-list-item-action\">{{{action}}}</span>{{/action}}{{#link}}<span class=\"gj-m-list-item-arrow\"><span class=\"gj-icon\" style=\"--gj-icon:url('{ROOT}assets/icons/iconfont/icf_Arrow_right.svg')\" aria-hidden=\"true\"></span></span>{{/link}}</span>{{#link}}</a>{{/link}}{{^link}}</div>{{/link}}",
  "list": "<div class=\"gj-m-list{{#inCard}} gj-m-list-in-card{{/inCard}}{{#card}} gj-m-list-card{{/card}}{{#cls}} {{cls}}{{/cls}}\">{{{items}}}</div>",
  "avatar": "<img class=\"gj-m-list-item-avatar\" src=\"{{src}}\" alt=\"\">"
 },
 "loading": {
  "loading": "<div class=\"gj-m-loading{{#cls}} {{cls}}{{/cls}}\" data-state=\"{{state}}\" role=\"status\"><span class=\"gj-icon\" style=\"--gj-icon:url('{ROOT}assets/icons/iconfont/{{icon}}.svg')\" aria-hidden=\"true\"></span><span>{{text}}</span></div>"
 },
 "metric": {
  "trend": "<span class=\"gj-m-trend is-{{kind}}\" aria-label=\"较上期{{label}}{{text}}\"><span aria-hidden=\"true\">{{text}}</span></span>",
  "tiles": "<div class=\"gj-m-metric-tiles\">{{#items}}<div class=\"gj-m-metric-tile{{#gray}} gj-m-metric-tile-gray{{/gray}}{{#empty}} is-empty{{/empty}}\"><span class=\"gj-m-metric-label\">{{label}}</span><span class=\"gj-m-metric-value\"><span class=\"gj-m-metric-num\">{{num}}</span>{{#unit}}<span class=\"gj-m-metric-unit\">{{unit}}</span>{{/unit}}{{{trend}}}</span></div>{{/items}}</div>",
  "grid": "<div class=\"gj-m-metric-grid{{#n3}} gj-m-metric-grid-3{{/n3}}{{#left}} gj-m-metric-grid-left{{/left}}\">{{#items}}<div class=\"gj-m-metric {{#size}}gj-m-metric-{{size}}{{/size}}{{^size}}gj-m-metric-n5{{/size}}{{#tone}} is-{{tone}}{{/tone}}\"><span class=\"gj-m-metric-value\"><span class=\"gj-m-metric-num\">{{{num}}}</span></span><span class=\"gj-m-metric-label\">{{label}}</span></div>{{/items}}</div>"
 },
 "navbar": {
  "navbar": "<header class=\"gj-m-navbar\" aria-label=\"页面导航\"><div class=\"gj-m-navbar-left\">{{#back}}<button class=\"gj-m-navbar-action gj-m-navbar-back\" type=\"button\" aria-label=\"返回上一页\"><span class=\"gj-icon gj-icon-24\" style=\"--gj-icon:url('{ROOT}assets/icons/iconfont/icf_Arrow_left.svg')\" aria-hidden=\"true\"></span></button>{{/back}}</div><div class=\"gj-m-navbar-center\"><span class=\"gj-m-navbar-title\">{{title}}</span></div><div class=\"gj-m-navbar-right\">{{{right}}}</div></header>",
  "action": "<button class=\"gj-m-navbar-action\" type=\"button\" aria-label=\"{{label}}\"{{{attrs}}}><span class=\"gj-icon gj-icon-24\" style=\"--gj-icon:url('{ROOT}assets/icons/iconfont/{{icon}}.svg')\" aria-hidden=\"true\"></span></button>"
 },
 "notice": {
  "notice": "<div class=\"gj-m-notice{{#small}} gj-m-notice-small{{/small}}\" data-tone=\"{{tone}}\" role=\"status\"><span class=\"gj-icon\" style=\"--gj-icon:url('{ROOT}assets/icons/iconfont/{{icon}}.svg')\" aria-hidden=\"true\"></span><span class=\"gj-m-notice-text\">{{{text}}}</span></div>",
  "toast": "<div class=\"gj-m-toast-layer\" role=\"status\"><div class=\"gj-m-notice\" data-tone=\"default\"><span class=\"gj-m-notice-text\">{{text}}</span></div></div>"
 },
 "radio": {
  "group": "<div class=\"gj-m-radio-group\" role=\"radiogroup\" aria-label=\"{{label}}\" data-radios=\"{{key}}\">{{#items}}<label class=\"gj-m-radio\"><input type=\"radio\" class=\"gj-m-radio-input\" name=\"{{name}}\" value=\"{{text}}\"{{#checked}} checked{{/checked}}><span class=\"gj-m-radio-icon\" aria-hidden=\"true\"></span><span class=\"gj-m-radio-label\">{{text}}</span></label>{{/items}}</div>"
 },
 "searchbar": {
  "search": "<label class=\"gj-m-search{{#size}} gj-m-search-{{size}}{{/size}}{{#line}} gj-m-search-line{{/line}}{{#focused}} is-focused{{/focused}}\"><span class=\"gj-icon\" style=\"--gj-icon:url('{ROOT}assets/icons/iconfont/icf_system_search.svg')\" aria-hidden=\"true\"></span><input type=\"search\" enterkeyhint=\"search\" placeholder=\"{{placeholder}}\"{{#value}} value=\"{{value}}\"{{/value}} aria-label=\"{{placeholder}}\"><button type=\"button\" class=\"gj-m-search-clear\" aria-label=\"清除\"><span class=\"gj-icon\" style=\"--gj-icon:url('{ROOT}assets/icons/iconfont/icf_system_close-circle-fill.svg')\" aria-hidden=\"true\"></span></button></label>",
  "highlight": "<mark class=\"gj-m-search-highlight\">{{text}}</mark>"
 },
 "select": {
  "select": "<button type=\"button\" class=\"gj-m-select{{#date}} gj-m-datepicker{{/date}}{{#size}} gj-m-select-{{size}}{{/size}}\" aria-haspopup=\"dialog\" aria-expanded=\"false\"{{#error}} aria-invalid=\"true\"{{/error}} aria-label=\"{{label}}\" data-sel=\"{{key}}\">{{#date}}<span class=\"gj-icon\" style=\"--gj-icon:url('{ROOT}assets/icons/iconfont/icf_system_calendar.svg')\" aria-hidden=\"true\"></span>{{/date}}<span class=\"gj-m-select-value{{^value}} is-placeholder{{/value}}\">{{#value}}{{value}}{{/value}}{{^value}}{{placeholder}}{{/value}}</span>{{^date}}<span class=\"gj-m-select-arrow\"><span class=\"gj-icon\" aria-hidden=\"true\"></span></span>{{/date}}</button>"
 },
 "selection-list": {
  "chips": "<div class=\"gj-m-chip-group\" role=\"{{role}}\" aria-label=\"{{label}}\" data-chips=\"{{key}}\">{{#items}}<button type=\"button\" class=\"gj-m-chip\" {{{state}}} data-v=\"{{text}}\"><span class=\"gj-m-chip-text\">{{text}}</span><span class=\"gj-m-selection-indicator\"><span class=\"gj-icon\" aria-hidden=\"true\"></span></span></button>{{/items}}</div>",
  "single": "<div class=\"gj-m-selection\" role=\"radiogroup\"{{#label}} aria-label=\"{{label}}\"{{/label}}>{{#items}}<button type=\"button\" class=\"gj-m-selection-item\" role=\"radio\" aria-checked=\"{{on}}\" data-v=\"{{text}}\"><span class=\"gj-m-selection-item-content\"><span class=\"gj-m-selection-item-text\">{{text}}</span><span class=\"gj-m-selection-check\"><span class=\"gj-icon\" aria-hidden=\"true\"></span></span></span></button>{{/items}}</div>"
 },
 "skeleton": {
  "lines": "<div class=\"gj-m-skeleton is-animated\"{{#layout}} data-layout=\"{{layout}}\"{{/layout}} aria-hidden=\"true\">{{#avatar}}<div class=\"gj-m-skeleton-block gj-m-skeleton-avatar\"></div>{{/avatar}}{{#lines}}<div class=\"gj-m-skeleton-block gj-m-skeleton-text{{#tail}} gj-m-skeleton-tail{{/tail}}\" style=\"--gj-m-skeleton-width:{{w}}%\"></div>{{/lines}}</div>"
 },
 "steps": {
  "timeline": "<ol class=\"gj-m-steps\" data-direction=\"vertical\" data-time=\"true\"{{#size}} data-size=\"{{size}}\"{{/size}} aria-label=\"{{label}}\"{{#id}} id=\"{{id}}\"{{/id}}>{{#items}}<li class=\"gj-m-step\" data-state=\"{{state}}\"{{#current}} aria-current=\"step\"{{/current}}><div class=\"gj-m-step-mark\" aria-hidden=\"true\"><span class=\"gj-m-step-dot\"></span></div><time class=\"gj-m-step-time{{#placeholder}} is-placeholder{{/placeholder}}\">{{time}}</time><div class=\"gj-m-step-copy\"><p class=\"gj-m-step-title\">{{{title}}}</p>{{#desc}}<p class=\"gj-m-step-description\">{{{desc}}}</p>{{/desc}}{{{extra}}}</div></li>{{/items}}</ol>"
 },
 "tabbar": {
  "tabbar": "{{#safe}}<div class=\"gj-m-tabbar-safe\">{{/safe}}<nav class=\"gj-m-tabbar\" data-content=\"icon+text\" aria-label=\"一级导航\">{{#items}}<button type=\"button\" class=\"gj-m-tabbar-item{{#active}} is-active{{/active}}\" aria-current=\"{{#active}}page{{/active}}{{^active}}false{{/active}}\"><span class=\"gj-m-tabbar-icon\"><span class=\"gj-icon gj-icon-24 gj-icon-default\" style=\"--gj-icon:url('{ROOT}assets/icons/iconfont/{{icon}}.svg')\" aria-hidden=\"true\"></span><span class=\"gj-icon gj-icon-24 gj-icon-active\" style=\"--gj-icon:url('{ROOT}assets/icons/iconfont/{{iconOn}}.svg')\" aria-hidden=\"true\"></span>{{#dot}}<i class=\"gj-m-tabbar-dot\" aria-hidden=\"true\"></i>{{/dot}}</span><span class=\"gj-m-tabbar-label\">{{label}}</span></button>{{/items}}</nav>{{#safe}}</div>{{/safe}}"
 },
 "tabs": {
  "tabs": "<div class=\"gj-m-tabs\" role=\"tablist\" aria-label=\"{{label}}\" data-kind=\"{{kind}}\"{{#line}} data-line=\"{{line}}\"{{/line}}{{#size}} data-size=\"{{size}}\"{{/size}}{{#scroll}} data-scroll=\"true\"{{/scroll}}{{#inset}} data-inset=\"page\"{{/inset}}>{{#items}}<button type=\"button\" class=\"gj-m-tab\" role=\"tab\" aria-selected=\"{{selected}}\" tabindex=\"{{tabindex}}\" data-i=\"{{@index}}\"><span class=\"gj-m-tab-face\"><span class=\"gj-m-tab-label\">{{text}}{{#badge}}<span class=\"gj-m-tab-badge\" aria-label=\"{{badge}}项\">{{badge}}</span>{{/badge}}</span></span></button>{{/items}}</div>"
 },
 "tag": {
  "tag": "<span class=\"gj-m-tag{{#small}} gj-m-tag-small{{/small}} gj-m-tag-{{color}}{{#filled}} gj-m-tag-filled{{/filled}}{{#line}} gj-m-tag-line{{/line}}\">{{text}}</span>"
 },
 "text-button": {
  "textButton": "<button type=\"button\" class=\"gj-m-text-button{{#size}} gj-m-text-button-{{size}}{{/size}}{{#blue}} gj-m-text-button-blue{{/blue}}{{#cls}} {{cls}}{{/cls}}\"{{{attrs}}}{{#disabled}} disabled{{/disabled}}>{{{lead}}}{{text}}{{#arrow}}<span class=\"gj-icon\" style=\"--gj-icon:url('{ROOT}assets/icons/iconfont/icf_Arrow_right.svg')\" aria-hidden=\"true\"></span>{{/arrow}}{{#tail}}<span class=\"gj-icon\" style=\"--gj-icon:url('{ROOT}assets/icons/iconfont/{{tail}}.svg')\" aria-hidden=\"true\"></span>{{/tail}}</button>"
 },
 "upload": {
  "progress": "<ul class=\"gj-m-upload-list\"><li class=\"gj-m-upload-item is-uploading\"><span class=\"gj-m-upload-item-icon-slot\"><img class=\"gj-m-upload-item-icon\" src=\"{ROOT}assets/icons/fileicon/{{icon}}.svg\" alt=\"\"></span><span class=\"gj-m-upload-item-name\">{{name}}</span><span class=\"gj-m-upload-progress\" role=\"progressbar\" aria-label=\"{{name}} 上传进度\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"{{progress}}\"><span style=\"--gj-m-upload-progress:{{progress}}%\"></span></span><span class=\"gj-m-upload-item-percent\">{{progress}}%</span><button type=\"button\" class=\"gj-m-upload-item-remove\" aria-label=\"取消上传 {{name}}\"{{{attrs}}}><span class=\"gj-icon\" aria-hidden=\"true\"></span></button></li></ul>"
 }
};

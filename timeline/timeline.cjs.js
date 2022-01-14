'use strict';

var utils = require('primevue/utils');
var vue = require('vue');

var script = {
    name: 'Timeline',
    props: {
        value: null,
        align: {
            mode: String,
            default: 'left'
        },
        layout: {
            mode: String,
            default: 'vertical'
        },
        dataKey: null
    },
    methods: {
        getKey(item, index) {
            return this.dataKey ? utils.ObjectUtils.resolveFieldData(item, this.dataKey) : index;
        }
    },
    computed: {
        containerClass() {
            return [
                'p-timeline p-component',
                'p-timeline-' + this.align,
                'p-timeline-' + this.layout
            ];
        }
    }
};

const _hoisted_1 = { class: "p-timeline-event-opposite" };
const _hoisted_2 = { class: "p-timeline-event-separator" };
const _hoisted_3 = /*#__PURE__*/vue.createVNode("div", { class: "p-timeline-event-marker" }, null, -1 /* HOISTED */);
const _hoisted_4 = /*#__PURE__*/vue.createVNode("div", { class: "p-timeline-event-connector" }, null, -1 /* HOISTED */);
const _hoisted_5 = { class: "p-timeline-event-content" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (vue.openBlock(), vue.createBlock("div", { class: $options.containerClass }, [
    (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($props.value, (item, index) => {
      return (vue.openBlock(), vue.createBlock("div", {
        key: $options.getKey(item, index),
        class: "p-timeline-event"
      }, [
        vue.createVNode("div", _hoisted_1, [
          vue.renderSlot(_ctx.$slots, "opposite", {
            item: item,
            index: index
          })
        ]),
        vue.createVNode("div", _hoisted_2, [
          vue.renderSlot(_ctx.$slots, "marker", {
            item: item,
            index: index
          }, () => [
            _hoisted_3
          ]),
          (index !== ($props.value.length - 1))
            ? vue.renderSlot(_ctx.$slots, "connector", { key: 0 }, () => [
                _hoisted_4
              ])
            : vue.createCommentVNode("v-if", true)
        ]),
        vue.createVNode("div", _hoisted_5, [
          vue.renderSlot(_ctx.$slots, "content", {
            item: item,
            index: index
          })
        ])
      ]))
    }), 128 /* KEYED_FRAGMENT */))
  ], 2 /* CLASS */))
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "\n.p-timeline {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-flex: 1;\r\n        -ms-flex-positive: 1;\r\n            flex-grow: 1;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\n}\n.p-timeline-left .p-timeline-event-opposite {\r\n    text-align: right;\n}\n.p-timeline-left .p-timeline-event-content {\r\n    text-align: left;\n}\n.p-timeline-right .p-timeline-event {\r\n    -webkit-box-orient: horizontal;\r\n    -webkit-box-direction: reverse;\r\n        -ms-flex-direction: row-reverse;\r\n            flex-direction: row-reverse;\n}\n.p-timeline-right .p-timeline-event-opposite {\r\n    text-align: left;\n}\n.p-timeline-right .p-timeline-event-content {\r\n    text-align: right;\n}\n.p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(even) {\r\n    -webkit-box-orient: horizontal;\r\n    -webkit-box-direction: reverse;\r\n        -ms-flex-direction: row-reverse;\r\n            flex-direction: row-reverse;\n}\n.p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(odd) .p-timeline-event-opposite {\r\n    text-align: right;\n}\n.p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(odd) .p-timeline-event-content {\r\n    text-align: left;\n}\n.p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-opposite {\r\n    text-align: left;\n}\n.p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-content {\r\n    text-align: right;\n}\n.p-timeline-event {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    position: relative;\r\n    min-height: 70px;\n}\n.p-timeline-event:last-child {\r\n    min-height: 0;\n}\n.p-timeline-event-opposite {\r\n    -webkit-box-flex: 1;\r\n        -ms-flex: 1;\r\n            flex: 1;\r\n    padding: 0 1rem;\n}\n.p-timeline-event-content {\r\n    -webkit-box-flex: 1;\r\n        -ms-flex: 1;\r\n            flex: 1;\r\n    padding: 0 1rem;\n}\n.p-timeline-event-separator {\r\n    -webkit-box-flex: 0;\r\n        -ms-flex: 0;\r\n            flex: 0;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\n}\n.p-timeline-event-marker {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -ms-flex-item-align: baseline;\r\n        align-self: baseline;\n}\n.p-timeline-event-connector {\r\n    -webkit-box-flex: 1;\r\n        -ms-flex-positive: 1;\r\n            flex-grow: 1;\n}\n.p-timeline-horizontal {\r\n    -webkit-box-orient: horizontal;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: row;\r\n            flex-direction: row;\n}\n.p-timeline-horizontal .p-timeline-event {\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\r\n    -webkit-box-flex: 1;\r\n        -ms-flex: 1;\r\n            flex: 1;\n}\n.p-timeline-horizontal .p-timeline-event:last-child {\r\n    -webkit-box-flex: 0;\r\n        -ms-flex: 0;\r\n            flex: 0;\n}\n.p-timeline-horizontal .p-timeline-event-separator {\r\n    -webkit-box-orient: horizontal;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: row;\r\n            flex-direction: row;\n}\n.p-timeline-horizontal .p-timeline-event-connector  {\r\n    width: 100%;\n}\n.p-timeline-bottom .p-timeline-event {\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: reverse;\r\n        -ms-flex-direction: column-reverse;\r\n            flex-direction: column-reverse;\n}\n.p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(even) {\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: reverse;\r\n        -ms-flex-direction: column-reverse;\r\n            flex-direction: column-reverse;\n}\r\n";
styleInject(css_248z);

script.render = render;
script.__file = "src/components/timeline/Timeline.vue";

module.exports = script;

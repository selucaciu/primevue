'use strict';

var utils = require('primevue/utils');
var Ripple = require('primevue/ripple');
var vue = require('vue');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Ripple__default = /*#__PURE__*/_interopDefaultLegacy(Ripple);

var script = {
    name: 'Panel',
    emits: ['update:collapsed', 'toggle'],
    props: {
        header: String,
        toggleable: Boolean,
        collapsed: Boolean
    },
    data() {
        return {
            d_collapsed: this.collapsed
        }
    },
    watch: {
        collapsed(newValue) {
            this.d_collapsed = newValue;
        }
    },
    methods: {
        toggle(event) {
            this.d_collapsed = !this.d_collapsed;
            this.$emit('update:collapsed', this.d_collapsed);
            this.$emit('toggle', {
                originalEvent: event,
                value: this.d_collapsed
            });
        }
    },
    computed: {
        ariaId() {
            return utils.UniqueComponentId();
        },
        containerClass() {
            return ['p-panel p-component', {'p-panel-toggleable': this.toggleable}];
        }
    },
    directives: {
        'ripple': Ripple__default["default"]
    }
};

const _hoisted_1 = { class: "p-panel-header" };
const _hoisted_2 = { class: "p-panel-icons" };
const _hoisted_3 = { class: "p-panel-content" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = vue.resolveDirective("ripple");

  return (vue.openBlock(), vue.createBlock("div", { class: $options.containerClass }, [
    vue.createVNode("div", _hoisted_1, [
      vue.renderSlot(_ctx.$slots, "header", {}, () => [
        ($props.header)
          ? (vue.openBlock(), vue.createBlock("span", {
              key: 0,
              class: "p-panel-title",
              id: $options.ariaId + '_header'
            }, vue.toDisplayString($props.header), 9 /* TEXT, PROPS */, ["id"]))
          : vue.createCommentVNode("v-if", true)
      ]),
      vue.createVNode("div", _hoisted_2, [
        vue.renderSlot(_ctx.$slots, "icons"),
        ($props.toggleable)
          ? vue.withDirectives((vue.openBlock(), vue.createBlock("button", {
              key: 0,
              class: "p-panel-header-icon p-panel-toggler p-link",
              onClick: _cache[1] || (_cache[1] = (...args) => ($options.toggle && $options.toggle(...args))),
              type: "button",
              id: $options.ariaId +  '_header',
              "aria-controls": $options.ariaId + '_content',
              "aria-expanded": !$data.d_collapsed
            }, [
              vue.createVNode("span", {
                class: {'pi pi-minus': !$data.d_collapsed, 'pi pi-plus': $data.d_collapsed}
              }, null, 2 /* CLASS */)
            ], 8 /* PROPS */, ["id", "aria-controls", "aria-expanded"])), [
              [_directive_ripple]
            ])
          : vue.createCommentVNode("v-if", true)
      ])
    ]),
    vue.createVNode(vue.Transition, { name: "p-toggleable-content" }, {
      default: vue.withCtx(() => [
        vue.withDirectives(vue.createVNode("div", {
          class: "p-toggleable-content",
          role: "region",
          id: $options.ariaId + '_content',
          "aria-labelledby": $options.ariaId + '_header'
        }, [
          vue.createVNode("div", _hoisted_3, [
            vue.renderSlot(_ctx.$slots, "default")
          ])
        ], 8 /* PROPS */, ["id", "aria-labelledby"]), [
          [vue.vShow, !$data.d_collapsed]
        ])
      ]),
      _: 3 /* FORWARDED */
    })
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

var css_248z = "\n.p-panel-header {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-pack: justify;\r\n        -ms-flex-pack: justify;\r\n            justify-content: space-between;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\n}\n.p-panel-title {\r\n    line-height: 1;\n}\n.p-panel-header-icon {\r\n    display: -webkit-inline-box;\r\n    display: -ms-inline-flexbox;\r\n    display: inline-flex;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    cursor: pointer;\r\n    text-decoration: none;\r\n    overflow: hidden;\r\n    position: relative;\n}\r\n";
styleInject(css_248z);

script.render = render;

module.exports = script;

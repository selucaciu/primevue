'use strict';

var Ripple = require('primevue/ripple');
var vue = require('vue');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Ripple__default = /*#__PURE__*/_interopDefaultLegacy(Ripple);

var script = {
    name: 'Message',
    emits: ['close'],
    props: {
        severity: {
            type: String,
            default: 'info'
        },
        closable: {
            type: Boolean,
            default: true
        },
        sticky: {
            type: Boolean,
            default: true
        },
        life: {
            type: Number,
            default: 3000
        },
        icon: {
            type: String,
            default: null
        },
    },
    timeout: null,
    data() {
        return {
            visible: true
        }
    },
    mounted() {
        if (!this.sticky) {
            setTimeout(() => {
                this.visible = false;
            }, this.life);
        }
    },
    methods: {
        close(event) {
            this.visible = false;
            this.$emit('close', event);
        }
    },
    computed: {
        containerClass() {
            return 'p-message p-component p-message-' + this.severity;
        },
        iconClass() {
            return ['p-message-icon pi', this.icon ? this.icon : {
                'pi-info-circle': this.severity === 'info',
                'pi-check': this.severity === 'success',
                'pi-exclamation-triangle': this.severity === 'warn',
                'pi-times-circle': this.severity === 'error'
            }];
        }
    },
    directives: {
        'ripple': Ripple__default["default"]
    }
};

const _hoisted_1 = { class: "p-message-wrapper" };
const _hoisted_2 = { class: "p-message-text" };
const _hoisted_3 = /*#__PURE__*/vue.createVNode("i", { class: "p-message-close-icon pi pi-times" }, null, -1 /* HOISTED */);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = vue.resolveDirective("ripple");

  return (vue.openBlock(), vue.createBlock(vue.Transition, {
    name: "p-message",
    appear: ""
  }, {
    default: vue.withCtx(() => [
      vue.withDirectives(vue.createVNode("div", {
        class: $options.containerClass,
        role: "alert"
      }, [
        vue.createVNode("div", _hoisted_1, [
          vue.createVNode("span", { class: $options.iconClass }, null, 2 /* CLASS */),
          vue.createVNode("div", _hoisted_2, [
            vue.renderSlot(_ctx.$slots, "default")
          ]),
          ($props.closable)
            ? vue.withDirectives((vue.openBlock(), vue.createBlock("button", {
                key: 0,
                class: "p-message-close p-link",
                onClick: _cache[1] || (_cache[1] = $event => ($options.close($event))),
                type: "button"
              }, [
                _hoisted_3
              ], 512 /* NEED_PATCH */)), [
                [_directive_ripple]
              ])
            : vue.createCommentVNode("v-if", true)
        ])
      ], 2 /* CLASS */), [
        [vue.vShow, $data.visible]
      ])
    ]),
    _: 3 /* FORWARDED */
  }))
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

var css_248z = "\n.p-message-wrapper {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\n}\n.p-message-close {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\n}\n.p-message-close.p-link {\r\n    margin-left: auto;\r\n    overflow: hidden;\r\n    position: relative;\n}\n.p-message-enter-from {\r\n    opacity: 0;\n}\n.p-message-enter-active {\r\n    -webkit-transition: opacity .3s;\r\n    transition: opacity .3s;\n}\n.p-message.p-message-leave-from {\r\n    max-height: 1000px;\n}\n.p-message.p-message-leave-to {\r\n    max-height: 0;\r\n    opacity: 0;\r\n    margin: 0 !important;\n}\n.p-message-leave-active {\r\n    overflow: hidden;\r\n    -webkit-transition: max-height .3s cubic-bezier(0, 1, 0, 1), opacity .3s, margin .15s;\r\n    transition: max-height .3s cubic-bezier(0, 1, 0, 1), opacity .3s, margin .15s;\n}\n.p-message-leave-active .p-message-close {\r\n    display: none;\n}\r\n";
styleInject(css_248z);

script.render = render;

module.exports = script;

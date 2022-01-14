'use strict';

var ToastEventBus = require('primevue/toasteventbus');
var Ripple = require('primevue/ripple');
var vue = require('vue');
var utils = require('primevue/utils');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var ToastEventBus__default = /*#__PURE__*/_interopDefaultLegacy(ToastEventBus);
var Ripple__default = /*#__PURE__*/_interopDefaultLegacy(Ripple);

var script$1 = {
    name: 'ToastMessage',
    emits: ['close'],
    props: {
        message: null,
        template: null
    },
    closeTimeout: null,
    mounted() {
        if (this.message.life) {
            this.closeTimeout = setTimeout(() => {
                this.close();
            }, this.message.life);
        }
    },
    beforeUnmount() {
        this.clearCloseTimeout();
    },
    methods: {
        close() {
            this.$emit('close', this.message);
        },
        onCloseClick() {
            this.clearCloseTimeout();
            this.close();
        },
        clearCloseTimeout() {
            if (this.closeTimeout) {
                clearTimeout(this.closeTimeout);
                this.closeTimeout = null;
            }
        }
    },
    computed: {
        containerClass() {
            return ['p-toast-message', this.message.styleClass, {
                'p-toast-message-info': this.message.severity === 'info',
                'p-toast-message-warn': this.message.severity === 'warn',
                'p-toast-message-error': this.message.severity === 'error',
                'p-toast-message-success': this.message.severity === 'success'
            }];
        },
        iconClass() {
            return ['p-toast-message-icon pi', {
                'pi-info-circle': this.message.severity === 'info',
                'pi-exclamation-triangle': this.message.severity === 'warn',
                'pi-times': this.message.severity === 'error',
                'pi-check': this.message.severity === 'success'
            }];
        }
    },
    directives: {
        'ripple': Ripple__default["default"]
    }
};

const _hoisted_1 = { class: "p-toast-message-text" };
const _hoisted_2 = { class: "p-toast-summary" };
const _hoisted_3 = { class: "p-toast-detail" };
const _hoisted_4 = /*#__PURE__*/vue.createVNode("span", { class: "p-toast-icon-close-icon pi pi-times" }, null, -1 /* HOISTED */);

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = vue.resolveDirective("ripple");

  return (vue.openBlock(), vue.createBlock("div", {
    class: $options.containerClass,
    role: "alert",
    "aria-live": "assertive",
    "aria-atomic": "true"
  }, [
    vue.createVNode("div", {
      class: ["p-toast-message-content", $props.message.contentStyleClass]
    }, [
      (!$props.template)
        ? (vue.openBlock(), vue.createBlock(vue.Fragment, { key: 0 }, [
            vue.createVNode("span", { class: $options.iconClass }, null, 2 /* CLASS */),
            vue.createVNode("div", _hoisted_1, [
              vue.createVNode("span", _hoisted_2, vue.toDisplayString($props.message.summary), 1 /* TEXT */),
              vue.createVNode("div", _hoisted_3, vue.toDisplayString($props.message.detail), 1 /* TEXT */)
            ])
          ], 64 /* STABLE_FRAGMENT */))
        : (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent($props.template), {
            key: 1,
            message: $props.message
          }, null, 8 /* PROPS */, ["message"])),
      ($props.message.closable !== false)
        ? vue.withDirectives((vue.openBlock(), vue.createBlock("button", {
            key: 2,
            class: "p-toast-icon-close p-link",
            onClick: _cache[1] || (_cache[1] = (...args) => ($options.onCloseClick && $options.onCloseClick(...args))),
            type: "button"
          }, [
            _hoisted_4
          ], 512 /* NEED_PATCH */)), [
            [_directive_ripple]
          ])
        : vue.createCommentVNode("v-if", true)
    ], 2 /* CLASS */)
  ], 2 /* CLASS */))
}

script$1.render = render$1;

var messageIdx = 0;

var script = {
    name: 'Toast',
    inheritAttrs: false,
    props: {
        group: {
            type: String,
            default: null
        },
        position: {
            type: String,
            default: 'top-right'
        },
        autoZIndex: {
            type: Boolean,
            default: true
        },
        baseZIndex: {
            type: Number,
            default: 0
        },
        breakpoints: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            messages: []
        }
    },
    styleElement: null,
    mounted() {
        ToastEventBus__default["default"].on('add', this.onAdd);
        ToastEventBus__default["default"].on('remove-group', this.onRemoveGroup);
        ToastEventBus__default["default"].on('remove-all-groups', this.onRemoveAllGroups);

        if (this.breakpoints) {
            this.createStyle();
        }
    },
    beforeUnmount() {
        this.destroyStyle();

        if (this.$refs.container && this.autoZIndex) {
            utils.ZIndexUtils.clear(this.$refs.container);
        }

        ToastEventBus__default["default"].off('add', this.onAdd);
        ToastEventBus__default["default"].off('remove-group', this.onRemoveGroup);
        ToastEventBus__default["default"].off('remove-all-groups', this.onRemoveAllGroups);
    },
    methods: {
        add(message) {
            if (message.id == null) {
                message.id = messageIdx++;
            }

            this.messages = [...this.messages, message];
        },
        remove(message) {
            let index = -1;
            for (let i = 0; i < this.messages.length; i++) {
                if (this.messages[i] === message) {
                    index = i;
                    break;
                }
            }

            this.messages.splice(index, 1);
        },
        onAdd(message) {
            if (this.group == message.group) {
                this.add(message);
            }
        },
        onRemoveGroup(group) {
            if (this.group === group) {
                this.messages = [];
            }
        },
        onRemoveAllGroups() {
            this.messages = [];
        },
        onEnter() {
            this.$refs.container.setAttribute(this.attributeSelector, '');

            if (this.autoZIndex) {
                utils.ZIndexUtils.set('modal', this.$refs.container, this.baseZIndex || this.$primevue.config.zIndex.modal);
            }
        },
        onLeave() {
            if (this.$refs.container && this.autoZIndex) {
                utils.ZIndexUtils.clear(this.$refs.container);
            }
        },
        createStyle() {
            if (!this.styleElement) {
                this.styleElement = document.createElement('style');
                this.styleElement.type = 'text/css';
                document.head.appendChild(this.styleElement);

                let innerHTML = '';
                for (let breakpoint in this.breakpoints) {
                    let breakpointStyle = '';
                    for (let styleProp in this.breakpoints[breakpoint]) {
                        breakpointStyle += styleProp + ':' + this.breakpoints[breakpoint][styleProp] + '!important;';
                    }
                    innerHTML += `
                        @media screen and (max-width: ${breakpoint}) {
                            .p-toast[${this.attributeSelector}] {
                                ${breakpointStyle}
                            }
                        }
                    `;
                }

                this.styleElement.innerHTML = innerHTML;
            }
        },
        destroyStyle() {
            if (this.styleElement) {
                document.head.removeChild(this.styleElement);
                this.styleElement = null;
            }
        }
    },
    components: {
        'ToastMessage': script$1
    },
    computed: {
        containerClass() {
            return ['p-toast p-component p-toast-' + this.position, {
                'p-input-filled': this.$primevue.config.inputStyle === 'filled',
                'p-ripple-disabled': this.$primevue.config.ripple === false
            }];
        },
        attributeSelector() {
            return utils.UniqueComponentId();
        }
    }
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ToastMessage = vue.resolveComponent("ToastMessage");

  return (vue.openBlock(), vue.createBlock(vue.Teleport, { to: "body" }, [
    vue.createVNode("div", vue.mergeProps({
      ref: "container",
      class: $options.containerClass
    }, _ctx.$attrs), [
      vue.createVNode(vue.TransitionGroup, {
        name: "p-toast-message",
        tag: "div",
        onEnter: $options.onEnter,
        onLeave: $options.onLeave
      }, {
        default: vue.withCtx(() => [
          (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($data.messages, (msg) => {
            return (vue.openBlock(), vue.createBlock(_component_ToastMessage, {
              key: msg.id,
              message: msg,
              onClose: _cache[1] || (_cache[1] = $event => ($options.remove($event))),
              template: _ctx.$slots.message
            }, null, 8 /* PROPS */, ["message", "template"]))
          }), 128 /* KEYED_FRAGMENT */))
        ]),
        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["onEnter", "onLeave"])
    ], 16 /* FULL_PROPS */)
  ]))
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

var css_248z = "\n.p-toast {\r\n    position: fixed;\r\n    width: 25rem;\n}\n.p-toast-message-content {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: start;\r\n        -ms-flex-align: start;\r\n            align-items: flex-start;\n}\n.p-toast-message-text {\r\n    -webkit-box-flex: 1;\r\n        -ms-flex: 1 1 auto;\r\n            flex: 1 1 auto;\n}\n.p-toast-top-right {\r\n\ttop: 20px;\r\n\tright: 20px;\n}\n.p-toast-top-left {\r\n\ttop: 20px;\r\n\tleft: 20px;\n}\n.p-toast-bottom-left {\r\n\tbottom: 20px;\r\n\tleft: 20px;\n}\n.p-toast-bottom-right {\r\n\tbottom: 20px;\r\n\tright: 20px;\n}\n.p-toast-top-center {\r\n\ttop: 20px;\r\n    left: 50%;\r\n    -webkit-transform: translateX(-50%);\r\n            transform: translateX(-50%);\n}\n.p-toast-bottom-center {\r\n\tbottom: 20px;\r\n    left: 50%;\r\n    -webkit-transform: translateX(-50%);\r\n            transform: translateX(-50%);\n}\n.p-toast-center {\r\n\tleft: 50%;\r\n\ttop: 50%;\r\n    min-width: 20vw;\r\n    -webkit-transform: translate(-50%, -50%);\r\n            transform: translate(-50%, -50%);\n}\n.p-toast-icon-close {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    overflow: hidden;\r\n    position: relative;\n}\n.p-toast-icon-close.p-link {\r\n\tcursor: pointer;\n}\r\n\r\n/* Animations */\n.p-toast-message-enter-from {\r\n    opacity: 0;\r\n    -webkit-transform: translateY(50%);\r\n    transform: translateY(50%);\n}\n.p-toast-message-leave-from {\r\n    max-height: 1000px;\n}\n.p-toast .p-toast-message.p-toast-message-leave-to {\r\n    max-height: 0;\r\n    opacity: 0;\r\n    margin-bottom: 0;\r\n    overflow: hidden;\n}\n.p-toast-message-enter-active {\r\n    -webkit-transition: transform .3s, opacity .3s;\r\n    -webkit-transition: opacity .3s, -webkit-transform .3s;\r\n    transition: opacity .3s, -webkit-transform .3s;\r\n    transition: transform .3s, opacity .3s;\r\n    transition: transform .3s, opacity .3s, -webkit-transform .3s;\n}\n.p-toast-message-leave-active {\r\n    -webkit-transition: max-height .45s cubic-bezier(0, 1, 0, 1), opacity .3s, margin-bottom .3s;\r\n    transition: max-height .45s cubic-bezier(0, 1, 0, 1), opacity .3s, margin-bottom .3s;\n}\r\n";
styleInject(css_248z);

script.render = render;

module.exports = script;
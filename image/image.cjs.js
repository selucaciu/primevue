'use strict';

var utils = require('primevue/utils');
var vue = require('vue');

var script = {
    name: 'Image',
    inheritAttrs: false,
    props: {
        preview: {
            type: Boolean,
            default: false
        },
        class: null,
        style: null,
        imageStyle: null,
        imageClass: null
    },
    mask: null,
    data() {
        return {
            maskVisible: false,
            previewVisible: false,
            rotate: 0,
            scale: 1
        }
    },
    beforeUnmount() {
        if (this.mask) {
            utils.ZIndexUtils.clear(this.container);
        }
    },
    methods: {
        maskRef(el) {
            this.mask = el;
        },
        toolbarRef(el) {
            this.toolbarRef = el;
        },
        onImageClick() {
            if (this.preview) {
                this.maskVisible = true;
                setTimeout(() => {
                    this.previewVisible = true;
                }, 25);
            }
        },
        onPreviewImageClick() {
            this.previewClick = true;
        },
        onMaskClick() {
            if (!this.previewClick) {
                this.previewVisible = false;
                this.rotate = 0;
                this.scale = 1;
            }

            this.previewClick = false;
        },
        rotateRight() {
            this.rotate += 90;
            this.previewClick = true;
        },
        rotateLeft() {
            this.rotate -= 90;
            this.previewClick = true;
        },
        zoomIn() {
            this.scale = this.scale + 0.1;
            this.previewClick = true;
        },
        zoomOut() {
            this.scale = this.scale - 0.1;
            this.previewClick = true;
        },
        onBeforeEnter() {
            utils.ZIndexUtils.set('modal', this.mask, this.$primevue.config.zIndex.modal);
        },
        onEnter() {
            this.$emit('show');
        },
        onBeforeLeave() {
            utils.DomHandler.addClass(this.mask, 'p-component-overlay-leave');
        },
        onLeave() {
            this.$emit('hide');
        },
        onAfterLeave(el) {
            utils.ZIndexUtils.clear(el);
            this.maskVisible = false;
        }
    },
    computed: {
        containerClass() {
            return ['p-image p-component', this.class, {
                'p-image-preview-container': this.preview
            }];
        },
        maskClass() {
            return ['p-image-mask p-component-overlay p-component-overlay-enter'];
        },
        rotateClass() {
            return 'p-image-preview-rotate-' + this.rotate;
        },
        imagePreviewStyle() {
            return {transform: 'rotate(' + this.rotate + 'deg) scale(' + this.scale + ')'};
        },
        zoomDisabled() {
            return this.scale <= 0.5 || this.scale >= 1.5;
        }
    }
};

const _hoisted_1 = /*#__PURE__*/vue.createVNode("i", { class: "p-image-preview-icon pi pi-eye" }, null, -1 /* HOISTED */);
const _hoisted_2 = { class: "p-image-toolbar" };
const _hoisted_3 = /*#__PURE__*/vue.createVNode("i", { class: "pi pi-refresh" }, null, -1 /* HOISTED */);
const _hoisted_4 = /*#__PURE__*/vue.createVNode("i", { class: "pi pi-undo" }, null, -1 /* HOISTED */);
const _hoisted_5 = /*#__PURE__*/vue.createVNode("i", { class: "pi pi-search-minus" }, null, -1 /* HOISTED */);
const _hoisted_6 = /*#__PURE__*/vue.createVNode("i", { class: "pi pi-search-plus" }, null, -1 /* HOISTED */);
const _hoisted_7 = /*#__PURE__*/vue.createVNode("i", { class: "pi pi-times" }, null, -1 /* HOISTED */);
const _hoisted_8 = { key: 0 };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (vue.openBlock(), vue.createBlock("span", {
    class: $options.containerClass,
    style: $props.style
  }, [
    vue.createVNode("img", vue.mergeProps(_ctx.$attrs, {
      style: $props.imageStyle,
      class: $props.imageClass
    }), null, 16 /* FULL_PROPS */),
    ($props.preview)
      ? (vue.openBlock(), vue.createBlock("div", {
          key: 0,
          class: "p-image-preview-indicator",
          onClick: _cache[1] || (_cache[1] = (...args) => ($options.onImageClick && $options.onImageClick(...args)))
        }, [
          vue.renderSlot(_ctx.$slots, "indicator", {}, () => [
            _hoisted_1
          ])
        ]))
      : vue.createCommentVNode("v-if", true),
    (vue.openBlock(), vue.createBlock(vue.Teleport, { to: "body" }, [
      ($data.maskVisible)
        ? (vue.openBlock(), vue.createBlock("div", {
            key: 0,
            ref: $options.maskRef,
            class: $options.maskClass,
            onClick: _cache[8] || (_cache[8] = (...args) => ($options.onMaskClick && $options.onMaskClick(...args)))
          }, [
            vue.createVNode("div", _hoisted_2, [
              vue.createVNode("button", {
                class: "p-image-action p-link",
                onClick: _cache[2] || (_cache[2] = (...args) => ($options.rotateRight && $options.rotateRight(...args))),
                type: "button"
              }, [
                _hoisted_3
              ]),
              vue.createVNode("button", {
                class: "p-image-action p-link",
                onClick: _cache[3] || (_cache[3] = (...args) => ($options.rotateLeft && $options.rotateLeft(...args))),
                type: "button"
              }, [
                _hoisted_4
              ]),
              vue.createVNode("button", {
                class: "p-image-action p-link",
                onClick: _cache[4] || (_cache[4] = (...args) => ($options.zoomOut && $options.zoomOut(...args))),
                type: "button",
                disabled: $options.zoomDisabled
              }, [
                _hoisted_5
              ], 8 /* PROPS */, ["disabled"]),
              vue.createVNode("button", {
                class: "p-image-action p-link",
                onClick: _cache[5] || (_cache[5] = (...args) => ($options.zoomIn && $options.zoomIn(...args))),
                type: "button",
                disabled: $options.zoomDisabled
              }, [
                _hoisted_6
              ], 8 /* PROPS */, ["disabled"]),
              vue.createVNode("button", {
                class: "p-image-action p-link",
                type: "button",
                onClick: _cache[6] || (_cache[6] = (...args) => (_ctx.hidePreview && _ctx.hidePreview(...args)))
              }, [
                _hoisted_7
              ])
            ]),
            vue.createVNode(vue.Transition, {
              name: "p-image-preview",
              onBeforeEnter: $options.onBeforeEnter,
              onEnter: $options.onEnter,
              onLeave: $options.onLeave,
              onBeforeLeave: $options.onBeforeLeave,
              onAfterLeave: $options.onAfterLeave
            }, {
              default: vue.withCtx(() => [
                ($data.previewVisible)
                  ? (vue.openBlock(), vue.createBlock("div", _hoisted_8, [
                      vue.createVNode("img", {
                        src: _ctx.$attrs.src,
                        class: "p-image-preview",
                        style: $options.imagePreviewStyle,
                        onClick: _cache[7] || (_cache[7] = (...args) => ($options.onPreviewImageClick && $options.onPreviewImageClick(...args)))
                      }, null, 12 /* STYLE, PROPS */, ["src"])
                    ]))
                  : vue.createCommentVNode("v-if", true)
              ]),
              _: 1 /* STABLE */
            }, 8 /* PROPS */, ["onBeforeEnter", "onEnter", "onLeave", "onBeforeLeave", "onAfterLeave"])
          ], 2 /* CLASS */))
        : vue.createCommentVNode("v-if", true)
    ]))
  ], 6 /* CLASS, STYLE */))
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

var css_248z = "\n.p-image-mask {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\n}\n.p-image-preview-container {\r\n    position: relative;\r\n    display: inline-block;\n}\n.p-image-preview-indicator {\r\n    position: absolute;\r\n    left: 0;\r\n    top: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    opacity: 0;\r\n    -webkit-transition: opacity .3s;\r\n    transition: opacity .3s;\n}\n.p-image-preview-icon {\r\n    font-size: 1.5rem;\n}\n.p-image-preview-container:hover > .p-image-preview-indicator {\r\n    opacity: 1;\r\n    cursor: pointer;\n}\n.p-image-preview-container > img {\r\n    cursor: pointer;\n}\n.p-image-toolbar {\r\n    position: absolute;\r\n    top: 0;\r\n    right: 0;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\n}\n.p-image-action.p-link {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\n}\n.p-image-preview {\r\n    -webkit-transition: -webkit-transform .15s;\r\n    transition: -webkit-transform .15s;\r\n    transition: transform .15s;\r\n    transition: transform .15s, -webkit-transform .15s;\r\n    max-width: 100vw;\r\n    max-height: 100vh;\n}\n.p-image-preview-enter-active {\r\n    -webkit-transition: all 150ms cubic-bezier(0, 0, 0.2, 1);\r\n    transition: all 150ms cubic-bezier(0, 0, 0.2, 1);\n}\n.p-image-preview-leave-active {\r\n    -webkit-transition: all 150ms cubic-bezier(0.4, 0.0, 0.2, 1);\r\n    transition: all 150ms cubic-bezier(0.4, 0.0, 0.2, 1);\n}\n.p-image-preview-enter-from,\r\n.p-image-preview-leave-to {\r\n    opacity: 0;\r\n    -webkit-transform: scale(0.7);\r\n            transform: scale(0.7);\n}\r\n";
styleInject(css_248z);

script.render = render;
script.__file = "src/components/image/Image.vue";

module.exports = script;

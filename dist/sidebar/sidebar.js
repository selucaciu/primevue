this.primevue = this.primevue || {};
this.primevue.sidebar = (function (utils, Ripple, vue) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var Ripple__default = /*#__PURE__*/_interopDefaultLegacy(Ripple);

    var script = {
        name: 'Sidebar',
        emits: ['update:visible', 'show', 'hide'],
        inheritAttrs: false,
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            position: {
                type: String,
                default: 'left'
            },
            baseZIndex: {
                type: Number,
                default: 0
            },
            autoZIndex: {
                type: Boolean,
                default: true
            },
            dismissable: {
                type: Boolean,
                default: true
            },
            showCloseIcon: {
                type: Boolean,
                default: true
            },
            modal: {
                type: Boolean,
                default: true
            },
            ariaCloseLabel: {
                type: String,
                default: 'close'
            }
        },
        mask: null,
        maskClickListener: null,
        container: null,
        beforeUnmount() {
            this.destroyModal();

            if (this.container && this.autoZIndex) {
                utils.ZIndexUtils.clear(this.container);
            }
            this.container = null;
        },
        methods: {
            hide() {
                this.$emit('update:visible', false);
            },
            onEnter(el) {
                this.$emit('show');

                if (this.autoZIndex) {
                    utils.ZIndexUtils.set('modal', el, this.baseZIndex || this.$primevue.config.zIndex.modal);
                }
                this.focus();
                if (this.modal && !this.fullScreen) {
                    this.enableModality();
                }
            },
            onLeave() {
                this.$emit('hide');

                if (this.modal && !this.fullScreen) {
                    this.disableModality();
                }
            },
            onAfterLeave(el) {
                if (this.autoZIndex) {
                    utils.ZIndexUtils.clear(el);
                }
            },
            focus() {
                let focusable = utils.DomHandler.findSingle(this.container, 'input,button');
                if (focusable) {
                    focusable.focus();
                }
            },
            enableModality() {
                if (!this.mask) {
                    this.mask = document.createElement('div');
                    this.mask.setAttribute('class', 'p-sidebar-mask p-component-overlay p-component-overlay-enter');
                    this.mask.style.zIndex = String(parseInt(this.container.style.zIndex, 10) - 1);
                    if (this.dismissable) {
                        this.bindMaskClickListener();
                    }
                    document.body.appendChild(this.mask);
                    utils.DomHandler.addClass(document.body, 'p-overflow-hidden');
                }
            },
            disableModality() {
                if (this.mask) {
                    utils.DomHandler.addClass(this.mask, 'p-component-overlay-leave');
                    this.mask.addEventListener('animationend', () => {
                        this.destroyModal();
                    });
                }
            },
            bindMaskClickListener() {
                if (!this.maskClickListener) {
                    this.maskClickListener = () => {
                        this.hide();
                    };
                    this.mask.addEventListener('click', this.maskClickListener);
                }
            },
            unbindMaskClickListener() {
                if (this.maskClickListener) {
                    this.mask.removeEventListener('click', this.maskClickListener);
                    this.maskClickListener = null;
                }
            },
            destroyModal() {
                if (this.mask) {
                    this.unbindMaskClickListener();
                    document.body.removeChild(this.mask);
                    utils.DomHandler.removeClass(document.body, 'p-overflow-hidden');
                    this.mask = null;
                }
            },
            containerRef(el) {
                this.container = el;
            }
        },
        computed: {
            containerClass() {
                return ['p-sidebar p-component p-sidebar-' + this.position , {
                    'p-sidebar-active': this.visible,
                    'p-input-filled': this.$primevue.config.inputStyle === 'filled',
                    'p-ripple-disabled': this.$primevue.config.ripple === false
                }];
            },
            fullScreen() {
                return this.position === 'full';
            }
        },
        directives: {
            'ripple': Ripple__default["default"]
        }
    };

    const _hoisted_1 = { class: "p-sidebar-header" };
    const _hoisted_2 = /*#__PURE__*/vue.createVNode("span", { class: "p-sidebar-close-icon pi pi-times" }, null, -1 /* HOISTED */);
    const _hoisted_3 = { class: "p-sidebar-content" };

    function render(_ctx, _cache, $props, $setup, $data, $options) {
      const _directive_ripple = vue.resolveDirective("ripple");

      return (vue.openBlock(), vue.createBlock(vue.Teleport, { to: "body" }, [
        vue.createVNode(vue.Transition, {
          name: "p-sidebar",
          onEnter: $options.onEnter,
          onLeave: $options.onLeave,
          onAfterLeave: $options.onAfterLeave,
          appear: ""
        }, {
          default: vue.withCtx(() => [
            ($props.visible)
              ? (vue.openBlock(), vue.createBlock("div", vue.mergeProps({
                  key: 0,
                  class: $options.containerClass,
                  ref: $options.containerRef,
                  role: "complementary",
                  "aria-modal": $props.modal
                }, _ctx.$attrs), [
                  vue.createVNode("div", _hoisted_1, [
                    ($props.showCloseIcon)
                      ? vue.withDirectives((vue.openBlock(), vue.createBlock("button", {
                          key: 0,
                          class: "p-sidebar-close p-sidebar-icon p-link",
                          onClick: _cache[1] || (_cache[1] = (...args) => ($options.hide && $options.hide(...args))),
                          "aria-label": $props.ariaCloseLabel,
                          type: "button"
                        }, [
                          _hoisted_2
                        ], 8 /* PROPS */, ["aria-label"])), [
                          [_directive_ripple]
                        ])
                      : vue.createCommentVNode("v-if", true)
                  ]),
                  vue.createVNode("div", _hoisted_3, [
                    vue.renderSlot(_ctx.$slots, "default")
                  ])
                ], 16 /* FULL_PROPS */, ["aria-modal"]))
              : vue.createCommentVNode("v-if", true)
          ]),
          _: 3 /* FORWARDED */
        }, 8 /* PROPS */, ["onEnter", "onLeave", "onAfterLeave"])
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

    var css_248z = "\n.p-sidebar {\r\n    position: fixed;\r\n    -webkit-transition: -webkit-transform .3s;\r\n    transition: -webkit-transform .3s;\r\n    transition: transform .3s;\r\n    transition: transform .3s, -webkit-transform .3s;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\n}\n.p-sidebar-content {\r\n    position: relative;\r\n    overflow-y: auto;\n}\n.p-sidebar-header {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: end;\r\n        -ms-flex-pack: end;\r\n            justify-content: flex-end;\n}\n.p-sidebar-icon {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\n}\n.p-sidebar-left {\r\n    top: 0;\r\n    left: 0;\r\n    width: 20rem;\r\n    height: 100%;\n}\n.p-sidebar-right {\r\n    top: 0;\r\n    right: 0;\r\n    width: 20rem;\r\n    height: 100%;\n}\n.p-sidebar-top {\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 10rem;\n}\n.p-sidebar-bottom {\r\n    bottom: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 10rem;\n}\n.p-sidebar-full {\r\n    width: 100%;\r\n    height: 100%;\r\n    top: 0;\r\n    left: 0;\r\n    -webkit-transition: none;\r\n    transition: none;\n}\n.p-sidebar-left.p-sidebar-enter-from,\r\n.p-sidebar-left.p-sidebar-leave-to {\r\n    -webkit-transform: translateX(-100%);\r\n            transform: translateX(-100%);\n}\n.p-sidebar-right.p-sidebar-enter-from,\r\n.p-sidebar-right.p-sidebar-leave-to {\r\n    -webkit-transform: translateX(100%);\r\n            transform: translateX(100%);\n}\n.p-sidebar-top.p-sidebar-enter-from,\r\n.p-sidebar-top.p-sidebar-leave-to {\r\n    -webkit-transform: translateY(-100%);\r\n            transform: translateY(-100%);\n}\n.p-sidebar-bottom.p-sidebar-enter-from,\r\n.p-sidebar-bottom.p-sidebar-leave-to {\r\n    -webkit-transform: translateY(100%);\r\n            transform: translateY(100%);\n}\n.p-sidebar-full.p-sidebar-enter-from,\r\n.p-sidebar-full.p-sidebar-leave-to {\r\n    opacity: 0;\n}\n.p-sidebar-full.p-sidebar-enter-active,\r\n.p-sidebar-full.p-sidebar-leave-active {\r\n    -webkit-transition: opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1);\r\n    transition: opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.p-sidebar-left.p-sidebar-sm,\r\n.p-sidebar-right.p-sidebar-sm {\r\n    width: 20rem;\n}\n.p-sidebar-left.p-sidebar-md,\r\n.p-sidebar-right.p-sidebar-md {\r\n    width: 40rem;\n}\n.p-sidebar-left.p-sidebar-lg,\r\n.p-sidebar-right.p-sidebar-lg {\r\n    width: 60rem;\n}\n.p-sidebar-top.p-sidebar-sm,\r\n.p-sidebar-bottom.p-sidebar-sm {\r\n    height: 10rem;\n}\n.p-sidebar-top.p-sidebar-md,\r\n.p-sidebar-bottom.p-sidebar-md {\r\n    height: 20rem;\n}\n.p-sidebar-top.p-sidebar-lg,\r\n.p-sidebar-bottom.p-sidebar-lg {\r\n    height: 30rem;\n}\n@media screen and (max-width: 64em) {\n.p-sidebar-left.p-sidebar-lg,\r\n    .p-sidebar-left.p-sidebar-md,\r\n    .p-sidebar-right.p-sidebar-lg,\r\n    .p-sidebar-right.p-sidebar-md {\r\n        width: 20rem;\n}\n}\r\n";
    styleInject(css_248z);

    script.render = render;
    script.__file = "src/components/sidebar/Sidebar.vue";

    return script;

})(primevue.utils, primevue.ripple, Vue);
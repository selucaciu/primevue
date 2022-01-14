this.primevue = this.primevue || {};
this.primevue.confirmpopup = (function (ConfirmationEventBus, utils, OverlayEventBus, Button, vue) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var ConfirmationEventBus__default = /*#__PURE__*/_interopDefaultLegacy(ConfirmationEventBus);
    var OverlayEventBus__default = /*#__PURE__*/_interopDefaultLegacy(OverlayEventBus);
    var Button__default = /*#__PURE__*/_interopDefaultLegacy(Button);

    var script = {
        name: 'ConfirmPopup',
        inheritAttrs: false,
        props: {
            group: String
        },
        data() {
            return {
                visible: false,
                confirmation: null
            }
        },
        target: null,
        outsideClickListener: null,
        scrollHandler: null,
        resizeListener: null,
        container: null,
        confirmListener: null,
        closeListener: null,
        mounted() {
            this.confirmListener = (options) => {
                if (!options) {
                    return;
                }

                if (options.group === this.group) {
                    this.confirmation = options;
                    this.target = options.target;
                    this.visible = true;
                }
            };
            this.closeListener = () => {
                this.visible = false;
                this.confirmation = null;
            };
            ConfirmationEventBus__default["default"].on('confirm', this.confirmListener);
            ConfirmationEventBus__default["default"].on('close', this.closeListener);
        },
        beforeUnmount() {
            ConfirmationEventBus__default["default"].off('confirm', this.confirmListener);
            ConfirmationEventBus__default["default"].off('close', this.closeListener);

            this.unbindOutsideClickListener();
            if (this.scrollHandler) {
                this.scrollHandler.destroy();
                this.scrollHandler = null;
            }
            this.unbindResizeListener();

            if (this.container) {
                utils.ZIndexUtils.clear(this.container);
                this.container = null;
            }

            this.target = null;
            this.confirmation = null;
        },
        methods: {
             accept() {
                if (this.confirmation.accept) {
                    this.confirmation.accept();
                }

                this.visible = false;
            },
            reject() {
                if (this.confirmation.reject) {
                    this.confirmation.reject();
                }

                this.visible = false;
            },
            onEnter(el) {
                this.alignOverlay();
                this.bindOutsideClickListener();
                this.bindScrollListener();
                this.bindResizeListener();

                utils.ZIndexUtils.set('overlay', el, this.$primevue.config.zIndex.overlay);
            },
            onLeave() {
                this.unbindOutsideClickListener();
                this.unbindScrollListener();
                this.unbindResizeListener();
            },
            onAfterLeave(el) {
                utils.ZIndexUtils.clear(el);
            },
            alignOverlay() {
                utils.DomHandler.absolutePosition(this.container, this.target);

                const containerOffset = utils.DomHandler.getOffset(this.container);
                const targetOffset = utils.DomHandler.getOffset(this.target);
                let arrowLeft = 0;

                if (containerOffset.left < targetOffset.left) {
                    arrowLeft = targetOffset.left - containerOffset.left;
                }
                this.container.style.setProperty('--overlayArrowLeft', `${arrowLeft}px`);

                if (containerOffset.top < targetOffset.top) {
                    utils.DomHandler.addClass(this.container, 'p-confirm-popup-flipped');
                }
            },
            bindOutsideClickListener() {
                if (!this.outsideClickListener) {
                    this.outsideClickListener = (event) => {
                        if (this.visible && this.container && !this.container.contains(event.target) && !this.isTargetClicked(event)) {
                            this.visible = false;
                        }
                    };
                    document.addEventListener('click', this.outsideClickListener);
                }
            },
            unbindOutsideClickListener() {
                if (this.outsideClickListener) {
                    document.removeEventListener('click', this.outsideClickListener);
                    this.outsideClickListener = null;
                }
            },
            bindScrollListener() {
                if (!this.scrollHandler) {
                    this.scrollHandler = new utils.ConnectedOverlayScrollHandler(this.target, () => {
                        if (this.visible) {
                            this.visible = false;
                        }
                    });
                }

                this.scrollHandler.bindScrollListener();
            },
            unbindScrollListener() {
                if (this.scrollHandler) {
                    this.scrollHandler.unbindScrollListener();
                }
            },
            bindResizeListener() {
                if (!this.resizeListener) {
                    this.resizeListener = () => {
                        if (this.visible) {
                            this.visible = false;
                        }
                    };
                    window.addEventListener('resize', this.resizeListener);
                }
            },
            unbindResizeListener() {
                if (this.resizeListener) {
                    window.removeEventListener('resize', this.resizeListener);
                    this.resizeListener = null;
                }
            },
            isTargetClicked() {
                return this.target && (this.target === event.target || this.target.contains(event.target));
            },
            containerRef(el) {
                this.container = el;
            },
            onOverlayClick(event) {
                OverlayEventBus__default["default"].emit('overlay-click', {
                    originalEvent: event,
                    target: this.target
                });
            }
        },
        computed: {
            containerClass() {
                return ['p-confirm-popup p-component', {
                    'p-input-filled': this.$primevue.config.inputStyle === 'filled',
                    'p-ripple-disabled': this.$primevue.config.ripple === false
                }];
            },
            message() {
                return this.confirmation ? this.confirmation.message : null;
            },
            iconClass() {
                return ['p-confirm-popup-icon', this.confirmation ? this.confirmation.icon : null];
            },
            acceptLabel() {
                return this.confirmation ? (this.confirmation.acceptLabel || this.$primevue.config.locale.accept) : null;
            },
            rejectLabel() {
                return this.confirmation ? (this.confirmation.rejectLabel || this.$primevue.config.locale.reject) : null;
            },
            acceptIcon() {
                return this.confirmation ? this.confirmation.acceptIcon : null;
            },
            rejectIcon() {
                return this.confirmation ? this.confirmation.rejectIcon : null;
            },
            acceptClass() {
                return ['p-confirm-popup-accept p-button-sm', this.confirmation ? this.confirmation.acceptClass : null];
            },
            rejectClass() {
                return ['p-confirm-popup-reject p-button-sm', this.confirmation ? (this.confirmation.rejectClass || 'p-button-text') : null];
            }
        },
        components: {
            'CPButton': Button__default["default"]
        }
    };

    const _hoisted_1 = {
      key: 0,
      class: "p-confirm-popup-content"
    };
    const _hoisted_2 = { class: "p-confirm-popup-message" };
    const _hoisted_3 = { class: "p-confirm-popup-footer" };

    function render(_ctx, _cache, $props, $setup, $data, $options) {
      const _component_CPButton = vue.resolveComponent("CPButton");

      return (vue.openBlock(), vue.createBlock(vue.Teleport, { to: "body" }, [
        vue.createVNode(vue.Transition, {
          name: "p-confirm-popup",
          onEnter: $options.onEnter,
          onLeave: $options.onLeave,
          onAfterLeave: $options.onAfterLeave
        }, {
          default: vue.withCtx(() => [
            ($data.visible)
              ? (vue.openBlock(), vue.createBlock("div", vue.mergeProps({
                  key: 0,
                  class: $options.containerClass,
                  ref: $options.containerRef
                }, _ctx.$attrs, {
                  onClick: _cache[3] || (_cache[3] = (...args) => ($options.onOverlayClick && $options.onOverlayClick(...args)))
                }), [
                  (!_ctx.$slots.message)
                    ? (vue.openBlock(), vue.createBlock("div", _hoisted_1, [
                        vue.createVNode("i", { class: $options.iconClass }, null, 2 /* CLASS */),
                        vue.createVNode("span", _hoisted_2, vue.toDisplayString($data.confirmation.message), 1 /* TEXT */)
                      ]))
                    : (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.$slots.message), {
                        key: 1,
                        message: $data.confirmation
                      }, null, 8 /* PROPS */, ["message"])),
                  vue.createVNode("div", _hoisted_3, [
                    vue.createVNode(_component_CPButton, {
                      label: $options.rejectLabel,
                      icon: $options.rejectIcon,
                      class: $options.rejectClass,
                      onClick: _cache[1] || (_cache[1] = $event => ($options.reject()))
                    }, null, 8 /* PROPS */, ["label", "icon", "class"]),
                    vue.createVNode(_component_CPButton, {
                      label: $options.acceptLabel,
                      icon: $options.acceptIcon,
                      class: $options.acceptClass,
                      onClick: _cache[2] || (_cache[2] = $event => ($options.accept())),
                      autofocus: ""
                    }, null, 8 /* PROPS */, ["label", "icon", "class"])
                  ])
                ], 16 /* FULL_PROPS */))
              : vue.createCommentVNode("v-if", true)
          ]),
          _: 1 /* STABLE */
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

    var css_248z = "\n.p-confirm-popup {\r\n    position: absolute;\r\n    margin-top: 10px;\r\n    top: 0;\r\n    left: 0;\n}\n.p-confirm-popup-flipped {\r\n    margin-top: 0;\r\n    margin-bottom: 10px;\n}\r\n\r\n/* Animation */\n.p-confirm-popup-enter-from {\r\n    opacity: 0;\r\n    -webkit-transform: scaleY(0.8);\r\n            transform: scaleY(0.8);\n}\n.p-confirm-popup-leave-to {\r\n    opacity: 0;\n}\n.p-confirm-popup-enter-active {\r\n    -webkit-transition: opacity .12s cubic-bezier(0, 0, 0.2, 1), -webkit-transform .12s cubic-bezier(0, 0, 0.2, 1);\r\n    transition: opacity .12s cubic-bezier(0, 0, 0.2, 1), -webkit-transform .12s cubic-bezier(0, 0, 0.2, 1);\r\n    transition: transform .12s cubic-bezier(0, 0, 0.2, 1), opacity .12s cubic-bezier(0, 0, 0.2, 1);\r\n    transition: transform .12s cubic-bezier(0, 0, 0.2, 1), opacity .12s cubic-bezier(0, 0, 0.2, 1), -webkit-transform .12s cubic-bezier(0, 0, 0.2, 1);\n}\n.p-confirm-popup-leave-active {\r\n    -webkit-transition: opacity .1s linear;\r\n    transition: opacity .1s linear;\n}\n.p-confirm-popup:after, .p-confirm-popup:before {\r\n\tbottom: 100%;\r\n\tleft: calc(var(--overlayArrowLeft, 0) + 1.25rem);\r\n\tcontent: \" \";\r\n\theight: 0;\r\n\twidth: 0;\r\n\tposition: absolute;\r\n\tpointer-events: none;\n}\n.p-confirm-popup:after {\r\n\tborder-width: 8px;\r\n\tmargin-left: -8px;\n}\n.p-confirm-popup:before {\r\n\tborder-width: 10px;\r\n\tmargin-left: -10px;\n}\n.p-confirm-popup-flipped:after, .p-confirm-popup-flipped:before {\r\n    bottom: auto;\r\n    top: 100%;\n}\n.p-confirm-popup.p-confirm-popup-flipped:after {\r\n    border-bottom-color: transparent;\n}\n.p-confirm-popup.p-confirm-popup-flipped:before {\r\n    border-bottom-color: transparent\n}\n.p-confirm-popup .p-confirm-popup-content {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\n}\r\n";
    styleInject(css_248z);

    script.render = render;
    script.__file = "src/components/confirmpopup/ConfirmPopup.vue";

    return script;

})(primevue.confirmationeventbus, primevue.utils, primevue.overlayeventbus, primevue.button, Vue);

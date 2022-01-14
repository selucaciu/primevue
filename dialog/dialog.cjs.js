'use strict';

var utils = require('primevue/utils');
var Ripple = require('primevue/ripple');
var vue = require('vue');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Ripple__default = /*#__PURE__*/_interopDefaultLegacy(Ripple);

var script = {
    name: 'Dialog',
    inheritAttrs: false,
    emits: ['update:visible','show','hide','maximize','unmaximize','dragend'],
    props: {
        header: null,
        footer: null,
        visible: Boolean,
        modal: Boolean,
        contentStyle: null,
        contentClass: String,
        rtl: Boolean,
        maximizable: Boolean,
        dismissableMask: Boolean,
        closable: {
            type: Boolean,
            default: true
        },
        closeOnEscape: {
            type: Boolean,
            default: true
        },
        showHeader: {
            type: Boolean,
            default: true
        },
        baseZIndex: {
            type: Number,
            default: 0
        },
        autoZIndex: {
            type: Boolean,
            default: true
        },
        ariaCloseLabel: {
            type: String,
            default: 'close'
        },
        position: {
            type: String,
            default: 'center'
        },
        breakpoints: {
            type: Object,
            default: null
        },
        draggable: {
            type: Boolean,
            default: true
        },
        keepInViewport: {
            type: Boolean,
            default: true
        },
        minX: {
            type: Number,
            default: 0
        },
        minY: {
            type: Number,
            default: 0
        },
        appendTo: {
            type: String,
            default: 'body'
        }
    },
    data() {
        return {
            containerVisible: this.visible,
            maximized: false
        }
    },
    documentKeydownListener: null,
    container: null,
    mask: null,
    styleElement: null,
    dragging: null,
    documentDragListener: null,
    documentDragEndListener: null,
    lastPageX: null,
    lastPageY: null,
    updated() {
        if (this.visible) {
            this.containerVisible = this.visible;
        }
    },
    beforeUnmount() {
        this.unbindDocumentState();
        this.unbindGlobalListeners();
        this.destroyStyle();

        this.mask = null;

        if (this.container && this.autoZIndex) {
            utils.ZIndexUtils.clear(this.container);
        }
        this.container = null;
    },
    mounted() {
        if (this.breakpoints) {
            this.createStyle();
        }
    },
    methods: {
        close() {
            this.$emit('update:visible', false);
        },
        onBeforeEnter(el) {
            if (this.autoZIndex) {
                utils.ZIndexUtils.set('modal', el, this.baseZIndex + this.$primevue.config.zIndex.modal);
            }

            el.setAttribute(this.attributeSelector, '');
        },
        onEnter() {
            this.mask.style.zIndex = String(parseInt(this.container.style.zIndex, 10) - 1);

            this.$emit('show');
            this.focus();
            this.enableDocumentSettings();
            this.bindGlobalListeners();
        },
        onBeforeLeave() {
            if (this.modal) {
                utils.DomHandler.addClass(this.mask, 'p-component-overlay-leave');
            }
        },
        onLeave() {

            this.$emit('hide');
        },
        onAfterLeave(el) {
            if (this.autoZIndex) {
                utils.ZIndexUtils.clear(el);
            }
            this.containerVisible = false;
            this.unbindDocumentState();
            this.unbindGlobalListeners();
        },
        onMaskClick(event) {
            if (this.dismissableMask && this.closable && this.modal && this.mask === event.target) {
                this.close();
            }
        },
        focus() {
            let focusTarget = this.container.querySelector('[autofocus]');
            if (focusTarget) {
                focusTarget.focus();
            }
        },
        maximize(event) {
            if (this.maximized) {
                this.maximized = false;
                this.$emit('unmaximize', event);
            }
            else {
                this.maximized = true;
                this.$emit('maximize', event);
            }

            if (!this.modal) {
                if (this.maximized)
                    utils.DomHandler.addClass(document.body, 'p-overflow-hidden');
                else
                    utils.DomHandler.removeClass(document.body, 'p-overflow-hidden');
            }
        },
        enableDocumentSettings() {
            if (this.modal || (this.maximizable && this.maximized)) {
                utils.DomHandler.addClass(document.body, 'p-overflow-hidden');
            }
        },
        unbindDocumentState() {
            if (this.modal || (this.maximizable && this.maximized)) {
                utils.DomHandler.removeClass(document.body, 'p-overflow-hidden');
            }
        },
        onKeyDown(event) {
            if (event.which === 9) {
                event.preventDefault();
                let focusableElements = utils.DomHandler.getFocusableElements(this.container);
                if (focusableElements && focusableElements.length > 0) {
                    if (!document.activeElement) {
                        focusableElements[0].focus();
                    }
                    else {
                        let focusedIndex = focusableElements.indexOf(document.activeElement);
                        if (event.shiftKey) {
                            if (focusedIndex == -1 || focusedIndex === 0)
                                focusableElements[focusableElements.length - 1].focus();
                            else
                                focusableElements[focusedIndex - 1].focus();
                        }
                        else {
                            if (focusedIndex == -1 || focusedIndex === (focusableElements.length - 1))
                                focusableElements[0].focus();
                            else
                                focusableElements[focusedIndex + 1].focus();
                        }
                    }
                }
            } else if (event.which === 27 && this.closeOnEscape) {
                this.close();
            }
        },
        bindDocumentKeyDownListener() {
            if (!this.documentKeydownListener) {
                this.documentKeydownListener = this.onKeyDown.bind(this);
                window.document.addEventListener('keydown', this.documentKeydownListener);
            }
        },
        unbindDocumentKeyDownListener() {
            if (this.documentKeydownListener) {
                window.document.removeEventListener('keydown', this.documentKeydownListener);
                this.documentKeydownListener = null;
            }
        },
        getPositionClass() {
            const positions = ['left', 'right', 'top', 'topleft', 'topright', 'bottom', 'bottomleft', 'bottomright'];
            const pos = positions.find(item => item === this.position);

            return pos ? `p-dialog-${pos}` : '';
        },
        containerRef(el) {
            this.container = el;
        },
        maskRef(el) {
            this.mask = el;
        },
        createStyle() {
			if (!this.styleElement) {
				this.styleElement = document.createElement('style');
				this.styleElement.type = 'text/css';
				document.head.appendChild(this.styleElement);

                let innerHTML = '';
                for (let breakpoint in this.breakpoints) {
                    innerHTML += `
                        @media screen and (max-width: ${breakpoint}) {
                            .p-dialog[${this.attributeSelector}] {
                                width: ${this.breakpoints[breakpoint]} !important;
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
        },
        initDrag(event) {
            if (utils.DomHandler.hasClass(event.target, 'p-dialog-header-icon') || utils.DomHandler.hasClass(event.target.parentElement, 'p-dialog-header-icon')) {
                return;
            }

            if (this.draggable) {
                this.dragging = true;
                this.lastPageX = event.pageX;
                this.lastPageY = event.pageY;

                this.container.style.margin = '0';
                utils.DomHandler.addClass(document.body, 'p-unselectable-text');
            }
        },
        bindGlobalListeners() {
            if (this.draggable) {
                this.bindDocumentDragListener();
                this.bindDocumentDragEndListener();
            }

            if (this.closeOnEscape && this.closable) {
                this.bindDocumentKeyDownListener();
            }
        },
        unbindGlobalListeners() {
            this.unbindDocumentDragListener();
            this.unbindDocumentDragEndListener();
            this.unbindDocumentKeyDownListener();
        },
        bindDocumentDragListener() {
            this.documentDragListener = (event) => {
                if (this.dragging) {
                    let width = utils.DomHandler.getOuterWidth(this.container);
                    let height = utils.DomHandler.getOuterHeight(this.container);
                    let deltaX = event.pageX - this.lastPageX;
                    let deltaY = event.pageY - this.lastPageY;
                    let offset = this.container.getBoundingClientRect();
                    let leftPos = offset.left + deltaX;
                    let topPos = offset.top + deltaY;
                    let viewport = utils.DomHandler.getViewport();

                    this.container.style.position = 'fixed';

                    if (this.keepInViewport) {
                        if (leftPos >= this.minX && (leftPos + width) < viewport.width) {
                            this.lastPageX = event.pageX;
                            this.container.style.left = leftPos + 'px';
                        }

                        if (topPos >= this.minY && (topPos + height) < viewport.height) {
                            this.lastPageY = event.pageY;
                            this.container.style.top = topPos + 'px';
                        }
                    }
                    else {
                        this.lastPageX = event.pageX;
                        this.container.style.left = leftPos + 'px';
                        this.lastPageY = event.pageY;
                        this.container.style.top = topPos + 'px';
                    }
                }
            };
            window.document.addEventListener('mousemove', this.documentDragListener);
        },
        unbindDocumentDragListener() {
            if (this.documentDragListener) {
                window.document.removeEventListener('mousemove', this.documentDragListener);
                this.documentDragListener = null;
            }
        },
        bindDocumentDragEndListener() {
            this.documentDragEndListener = (event) => {
                if (this.dragging) {
                    this.dragging = false;
                    utils.DomHandler.removeClass(document.body, 'p-unselectable-text');

                    this.$emit('dragend', event);
                }
            };
            window.document.addEventListener('mouseup', this.documentDragEndListener);
        },
        unbindDocumentDragEndListener() {
            if (this.documentDragEndListener) {
                window.document.removeEventListener('mouseup', this.documentDragEndListener);
                this.documentDragEndListener = null;
            }
        }
    },
    computed: {
        maskClass() {
            return ['p-dialog-mask', {'p-component-overlay p-component-overlay-enter': this.modal}, this.getPositionClass()];
        },
        dialogClass() {
            return ['p-dialog p-component', {
                'p-dialog-rtl': this.rtl,
                'p-dialog-maximized': this.maximizable && this.maximized,
                'p-input-filled': this.$primevue.config.inputStyle === 'filled',
                'p-ripple-disabled': this.$primevue.config.ripple === false
            }];
        },
        maximizeIconClass() {
            return ['p-dialog-header-maximize-icon pi', {
                'pi-window-maximize': !this.maximized,
                'pi-window-minimize': this.maximized
            }];
        },
        ariaId() {
            return utils.UniqueComponentId();
        },
        ariaLabelledById() {
            return this.header != null ? this.ariaId + '_header' : null;
        },
        attributeSelector() {
            return utils.UniqueComponentId();
        },
        contentStyleClass() {
            return ['p-dialog-content', this.contentClass];
        },
        appendDisabled() {
            return this.appendTo === 'self';
        },
        appendTarget() {
            return this.appendDisabled ? null : this.appendTo;
        }
    },
    directives: {
        'ripple': Ripple__default["default"]
    }
};

const _hoisted_1 = { class: "p-dialog-header-icons" };
const _hoisted_2 = /*#__PURE__*/vue.createVNode("span", { class: "p-dialog-header-close-icon pi pi-times" }, null, -1 /* HOISTED */);
const _hoisted_3 = {
  key: 1,
  class: "p-dialog-footer"
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = vue.resolveDirective("ripple");

  return (vue.openBlock(), vue.createBlock(vue.Teleport, {
    to: $options.appendTarget,
    disabled: $options.appendDisabled
  }, [
    ($data.containerVisible)
      ? (vue.openBlock(), vue.createBlock("div", {
          key: 0,
          ref: $options.maskRef,
          class: $options.maskClass,
          onClick: _cache[4] || (_cache[4] = (...args) => ($options.onMaskClick && $options.onMaskClick(...args)))
        }, [
          vue.createVNode(vue.Transition, {
            name: "p-dialog",
            onBeforeEnter: $options.onBeforeEnter,
            onEnter: $options.onEnter,
            onBeforeLeave: $options.onBeforeLeave,
            onLeave: $options.onLeave,
            onAfterLeave: $options.onAfterLeave,
            appear: ""
          }, {
            default: vue.withCtx(() => [
              ($props.visible)
                ? (vue.openBlock(), vue.createBlock("div", vue.mergeProps({
                    key: 0,
                    ref: $options.containerRef,
                    class: $options.dialogClass
                  }, _ctx.$attrs, {
                    role: "dialog",
                    "aria-labelledby": $options.ariaLabelledById,
                    "aria-modal": $props.modal
                  }), [
                    ($props.showHeader)
                      ? (vue.openBlock(), vue.createBlock("div", {
                          key: 0,
                          class: "p-dialog-header",
                          onMousedown: _cache[3] || (_cache[3] = (...args) => ($options.initDrag && $options.initDrag(...args)))
                        }, [
                          vue.renderSlot(_ctx.$slots, "header", {}, () => [
                            ($props.header)
                              ? (vue.openBlock(), vue.createBlock("span", {
                                  key: 0,
                                  id: $options.ariaLabelledById,
                                  class: "p-dialog-title"
                                }, vue.toDisplayString($props.header), 9 /* TEXT, PROPS */, ["id"]))
                              : vue.createCommentVNode("v-if", true)
                          ]),
                          vue.createVNode("div", _hoisted_1, [
                            ($props.maximizable)
                              ? vue.withDirectives((vue.openBlock(), vue.createBlock("button", {
                                  key: 0,
                                  class: "p-dialog-header-icon p-dialog-header-maximize p-link",
                                  onClick: _cache[1] || (_cache[1] = (...args) => ($options.maximize && $options.maximize(...args))),
                                  type: "button",
                                  tabindex: "-1"
                                }, [
                                  vue.createVNode("span", { class: $options.maximizeIconClass }, null, 2 /* CLASS */)
                                ], 512 /* NEED_PATCH */)), [
                                  [_directive_ripple]
                                ])
                              : vue.createCommentVNode("v-if", true),
                            ($props.closable)
                              ? vue.withDirectives((vue.openBlock(), vue.createBlock("button", {
                                  key: 1,
                                  class: "p-dialog-header-icon p-dialog-header-close p-link",
                                  onClick: _cache[2] || (_cache[2] = (...args) => ($options.close && $options.close(...args))),
                                  "aria-label": $props.ariaCloseLabel,
                                  type: "button"
                                }, [
                                  _hoisted_2
                                ], 8 /* PROPS */, ["aria-label"])), [
                                  [_directive_ripple]
                                ])
                              : vue.createCommentVNode("v-if", true)
                          ])
                        ], 32 /* HYDRATE_EVENTS */))
                      : vue.createCommentVNode("v-if", true),
                    vue.createVNode("div", {
                      class: $options.contentStyleClass,
                      style: $props.contentStyle
                    }, [
                      vue.renderSlot(_ctx.$slots, "default")
                    ], 6 /* CLASS, STYLE */),
                    ($props.footer || _ctx.$slots.footer)
                      ? (vue.openBlock(), vue.createBlock("div", _hoisted_3, [
                          vue.renderSlot(_ctx.$slots, "footer", {}, () => [
                            vue.createTextVNode(vue.toDisplayString($props.footer), 1 /* TEXT */)
                          ])
                        ]))
                      : vue.createCommentVNode("v-if", true)
                  ], 16 /* FULL_PROPS */, ["aria-labelledby", "aria-modal"]))
                : vue.createCommentVNode("v-if", true)
            ]),
            _: 3 /* FORWARDED */
          }, 8 /* PROPS */, ["onBeforeEnter", "onEnter", "onBeforeLeave", "onLeave", "onAfterLeave"])
        ], 2 /* CLASS */))
      : vue.createCommentVNode("v-if", true)
  ], 8 /* PROPS */, ["to", "disabled"]))
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

var css_248z = "\n.p-dialog-mask {\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    pointer-events: none;\n}\n.p-dialog-mask.p-component-overlay {\r\n    pointer-events: auto;\n}\n.p-dialog {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\r\n    pointer-events: auto;\r\n    max-height: 90%;\r\n    -webkit-transform: scale(1);\r\n            transform: scale(1);\n}\n.p-dialog-content {\r\n    overflow-y: auto;\n}\n.p-dialog-header {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: justify;\r\n        -ms-flex-pack: justify;\r\n            justify-content: space-between;\r\n    -ms-flex-negative: 0;\r\n        flex-shrink: 0;\n}\n.p-dialog-footer {\r\n    -ms-flex-negative: 0;\r\n        flex-shrink: 0;\n}\n.p-dialog .p-dialog-header-icons {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\n}\n.p-dialog .p-dialog-header-icon {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    overflow: hidden;\r\n    position: relative;\n}\r\n\r\n/* Fluid */\n.p-fluid .p-dialog-footer .p-button {\r\n    width: auto;\n}\r\n\r\n/* Animation */\r\n/* Center */\n.p-dialog-enter-active {\r\n    -webkit-transition: all 150ms cubic-bezier(0, 0, 0.2, 1);\r\n    transition: all 150ms cubic-bezier(0, 0, 0.2, 1);\n}\n.p-dialog-leave-active {\r\n    -webkit-transition: all 150ms cubic-bezier(0.4, 0.0, 0.2, 1);\r\n    transition: all 150ms cubic-bezier(0.4, 0.0, 0.2, 1);\n}\n.p-dialog-enter-from,\r\n.p-dialog-leave-to {\r\n    opacity: 0;\r\n    -webkit-transform: scale(0.7);\r\n            transform: scale(0.7);\n}\r\n\r\n/* Top, Bottom, Left, Right, Top* and Bottom* */\n.p-dialog-top .p-dialog,\r\n.p-dialog-bottom .p-dialog,\r\n.p-dialog-left .p-dialog,\r\n.p-dialog-right .p-dialog,\r\n.p-dialog-topleft .p-dialog,\r\n.p-dialog-topright .p-dialog,\r\n.p-dialog-bottomleft .p-dialog,\r\n.p-dialog-bottomright .p-dialog {\r\n    margin: .75rem;\r\n    -webkit-transform: translate3d(0px, 0px, 0px);\r\n            transform: translate3d(0px, 0px, 0px);\n}\n.p-dialog-top .p-dialog-enter-active,\r\n.p-dialog-top .p-dialog-leave-active,\r\n.p-dialog-bottom .p-dialog-enter-active,\r\n.p-dialog-bottom .p-dialog-leave-active,\r\n.p-dialog-left .p-dialog-enter-active,\r\n.p-dialog-left .p-dialog-leave-active,\r\n.p-dialog-right .p-dialog-enter-active,\r\n.p-dialog-right .p-dialog-leave-active,\r\n.p-dialog-topleft .p-dialog-enter-active,\r\n.p-dialog-topleft .p-dialog-leave-active,\r\n.p-dialog-topright .p-dialog-enter-active,\r\n.p-dialog-topright .p-dialog-leave-active,\r\n.p-dialog-bottomleft .p-dialog-enter-active,\r\n.p-dialog-bottomleft .p-dialog-leave-active,\r\n.p-dialog-bottomright .p-dialog-enter-active,\r\n.p-dialog-bottomright .p-dialog-leave-active {\r\n    -webkit-transition: all .3s ease-out;\r\n    transition: all .3s ease-out;\n}\n.p-dialog-top .p-dialog-enter-from,\r\n.p-dialog-top .p-dialog-leave-to {\r\n    -webkit-transform: translate3d(0px, -100%, 0px);\r\n            transform: translate3d(0px, -100%, 0px);\n}\n.p-dialog-bottom .p-dialog-enter-from,\r\n.p-dialog-bottom .p-dialog-leave-to {\r\n    -webkit-transform: translate3d(0px, 100%, 0px);\r\n            transform: translate3d(0px, 100%, 0px);\n}\n.p-dialog-left .p-dialog-enter-from,\r\n.p-dialog-left .p-dialog-leave-to,\r\n.p-dialog-topleft .p-dialog-enter-from,\r\n.p-dialog-topleft .p-dialog-leave-to,\r\n.p-dialog-bottomleft .p-dialog-enter-from,\r\n.p-dialog-bottomleft .p-dialog-leave-to {\r\n    -webkit-transform: translate3d(-100%, 0px, 0px);\r\n            transform: translate3d(-100%, 0px, 0px);\n}\n.p-dialog-right .p-dialog-enter-from,\r\n.p-dialog-right .p-dialog-leave-to,\r\n.p-dialog-topright .p-dialog-enter-from,\r\n.p-dialog-topright .p-dialog-leave-to,\r\n.p-dialog-bottomright .p-dialog-enter-from,\r\n.p-dialog-bottomright .p-dialog-leave-to {\r\n    -webkit-transform: translate3d(100%, 0px, 0px);\r\n            transform: translate3d(100%, 0px, 0px);\n}\r\n\r\n/* Maximize */\n.p-dialog-maximized {\r\n    -webkit-transition: none;\r\n    transition: none;\r\n    -webkit-transform: none;\r\n            transform: none;\r\n    width: 100vw !important;\r\n    height: 100vh !important;\r\n    top: 0px !important;\r\n    left: 0px !important;\r\n    max-height: 100%;\r\n    height: 100%;\n}\n.p-dialog-maximized .p-dialog-content {\r\n    -webkit-box-flex: 1;\r\n        -ms-flex-positive: 1;\r\n            flex-grow: 1;\n}\r\n\r\n/* Position */\n.p-dialog-left {\r\n    -webkit-box-pack: start;\r\n        -ms-flex-pack: start;\r\n            justify-content: flex-start;\n}\n.p-dialog-right {\r\n    -webkit-box-pack: end;\r\n        -ms-flex-pack: end;\r\n            justify-content: flex-end;\n}\n.p-dialog-top {\r\n    -webkit-box-align: start;\r\n        -ms-flex-align: start;\r\n            align-items: flex-start;\n}\n.p-dialog-topleft {\r\n    -webkit-box-pack: start;\r\n        -ms-flex-pack: start;\r\n            justify-content: flex-start;\r\n    -webkit-box-align: start;\r\n        -ms-flex-align: start;\r\n            align-items: flex-start;\n}\n.p-dialog-topright {\r\n    -webkit-box-pack: end;\r\n        -ms-flex-pack: end;\r\n            justify-content: flex-end;\r\n    -webkit-box-align: start;\r\n        -ms-flex-align: start;\r\n            align-items: flex-start;\n}\n.p-dialog-bottom {\r\n    -webkit-box-align: end;\r\n        -ms-flex-align: end;\r\n            align-items: flex-end;\n}\n.p-dialog-bottomleft {\r\n    -webkit-box-pack: start;\r\n        -ms-flex-pack: start;\r\n            justify-content: flex-start;\r\n    -webkit-box-align: end;\r\n        -ms-flex-align: end;\r\n            align-items: flex-end;\n}\n.p-dialog-bottomright {\r\n    -webkit-box-pack: end;\r\n        -ms-flex-pack: end;\r\n            justify-content: flex-end;\r\n    -webkit-box-align: end;\r\n        -ms-flex-align: end;\r\n            align-items: flex-end;\n}\n.p-confirm-dialog .p-dialog-content {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\n}\r\n";
styleInject(css_248z);

script.render = render;

module.exports = script;

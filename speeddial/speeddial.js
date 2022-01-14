this.primevue = this.primevue || {};
this.primevue.speeddial = (function (Button, Ripple, utils, vue) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var Button__default = /*#__PURE__*/_interopDefaultLegacy(Button);
    var Ripple__default = /*#__PURE__*/_interopDefaultLegacy(Ripple);

    var script = {
        name: 'SpeedDial',
        emits: ['click', 'show', 'hide'],
        props: {
            model: null,
            visible: {
                type: Boolean,
                default: false
            },
            direction: {
                type: String,
                default: 'up'
            },
            transitionDelay: {
                type: Number,
                default: 30
            },
            type: {
                type: String,
                default: 'linear'
            },
            radius: {
                type: Number,
                default: 0
            },
            mask: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            hideOnClickOutside: {
                type: Boolean,
                default: true
            },
            buttonClass: null,
            maskStyle: null,
            maskClass: null,
            showIcon: {
                type: String,
                default: 'pi pi-plus'
            },
            hideIcon: null,
            rotateAnimation: {
                type: Boolean,
                default: true
            },
            tooltipOptions: null,
            style: null,
            class: null
        },
        documentClickListener: null,
        container: null,
        list: null,
        data() {
            return {
                d_visible: this.visible,
                isItemClicked: false
            }
        },
        watch: {
            visible(newValue) {
                this.d_visible = newValue;
            }
        },
        mounted() {
            if (this.type !== 'linear') {
                const button = utils.DomHandler.findSingle(this.container, '.p-speeddial-button');
                const firstItem = utils.DomHandler.findSingle(this.list, '.p-speeddial-item');

                if (button && firstItem) {
                    const wDiff = Math.abs(button.offsetWidth - firstItem.offsetWidth);
                    const hDiff = Math.abs(button.offsetHeight - firstItem.offsetHeight);
                    this.list.style.setProperty('--item-diff-x', `${wDiff / 2}px`);
                    this.list.style.setProperty('--item-diff-y', `${hDiff / 2}px`);
                }
            }

            if (this.hideOnClickOutside) {
                this.bindDocumentClickListener();
            }
        },
        beforeMount() {
            this.unbindDocumentClickListener();
        },
        methods: {
            onItemClick(e, item) {
                if (item.command) {
                    item.command({ originalEvent: e, item });
                }

                this.hide();

                this.isItemClicked = true;
                e.preventDefault();
            },
            onClick(event) {
                this.d_visible ? this.hide() : this.show();

                this.isItemClicked = true;

                this.$emit('click', event);
            },
            show() {
                this.d_visible = true;
                this.$emit('show');
            },
            hide() {
                this.d_visible = false;
                this.$emit('hide');
            },
            calculateTransitionDelay(index) {
                const length = this.model.length;
                const visible = this.d_visible;

                return (visible ? index : length - index - 1) * this.transitionDelay;
            },
            calculatePointStyle(index) {
                const type = this.type;

                if (type !== 'linear') {
                    const length = this.model.length;
                    const radius = this.radius || (length * 20);

                    if (type === 'circle') {
                        const step = 2 * Math.PI / length;

                        return {
                            left: `calc(${radius * Math.cos(step * index)}px + var(--item-diff-x, 0px))`,
                            top: `calc(${radius * Math.sin(step * index)}px + var(--item-diff-y, 0px))`,
                        }
                    }
                    else if (type === 'semi-circle') {
                        const direction = this.direction;
                        const step = Math.PI / (length - 1);
                        const x = `calc(${radius * Math.cos(step * index)}px + var(--item-diff-x, 0px))`;
                        const y = `calc(${radius * Math.sin(step * index)}px + var(--item-diff-y, 0px))`;
                        if (direction === 'up') {
                            return { left: x, bottom: y };
                        }
                        else if (direction === 'down') {
                            return { left: x, top: y };
                        }
                        else if (direction === 'left') {
                            return { right: y, top: x };
                        }
                        else if (direction === 'right') {
                            return { left: y, top: x };
                        }
                    }
                    else if (type === 'quarter-circle') {
                        const direction = this.direction;
                        const step = Math.PI / (2 * (length - 1));
                        const x = `calc(${radius * Math.cos(step * index)}px + var(--item-diff-x, 0px))`;
                        const y = `calc(${radius * Math.sin(step * index)}px + var(--item-diff-y, 0px))`;
                        if (direction === 'up-left') {
                            return { right: x, bottom: y };
                        }
                        else if (direction === 'up-right') {
                            return { left: x, bottom: y };
                        }
                        else if (direction === 'down-left') {
                            return { right: y, top: x };
                        }
                        else if (direction === 'down-right') {
                            return { left: y, top: x };
                        }
                    }
                }

                return {};
            },
            getItemStyle(index) {
                const transitionDelay = this.calculateTransitionDelay(index);
                const pointStyle = this.calculatePointStyle(index);

                return {
                    transitionDelay: `${transitionDelay}ms`,
                    ...pointStyle
                };
            },
            bindDocumentClickListener() {
                if (!this.documentClickListener) {
                    this.documentClickListener = (event) => {
                        if (this.d_visible && this.isOutsideClicked(event)) {
                            this.hide();
                        }

                        this.isItemClicked = false;
                    };
                    document.addEventListener('click', this.documentClickListener);
                }
            },
            unbindDocumentClickListener() {
                if (this.documentClickListener) {
                    document.removeEventListener('click', this.documentClickListener);
                    this.documentClickListener = null;
                }
            },
            isOutsideClicked(event) {
                return this.container && !(this.container.isSameNode(event.target) || this.container.contains(event.target) || this.isItemClicked);
            },
            containerRef(el) {
                this.container = el;
            },
            listRef(el) {
                this.list = el;
            }
        },
        computed: {
            containerClass() {
                return [`p-speeddial p-component p-speeddial-${this.type}`, {
                    [`p-speeddial-direction-${this.direction}`]: this.type !== 'circle',
                    'p-speeddial-opened': this.d_visible,
                    'p-disabled': this.disabled
                }, this.class];
            },
            buttonClassName() {
                return ['p-speeddial-button p-button-rounded', {
                    'p-speeddial-rotate': this.rotateAnimation && !this.hideIcon
                }, this.buttonClass];
            },
            iconClassName() {
                return this.d_visible && !!this.hideIcon ? this.hideIcon : this.showIcon;
            },
            maskClassName() {
                return ['p-speeddial-mask', {
                    'p-speeddial-mask-visible': this.d_visible
                }, this.maskClass];
            }
        },
        components: {
            'SDButton': Button__default["default"]
        },
        directives: {
            'ripple': Ripple__default["default"]
        }
    };

    function render(_ctx, _cache, $props, $setup, $data, $options) {
      const _component_SDButton = vue.resolveComponent("SDButton");
      const _directive_tooltip = vue.resolveDirective("tooltip");
      const _directive_ripple = vue.resolveDirective("ripple");

      return (vue.openBlock(), vue.createBlock(vue.Fragment, null, [
        vue.createVNode("div", {
          ref: $options.containerRef,
          class: $options.containerClass,
          style: $props.style
        }, [
          vue.renderSlot(_ctx.$slots, "button", { toggle: $options.onClick }, () => [
            vue.createVNode(_component_SDButton, {
              type: "button",
              class: $options.buttonClassName,
              icon: $options.iconClassName,
              onClick: _cache[1] || (_cache[1] = $event => ($options.onClick($event))),
              disabled: $props.disabled
            }, null, 8 /* PROPS */, ["class", "icon", "disabled"])
          ]),
          vue.createVNode("ul", {
            ref: $options.listRef,
            class: "p-speeddial-list",
            role: "menu"
          }, [
            (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($props.model, (item, index) => {
              return (vue.openBlock(), vue.createBlock("li", {
                key: index,
                class: "p-speeddial-item",
                style: $options.getItemStyle(index),
                role: "none"
              }, [
                (!_ctx.$slots.item)
                  ? vue.withDirectives((vue.openBlock(), vue.createBlock("a", {
                      key: 0,
                      href: item.url || '#',
                      role: "menuitem",
                      class: ['p-speeddial-action', { 'p-disabled': item.disabled }],
                      target: item.target,
                      onClick: $event => ($options.onItemClick($event, item))
                    }, [
                      (item.icon)
                        ? (vue.openBlock(), vue.createBlock("span", {
                            key: 0,
                            class: ['p-speeddial-action-icon', item.icon]
                          }, null, 2 /* CLASS */))
                        : vue.createCommentVNode("v-if", true)
                    ], 10 /* CLASS, PROPS */, ["href", "target", "onClick"])), [
                      [_directive_tooltip, {value: item.label, disabled: !$props.tooltipOptions}, $props.tooltipOptions],
                      [_directive_ripple]
                    ])
                  : (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.$slots.item), {
                      key: 1,
                      item: item
                    }, null, 8 /* PROPS */, ["item"]))
              ], 4 /* STYLE */))
            }), 128 /* KEYED_FRAGMENT */))
          ], 512 /* NEED_PATCH */)
        ], 6 /* CLASS, STYLE */),
        ($props.mask)
          ? (vue.openBlock(), vue.createBlock("div", {
              key: 0,
              class: $options.maskClassName,
              style: $props.maskStyle
            }, null, 6 /* CLASS, STYLE */))
          : vue.createCommentVNode("v-if", true)
      ], 64 /* STABLE_FRAGMENT */))
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

    var css_248z = "\n.p-speeddial {\r\n    position: absolute;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    z-index: 1;\n}\n.p-speeddial-list {\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style: none;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    -webkit-transition: top 0s linear 0.2s;\r\n    transition: top 0s linear 0.2s;\r\n    pointer-events: none;\n}\n.p-speeddial-item {\r\n    -webkit-transform: scale(0);\r\n            transform: scale(0);\r\n    opacity: 0;\r\n    -webkit-transition: opacity 0.8s, -webkit-transform 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;\r\n    transition: opacity 0.8s, -webkit-transform 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;\r\n    transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, opacity 0.8s;\r\n    transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, opacity 0.8s, -webkit-transform 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;\r\n    will-change: transform;\n}\n.p-speeddial-action {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    border-radius: 50%;\r\n    position: relative;\r\n    overflow: hidden;\n}\n.p-speeddial-circle .p-speeddial-item,\r\n.p-speeddial-semi-circle .p-speeddial-item,\r\n.p-speeddial-quarter-circle .p-speeddial-item {\r\n    position: absolute;\n}\n.p-speeddial-rotate {\r\n    -webkit-transition: -webkit-transform 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;\r\n    transition: -webkit-transform 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;\r\n    transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;\r\n    transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, -webkit-transform 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;\r\n    will-change: transform;\n}\n.p-speeddial-mask {\r\n    position: absolute;\r\n    left: 0;\r\n    top: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    opacity: 0;\r\n    -webkit-transition: opacity 250ms cubic-bezier(0.25, 0.8, 0.25, 1);\r\n    transition: opacity 250ms cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.p-speeddial-mask-visible {\r\n    pointer-events: none;\r\n    opacity: 1;\r\n    -webkit-transition: opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1);\r\n    transition: opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n.p-speeddial-opened .p-speeddial-list {\r\n    pointer-events: auto;\n}\n.p-speeddial-opened .p-speeddial-item {\r\n    -webkit-transform: scale(1);\r\n            transform: scale(1);\r\n    opacity: 1;\n}\n.p-speeddial-opened .p-speeddial-rotate {\r\n    -webkit-transform: rotate(45deg);\r\n            transform: rotate(45deg);\n}\r\n\r\n/* Direction */\n.p-speeddial-direction-up {\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: reverse;\r\n        -ms-flex-direction: column-reverse;\r\n            flex-direction: column-reverse;\n}\n.p-speeddial-direction-up .p-speeddial-list {\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: reverse;\r\n        -ms-flex-direction: column-reverse;\r\n            flex-direction: column-reverse;\n}\n.p-speeddial-direction-down {\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\n}\n.p-speeddial-direction-down .p-speeddial-list {\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\n}\n.p-speeddial-direction-left {\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    -webkit-box-orient: horizontal;\r\n    -webkit-box-direction: reverse;\r\n        -ms-flex-direction: row-reverse;\r\n            flex-direction: row-reverse;\n}\n.p-speeddial-direction-left .p-speeddial-list {\r\n    -webkit-box-orient: horizontal;\r\n    -webkit-box-direction: reverse;\r\n        -ms-flex-direction: row-reverse;\r\n            flex-direction: row-reverse;\n}\n.p-speeddial-direction-right {\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    -webkit-box-orient: horizontal;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: row;\r\n            flex-direction: row;\n}\n.p-speeddial-direction-right .p-speeddial-list {\r\n    -webkit-box-orient: horizontal;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: row;\r\n            flex-direction: row;\n}\r\n";
    styleInject(css_248z);

    script.render = render;

    return script;

})(primevue.button, primevue.ripple, primevue.utils, Vue);

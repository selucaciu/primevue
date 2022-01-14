import { ZIndexUtils, DomHandler, ConnectedOverlayScrollHandler } from 'primevue/utils';
import OverlayEventBus from 'primevue/overlayeventbus';
import Ripple from 'primevue/ripple';
import { resolveComponent, resolveDirective, openBlock, createBlock, Fragment, withCtx, withDirectives, createVNode, toDisplayString, resolveDynamicComponent, createCommentVNode, Teleport, Transition, mergeProps, renderList, renderSlot, createTextVNode } from 'vue';

var script$1 = {
    name: 'Menuitem',
    inheritAttrs: false,
    emits: ['click'],
    props: {
        item: null,
        template: null,
        exact: null
    },
    methods: {
        onClick(event, navigate) {
            this.$emit('click', {
                originalEvent: event,
                item: this.item,
                navigate: navigate
            });
        },
        linkClass(item, routerProps) {
            return ['p-menuitem-link', {
                'p-disabled': this.disabled(item),
                'router-link-active': routerProps && routerProps.isActive,
                'router-link-active-exact': this.exact && routerProps && routerProps.isExactActive
            }];
        },
        visible() {
            return (typeof this.item.visible === 'function' ? this.item.visible() : this.item.visible !== false);
        },
        disabled(item) {
            return (typeof item.disabled === 'function' ? item.disabled() : item.disabled);
        },
        label() {
            return (typeof this.item.label === 'function' ? this.item.label() : this.item.label);
        }
    },
    computed: {
        containerClass() {
            return ['p-menuitem', this.item.class];
        }
    },
    directives: {
        'ripple': Ripple
    }
};

const _hoisted_1$1 = { class: "p-menuitem-text" };
const _hoisted_2$1 = { class: "p-menuitem-text" };

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  const _directive_ripple = resolveDirective("ripple");

  return ($options.visible())
    ? (openBlock(), createBlock("li", {
        key: 0,
        class: $options.containerClass,
        role: "none",
        style: $props.item.style
      }, [
        (!$props.template)
          ? (openBlock(), createBlock(Fragment, { key: 0 }, [
              ($props.item.to && !$options.disabled($props.item))
                ? (openBlock(), createBlock(_component_router_link, {
                    key: 0,
                    to: $props.item.to,
                    custom: ""
                  }, {
                    default: withCtx(({navigate, href, isActive, isExactActive}) => [
                      withDirectives(createVNode("a", {
                        href: href,
                        onClick: $event => ($options.onClick($event, navigate)),
                        class: $options.linkClass($props.item, {isActive, isExactActive}),
                        role: "menuitem"
                      }, [
                        createVNode("span", {
                          class: ['p-menuitem-icon', $props.item.icon]
                        }, null, 2 /* CLASS */),
                        createVNode("span", _hoisted_1$1, toDisplayString($options.label()), 1 /* TEXT */)
                      ], 10 /* CLASS, PROPS */, ["href", "onClick"]), [
                        [_directive_ripple]
                      ])
                    ]),
                    _: 1 /* STABLE */
                  }, 8 /* PROPS */, ["to"]))
                : withDirectives((openBlock(), createBlock("a", {
                    key: 1,
                    href: $props.item.url,
                    class: $options.linkClass($props.item),
                    onClick: _cache[1] || (_cache[1] = (...args) => ($options.onClick && $options.onClick(...args))),
                    target: $props.item.target,
                    role: "menuitem",
                    tabindex: $options.disabled($props.item) ? null : '0'
                  }, [
                    createVNode("span", {
                      class: ['p-menuitem-icon', $props.item.icon]
                    }, null, 2 /* CLASS */),
                    createVNode("span", _hoisted_2$1, toDisplayString($options.label()), 1 /* TEXT */)
                  ], 10 /* CLASS, PROPS */, ["href", "target", "tabindex"])), [
                    [_directive_ripple]
                  ])
            ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
          : (openBlock(), createBlock(resolveDynamicComponent($props.template), {
              key: 1,
              item: $props.item
            }, null, 8 /* PROPS */, ["item"]))
      ], 6 /* CLASS, STYLE */))
    : createCommentVNode("v-if", true)
}

script$1.render = render$1;
script$1.__file = "src/components/menu/Menuitem.vue";

var script = {
    name: 'Menu',
    emits: ['show', 'hide'],
    inheritAttrs: false,
    props: {
        popup: {
            type: Boolean,
            default: false
        },
		model: {
            type: Array,
            default: null
        },
        appendTo: {
            type: String,
            default: 'body'
        },
        autoZIndex: {
            type: Boolean,
            default: true
        },
        baseZIndex: {
            type: Number,
            default: 0
        },
        exact: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            overlayVisible: false
        };
    },
    target: null,
    outsideClickListener: null,
    scrollHandler: null,
    resizeListener: null,
    container: null,
    beforeUnmount() {
        this.unbindResizeListener();
        this.unbindOutsideClickListener();

        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }
        this.target = null;

        if (this.container && this.autoZIndex) {
            ZIndexUtils.clear(this.container);
        }
        this.container = null;
    },
    methods: {
        itemClick(event) {
            const item = event.item;
            if (item.disabled) {
                return;
            }

            if (item.command) {
                item.command(event);
            }

            if (item.to && event.navigate) {
                event.navigate(event.originalEvent);
            }

            this.hide();
        },
        toggle(event) {
            if (this.overlayVisible)
                this.hide();
            else
                this.show(event);
        },
        show(event) {
            this.overlayVisible = true;
            this.target = event.currentTarget;
        },
        hide() {
            this.overlayVisible = false;
            this.target = null;
        },
        onEnter(el) {
            this.alignOverlay();
            this.bindOutsideClickListener();
            this.bindResizeListener();
            this.bindScrollListener();

            if (this.autoZIndex) {
                ZIndexUtils.set('menu', el, this.baseZIndex + this.$primevue.config.zIndex.menu);
            }

            this.$emit('show');
        },
        onLeave() {
            this.unbindOutsideClickListener();
            this.unbindResizeListener();
            this.unbindScrollListener();
            this.$emit('hide');
        },
        onAfterLeave(el) {
            if (this.autoZIndex) {
                ZIndexUtils.clear(el);
            }
        },
        alignOverlay() {
            DomHandler.absolutePosition(this.container, this.target);
            this.container.style.minWidth = DomHandler.getOuterWidth(this.target) + 'px';
        },
        bindOutsideClickListener() {
            if (!this.outsideClickListener) {
                this.outsideClickListener = (event) => {
                    if (this.overlayVisible && this.container && !this.container.contains(event.target) && !this.isTargetClicked(event)) {
                        this.hide();
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
                this.scrollHandler = new ConnectedOverlayScrollHandler(this.target, () => {
                    if (this.overlayVisible) {
                        this.hide();
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
                    if (this.overlayVisible) {
                        this.hide();
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
        visible(item) {
            return (typeof item.visible === 'function' ? item.visible() : item.visible !== false);
        },
        label(item) {
            return (typeof item.label === 'function' ? item.label() : item.label);
        },
        containerRef(el) {
            this.container = el;
        },
        onOverlayClick(event) {
            OverlayEventBus.emit('overlay-click', {
                originalEvent: event,
                target: this.target
            });
        }
    },
    computed: {
        containerClass() {
            return ['p-menu p-component', {
                'p-menu-overlay': this.popup,
                'p-input-filled': this.$primevue.config.inputStyle === 'filled',
                'p-ripple-disabled': this.$primevue.config.ripple === false
            }]
        }
    },
    components: {
        'Menuitem': script$1
    }
};

const _hoisted_1 = {
  class: "p-menu-list p-reset",
  role: "menu"
};
const _hoisted_2 = {
  key: 0,
  class: "p-submenu-header"
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Menuitem = resolveComponent("Menuitem");

  return (openBlock(), createBlock(Teleport, {
    to: $props.appendTo,
    disabled: !$props.popup
  }, [
    createVNode(Transition, {
      name: "p-connected-overlay",
      onEnter: $options.onEnter,
      onLeave: $options.onLeave,
      onAfterLeave: $options.onAfterLeave
    }, {
      default: withCtx(() => [
        ($props.popup ? $data.overlayVisible : true)
          ? (openBlock(), createBlock("div", mergeProps({
              key: 0,
              ref: $options.containerRef,
              class: $options.containerClass
            }, _ctx.$attrs, {
              onClick: _cache[1] || (_cache[1] = (...args) => ($options.onOverlayClick && $options.onOverlayClick(...args)))
            }), [
              createVNode("ul", _hoisted_1, [
                (openBlock(true), createBlock(Fragment, null, renderList($props.model, (item, i) => {
                  return (openBlock(), createBlock(Fragment, {
                    key: $options.label(item) + i.toString()
                  }, [
                    (item.items && $options.visible(item) && !item.separator)
                      ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                          (item.items)
                            ? (openBlock(), createBlock("li", _hoisted_2, [
                                renderSlot(_ctx.$slots, "item", { item: item }, () => [
                                  createTextVNode(toDisplayString($options.label(item)), 1 /* TEXT */)
                                ])
                              ]))
                            : createCommentVNode("v-if", true),
                          (openBlock(true), createBlock(Fragment, null, renderList(item.items, (child, j) => {
                            return (openBlock(), createBlock(Fragment, {
                              key: child.label + i + j
                            }, [
                              ($options.visible(child) && !child.separator)
                                ? (openBlock(), createBlock(_component_Menuitem, {
                                    key: 0,
                                    item: child,
                                    onClick: $options.itemClick,
                                    template: _ctx.$slots.item,
                                    exact: $props.exact
                                  }, null, 8 /* PROPS */, ["item", "onClick", "template", "exact"]))
                                : ($options.visible(child) && child.separator)
                                  ? (openBlock(), createBlock("li", {
                                      class: ['p-menu-separator', child.class],
                                      style: child.style,
                                      key: 'separator' + i + j,
                                      role: "separator"
                                    }, null, 6 /* CLASS, STYLE */))
                                  : createCommentVNode("v-if", true)
                            ], 64 /* STABLE_FRAGMENT */))
                          }), 128 /* KEYED_FRAGMENT */))
                        ], 64 /* STABLE_FRAGMENT */))
                      : ($options.visible(item) && item.separator)
                        ? (openBlock(), createBlock("li", {
                            class: ['p-menu-separator', item.class],
                            style: item.style,
                            key: 'separator' + i.toString(),
                            role: "separator"
                          }, null, 6 /* CLASS, STYLE */))
                        : (openBlock(), createBlock(_component_Menuitem, {
                            key: $options.label(item) + i.toString(),
                            item: item,
                            onClick: $options.itemClick,
                            template: _ctx.$slots.item,
                            exact: $props.exact
                          }, null, 8 /* PROPS */, ["item", "onClick", "template", "exact"]))
                  ], 64 /* STABLE_FRAGMENT */))
                }), 128 /* KEYED_FRAGMENT */))
              ])
            ], 16 /* FULL_PROPS */))
          : createCommentVNode("v-if", true)
      ]),
      _: 3 /* FORWARDED */
    }, 8 /* PROPS */, ["onEnter", "onLeave", "onAfterLeave"])
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

var css_248z = "\n.p-menu-overlay {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\n}\n.p-menu ul {\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style: none;\n}\n.p-menu .p-menuitem-link {\r\n    cursor: pointer;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    text-decoration: none;\r\n    overflow: hidden;\r\n    position: relative;\n}\n.p-menu .p-menuitem-text {\r\n    line-height: 1;\n}\r\n";
styleInject(css_248z);

script.render = render;
script.__file = "src/components/menu/Menu.vue";

export { script as default };

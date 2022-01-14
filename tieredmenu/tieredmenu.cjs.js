'use strict';

var utils = require('primevue/utils');
var OverlayEventBus = require('primevue/overlayeventbus');
var Ripple = require('primevue/ripple');
var vue = require('vue');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var OverlayEventBus__default = /*#__PURE__*/_interopDefaultLegacy(OverlayEventBus);
var Ripple__default = /*#__PURE__*/_interopDefaultLegacy(Ripple);

var script$1 = {
    name: 'TieredMenuSub',
    emits: ['leaf-click', 'keydown-item'],
    props: {
        model: {
            type: Array,
            default: null
        },
        root: {
            type: Boolean,
            default: false
        },
        popup: {
            type: Boolean,
            default: false
        },
        parentActive: {
            type: Boolean,
            default: false
        },
        template: {
            type: Function,
            default: null
        },
        exact: {
            type: Boolean,
            default: true
        }
    },
    documentClickListener: null,
    watch: {
        parentActive(newValue) {
            if (!newValue) {
                this.activeItem = null;
            }
        }
    },
    data() {
        return {
            activeItem: null
        }
    },
    updated() {
        if (this.root && this.activeItem) {
            this.bindDocumentClickListener();
        }
    },
    beforeUnmount() {
        this.unbindDocumentClickListener();
    },
    methods: {
        onItemMouseEnter(event, item) {
            if (this.disabled(item)) {
                event.preventDefault();
                return;
            }

            if (this.root) {
                if (this.activeItem || this.popup) {
                    this.activeItem = item;
                }
            }
            else {
                this.activeItem = item;
            }
        },
        onItemClick(event, item, navigate) {
            if (this.disabled(item)) {
                event.preventDefault();
                return;
            }

            if (item.command) {
                item.command({
                    originalEvent: event,
                    item: item
                });
            }

            if (item.items) {
                if (this.activeItem && item === this.activeItem)
                    this.activeItem = null;
                else
                   this.activeItem = item;
            }

            if (!item.items) {
                this.onLeafClick();
            }

            if (item.to && navigate) {
                navigate(event);
            }
        },
        onLeafClick() {
            this.activeItem = null;
            this.$emit('leaf-click');
        },
        onItemKeyDown(event, item) {
            let listItem = event.currentTarget.parentElement;

            switch (event.which) {
                //down
                case 40:
                    var nextItem = this.findNextItem(listItem);
                    if (nextItem) {
                        nextItem.children[0].focus();
                    }

                    event.preventDefault();
                break;

                //up
                case 38:
                    var prevItem = this.findPrevItem(listItem);
                    if (prevItem) {
                        prevItem.children[0].focus();
                    }

                    event.preventDefault();
                break;

                //right
                case 39:
                    if (item.items) {
                        this.activeItem = item;

                        setTimeout(() => {
                            listItem.children[1].children[0].children[0].focus();
                        }, 50);
                    }

                    event.preventDefault();
                break;
            }

            this.$emit('keydown-item', {
                originalEvent: event,
                element: listItem
            });
        },
        onChildItemKeyDown(event) {
            //left
            if (event.originalEvent.which === 37) {
                this.activeItem = null;
                event.element.parentElement.previousElementSibling.focus();
            }
        },
        findNextItem(item) {
            let nextItem = item.nextElementSibling;

            if (nextItem)
                return utils.DomHandler.hasClass(nextItem, 'p-disabled') || !utils.DomHandler.hasClass(nextItem, 'p-menuitem') ? this.findNextItem(nextItem) : nextItem;
            else
                return null;
        },
        findPrevItem(item) {
            let prevItem = item.previousElementSibling;

            if (prevItem)
                return utils.DomHandler.hasClass(prevItem, 'p-disabled') || !utils.DomHandler.hasClass(prevItem, 'p-menuitem') ? this.findPrevItem(prevItem) : prevItem;
            else
                return null;
        },
        getItemClass(item) {
            return [
                'p-menuitem', item.class, {
                    'p-menuitem-active': this.activeItem === item
                }
            ]
        },
        linkClass(item, routerProps) {
            return ['p-menuitem-link', {
                'p-disabled': this.disabled(item),
                'router-link-active': routerProps && routerProps.isActive,
                'router-link-active-exact': this.exact && routerProps && routerProps.isExactActive
            }];
        },
        bindDocumentClickListener() {
            if (!this.documentClickListener) {
                this.documentClickListener = (event) => {
                    if (this.$el && !this.$el.contains(event.target)) {
                        this.activeItem = null;
                        this.unbindDocumentClickListener();
                    }
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
        visible(item) {
            return (typeof item.visible === 'function' ? item.visible() : item.visible !== false);
        },
        disabled(item) {
            return (typeof item.disabled === 'function' ? item.disabled() : item.disabled);
        },
        label(item) {
            return (typeof item.label === 'function' ? item.label() : item.label);
        }
    },
    computed: {
        containerClass() {
            return {'p-submenu-list': !this.root};
        }
    },
    directives: {
        'ripple': Ripple__default["default"]
    }
};

const _hoisted_1 = { class: "p-menuitem-text" };
const _hoisted_2 = { class: "p-menuitem-text" };
const _hoisted_3 = {
  key: 0,
  class: "p-submenu-icon pi pi-angle-right"
};

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = vue.resolveComponent("router-link");
  const _component_TieredMenuSub = vue.resolveComponent("TieredMenuSub", true);
  const _directive_ripple = vue.resolveDirective("ripple");

  return (vue.openBlock(), vue.createBlock("ul", {
    ref: "element",
    class: $options.containerClass,
    role: "'menubar' : 'menu'",
    "aria-orientation": "horizontal"
  }, [
    (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($props.model, (item, i) => {
      return (vue.openBlock(), vue.createBlock(vue.Fragment, {
        key: $options.label(item) + i.toString()
      }, [
        ($options.visible(item) && !item.separator)
          ? (vue.openBlock(), vue.createBlock("li", {
              key: 0,
              class: $options.getItemClass(item),
              style: item.style,
              onMouseenter: $event => ($options.onItemMouseEnter($event, item)),
              role: "none"
            }, [
              (!$props.template)
                ? (vue.openBlock(), vue.createBlock(vue.Fragment, { key: 0 }, [
                    (item.to && !$options.disabled(item))
                      ? (vue.openBlock(), vue.createBlock(_component_router_link, {
                          key: 0,
                          to: item.to,
                          custom: ""
                        }, {
                          default: vue.withCtx(({navigate, href, isActive, isExactActive}) => [
                            vue.withDirectives(vue.createVNode("a", {
                              href: href,
                              onClick: $event => ($options.onItemClick($event, item, navigate)),
                              class: $options.linkClass(item, {isActive, isExactActive}),
                              onKeydown: $event => ($options.onItemKeyDown($event, item)),
                              role: "menuitem"
                            }, [
                              vue.createVNode("span", {
                                class: ['p-menuitem-icon', item.icon]
                              }, null, 2 /* CLASS */),
                              vue.createVNode("span", _hoisted_1, vue.toDisplayString($options.label(item)), 1 /* TEXT */)
                            ], 42 /* CLASS, PROPS, HYDRATE_EVENTS */, ["href", "onClick", "onKeydown"]), [
                              [_directive_ripple]
                            ])
                          ]),
                          _: 2 /* DYNAMIC */
                        }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["to"]))
                      : vue.withDirectives((vue.openBlock(), vue.createBlock("a", {
                          key: 1,
                          href: item.url,
                          class: $options.linkClass(item),
                          target: item.target,
                          "aria-haspopup": item.items != null,
                          "aria-expanded": item === $data.activeItem,
                          onClick: $event => ($options.onItemClick($event, item)),
                          onKeydown: $event => ($options.onItemKeyDown($event, item)),
                          role: "menuitem",
                          tabindex: $options.disabled(item) ? null : '0'
                        }, [
                          vue.createVNode("span", {
                            class: ['p-menuitem-icon', item.icon]
                          }, null, 2 /* CLASS */),
                          vue.createVNode("span", _hoisted_2, vue.toDisplayString($options.label(item)), 1 /* TEXT */),
                          (item.items)
                            ? (vue.openBlock(), vue.createBlock("span", _hoisted_3))
                            : vue.createCommentVNode("v-if", true)
                        ], 42 /* CLASS, PROPS, HYDRATE_EVENTS */, ["href", "target", "aria-haspopup", "aria-expanded", "onClick", "onKeydown", "tabindex"])), [
                          [_directive_ripple]
                        ])
                  ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
                : (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent($props.template), {
                    key: 1,
                    item: item
                  }, null, 8 /* PROPS */, ["item"])),
              ($options.visible(item) && item.items)
                ? (vue.openBlock(), vue.createBlock(_component_TieredMenuSub, {
                    model: item.items,
                    key: $options.label(item) + '_sub_',
                    template: $props.template,
                    onLeafClick: $options.onLeafClick,
                    onKeydownItem: $options.onChildItemKeyDown,
                    parentActive: item === $data.activeItem,
                    exact: $props.exact
                  }, null, 8 /* PROPS */, ["model", "template", "onLeafClick", "onKeydownItem", "parentActive", "exact"]))
                : vue.createCommentVNode("v-if", true)
            ], 46 /* CLASS, STYLE, PROPS, HYDRATE_EVENTS */, ["onMouseenter"]))
          : vue.createCommentVNode("v-if", true),
        ($options.visible(item) && item.separator)
          ? (vue.openBlock(), vue.createBlock("li", {
              class: ['p-menu-separator', item.class],
              style: item.style,
              key: 'separator' + i.toString(),
              role: "separator"
            }, null, 6 /* CLASS, STYLE */))
          : vue.createCommentVNode("v-if", true)
      ], 64 /* STABLE_FRAGMENT */))
    }), 128 /* KEYED_FRAGMENT */))
  ], 2 /* CLASS */))
}

script$1.render = render$1;

var script = {
    name: 'TieredMenu',
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
    target: null,
    container: null,
    outsideClickListener: null,
    scrollHandler: null,
    resizeListener: null,
    data() {
        return {
            visible: false
        };
    },
    beforeUnmount() {
        this.unbindResizeListener();
        this.unbindOutsideClickListener();

        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }
        this.target = null;
        if (this.container && this.autoZIndex) {
            utils.ZIndexUtils.clear(this.container);
        }
        this.container = null;
    },
    methods: {
        itemClick(event) {
            const item = event.item;
            if (item.command) {
                item.command(event);
                event.originalEvent.preventDefault();
            }
            this.hide();
        },
        toggle(event) {
            if (this.visible)
                this.hide();
            else
                this.show(event);
        },
        show(event) {
            this.visible = true;
            this.target = event.currentTarget;
        },
        hide() {
            this.visible = false;
        },
        onEnter(el) {
            this.alignOverlay();
            this.bindOutsideClickListener();
            this.bindResizeListener();
            this.bindScrollListener();

            if (this.autoZIndex) {
                utils.ZIndexUtils.set('menu', el, this.baseZIndex + this.$primevue.config.zIndex.menu);
            }
        },
        onLeave() {
            this.unbindOutsideClickListener();
            this.unbindResizeListener();
            this.unbindScrollListener();
        },
        onAfterLeave(el) {
            if (this.autoZIndex) {
                utils.ZIndexUtils.clear(el);
            }
        },
        alignOverlay() {
            utils.DomHandler.absolutePosition(this.container, this.target);
            this.container.style.minWidth = utils.DomHandler.getOuterWidth(this.target) + 'px';
        },
        bindOutsideClickListener() {
            if (!this.outsideClickListener) {
                this.outsideClickListener = (event) => {
                    if (this.visible && this.container && !this.container.contains(event.target) && !this.isTargetClicked(event)) {
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
                this.scrollHandler = new utils.ConnectedOverlayScrollHandler(this.target, () => {
                    if (this.visible) {
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
                    if (this.visible) {
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
        onLeafClick() {
            if (this.popup) {
                this.hide();
            }
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
            return ['p-tieredmenu p-component', {
                'p-tieredmenu-overlay': this.popup,
                'p-input-filled': this.$primevue.config.inputStyle === 'filled',
                'p-ripple-disabled': this.$primevue.config.ripple === false
            }];
        }
    },
    components: {
        'TieredMenuSub': script$1
    }
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_TieredMenuSub = vue.resolveComponent("TieredMenuSub");

  return (vue.openBlock(), vue.createBlock(vue.Teleport, {
    to: $props.appendTo,
    disabled: !$props.popup
  }, [
    vue.createVNode(vue.Transition, {
      name: "p-connected-overlay",
      onEnter: $options.onEnter,
      onLeave: $options.onLeave,
      onAfterLeave: $options.onAfterLeave
    }, {
      default: vue.withCtx(() => [
        ($props.popup ? $data.visible : true)
          ? (vue.openBlock(), vue.createBlock("div", vue.mergeProps({
              key: 0,
              ref: $options.containerRef,
              class: $options.containerClass
            }, _ctx.$attrs, {
              onClick: _cache[1] || (_cache[1] = (...args) => ($options.onOverlayClick && $options.onOverlayClick(...args)))
            }), [
              vue.createVNode(_component_TieredMenuSub, {
                model: $props.model,
                root: true,
                popup: $props.popup,
                onLeafClick: $options.onLeafClick,
                template: _ctx.$slots.item,
                exact: $props.exact
              }, null, 8 /* PROPS */, ["model", "popup", "onLeafClick", "template", "exact"])
            ], 16 /* FULL_PROPS */))
          : vue.createCommentVNode("v-if", true)
      ]),
      _: 1 /* STABLE */
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

var css_248z = "\n.p-tieredmenu-overlay {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\n}\n.p-tieredmenu ul {\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style: none;\n}\n.p-tieredmenu .p-submenu-list {\r\n    position: absolute;\r\n    min-width: 100%;\r\n    z-index: 1;\r\n    display: none;\n}\n.p-tieredmenu .p-menuitem-link {\r\n    cursor: pointer;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    text-decoration: none;\r\n    overflow: hidden;\r\n    position: relative;\n}\n.p-tieredmenu .p-menuitem-text {\r\n    line-height: 1;\n}\n.p-tieredmenu .p-menuitem {\r\n    position: relative;\n}\n.p-tieredmenu .p-menuitem-link .p-submenu-icon {\r\n    margin-left: auto;\n}\n.p-tieredmenu .p-menuitem-active > .p-submenu-list {\r\n    display: block;\r\n    left: 100%;\r\n    top: 0;\n}\r\n";
styleInject(css_248z);

script.render = render;

module.exports = script;

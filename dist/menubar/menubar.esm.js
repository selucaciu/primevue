import { DomHandler, ZIndexUtils } from 'primevue/utils';
import Ripple from 'primevue/ripple';
import { resolveComponent, resolveDirective, openBlock, createBlock, Fragment, renderList, withCtx, withDirectives, createVNode, toDisplayString, createCommentVNode, resolveDynamicComponent, renderSlot } from 'vue';

var script$1 = {
    name: 'MenubarSub',
    emits: ['keydown-item', 'leaf-click'],
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
        mobileActive: {
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
            if (this.disabled(item) || this.mobileActive) {
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

            switch(event.which) {
                //down
                case 40:
                    if (this.root) {
                        if (item.items) {
                            this.expandSubmenu(item, listItem);
                        }
                    }
                    else {
                        this.navigateToNextItem(listItem);
                    }

                    event.preventDefault();
                break;

                //up
                case 38:
                    if (!this.root) {
                        this.navigateToPrevItem(listItem);
                    }

                    event.preventDefault();
                break;

                //right
                case 39:
                    if (this.root) {
                        var nextItem = this.findNextItem(listItem);
                        if (nextItem) {
                            nextItem.children[0].focus();
                        }
                    }
                    else {
                        if (item.items) {
                            this.expandSubmenu(item, listItem);
                        }
                    }

                    event.preventDefault();
                break;

                //left
                case 37:
                    if (this.root) {
                        this.navigateToPrevItem(listItem);
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
            if (this.root) {
                //up
                if (event.originalEvent.which === 38 && event.element.previousElementSibling == null) {
                    this.collapseMenu(event.element);
                }
            }
            else {
                //left
                if (event.originalEvent.which === 37) {
                    this.collapseMenu(event.element);
                }
            }
        },
        findNextItem(item) {
            let nextItem = item.nextElementSibling;

            if (nextItem)
                return DomHandler.hasClass(nextItem, 'p-disabled') || !DomHandler.hasClass(nextItem, 'p-menuitem') ? this.findNextItem(nextItem) : nextItem;
            else
                return null;
        },
        findPrevItem(item) {
            let prevItem = item.previousElementSibling;

            if (prevItem)
                return DomHandler.hasClass(prevItem, 'p-disabled') || !DomHandler.hasClass(prevItem, 'p-menuitem') ? this.findPrevItem(prevItem) : prevItem;
            else
                return null;
        },
        expandSubmenu(item, listItem) {
            this.activeItem = item;

            setTimeout(() => {
                listItem.children[1].children[0].children[0].focus();
            }, 50);
        },
        collapseMenu(listItem) {
            this.activeItem = null;
            listItem.parentElement.previousElementSibling.focus();
        },
        navigateToNextItem(listItem) {
            var nextItem = this.findNextItem(listItem);
            if (nextItem) {
                nextItem.children[0].focus();
            }
        },
        navigateToPrevItem(listItem) {
            var prevItem = this.findPrevItem(listItem);
            if (prevItem) {
                prevItem.children[0].focus();
            }
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
        getSubmenuIcon() {
            return [
                'p-submenu-icon pi', {'pi-angle-right': !this.root, 'pi-angle-down': this.root}
            ];
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
            return {'p-submenu-list': !this.root, 'p-menubar-root-list': this.root};
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
  const _component_MenubarSub = resolveComponent("MenubarSub", true);
  const _directive_ripple = resolveDirective("ripple");

  return (openBlock(), createBlock("ul", {
    class: $options.containerClass,
    role: $props.root ? 'menubar' : 'menu'
  }, [
    (openBlock(true), createBlock(Fragment, null, renderList($props.model, (item, i) => {
      return (openBlock(), createBlock(Fragment, {
        key: $options.label(item) + i.toString()
      }, [
        ($options.visible(item) && !item.separator)
          ? (openBlock(), createBlock("li", {
              key: 0,
              role: "none",
              class: $options.getItemClass(item),
              style: item.style,
              onMouseenter: $event => ($options.onItemMouseEnter($event, item))
            }, [
              (!$props.template)
                ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                    (item.to && !$options.disabled(item))
                      ? (openBlock(), createBlock(_component_router_link, {
                          key: 0,
                          to: item.to,
                          custom: ""
                        }, {
                          default: withCtx(({navigate, href, isActive, isExactActive}) => [
                            withDirectives(createVNode("a", {
                              href: href,
                              onClick: $event => ($options.onItemClick($event, item, navigate)),
                              class: $options.linkClass(item, {isActive, isExactActive}),
                              onKeydown: $event => ($options.onItemKeyDown($event, item)),
                              role: "menuitem"
                            }, [
                              createVNode("span", {
                                class: ['p-menuitem-icon', item.icon]
                              }, null, 2 /* CLASS */),
                              createVNode("span", _hoisted_1$1, toDisplayString($options.label(item)), 1 /* TEXT */)
                            ], 42 /* CLASS, PROPS, HYDRATE_EVENTS */, ["href", "onClick", "onKeydown"]), [
                              [_directive_ripple]
                            ])
                          ]),
                          _: 2 /* DYNAMIC */
                        }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["to"]))
                      : withDirectives((openBlock(), createBlock("a", {
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
                          createVNode("span", {
                            class: ['p-menuitem-icon', item.icon]
                          }, null, 2 /* CLASS */),
                          createVNode("span", _hoisted_2$1, toDisplayString($options.label(item)), 1 /* TEXT */),
                          (item.items)
                            ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: $options.getSubmenuIcon()
                              }, null, 2 /* CLASS */))
                            : createCommentVNode("v-if", true)
                        ], 42 /* CLASS, PROPS, HYDRATE_EVENTS */, ["href", "target", "aria-haspopup", "aria-expanded", "onClick", "onKeydown", "tabindex"])), [
                          [_directive_ripple]
                        ])
                  ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
                : (openBlock(), createBlock(resolveDynamicComponent($props.template), {
                    key: 1,
                    item: item
                  }, null, 8 /* PROPS */, ["item"])),
              ($options.visible(item) && item.items)
                ? (openBlock(), createBlock(_component_MenubarSub, {
                    model: item.items,
                    key: $options.label(item) + '_sub_',
                    mobileActive: $props.mobileActive,
                    onLeafClick: $options.onLeafClick,
                    onKeydownItem: $options.onChildItemKeyDown,
                    parentActive: item === $data.activeItem,
                    template: $props.template,
                    exact: $props.exact
                  }, null, 8 /* PROPS */, ["model", "mobileActive", "onLeafClick", "onKeydownItem", "parentActive", "template", "exact"]))
                : createCommentVNode("v-if", true)
            ], 46 /* CLASS, STYLE, PROPS, HYDRATE_EVENTS */, ["onMouseenter"]))
          : createCommentVNode("v-if", true),
        ($options.visible(item) && item.separator)
          ? (openBlock(), createBlock("li", {
              class: ['p-menu-separator', item.class],
              style: item.style,
              key: 'separator' + i.toString(),
              role: "separator"
            }, null, 6 /* CLASS, STYLE */))
          : createCommentVNode("v-if", true)
      ], 64 /* STABLE_FRAGMENT */))
    }), 128 /* KEYED_FRAGMENT */))
  ], 10 /* CLASS, PROPS */, ["role"]))
}

script$1.render = render$1;
script$1.__file = "src/components/menubar/MenubarSub.vue";

var script = {
    name: 'Menubar',
    props: {
		model: {
            type: Array,
            default: null
        },
        exact: {
            type: Boolean,
            default: true
        }
    },
    outsideClickListener: null,
    data() {
        return {
            mobileActive: false
        }
    },
    beforeUnmount() {
        this.mobileActive = false;
        this.unbindOutsideClickListener();
        if (this.$refs.rootmenu && this.$refs.rootmenu.$el) {
            ZIndexUtils.clear(this.$refs.rootmenu.$el);
        }
    },
    methods: {
        toggle(event) {
            if (this.mobileActive) {
                this.mobileActive = false;
                ZIndexUtils.clear(this.$refs.rootmenu.$el);
            }
            else {
                this.mobileActive = true;
                ZIndexUtils.set('menu', this.$refs.rootmenu.$el, this.$primevue.config.zIndex.menu);
            }

            this.bindOutsideClickListener();
            event.preventDefault();
        },
        bindOutsideClickListener() {
            if (!this.outsideClickListener) {
                this.outsideClickListener = (event) => {
                    if (this.mobileActive && this.$refs.rootmenu.$el !== event.target && !this.$refs.rootmenu.$el.contains(event.target)
                        && this.$refs.menubutton !== event.target && !this.$refs.menubutton.contains(event.target)) {
                        this.mobileActive = false;
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
        onLeafClick() {
            this.mobileActive = false;
        }
    },
    computed: {
        containerClass() {
            return ['p-menubar p-component', {'p-menubar-mobile-active': this.mobileActive}];
        }
    },
    components: {
        'MenubarSub': script$1
    }
};

const _hoisted_1 = {
  key: 0,
  class: "p-menubar-start"
};
const _hoisted_2 = /*#__PURE__*/createVNode("i", { class: "pi pi-bars" }, null, -1 /* HOISTED */);
const _hoisted_3 = {
  key: 1,
  class: "p-menubar-end"
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_MenubarSub = resolveComponent("MenubarSub");

  return (openBlock(), createBlock("div", { class: $options.containerClass }, [
    (_ctx.$slots.start)
      ? (openBlock(), createBlock("div", _hoisted_1, [
          renderSlot(_ctx.$slots, "start")
        ]))
      : createCommentVNode("v-if", true),
    createVNode("a", {
      ref: "menubutton",
      tabindex: "0",
      class: "p-menubar-button",
      onClick: _cache[1] || (_cache[1] = $event => ($options.toggle($event)))
    }, [
      _hoisted_2
    ], 512 /* NEED_PATCH */),
    createVNode(_component_MenubarSub, {
      ref: "rootmenu",
      model: $props.model,
      root: true,
      mobileActive: $data.mobileActive,
      onLeafClick: $options.onLeafClick,
      template: _ctx.$slots.item,
      exact: $props.exact
    }, null, 8 /* PROPS */, ["model", "mobileActive", "onLeafClick", "template", "exact"]),
    (_ctx.$slots.end)
      ? (openBlock(), createBlock("div", _hoisted_3, [
          renderSlot(_ctx.$slots, "end")
        ]))
      : createCommentVNode("v-if", true)
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

var css_248z = "\n.p-menubar {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\n}\n.p-menubar ul {\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style: none;\n}\n.p-menubar .p-menuitem-link {\r\n    cursor: pointer;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    text-decoration: none;\r\n    overflow: hidden;\r\n    position: relative;\n}\n.p-menubar .p-menuitem-text {\r\n    line-height: 1;\n}\n.p-menubar .p-menuitem {\r\n    position: relative;\n}\n.p-menubar-root-list {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\n}\n.p-menubar-root-list > li ul {\r\n    display: none;\r\n    z-index: 1;\n}\n.p-menubar-root-list > .p-menuitem-active > .p-submenu-list {\r\n    display: block;\n}\n.p-menubar .p-submenu-list {\r\n    display: none;\r\n    position: absolute;\r\n    z-index: 1;\n}\n.p-menubar .p-submenu-list > .p-menuitem-active > .p-submenu-list  {\r\n    display: block;\r\n    left: 100%;\r\n    top: 0;\n}\n.p-menubar .p-submenu-list .p-menuitem-link .p-submenu-icon {\r\n    margin-left: auto;\n}\n.p-menubar .p-menubar-custom,\r\n.p-menubar .p-menubar-end {\r\n    margin-left: auto;\r\n    -ms-flex-item-align: center;\r\n        align-self: center;\n}\n.p-menubar-button {\r\n    display: none;\r\n    cursor: pointer;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    text-decoration: none;\n}\r\n";
styleInject(css_248z);

script.render = render;
script.__file = "src/components/menubar/Menubar.vue";

export { script as default };
import { resolveComponent, openBlock, createBlock, Fragment, renderList, withCtx, createVNode, toDisplayString, createCommentVNode, resolveDynamicComponent, Transition, withDirectives, vShow } from 'vue';
import { UniqueComponentId } from 'primevue/utils';

var script$1 = {
    name: 'PanelMenuSub',
    emits: ['item-toggle'],
    props: {
		model: {
            type: null,
            default: null
        },
        template: {
            type: Function,
            default: null
        },
        expandedKeys: {
            type: null,
            default: null
        },
        exact: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            activeItem: null
        }
    },
    methods: {
        onItemClick(event, item, navigate) {
            if (this.isActive(item) && this.activeItem === null) {
                this.activeItem = item;
            }

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

            if (this.activeItem && this.activeItem === item)
                this.activeItem = null;
            else
                this.activeItem = item;

            this.$emit('item-toggle', {item: item, expanded: this.activeItem != null});

            if (item.to && navigate) {
                navigate(event);
            }
        },
        getItemClass(item) {
            return ['p-menuitem', item.className];
        },
        linkClass(item, routerProps) {
            return ['p-menuitem-link', {
                'p-disabled': this.disabled(item),
                'router-link-active': routerProps && routerProps.isActive,
                'router-link-active-exact': this.exact && routerProps && routerProps.isExactActive
            }];
        },
        isActive(item) {
            return this.expandedKeys ? this.expandedKeys[item.key] : item === this.activeItem;
        },
        getSubmenuIcon(item) {
            const active = this.isActive(item);
            return ['p-panelmenu-icon pi pi-fw', {'pi-angle-right': !active, 'pi-angle-down': active}];
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
    }
};

const _hoisted_1$1 = {
  class: "p-submenu-list",
  role: "tree"
};
const _hoisted_2$1 = { class: "p-menuitem-text" };
const _hoisted_3$1 = { class: "p-menuitem-text" };
const _hoisted_4$1 = { class: "p-toggleable-content" };

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  const _component_PanelMenuSub = resolveComponent("PanelMenuSub", true);

  return (openBlock(), createBlock("ul", _hoisted_1$1, [
    (openBlock(true), createBlock(Fragment, null, renderList($props.model, (item, i) => {
      return (openBlock(), createBlock(Fragment, {
        key: $options.label(item) + i.toString()
      }, [
        ($options.visible(item) && !item.separator)
          ? (openBlock(), createBlock("li", {
              key: 0,
              role: "none",
              class: $options.getItemClass(item),
              style: item.style
            }, [
              (!$props.template)
                ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                    (item.to && !$options.disabled(item))
                      ? (openBlock(), createBlock(_component_router_link, {
                          key: 0,
                          to: item.to,
                          custom: ""
                        }, {
                          default: withCtx(({navigate, href, isActive:isRouterActive, isExactActive}) => [
                            createVNode("a", {
                              href: href,
                              class: $options.linkClass(item, {isRouterActive, isExactActive}),
                              onClick: $event => ($options.onItemClick($event, item, navigate)),
                              role: "treeitem",
                              "aria-expanded": $options.isActive(item)
                            }, [
                              createVNode("span", {
                                class: ['p-menuitem-icon', item.icon]
                              }, null, 2 /* CLASS */),
                              createVNode("span", _hoisted_2$1, toDisplayString($options.label(item)), 1 /* TEXT */)
                            ], 10 /* CLASS, PROPS */, ["href", "onClick", "aria-expanded"])
                          ]),
                          _: 2 /* DYNAMIC */
                        }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["to"]))
                      : (openBlock(), createBlock("a", {
                          key: 1,
                          href: item.url,
                          class: $options.linkClass(item),
                          target: item.target,
                          onClick: $event => ($options.onItemClick($event, item)),
                          role: "treeitem",
                          "aria-expanded": $options.isActive(item),
                          tabindex: $options.disabled(item) ? null : '0'
                        }, [
                          (item.items)
                            ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: $options.getSubmenuIcon(item)
                              }, null, 2 /* CLASS */))
                            : createCommentVNode("v-if", true),
                          createVNode("span", {
                            class: ['p-menuitem-icon', item.icon]
                          }, null, 2 /* CLASS */),
                          createVNode("span", _hoisted_3$1, toDisplayString($options.label(item)), 1 /* TEXT */)
                        ], 10 /* CLASS, PROPS */, ["href", "target", "onClick", "aria-expanded", "tabindex"]))
                  ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
                : (openBlock(), createBlock(resolveDynamicComponent($props.template), {
                    key: 1,
                    item: item
                  }, null, 8 /* PROPS */, ["item"])),
              createVNode(Transition, { name: "p-toggleable-content" }, {
                default: withCtx(() => [
                  withDirectives(createVNode("div", _hoisted_4$1, [
                    ($options.visible(item) && item.items)
                      ? (openBlock(), createBlock(_component_PanelMenuSub, {
                          model: item.items,
                          key: $options.label(item) + '_sub_',
                          template: $props.template,
                          expandedKeys: $props.expandedKeys,
                          onItemToggle: _cache[1] || (_cache[1] = $event => (_ctx.$emit('item-toggle', $event))),
                          exact: $props.exact
                        }, null, 8 /* PROPS */, ["model", "template", "expandedKeys", "exact"]))
                      : createCommentVNode("v-if", true)
                  ], 512 /* NEED_PATCH */), [
                    [vShow, $options.isActive(item)]
                  ])
                ]),
                _: 2 /* DYNAMIC */
              }, 1024 /* DYNAMIC_SLOTS */)
            ], 6 /* CLASS, STYLE */))
          : createCommentVNode("v-if", true),
        ($options.visible(item) && item.separator)
          ? (openBlock(), createBlock("li", {
              class: ['p-menu-separator', item.class],
              style: item.style,
              key: 'separator' + i.toString()
            }, null, 6 /* CLASS, STYLE */))
          : createCommentVNode("v-if", true)
      ], 64 /* STABLE_FRAGMENT */))
    }), 128 /* KEYED_FRAGMENT */))
  ]))
}

script$1.render = render$1;

var script = {
    name: 'PanelMenu',
    emits: ['update:expandedKeys'],
    props: {
		model: {
            type: Array,
            default: null
        },
        expandedKeys: {
            type: null,
            default: null
        },
        exact: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            activeItem: null
        }
    },
    methods: {
        onItemClick(event, item, navigate) {
            if (this.isActive(item) && this.activeItem === null) {
                this.activeItem = item;
            }
            
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

            if (this.activeItem && this.activeItem === item)
                this.activeItem = null;
            else
                this.activeItem = item;

            this.updateExpandedKeys({item: item, expanded: this.activeItem != null});
        
            if (item.to && navigate) {
                navigate(event);
            }
        },
        updateExpandedKeys(event) {
            if (this.expandedKeys) {
                let item = event.item;
                let _keys = {...this.expandedKeys};

                if (event.expanded)
                    _keys[item.key] = true;
                else
                    delete _keys[item.key];

                this.$emit('update:expandedKeys', _keys);
            }
        },
        getPanelClass(item) {
            return ['p-panelmenu-panel', item.class];
        },
        getPanelToggleIcon(item) {
            const active = this.isActive(item);
            return ['p-panelmenu-icon pi', {'pi-chevron-right': !active,' pi-chevron-down': active}];
        },
        getPanelIcon(item) {
            return ['p-menuitem-icon', item.icon];
        },
        getHeaderLinkClass(item, routerProps) {
            return ['p-panelmenu-header-link', {
                'router-link-active': routerProps && routerProps.isActive,
                'router-link-active-exact': this.exact && routerProps && routerProps.isExactActive
            }];
        },
        isActive(item) {
            return this.expandedKeys ? this.expandedKeys[item.key] : item === this.activeItem;
        },
        getHeaderClass(item) {
            return ['p-component p-panelmenu-header', {'p-highlight': this.isActive(item), 'p-disabled': this.disabled(item)}];
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
    components: {
        'PanelMenuSub': script$1
    },
    computed: {
        ariaId() {
            return UniqueComponentId();
        }
    }
};

const _hoisted_1 = { class: "p-panelmenu p-component" };
const _hoisted_2 = { class: "p-menuitem-text" };
const _hoisted_3 = { class: "p-menuitem-text" };
const _hoisted_4 = {
  key: 0,
  class: "p-panelmenu-content"
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  const _component_PanelMenuSub = resolveComponent("PanelMenuSub");

  return (openBlock(), createBlock("div", _hoisted_1, [
    (openBlock(true), createBlock(Fragment, null, renderList($props.model, (item, index) => {
      return (openBlock(), createBlock(Fragment, {
        key: $options.label(item) + '_' + index
      }, [
        ($options.visible(item))
          ? (openBlock(), createBlock("div", {
              key: 0,
              class: $options.getPanelClass(item),
              style: item.style
            }, [
              createVNode("div", {
                class: $options.getHeaderClass(item),
                style: item.style
              }, [
                (!_ctx.$slots.item)
                  ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      (item.to && !$options.disabled(item))
                        ? (openBlock(), createBlock(_component_router_link, {
                            key: 0,
                            to: item.to,
                            custom: ""
                          }, {
                            default: withCtx(({navigate, href, isActive, isExactActive}) => [
                              createVNode("a", {
                                href: href,
                                class: $options.getHeaderLinkClass(item, {isActive, isExactActive}),
                                onClick: $event => ($options.onItemClick($event, item, navigate)),
                                role: "treeitem"
                              }, [
                                (item.icon)
                                  ? (openBlock(), createBlock("span", {
                                      key: 0,
                                      class: $options.getPanelIcon(item)
                                    }, null, 2 /* CLASS */))
                                  : createCommentVNode("v-if", true),
                                createVNode("span", _hoisted_2, toDisplayString($options.label(item)), 1 /* TEXT */)
                              ], 10 /* CLASS, PROPS */, ["href", "onClick"])
                            ]),
                            _: 2 /* DYNAMIC */
                          }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["to"]))
                        : (openBlock(), createBlock("a", {
                            key: 1,
                            href: item.url,
                            class: $options.getHeaderLinkClass(item),
                            onClick: $event => ($options.onItemClick($event, item)),
                            tabindex: $options.disabled(item) ? null : '0',
                            "aria-expanded": $options.isActive(item),
                            id: $options.ariaId +'_header_' + index,
                            "aria-controls": $options.ariaId +'_content_' + index
                          }, [
                            (item.items)
                              ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  class: $options.getPanelToggleIcon(item)
                                }, null, 2 /* CLASS */))
                              : createCommentVNode("v-if", true),
                            (item.icon)
                              ? (openBlock(), createBlock("span", {
                                  key: 1,
                                  class: $options.getPanelIcon(item)
                                }, null, 2 /* CLASS */))
                              : createCommentVNode("v-if", true),
                            createVNode("span", _hoisted_3, toDisplayString($options.label(item)), 1 /* TEXT */)
                          ], 10 /* CLASS, PROPS */, ["href", "onClick", "tabindex", "aria-expanded", "id", "aria-controls"]))
                    ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
                  : (openBlock(), createBlock(resolveDynamicComponent(_ctx.$slots.item), {
                      key: 1,
                      item: item
                    }, null, 8 /* PROPS */, ["item"]))
              ], 6 /* CLASS, STYLE */),
              createVNode(Transition, { name: "p-toggleable-content" }, {
                default: withCtx(() => [
                  withDirectives(createVNode("div", {
                    class: "p-toggleable-content",
                    role: "region",
                    id: $options.ariaId +'_content_' + index,
                    "aria-labelledby": $options.ariaId +'_header_' + index
                  }, [
                    (item.items)
                      ? (openBlock(), createBlock("div", _hoisted_4, [
                          createVNode(_component_PanelMenuSub, {
                            model: item.items,
                            class: "p-panelmenu-root-submenu",
                            template: _ctx.$slots.item,
                            expandedKeys: $props.expandedKeys,
                            onItemToggle: $options.updateExpandedKeys,
                            exact: $props.exact
                          }, null, 8 /* PROPS */, ["model", "template", "expandedKeys", "onItemToggle", "exact"])
                        ]))
                      : createCommentVNode("v-if", true)
                  ], 8 /* PROPS */, ["id", "aria-labelledby"]), [
                    [vShow, $options.isActive(item)]
                  ])
                ]),
                _: 2 /* DYNAMIC */
              }, 1024 /* DYNAMIC_SLOTS */)
            ], 6 /* CLASS, STYLE */))
          : createCommentVNode("v-if", true)
      ], 64 /* STABLE_FRAGMENT */))
    }), 128 /* KEYED_FRAGMENT */))
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

var css_248z = "\n.p-panelmenu .p-panelmenu-header-link {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-user-select: none;\r\n       -moz-user-select: none;\r\n        -ms-user-select: none;\r\n            user-select: none;\r\n    cursor: pointer;\r\n    position: relative;\r\n    text-decoration: none;\n}\n.p-panelmenu .p-panelmenu-header-link:focus {\r\n    z-index: 1;\n}\n.p-panelmenu .p-submenu-list {\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style: none;\n}\n.p-panelmenu .p-menuitem-link {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-user-select: none;\r\n       -moz-user-select: none;\r\n        -ms-user-select: none;\r\n            user-select: none;\r\n    cursor: pointer;\r\n    text-decoration: none;\n}\n.p-panelmenu .p-menuitem-text {\r\n    line-height: 1;\n}\r\n";
styleInject(css_248z);

script.render = render;

export { script as default };

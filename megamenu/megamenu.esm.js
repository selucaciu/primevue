import { DomHandler } from 'primevue/utils';
import Ripple from 'primevue/ripple';
import { resolveComponent, resolveDirective, openBlock, createBlock, renderSlot, createCommentVNode, createVNode, Fragment, renderList, withCtx, withDirectives, toDisplayString, resolveDynamicComponent } from 'vue';

var script = {
    name: 'MegaMenu',
    props: {
		model: {
            type: Array,
            default: null
        },
        orientation: {
            type: String,
            default: 'horizontal'
        },
        exact: {
            type: Boolean,
            default: true
        }
    },
    documentClickListener: null,
    data() {
        return {
            activeItem: null
        }
    },
    beforeUnmount() {
        this.unbindDocumentClickListener();
    },
    methods: {
        onLeafClick(event, item, navigate) {
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

            this.activeItem = null;

            if (item.to && navigate) {
                navigate(event);
            }
        },
        onCategoryMouseEnter(event, category) {
            if (this.disabled(category)) {
                event.preventDefault();
                return;
            }

            if (this.activeItem) {
                this.activeItem = category;
            }
        },
        onCategoryClick(event, category, navigate) {
            if (this.disabled(category)) {
                event.preventDefault();
                return;
            }

            if (category.command) {
                category.command({
                    originalEvent: event,
                    item: category
                });
            }

            if (category.items) {
                if (this.activeItem && this.activeItem === category) {
                    this.activeItem = null;
                    this.unbindDocumentClickListener();
                }
                else {
                    this.activeItem = category;
                    this.bindDocumentClickListener();
                }
            }

            if (category.to && navigate) {
                navigate(event);
            }
        },
        onCategoryKeydown(event, category) {
            let listItem = event.currentTarget.parentElement;

            switch(event.which) {
                //down
                case 40:
                    if (this.horizontal)
                        this.expandMenu(category);
                    else
                        this.navigateToNextItem(listItem);

                    event.preventDefault();
                break;

                //up
                case 38:
                    if (this.vertical)
                        this.navigateToPrevItem(listItem);
                    else if (category.items && category === this.activeItem)
                        this.collapseMenu();

                    event.preventDefault();
                break;

                //right
                case 39:
                    if (this.horizontal)
                        this.navigateToNextItem(listItem);
                    else
                        this.expandMenu(category);

                    event.preventDefault();
                break;

                //left
                case 37:
                    if (this.horizontal)
                        this.navigateToPrevItem(listItem);
                    else if (category.items && category === this.activeItem)
                        this.collapseMenu();

                    event.preventDefault();
                break;
            }
        },
        expandMenu(item) {
            if (item.items) {
                this.activeItem = item;
            }
        },
        collapseMenu() {
            this.activeItem = null;
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
        getCategoryClass(category) {
            return ['p-menuitem', {
                'p-menuitem-active': category === this.activeItem
            }, category.class];
        },
        getCategorySubMenuIcon() {
            return ['p-submenu-icon pi', {
                'pi-angle-down': this.horizontal,
                'pi-angle-right': this.vertical
            }];
        },
        getCategoryIcon(category) {
            return ['p-menuitem-icon', category.icon];
        },
        getColumnClassName(category) {
            let length = category.items ? category.items.length: 0;
            let columnClass;

            switch(length) {
                case 2:
                    columnClass= 'p-megamenu-col-6';
                break;

                case 3:
                    columnClass= 'p-megamenu-col-4';
                break;

                case 4:
                    columnClass= 'p-megamenu-col-3';
                break;

                case 6:
                    columnClass= 'p-megamenu-col-2';
                break;

                default:
                    columnClass= 'p-megamenu-col-12';
                break;
            }

            return columnClass;
        },
        getSubmenuHeaderClass(submenu) {
            return ['p-megamenu-submenu-header', submenu.class, {'p-disabled': this.disabled(submenu)}];
        },
        getSubmenuItemClass(item) {
            return ['p-menuitem', item.class];
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
            return (typeof item.disabled === 'function' ? item.label() : item.label);
        }
    },
    computed: {
        containerClass() {
            return ['p-megamenu p-component', {
                'p-megamenu-horizontal': this.horizontal,
                'p-megamenu-vertical': this.vertical
            }];
        },
        horizontal() {
            return this.orientation === 'horizontal';
        },
        vertical() {
            return this.orientation === 'vertical';
        }
    },
    directives: {
        'ripple': Ripple
    }
};

const _hoisted_1 = {
  key: 0,
  class: "p-megamenu-start"
};
const _hoisted_2 = {
  class: "p-megamenu-root-list",
  role: "menubar"
};
const _hoisted_3 = { class: "p-menuitem-text" };
const _hoisted_4 = { class: "p-menuitem-text" };
const _hoisted_5 = {
  key: 2,
  class: "p-megamenu-panel"
};
const _hoisted_6 = { class: "p-megamenu-grid" };
const _hoisted_7 = { class: "p-menuitem-text" };
const _hoisted_8 = { class: "p-menuitem-text" };
const _hoisted_9 = {
  key: 1,
  class: "p-megamenu-end"
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  const _directive_ripple = resolveDirective("ripple");

  return (openBlock(), createBlock("div", { class: $options.containerClass }, [
    (_ctx.$slots.start)
      ? (openBlock(), createBlock("div", _hoisted_1, [
          renderSlot(_ctx.$slots, "start")
        ]))
      : createCommentVNode("v-if", true),
    createVNode("ul", _hoisted_2, [
      (openBlock(true), createBlock(Fragment, null, renderList($props.model, (category, index) => {
        return (openBlock(), createBlock(Fragment, {
          key: $options.label(category) + '_' + index
        }, [
          ($options.visible(category))
            ? (openBlock(), createBlock("li", {
                key: 0,
                class: $options.getCategoryClass(category),
                style: category.style,
                onMouseenter: $event => ($options.onCategoryMouseEnter($event, category)),
                role: "none"
              }, [
                (!_ctx.$slots.item)
                  ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      (category.to && !$options.disabled(category))
                        ? (openBlock(), createBlock(_component_router_link, {
                            key: 0,
                            to: category.to,
                            custom: ""
                          }, {
                            default: withCtx(({navigate, href, isActive, isExactActive}) => [
                              withDirectives(createVNode("a", {
                                href: href,
                                class: $options.linkClass(category, {isActive, isExactActive}),
                                onClick: $event => ($options.onCategoryClick($event, category, navigate)),
                                onKeydown: $event => ($options.onCategoryKeydown($event, category)),
                                role: "menuitem"
                              }, [
                                (category.icon)
                                  ? (openBlock(), createBlock("span", {
                                      key: 0,
                                      class: $options.getCategoryIcon(category)
                                    }, null, 2 /* CLASS */))
                                  : createCommentVNode("v-if", true),
                                createVNode("span", _hoisted_3, toDisplayString($options.label(category)), 1 /* TEXT */)
                              ], 42 /* CLASS, PROPS, HYDRATE_EVENTS */, ["href", "onClick", "onKeydown"]), [
                                [_directive_ripple]
                              ])
                            ]),
                            _: 2 /* DYNAMIC */
                          }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["to"]))
                        : withDirectives((openBlock(), createBlock("a", {
                            key: 1,
                            href: category.url,
                            class: $options.linkClass(category),
                            target: category.target,
                            onClick: $event => ($options.onCategoryClick($event, category)),
                            onKeydown: $event => ($options.onCategoryKeydown($event, category)),
                            role: "menuitem",
                            "aria-haspopup": category.items != null,
                            "aria-expanded": category === $data.activeItem,
                            tabindex: $options.disabled(category) ? null : '0'
                          }, [
                            (category.icon)
                              ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  class: $options.getCategoryIcon(category)
                                }, null, 2 /* CLASS */))
                              : createCommentVNode("v-if", true),
                            createVNode("span", _hoisted_4, toDisplayString($options.label(category)), 1 /* TEXT */),
                            (category.items)
                              ? (openBlock(), createBlock("span", {
                                  key: 1,
                                  class: $options.getCategorySubMenuIcon()
                                }, null, 2 /* CLASS */))
                              : createCommentVNode("v-if", true)
                          ], 42 /* CLASS, PROPS, HYDRATE_EVENTS */, ["href", "target", "onClick", "onKeydown", "aria-haspopup", "aria-expanded", "tabindex"])), [
                            [_directive_ripple]
                          ])
                    ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
                  : (openBlock(), createBlock(resolveDynamicComponent(_ctx.$slots.item), {
                      key: 1,
                      item: category
                    }, null, 8 /* PROPS */, ["item"])),
                (category.items)
                  ? (openBlock(), createBlock("div", _hoisted_5, [
                      createVNode("div", _hoisted_6, [
                        (openBlock(true), createBlock(Fragment, null, renderList(category.items, (column, columnIndex) => {
                          return (openBlock(), createBlock("div", {
                            key: $options.label(category) + '_column_' + columnIndex,
                            class: $options.getColumnClassName(category)
                          }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(column, (submenu, submenuIndex) => {
                              return (openBlock(), createBlock("ul", {
                                class: "p-megamenu-submenu",
                                key: submenu.label + '_submenu_' + submenuIndex,
                                role: "menu"
                              }, [
                                createVNode("li", {
                                  class: $options.getSubmenuHeaderClass(submenu),
                                  style: submenu.style,
                                  role: "presentation"
                                }, toDisplayString(submenu.label), 7 /* TEXT, CLASS, STYLE */),
                                (openBlock(true), createBlock(Fragment, null, renderList(submenu.items, (item, i) => {
                                  return (openBlock(), createBlock(Fragment, {
                                    key: $options.label(item) + i.toString()
                                  }, [
                                    ($options.visible(item) && !item.separator)
                                      ? (openBlock(), createBlock("li", {
                                          key: 0,
                                          role: "none",
                                          class: $options.getSubmenuItemClass(item),
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
                                                        withDirectives(createVNode("a", {
                                                          href: href,
                                                          class: $options.linkClass(item, {isActive, isExactActive}),
                                                          onClick: $event => ($options.onLeafClick($event, item, navigate)),
                                                          role: "menuitem"
                                                        }, [
                                                          (item.icon)
                                                            ? (openBlock(), createBlock("span", {
                                                                key: 0,
                                                                class: ['p-menuitem-icon', item.icon]
                                                              }, null, 2 /* CLASS */))
                                                            : createCommentVNode("v-if", true),
                                                          createVNode("span", _hoisted_7, toDisplayString($options.label(item)), 1 /* TEXT */)
                                                        ], 10 /* CLASS, PROPS */, ["href", "onClick"]), [
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
                                                      onClick: $event => ($options.onLeafClick($event, item)),
                                                      role: "menuitem",
                                                      tabindex: $options.disabled(item) ? null : '0'
                                                    }, [
                                                      (item.icon)
                                                        ? (openBlock(), createBlock("span", {
                                                            key: 0,
                                                            class: ['p-menuitem-icon', item.icon]
                                                          }, null, 2 /* CLASS */))
                                                        : createCommentVNode("v-if", true),
                                                      createVNode("span", _hoisted_8, toDisplayString($options.label(item)), 1 /* TEXT */),
                                                      (item.items)
                                                        ? (openBlock(), createBlock("span", {
                                                            key: 1,
                                                            class: _ctx.getSubmenuIcon()
                                                          }, null, 2 /* CLASS */))
                                                        : createCommentVNode("v-if", true)
                                                    ], 10 /* CLASS, PROPS */, ["href", "target", "onClick", "tabindex"])), [
                                                      [_directive_ripple]
                                                    ])
                                              ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
                                            : (openBlock(), createBlock(resolveDynamicComponent(_ctx.$slots.item), {
                                                key: 1,
                                                item: item
                                              }, null, 8 /* PROPS */, ["item"]))
                                        ], 6 /* CLASS, STYLE */))
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
                              ]))
                            }), 128 /* KEYED_FRAGMENT */))
                          ], 2 /* CLASS */))
                        }), 128 /* KEYED_FRAGMENT */))
                      ])
                    ]))
                  : createCommentVNode("v-if", true)
              ], 46 /* CLASS, STYLE, PROPS, HYDRATE_EVENTS */, ["onMouseenter"]))
            : createCommentVNode("v-if", true)
        ], 64 /* STABLE_FRAGMENT */))
      }), 128 /* KEYED_FRAGMENT */))
    ]),
    (_ctx.$slots.end)
      ? (openBlock(), createBlock("div", _hoisted_9, [
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

var css_248z = "\n.p-megamenu-root-list {\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style: none;\n}\n.p-megamenu-root-list > .p-menuitem {\r\n    position: relative;\n}\n.p-megamenu .p-menuitem-link {\r\n    cursor: pointer;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    text-decoration: none;\r\n    overflow: hidden;\r\n    position: relative;\n}\n.p-megamenu .p-menuitem-text {\r\n    line-height: 1;\n}\n.p-megamenu-panel {\r\n    display: none;\r\n    position: absolute;\r\n    width: auto;\r\n    z-index: 1;\n}\n.p-megamenu-root-list > .p-menuitem-active > .p-megamenu-panel {\r\n    display: block;\n}\n.p-megamenu-submenu {\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style: none;\n}\r\n\r\n/* Horizontal */\n.p-megamenu-horizontal .p-megamenu-root-list {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -ms-flex-wrap: wrap;\r\n        flex-wrap: wrap;\n}\r\n\r\n/* Vertical */\n.p-megamenu-vertical .p-megamenu-root-list {\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\n}\n.p-megamenu-vertical .p-megamenu-root-list > .p-menuitem-active > .p-megamenu-panel {\r\n    left: 100%;\r\n    top: 0;\n}\n.p-megamenu-vertical .p-megamenu-root-list > .p-menuitem > .p-menuitem-link > .p-submenu-icon {\r\n    margin-left: auto;\n}\n.p-megamenu-grid {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\n}\n.p-megamenu-col-2,\r\n.p-megamenu-col-3,\r\n.p-megamenu-col-4,\r\n.p-megamenu-col-6,\r\n.p-megamenu-col-12 {\r\n    -webkit-box-flex: 0;\r\n        -ms-flex: 0 0 auto;\r\n            flex: 0 0 auto;\r\n    padding: 0.5rem;\n}\n.p-megamenu-col-2 {\r\n    width: 16.6667%;\n}\n.p-megamenu-col-3 {\r\n    width: 25%;\n}\n.p-megamenu-col-4 {\r\n    width: 33.3333%;\n}\n.p-megamenu-col-6 {\r\n    width: 50%;\n}\n.p-megamenu-col-12 {\r\n    width: 100%;\n}\r\n";
styleInject(css_248z);

script.render = render;

export { script as default };
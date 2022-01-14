import { DomHandler } from 'primevue/utils';
import Ripple from 'primevue/ripple';
import { resolveComponent, resolveDirective, openBlock, createBlock, createVNode, Fragment, renderList, withCtx, withDirectives, createCommentVNode, toDisplayString, resolveDynamicComponent } from 'vue';

var script = {
    name: 'TabMenu',
    emits: ['update:activeIndex', 'tab-change'],
    props: {
		model: {
            type: Array,
            default: null
        },
        exact: {
            type: Boolean,
            default: true
        },
        activeIndex: {
            type: Number,
            default: 0
        }
    },
    timeout: null,
    data() {
        return {
            d_activeIndex: this.activeIndex
        }
    },
    mounted() {
        this.updateInkBar();
    },
    updated() {
        this.updateInkBar();
    },
    beforeUnmount() {
        clearTimeout(this.timeout);
    },
    watch: {
        $route() {
            this.timeout = setTimeout(() => this.updateInkBar(), 50);
        },
        activeIndex(newValue) {
            this.d_activeIndex = newValue;
        }
    },
    methods: {
        onItemClick(event, item, index, navigate) {
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

            if (item.to && navigate) {
                navigate(event);
            }

            if (index !== this.d_activeIndex) {
                this.d_activeIndex = index;
                this.$emit('update:activeIndex', this.d_activeIndex);
            }

            this.$emit('tab-change', {
                originalEvent: event,
                index: index
            });
        },
        getItemClass(item, index) {
            return ['p-tabmenuitem', item.class, {
                'p-highlight': this.d_activeIndex === index,
                'p-disabled': this.disabled(item)
            }];
        },
        getRouteItemClass(item, isActive, isExactActive) {
            return ['p-tabmenuitem', item.class, {
                 'p-highlight': this.exact ? isExactActive : isActive,
                'p-disabled': this.disabled(item)
            }];
        },
        getItemIcon(item) {
            return ['p-menuitem-icon', item.icon];
        },
        visible(item) {
            return (typeof item.visible === 'function' ? item.visible() : item.visible !== false);
        },
        disabled(item) {
            return (typeof item.disabled === 'function' ? item.disabled() : item.disabled);
        },
        label(item) {
            return (typeof item.label === 'function' ? item.label() : item.label);
        },
        updateInkBar() {
            let tabs = this.$refs.nav.children;
            let inkHighlighted = false;
            for (let i = 0; i < tabs.length; i++) {
                let tab = tabs[i];
                if (DomHandler.hasClass(tab, 'p-highlight')) {
                    this.$refs.inkbar.style.width = DomHandler.getWidth(tab) + 'px';
                    this.$refs.inkbar.style.left =  DomHandler.getOffset(tab).left - DomHandler.getOffset(this.$refs.nav).left + 'px';
                    inkHighlighted = true;
                }
            }

            if (!inkHighlighted) {
                this.$refs.inkbar.style.width = '0px';
                this.$refs.inkbar.style.left =  '0px';
            }
        }
    },
    directives: {
        'ripple': Ripple
    }
};

const _hoisted_1 = { class: "p-tabmenu p-component" };
const _hoisted_2 = {
  ref: "nav",
  class: "p-tabmenu-nav p-reset",
  role: "tablist"
};
const _hoisted_3 = { class: "p-menuitem-text" };
const _hoisted_4 = { class: "p-menuitem-text" };
const _hoisted_5 = {
  ref: "inkbar",
  class: "p-tabmenu-ink-bar"
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  const _directive_ripple = resolveDirective("ripple");

  return (openBlock(), createBlock("div", _hoisted_1, [
    createVNode("ul", _hoisted_2, [
      (openBlock(true), createBlock(Fragment, null, renderList($props.model, (item, i) => {
        return (openBlock(), createBlock(Fragment, {
          key: $options.label(item) + '_' + i.toString()
        }, [
          (item.to && !$options.disabled(item))
            ? (openBlock(), createBlock(_component_router_link, {
                key: 0,
                to: item.to,
                custom: ""
              }, {
                default: withCtx(({navigate, href, isActive, isExactActive}) => [
                  ($options.visible(item))
                    ? (openBlock(), createBlock("li", {
                        key: 0,
                        class: $options.getRouteItemClass(item,isActive,isExactActive),
                        style: item.style,
                        role: "tab"
                      }, [
                        (!_ctx.$slots.item)
                          ? withDirectives((openBlock(), createBlock("a", {
                              key: 0,
                              href: href,
                              class: "p-menuitem-link",
                              onClick: $event => ($options.onItemClick($event, item, i, navigate)),
                              role: "presentation"
                            }, [
                              (item.icon)
                                ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    class: $options.getItemIcon(item)
                                  }, null, 2 /* CLASS */))
                                : createCommentVNode("v-if", true),
                              createVNode("span", _hoisted_3, toDisplayString($options.label(item)), 1 /* TEXT */)
                            ], 8 /* PROPS */, ["href", "onClick"])), [
                              [_directive_ripple]
                            ])
                          : (openBlock(), createBlock(resolveDynamicComponent(_ctx.$slots.item), {
                              key: 1,
                              item: item
                            }, null, 8 /* PROPS */, ["item"]))
                      ], 6 /* CLASS, STYLE */))
                    : createCommentVNode("v-if", true)
                ]),
                _: 2 /* DYNAMIC */
              }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["to"]))
            : ($options.visible(item))
              ? (openBlock(), createBlock("li", {
                  key: 1,
                  class: $options.getItemClass(item, i),
                  role: "tab"
                }, [
                  (!_ctx.$slots.item)
                    ? withDirectives((openBlock(), createBlock("a", {
                        key: 0,
                        href: item.url,
                        class: "p-menuitem-link",
                        target: item.target,
                        onClick: $event => ($options.onItemClick($event, item, i)),
                        role: "presentation",
                        tabindex: $options.disabled(item) ? null : '0'
                      }, [
                        (item.icon)
                          ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: $options.getItemIcon(item)
                            }, null, 2 /* CLASS */))
                          : createCommentVNode("v-if", true),
                        createVNode("span", _hoisted_4, toDisplayString($options.label(item)), 1 /* TEXT */)
                      ], 8 /* PROPS */, ["href", "target", "onClick", "tabindex"])), [
                        [_directive_ripple]
                      ])
                    : (openBlock(), createBlock(resolveDynamicComponent(_ctx.$slots.item), {
                        key: 1,
                        item: item
                      }, null, 8 /* PROPS */, ["item"]))
                ], 2 /* CLASS */))
              : createCommentVNode("v-if", true)
        ], 64 /* STABLE_FRAGMENT */))
      }), 128 /* KEYED_FRAGMENT */)),
      createVNode("li", _hoisted_5, null, 512 /* NEED_PATCH */)
    ], 512 /* NEED_PATCH */)
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

var css_248z = "\n.p-tabmenu {\r\n    overflow-x: auto;\n}\n.p-tabmenu-nav {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style-type: none;\r\n    -ms-flex-wrap: nowrap;\r\n        flex-wrap: nowrap;\n}\n.p-tabmenu-nav a {\r\n    cursor: pointer;\r\n    -webkit-user-select: none;\r\n       -moz-user-select: none;\r\n        -ms-user-select: none;\r\n            user-select: none;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    position: relative;\r\n    text-decoration: none;\r\n    text-decoration: none;\r\n    overflow: hidden;\n}\n.p-tabmenu-nav a:focus {\r\n    z-index: 1;\n}\n.p-tabmenu-nav .p-menuitem-text {\r\n    line-height: 1;\n}\n.p-tabmenu-ink-bar {\r\n    display: none;\r\n    z-index: 1;\n}\n.p-tabmenu::-webkit-scrollbar {\r\n    display: none;\n}\r\n";
styleInject(css_248z);

script.render = render;

export { script as default };

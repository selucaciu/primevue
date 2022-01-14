this.primevue = this.primevue || {};
this.primevue.tabmenu = (function (utils, Ripple, vue) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var Ripple__default = /*#__PURE__*/_interopDefaultLegacy(Ripple);

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
                    if (utils.DomHandler.hasClass(tab, 'p-highlight')) {
                        this.$refs.inkbar.style.width = utils.DomHandler.getWidth(tab) + 'px';
                        this.$refs.inkbar.style.left =  utils.DomHandler.getOffset(tab).left - utils.DomHandler.getOffset(this.$refs.nav).left + 'px';
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
            'ripple': Ripple__default["default"]
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
      const _component_router_link = vue.resolveComponent("router-link");
      const _directive_ripple = vue.resolveDirective("ripple");

      return (vue.openBlock(), vue.createBlock("div", _hoisted_1, [
        vue.createVNode("ul", _hoisted_2, [
          (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($props.model, (item, i) => {
            return (vue.openBlock(), vue.createBlock(vue.Fragment, {
              key: $options.label(item) + '_' + i.toString()
            }, [
              (item.to && !$options.disabled(item))
                ? (vue.openBlock(), vue.createBlock(_component_router_link, {
                    key: 0,
                    to: item.to,
                    custom: ""
                  }, {
                    default: vue.withCtx(({navigate, href, isActive, isExactActive}) => [
                      ($options.visible(item))
                        ? (vue.openBlock(), vue.createBlock("li", {
                            key: 0,
                            class: $options.getRouteItemClass(item,isActive,isExactActive),
                            style: item.style,
                            role: "tab"
                          }, [
                            (!_ctx.$slots.item)
                              ? vue.withDirectives((vue.openBlock(), vue.createBlock("a", {
                                  key: 0,
                                  href: href,
                                  class: "p-menuitem-link",
                                  onClick: $event => ($options.onItemClick($event, item, i, navigate)),
                                  role: "presentation"
                                }, [
                                  (item.icon)
                                    ? (vue.openBlock(), vue.createBlock("span", {
                                        key: 0,
                                        class: $options.getItemIcon(item)
                                      }, null, 2 /* CLASS */))
                                    : vue.createCommentVNode("v-if", true),
                                  vue.createVNode("span", _hoisted_3, vue.toDisplayString($options.label(item)), 1 /* TEXT */)
                                ], 8 /* PROPS */, ["href", "onClick"])), [
                                  [_directive_ripple]
                                ])
                              : (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.$slots.item), {
                                  key: 1,
                                  item: item
                                }, null, 8 /* PROPS */, ["item"]))
                          ], 6 /* CLASS, STYLE */))
                        : vue.createCommentVNode("v-if", true)
                    ]),
                    _: 2 /* DYNAMIC */
                  }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["to"]))
                : ($options.visible(item))
                  ? (vue.openBlock(), vue.createBlock("li", {
                      key: 1,
                      class: $options.getItemClass(item, i),
                      role: "tab"
                    }, [
                      (!_ctx.$slots.item)
                        ? vue.withDirectives((vue.openBlock(), vue.createBlock("a", {
                            key: 0,
                            href: item.url,
                            class: "p-menuitem-link",
                            target: item.target,
                            onClick: $event => ($options.onItemClick($event, item, i)),
                            role: "presentation",
                            tabindex: $options.disabled(item) ? null : '0'
                          }, [
                            (item.icon)
                              ? (vue.openBlock(), vue.createBlock("span", {
                                  key: 0,
                                  class: $options.getItemIcon(item)
                                }, null, 2 /* CLASS */))
                              : vue.createCommentVNode("v-if", true),
                            vue.createVNode("span", _hoisted_4, vue.toDisplayString($options.label(item)), 1 /* TEXT */)
                          ], 8 /* PROPS */, ["href", "target", "onClick", "tabindex"])), [
                            [_directive_ripple]
                          ])
                        : (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.$slots.item), {
                            key: 1,
                            item: item
                          }, null, 8 /* PROPS */, ["item"]))
                    ], 2 /* CLASS */))
                  : vue.createCommentVNode("v-if", true)
            ], 64 /* STABLE_FRAGMENT */))
          }), 128 /* KEYED_FRAGMENT */)),
          vue.createVNode("li", _hoisted_5, null, 512 /* NEED_PATCH */)
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
    script.__file = "src/components/tabmenu/TabMenu.vue";

    return script;

})(primevue.utils, primevue.ripple, Vue);

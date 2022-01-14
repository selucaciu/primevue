this.primevue = this.primevue || {};
this.primevue.dock = (function (Ripple, vue) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var Ripple__default = /*#__PURE__*/_interopDefaultLegacy(Ripple);

    var script$1 = {
        name: 'DockSub',
        props: {
            model: {
                type: Array,
                default: null
            },
            templates: {
                type: null,
                default: null
            },
            exact: {
                type: Boolean,
                default: true
            },
            tooltipOptions: null
        },
        data() {
            return {
                currentIndex: -3
            }
        },
        methods: {
            onListMouseLeave() {
                this.currentIndex = -3;
            },
            onItemMouseEnter(index) {
                this.currentIndex = index;
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

                if (item.to && navigate) {
                    navigate(event);
                }
            },
            itemClass(index) {
                return ['p-dock-item', {
                    'p-dock-item-second-prev': (this.currentIndex - 2) === index,
                    'p-dock-item-prev': (this.currentIndex - 1) === index,
                    'p-dock-item-current': this.currentIndex === index,
                    'p-dock-item-next': (this.currentIndex + 1) === index,
                    'p-dock-item-second-next': (this.currentIndex + 2) === index
                }];
            },
            linkClass(item, routerProps) {
                return ['p-dock-action', {
                    'p-disabled': this.disabled(item),
                    'router-link-active': routerProps && routerProps.isActive,
                    'router-link-active-exact': this.exact && routerProps && routerProps.isExactActive
                }];
            },
            disabled(item) {
                return (typeof item.disabled === 'function' ? item.disabled() : item.disabled);
            }
        },
        directives: {
            'ripple': Ripple__default["default"]
        }
    };

    const _hoisted_1 = { class: "p-dock-list-container" };

    function render$1(_ctx, _cache, $props, $setup, $data, $options) {
      const _component_router_link = vue.resolveComponent("router-link");
      const _directive_ripple = vue.resolveDirective("ripple");
      const _directive_tooltip = vue.resolveDirective("tooltip");

      return (vue.openBlock(), vue.createBlock("div", _hoisted_1, [
        vue.createVNode("ul", {
          ref: "list",
          class: "p-dock-list",
          role: "menu",
          onMouseleave: _cache[1] || (_cache[1] = (...args) => ($options.onListMouseLeave && $options.onListMouseLeave(...args)))
        }, [
          (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($props.model, (item, index) => {
            return (vue.openBlock(), vue.createBlock("li", {
              class: $options.itemClass(index),
              key: index,
              role: "none",
              onMouseenter: $event => ($options.onItemMouseEnter(index))
            }, [
              (!$props.templates['item'])
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
                              role: "menuitem",
                              class: $options.linkClass(item, {isActive, isExactActive}),
                              target: item.target,
                              onClick: $event => ($options.onItemClick($event, item, navigate))
                            }, [
                              (!$props.templates['icon'])
                                ? vue.withDirectives((vue.openBlock(), vue.createBlock("span", {
                                    key: 0,
                                    class: ['p-dock-action-icon', item.icon]
                                  }, null, 2 /* CLASS */)), [
                                    [_directive_ripple]
                                  ])
                                : (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent($props.templates['icon']), {
                                    key: 1,
                                    item: item
                                  }, null, 8 /* PROPS */, ["item"]))
                            ], 10 /* CLASS, PROPS */, ["href", "target", "onClick"]), [
                              [_directive_tooltip, {value: item.label, disabled: !$props.tooltipOptions}, $props.tooltipOptions]
                            ])
                          ]),
                          _: 2 /* DYNAMIC */
                        }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["to"]))
                      : vue.withDirectives((vue.openBlock(), vue.createBlock("a", {
                          key: 1,
                          href: item.url,
                          role: "menuitem",
                          class: $options.linkClass(item),
                          target: item.target,
                          onClick: $event => ($options.onItemClick($event, item)),
                          tabindex: $options.disabled(item) ? null : '0'
                        }, [
                          (!$props.templates['icon'])
                            ? vue.withDirectives((vue.openBlock(), vue.createBlock("span", {
                                key: 0,
                                class: ['p-dock-action-icon', item.icon]
                              }, null, 2 /* CLASS */)), [
                                [_directive_ripple]
                              ])
                            : (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent($props.templates['icon']), {
                                key: 1,
                                item: item
                              }, null, 8 /* PROPS */, ["item"]))
                        ], 10 /* CLASS, PROPS */, ["href", "target", "onClick", "tabindex"])), [
                          [_directive_tooltip, {value: item.label, disabled: !$props.tooltipOptions}, $props.tooltipOptions]
                        ])
                  ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
                : (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent($props.templates['item']), {
                    key: 1,
                    item: item
                  }, null, 8 /* PROPS */, ["item"]))
            ], 42 /* CLASS, PROPS, HYDRATE_EVENTS */, ["onMouseenter"]))
          }), 128 /* KEYED_FRAGMENT */))
        ], 544 /* HYDRATE_EVENTS, NEED_PATCH */)
      ]))
    }

    script$1.render = render$1;
    script$1.__file = "src/components/dock/DockSub.vue";

    var script = {
        name: 'Dock',
        props: {
            position: {
                type: String,
                default: "bottom"
            },
            model: null,
            class: null,
            style: null,
            tooltipOptions: null,
            exact: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            containerClass() {
                return ['p-dock p-component', `p-dock-${this.position}`, this.class];
            }
        },
        components: {
            DockSub: script$1
        }
    };

    function render(_ctx, _cache, $props, $setup, $data, $options) {
      const _component_DockSub = vue.resolveComponent("DockSub");

      return (vue.openBlock(), vue.createBlock("div", {
        class: $options.containerClass,
        style: $props.style
      }, [
        vue.createVNode(_component_DockSub, {
          model: $props.model,
          templates: _ctx.$slots,
          exact: $props.exact,
          tooltipOptions: $props.tooltipOptions
        }, null, 8 /* PROPS */, ["model", "templates", "exact", "tooltipOptions"])
      ], 6 /* CLASS, STYLE */))
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

    var css_248z = "\n.p-dock {\r\n    position: absolute;\r\n    z-index: 1;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    pointer-events: none;\n}\n.p-dock-list-container {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    pointer-events: auto;\n}\n.p-dock-list {\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style: none;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\n}\n.p-dock-item {\r\n    -webkit-transition: all .2s cubic-bezier(0.4, 0, 0.2, 1);\r\n    transition: all .2s cubic-bezier(0.4, 0, 0.2, 1);\r\n    will-change: transform;\n}\n.p-dock-action {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    position: relative;\r\n    overflow: hidden;\r\n    cursor: default;\n}\n.p-dock-item-second-prev,\r\n.p-dock-item-second-next {\r\n    -webkit-transform: scale(1.2);\r\n            transform: scale(1.2);\n}\n.p-dock-item-prev,\r\n.p-dock-item-next {\r\n    -webkit-transform: scale(1.4);\r\n            transform: scale(1.4);\n}\n.p-dock-item-current {\r\n    -webkit-transform: scale(1.6);\r\n            transform: scale(1.6);\r\n    z-index: 1;\n}\r\n\r\n/* Position */\r\n/* top */\n.p-dock-top {\r\n    left: 0;\r\n    top: 0;\r\n    width: 100%;\n}\n.p-dock-top .p-dock-item {\r\n    -webkit-transform-origin: center top;\r\n            transform-origin: center top;\n}\r\n\r\n/* bottom */\n.p-dock-bottom {\r\n    left: 0;\r\n    bottom: 0;\r\n    width: 100%;\n}\n.p-dock-bottom .p-dock-item {\r\n    -webkit-transform-origin: center bottom;\r\n            transform-origin: center bottom;\n}\r\n\r\n/* right */\n.p-dock-right {\r\n    right: 0;\r\n    top: 0;\r\n    height: 100%;\n}\n.p-dock-right .p-dock-item {\r\n    -webkit-transform-origin: center right;\r\n            transform-origin: center right;\n}\n.p-dock-right .p-dock-list {\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\n}\r\n\r\n/* left */\n.p-dock-left {\r\n    left: 0;\r\n    top: 0;\r\n    height: 100%;\n}\n.p-dock-left .p-dock-item {\r\n    -webkit-transform-origin: center left;\r\n            transform-origin: center left;\n}\n.p-dock-left .p-dock-list {\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\n}\r\n";
    styleInject(css_248z);

    script.render = render;
    script.__file = "src/components/dock/Dock.vue";

    return script;

})(primevue.ripple, Vue);

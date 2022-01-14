import { resolveComponent, openBlock, createBlock, Fragment, withCtx, createVNode, createCommentVNode, toDisplayString, resolveDynamicComponent, renderList } from 'vue';

var script$1 = {
    name: 'BreadcrumbItem',
    props: {
        item: null,
        template: null,
        exact: null
    },
    methods: {
        onClick(event, navigate) {
            if (this.item.command) {
                this.item.command({
                    originalEvent: event,
                    item: this.item
                });
            }

            if (this.item.to && navigate) {
                navigate(event);
            }
        },
        containerClass(item) {
            return [{'p-disabled': this.disabled(item)}, this.item.class];
        },
        linkClass(routerProps) {
            return ['p-menuitem-link', {
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
        iconClass() {
            return ['p-menuitem-icon', this.item.icon];
        }
    }
};

const _hoisted_1$1 = {
  key: 1,
  class: "p-menuitem-text"
};
const _hoisted_2$1 = {
  key: 1,
  class: "p-menuitem-text"
};

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");

  return ($options.visible())
    ? (openBlock(), createBlock("li", {
        key: 0,
        class: $options.containerClass($props.item)
      }, [
        (!$props.template)
          ? (openBlock(), createBlock(Fragment, { key: 0 }, [
              ($props.item.to)
                ? (openBlock(), createBlock(_component_router_link, {
                    key: 0,
                    to: $props.item.to,
                    custom: ""
                  }, {
                    default: withCtx(({navigate, href, isActive, isExactActive}) => [
                      createVNode("a", {
                        href: href,
                        class: $options.linkClass({isActive, isExactActive}),
                        onClick: $event => ($options.onClick($event, navigate))
                      }, [
                        ($props.item.icon)
                          ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: $options.iconClass
                            }, null, 2 /* CLASS */))
                          : createCommentVNode("v-if", true),
                        ($props.item.label)
                          ? (openBlock(), createBlock("span", _hoisted_1$1, toDisplayString($options.label()), 1 /* TEXT */))
                          : createCommentVNode("v-if", true)
                      ], 10 /* CLASS, PROPS */, ["href", "onClick"])
                    ]),
                    _: 1 /* STABLE */
                  }, 8 /* PROPS */, ["to"]))
                : (openBlock(), createBlock("a", {
                    key: 1,
                    href: $props.item.url||'#',
                    class: $options.linkClass(),
                    onClick: _cache[1] || (_cache[1] = (...args) => ($options.onClick && $options.onClick(...args))),
                    target: $props.item.target
                  }, [
                    ($props.item.icon)
                      ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: $options.iconClass
                        }, null, 2 /* CLASS */))
                      : createCommentVNode("v-if", true),
                    ($props.item.label)
                      ? (openBlock(), createBlock("span", _hoisted_2$1, toDisplayString($options.label()), 1 /* TEXT */))
                      : createCommentVNode("v-if", true)
                  ], 10 /* CLASS, PROPS */, ["href", "target"]))
            ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
          : (openBlock(), createBlock(resolveDynamicComponent($props.template), {
              key: 1,
              item: $props.item
            }, null, 8 /* PROPS */, ["item"]))
      ], 2 /* CLASS */))
    : createCommentVNode("v-if", true)
}

script$1.render = render$1;
script$1.__file = "src/components/breadcrumb/BreadcrumbItem.vue";

var script = {
    name: 'Breadcrumb',
    props: {
        model: {
            type: Array,
            default: null
        },
        home: {
            type: null,
            default: null
        },
        exact: {
            type: Boolean,
            default: true
        }
    },
    components: {
        'BreadcrumbItem': script$1
    }
};

const _hoisted_1 = {
  class: "p-breadcrumb p-component",
  "aria-label": "Breadcrumb"
};
const _hoisted_2 = /*#__PURE__*/createVNode("li", { class: "p-breadcrumb-chevron pi pi-chevron-right" }, null, -1 /* HOISTED */);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BreadcrumbItem = resolveComponent("BreadcrumbItem");

  return (openBlock(), createBlock("nav", _hoisted_1, [
    createVNode("ul", null, [
      ($props.home)
        ? (openBlock(), createBlock(_component_BreadcrumbItem, {
            key: 0,
            item: $props.home,
            class: "p-breadcrumb-home",
            template: _ctx.$slots.item,
            exact: $props.exact
          }, null, 8 /* PROPS */, ["item", "template", "exact"]))
        : createCommentVNode("v-if", true),
      (openBlock(true), createBlock(Fragment, null, renderList($props.model, (item) => {
        return (openBlock(), createBlock(Fragment, {
          key: item.label
        }, [
          _hoisted_2,
          createVNode(_component_BreadcrumbItem, {
            item: item,
            template: _ctx.$slots.item,
            exact: $props.exact
          }, null, 8 /* PROPS */, ["item", "template", "exact"])
        ], 64 /* STABLE_FRAGMENT */))
      }), 128 /* KEYED_FRAGMENT */))
    ])
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

var css_248z = "\n.p-breadcrumb {\r\n    overflow-x: auto;\n}\n.p-breadcrumb ul {\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style-type: none;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -ms-flex-wrap: nowrap;\r\n        flex-wrap: nowrap;\n}\n.p-breadcrumb .p-menuitem-text {\r\n    line-height: 1;\n}\n.p-breadcrumb .p-menuitem-link {\r\n    text-decoration: none;\n}\n.p-breadcrumb::-webkit-scrollbar {\r\n    display: none;\n}\r\n";
styleInject(css_248z);

script.render = render;
script.__file = "src/components/breadcrumb/Breadcrumb.vue";

export { script as default };
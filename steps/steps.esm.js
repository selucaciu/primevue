import { UniqueComponentId } from 'primevue/utils';
import { resolveComponent, openBlock, createBlock, createVNode, Fragment, renderList, withCtx, toDisplayString, resolveDynamicComponent, createCommentVNode } from 'vue';

var script = {
    name: 'Steps',
    props: {
        id: {
            type: String,
            default: UniqueComponentId()
        },
		model: {
            type: Array,
            default: null
        },
        readonly: {
            type: Boolean,
            default: true
        },
        exact: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        onItemClick(event, item, navigate) {
            if (this.disabled(item) || this.readonly) {
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
        isActive(item) {
            return this.activeRoute === item.to || this.activeRoute === item.to + '/' ;
        },
        getItemClass(item) {
            return ['p-steps-item', item.class, {
                'p-highlight p-steps-current': this.isActive(item),
                'p-disabled': this.isItemDisabled(item)
            }];
        },
        linkClass(routerProps) {
            return ['p-menuitem-link', {
                'router-link-active': routerProps && routerProps.isActive,
                'router-link-active-exact': this.exact && routerProps && routerProps.isExactActive
            }];
        },
        isItemDisabled(item) {
            return (this.disabled(item) || (this.readonly && !this.isActive(item)));
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
        activeRoute() {
            return this.$route.path;
        },
        containerClass() {
            return ['p-steps p-component', {'p-readonly': this.readonly}];
        }
    }
};

const _hoisted_1 = { role: "tablist" };
const _hoisted_2 = { class: "p-steps-number" };
const _hoisted_3 = { class: "p-steps-title" };
const _hoisted_4 = { class: "p-steps-number" };
const _hoisted_5 = { class: "p-steps-title" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");

  return (openBlock(), createBlock("div", {
    id: $props.id,
    class: $options.containerClass
  }, [
    createVNode("ul", _hoisted_1, [
      (openBlock(true), createBlock(Fragment, null, renderList($props.model, (item, index) => {
        return (openBlock(), createBlock(Fragment, {
          key: item.to
        }, [
          ($options.visible(item))
            ? (openBlock(), createBlock("li", {
                key: 0,
                class: $options.getItemClass(item),
                style: item.style,
                role: "tab",
                "aria-selected": $options.isActive(item),
                "aria-expanded": $options.isActive(item)
              }, [
                (!_ctx.$slots.item)
                  ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      (!$options.isItemDisabled(item))
                        ? (openBlock(), createBlock(_component_router_link, {
                            key: 0,
                            to: item.to,
                            custom: ""
                          }, {
                            default: withCtx(({navigate, href, isActive, isExactActive}) => [
                              createVNode("a", {
                                href: href,
                                class: $options.linkClass({isActive, isExactActive}),
                                onClick: $event => ($options.onItemClick($event, item, navigate)),
                                role: "presentation"
                              }, [
                                createVNode("span", _hoisted_2, toDisplayString(index + 1), 1 /* TEXT */),
                                createVNode("span", _hoisted_3, toDisplayString($options.label(item)), 1 /* TEXT */)
                              ], 10 /* CLASS, PROPS */, ["href", "onClick"])
                            ]),
                            _: 2 /* DYNAMIC */
                          }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["to"]))
                        : (openBlock(), createBlock("span", {
                            key: 1,
                            class: $options.linkClass(),
                            role: "presentation"
                          }, [
                            createVNode("span", _hoisted_4, toDisplayString(index + 1), 1 /* TEXT */),
                            createVNode("span", _hoisted_5, toDisplayString($options.label(item)), 1 /* TEXT */)
                          ], 2 /* CLASS */))
                    ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
                  : (openBlock(), createBlock(resolveDynamicComponent(_ctx.$slots.item), {
                      key: 1,
                      item: item
                    }, null, 8 /* PROPS */, ["item"]))
              ], 14 /* CLASS, STYLE, PROPS */, ["aria-selected", "aria-expanded"]))
            : createCommentVNode("v-if", true)
        ], 64 /* STABLE_FRAGMENT */))
      }), 128 /* KEYED_FRAGMENT */))
    ])
  ], 10 /* CLASS, PROPS */, ["id"]))
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

var css_248z = "\n.p-steps {\r\n    position: relative;\n}\n.p-steps ul {\r\n    padding: 0;\r\n    margin: 0;\r\n    list-style-type: none;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\n}\n.p-steps-item {\r\n    position: relative;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    -webkit-box-flex: 1;\r\n        -ms-flex: 1 1 auto;\r\n            flex: 1 1 auto;\n}\n.p-steps-item .p-menuitem-link {\r\n    display: -webkit-inline-box;\r\n    display: -ms-inline-flexbox;\r\n    display: inline-flex;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    overflow: hidden;\r\n    text-decoration: none;\n}\n.p-steps.p-steps-readonly .p-steps-item {\r\n    cursor: auto;\n}\n.p-steps-item.p-steps-current .p-menuitem-link {\r\n    cursor: default;\n}\n.p-steps-title {\r\n    white-space: nowrap;\n}\n.p-steps-number {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\n}\n.p-steps-title {\r\n    display: block;\n}\r\n";
styleInject(css_248z);

script.render = render;
script.__file = "src/components/steps/Steps.vue";

export { script as default };

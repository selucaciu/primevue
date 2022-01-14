import { UniqueComponentId } from 'primevue/utils';
import { openBlock, createBlock, Fragment, renderList, createVNode, toDisplayString, createCommentVNode, resolveDynamicComponent, Transition, withCtx, withDirectives, vShow } from 'vue';

var script = {
    name: 'Accordion',
    emits: ['tab-close', 'tab-open', 'update:activeIndex'],
    props: {
        multiple: {
            type: Boolean,
            default: false
        },
        activeIndex: {
            type: [Number,Array],
            default: null
        },
        lazy: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            d_activeIndex: this.activeIndex
        }
    },
    watch: {
        activeIndex(newValue) {
            this.d_activeIndex = newValue;
        }
    },
    methods: {
        onTabClick(event, tab, i) {
            if (!this.isTabDisabled(tab)) {
                const active = this.isTabActive(i);
                const eventName = active ? 'tab-close' : 'tab-open';

                if (this.multiple) {
                    if (active) {
                        this.d_activeIndex = this.d_activeIndex.filter(index => index !== i);
                    }
                    else {
                        if (this.d_activeIndex)
                            this.d_activeIndex.push(i);
                        else
                            this.d_activeIndex = [i];
                    }
                }
                else {
                    this.d_activeIndex = this.d_activeIndex === i ? null : i;
                }

                this.$emit('update:activeIndex', this.d_activeIndex);

                this.$emit(eventName, {
                    originalEvent: event,
                    index: i
                });
            }
        },
        onTabKeydown(event, tab, i) {
            if (event.which === 13) {
                this.onTabClick(event, tab, i);
            }
        },
        isTabActive(index) {
            if (this.multiple)
                return this.d_activeIndex && this.d_activeIndex.includes(index);
            else
                return index === this.d_activeIndex;
        },
        getKey(tab, i) {
            return (tab.props && tab.props.header) ? tab.props.header : i;
        },
        isTabDisabled(tab) {
            return tab.props && tab.props.disabled;
        },
        getTabClass(i) {
            return ['p-accordion-tab', {'p-accordion-tab-active': this.isTabActive(i)}];
        },
        getTabHeaderClass(tab, i) {
            return ['p-accordion-header', {'p-highlight': this.isTabActive(i), 'p-disabled': this.isTabDisabled(tab)}];
        },
        getTabAriaId(i) {
            return this.ariaId + '_' + i;
        },
        getHeaderIcon(i) {
            const active = this.isTabActive(i);
            return ['p-accordion-toggle-icon pi', {'pi-chevron-right': !active, 'pi-chevron-down': active}];
        },
        isAccordionTab(child) {
            return child.type.name === 'AccordionTab'
        }
    },
    computed: {
        tabs() {
            const tabs = [];
            this.$slots.default().forEach(child => {
                    if (this.isAccordionTab(child)) {
                        tabs.push(child);
                    }
                    else if (child.children && child.children instanceof Array) {
                        child.children.forEach(nestedChild => {
                            if (this.isAccordionTab(nestedChild)) {
                                tabs.push(nestedChild);
                            }
                        });
                    }
                }
            );
            return tabs;
        },
        ariaId() {
            return UniqueComponentId();
        }
    }
};

const _hoisted_1 = { class: "p-accordion p-component" };
const _hoisted_2 = {
  key: 0,
  class: "p-accordion-header-text"
};
const _hoisted_3 = { class: "p-accordion-content" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("div", _hoisted_1, [
    (openBlock(true), createBlock(Fragment, null, renderList($options.tabs, (tab, i) => {
      return (openBlock(), createBlock("div", {
        key: $options.getKey(tab,i),
        class: $options.getTabClass(i)
      }, [
        createVNode("div", {
          class: $options.getTabHeaderClass(tab, i)
        }, [
          createVNode("a", {
            role: "tab",
            class: "p-accordion-header-link",
            onClick: $event => ($options.onTabClick($event, tab, i)),
            onKeydown: $event => ($options.onTabKeydown($event, tab, i)),
            tabindex: $options.isTabDisabled(tab) ? null : '0',
            "aria-expanded": $options.isTabActive(i),
            id: $options.getTabAriaId(i) + '_header',
            "aria-controls": $options.getTabAriaId(i) + '_content'
          }, [
            createVNode("span", {
              class: $options.getHeaderIcon(i)
            }, null, 2 /* CLASS */),
            (tab.props && tab.props.header)
              ? (openBlock(), createBlock("span", _hoisted_2, toDisplayString(tab.props.header), 1 /* TEXT */))
              : createCommentVNode("v-if", true),
            (tab.children && tab.children.header)
              ? (openBlock(), createBlock(resolveDynamicComponent(tab.children.header), { key: 1 }))
              : createCommentVNode("v-if", true)
          ], 40 /* PROPS, HYDRATE_EVENTS */, ["onClick", "onKeydown", "tabindex", "aria-expanded", "id", "aria-controls"])
        ], 2 /* CLASS */),
        createVNode(Transition, { name: "p-toggleable-content" }, {
          default: withCtx(() => [
            ($props.lazy ? $options.isTabActive(i) : true)
              ? withDirectives((openBlock(), createBlock("div", {
                  key: 0,
                  class: "p-toggleable-content",
                  role: "region",
                  id: $options.getTabAriaId(i) + '_content',
                  "aria-labelledby": $options.getTabAriaId(i) + '_header'
                }, [
                  createVNode("div", _hoisted_3, [
                    (openBlock(), createBlock(resolveDynamicComponent(tab)))
                  ])
                ], 8 /* PROPS */, ["id", "aria-labelledby"])), [
                  [vShow, $props.lazy ? true: $options.isTabActive(i)]
                ])
              : createCommentVNode("v-if", true)
          ]),
          _: 2 /* DYNAMIC */
        }, 1024 /* DYNAMIC_SLOTS */)
      ], 2 /* CLASS */))
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

var css_248z = "\n.p-accordion-header-link {\r\n    cursor: pointer;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-user-select: none;\r\n       -moz-user-select: none;\r\n        -ms-user-select: none;\r\n            user-select: none;\r\n    position: relative;\r\n    text-decoration: none;\n}\n.p-accordion-header-link:focus {\r\n    z-index: 1;\n}\n.p-accordion-header-text {\r\n    line-height: 1;\n}\r\n";
styleInject(css_248z);

script.render = render;
script.__file = "src/components/accordion/Accordion.vue";

export { script as default };

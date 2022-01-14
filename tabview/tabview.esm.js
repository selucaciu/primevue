import { DomHandler } from 'primevue/utils';
import Ripple from 'primevue/ripple';
import { resolveDirective, openBlock, createBlock, createVNode, withDirectives, createCommentVNode, Fragment, renderList, toDisplayString, resolveDynamicComponent, vShow } from 'vue';

var script = {
    name: 'TabView',
    emits: ['update:activeIndex', 'tab-change', 'tab-click'],
    props: {
        activeIndex: {
            type: Number,
            default: 0
        },
        lazy: {
            type: Boolean,
            default: false
        },
        scrollable: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            d_activeIndex: this.activeIndex,
            backwardIsDisabled: true,
            forwardIsDisabled: false
        }
    },
    watch: {
        activeIndex(newValue) {
            this.d_activeIndex = newValue;

            this.updateScrollBar(newValue);
        }
    },
    updated() {
        this.updateInkBar();
    },
    mounted() {
        this.updateInkBar();
    },
    methods: {
        onTabClick(event, i) {
            if (!this.isTabDisabled(this.tabs[i]) && i !== this.d_activeIndex) {
                this.d_activeIndex = i;
                this.$emit('update:activeIndex', this.d_activeIndex);

                this.$emit('tab-change', {
                    originalEvent: event,
                    index: i
                });

                this.updateScrollBar(i);
            }

            this.$emit('tab-click', {
                originalEvent: event,
                index: i
            });
        },
        onTabKeydown(event, i) {
            if (event.which === 13) {
                this.onTabClick(event, i);
            }
        },
        updateInkBar() {
            let tabHeader = this.$refs.nav.children[this.d_activeIndex];
            this.$refs.inkbar.style.width = DomHandler.getWidth(tabHeader) + 'px';
            this.$refs.inkbar.style.left =  DomHandler.getOffset(tabHeader).left - DomHandler.getOffset(this.$refs.nav).left + 'px';
        },
        updateScrollBar(index) {
            let tabHeader = this.$refs.nav.children[index];
            tabHeader.scrollIntoView({ block: 'nearest' });
        },
        updateButtonState() {
            const content = this.$refs.content;
            const { scrollLeft, scrollWidth } = content;
            const width = DomHandler.getWidth(content);

            this.backwardIsDisabled = scrollLeft === 0;
            this.forwardIsDisabled = scrollLeft === scrollWidth - width;
        },
        getKey(tab, i) {
            return (tab.props && tab.props.header) ? tab.props.header : i;
        },
        isTabDisabled(tab) {
            return (tab.props && tab.props.disabled);
        },
        isTabPanel(child) {
            return child.type.name === 'TabPanel'
        },
        onScroll(event) {
            this.scrollable && this.updateButtonState();

            event.preventDefault();
        },
        getVisibleButtonWidths() {
            const { prevBtn, nextBtn } = this.$refs;

            return [prevBtn, nextBtn].reduce((acc, el) => el ? acc + DomHandler.getWidth(el) : acc, 0);
        },
        navBackward() {
            const content = this.$refs.content;
            const width = DomHandler.getWidth(content) - this.getVisibleButtonWidths();
            const pos = content.scrollLeft - width;
            content.scrollLeft = pos <= 0 ? 0 : pos;
        },
        navForward() {
            const content = this.$refs.content;
            const width = DomHandler.getWidth(content) - this.getVisibleButtonWidths();
            const pos = content.scrollLeft + width;
            const lastPos = content.scrollWidth - width;

            content.scrollLeft = pos >= lastPos ? lastPos : pos;
        }
    },
    computed: {
        contentClasses() {
			return ['p-tabview p-component', {'p-tabview-scrollable': this.scrollable}];
		},
        prevButtonClasses() {
            return ['p-tabview-nav-prev p-tabview-nav-btn p-link']
        },
        nextButtonClasses() {
            return ['p-tabview-nav-next p-tabview-nav-btn p-link']
        },
        tabs() {
            const tabs = [];
            this.$slots.default().forEach(child => {
                    if (this.isTabPanel(child)) {
                        tabs.push(child);
                    }
                    else if (child.children && child.children instanceof Array) {
                        child.children.forEach(nestedChild => {
                            if (this.isTabPanel(nestedChild)) {
                                tabs.push(nestedChild);
                            }
                        });
                    }
                }
            );
            return tabs;
        }
    },
    directives: {
        'ripple': Ripple
    }
};

const _hoisted_1 = { class: "p-tabview-nav-container" };
const _hoisted_2 = /*#__PURE__*/createVNode("span", { class: "pi pi-chevron-left" }, null, -1 /* HOISTED */);
const _hoisted_3 = {
  ref: "nav",
  class: "p-tabview-nav",
  role: "tablist"
};
const _hoisted_4 = {
  key: 0,
  class: "p-tabview-title"
};
const _hoisted_5 = {
  ref: "inkbar",
  class: "p-tabview-ink-bar"
};
const _hoisted_6 = /*#__PURE__*/createVNode("span", { class: "pi pi-chevron-right" }, null, -1 /* HOISTED */);
const _hoisted_7 = { class: "p-tabview-panels" };
const _hoisted_8 = {
  key: 0,
  class: "p-tabview-panel",
  role: "tabpanel"
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = resolveDirective("ripple");

  return (openBlock(), createBlock("div", { class: $options.contentClasses }, [
    createVNode("div", _hoisted_1, [
      ($props.scrollable && !$data.backwardIsDisabled)
        ? withDirectives((openBlock(), createBlock("button", {
            key: 0,
            ref: "prevBtn",
            class: $options.prevButtonClasses,
            onClick: _cache[1] || (_cache[1] = (...args) => ($options.navBackward && $options.navBackward(...args))),
            type: "button"
          }, [
            _hoisted_2
          ], 2 /* CLASS */)), [
            [_directive_ripple]
          ])
        : createCommentVNode("v-if", true),
      createVNode("div", {
        ref: "content",
        class: "p-tabview-nav-content",
        onScroll: _cache[2] || (_cache[2] = (...args) => ($options.onScroll && $options.onScroll(...args)))
      }, [
        createVNode("ul", _hoisted_3, [
          (openBlock(true), createBlock(Fragment, null, renderList($options.tabs, (tab, i) => {
            return (openBlock(), createBlock("li", {
              role: "presentation",
              key: $options.getKey(tab,i),
              class: [{'p-highlight': ($data.d_activeIndex === i), 'p-disabled': $options.isTabDisabled(tab)}]
            }, [
              withDirectives(createVNode("a", {
                role: "tab",
                class: "p-tabview-nav-link",
                onClick: $event => ($options.onTabClick($event, i)),
                onKeydown: $event => ($options.onTabKeydown($event, i)),
                tabindex: $options.isTabDisabled(tab) ? null : '0',
                "aria-selected": $data.d_activeIndex === i
              }, [
                (tab.props && tab.props.header)
                  ? (openBlock(), createBlock("span", _hoisted_4, toDisplayString(tab.props.header), 1 /* TEXT */))
                  : createCommentVNode("v-if", true),
                (tab.children && tab.children.header)
                  ? (openBlock(), createBlock(resolveDynamicComponent(tab.children.header), { key: 1 }))
                  : createCommentVNode("v-if", true)
              ], 40 /* PROPS, HYDRATE_EVENTS */, ["onClick", "onKeydown", "tabindex", "aria-selected"]), [
                [_directive_ripple]
              ])
            ], 2 /* CLASS */))
          }), 128 /* KEYED_FRAGMENT */)),
          createVNode("li", _hoisted_5, null, 512 /* NEED_PATCH */)
        ], 512 /* NEED_PATCH */)
      ], 544 /* HYDRATE_EVENTS, NEED_PATCH */),
      ($props.scrollable && !$data.forwardIsDisabled)
        ? withDirectives((openBlock(), createBlock("button", {
            key: 1,
            ref: "nextBtn",
            class: $options.nextButtonClasses,
            onClick: _cache[3] || (_cache[3] = (...args) => ($options.navForward && $options.navForward(...args))),
            type: "button"
          }, [
            _hoisted_6
          ], 2 /* CLASS */)), [
            [_directive_ripple]
          ])
        : createCommentVNode("v-if", true)
    ]),
    createVNode("div", _hoisted_7, [
      (openBlock(true), createBlock(Fragment, null, renderList($options.tabs, (tab, i) => {
        return (openBlock(), createBlock(Fragment, {
          key: $options.getKey(tab,i)
        }, [
          ($props.lazy ? ($data.d_activeIndex === i) : true)
            ? withDirectives((openBlock(), createBlock("div", _hoisted_8, [
                (openBlock(), createBlock(resolveDynamicComponent(tab)))
              ], 512 /* NEED_PATCH */)), [
                [vShow, $props.lazy ? true: ($data.d_activeIndex === i)]
              ])
            : createCommentVNode("v-if", true)
        ], 64 /* STABLE_FRAGMENT */))
      }), 128 /* KEYED_FRAGMENT */))
    ])
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

var css_248z = "\n.p-tabview-nav-container {\r\n    position: relative;\n}\n.p-tabview-scrollable .p-tabview-nav-container {\r\n    overflow: hidden;\n}\n.p-tabview-nav-content {\r\n    overflow-x: auto;\r\n    overflow-y: hidden;\r\n    scroll-behavior: smooth;\r\n    scrollbar-width: none;\r\n    -ms-scroll-chaining: contain auto;\r\n        overscroll-behavior: contain auto;\n}\n.p-tabview-nav {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style-type: none;\r\n    -webkit-box-flex: 1;\r\n        -ms-flex: 1 1 auto;\r\n            flex: 1 1 auto;\n}\n.p-tabview-nav-link {\r\n    cursor: pointer;\r\n    -webkit-user-select: none;\r\n       -moz-user-select: none;\r\n        -ms-user-select: none;\r\n            user-select: none;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    position: relative;\r\n    text-decoration: none;\r\n    overflow: hidden;\n}\n.p-tabview-ink-bar {\r\n    display: none;\r\n    z-index: 1;\n}\n.p-tabview-nav-link:focus {\r\n    z-index: 1;\n}\n.p-tabview-title {\r\n    line-height: 1;\r\n    white-space: nowrap;\n}\n.p-tabview-nav-btn {\r\n    position: absolute;\r\n    top: 0;\r\n    z-index: 2;\r\n    height: 100%;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\n}\n.p-tabview-nav-prev {\r\n    left: 0;\n}\n.p-tabview-nav-next {\r\n    right: 0;\n}\n.p-tabview-nav-content::-webkit-scrollbar {\r\n    display: none;\n}\r\n";
styleInject(css_248z);

script.render = render;

export { script as default };

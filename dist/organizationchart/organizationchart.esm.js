import { DomHandler } from 'primevue/utils';
import { resolveComponent, openBlock, createBlock, createVNode, resolveDynamicComponent, withKeys, createCommentVNode, Fragment, renderList } from 'vue';

var script$1 = {
    name: 'OrganizationChartNode',
    emits: ['node-click', 'node-toggle'],
    props: {
        node: {
            type: null,
            default: null
        },
        templates: {
            type: null,
            default: null
        },
        collapsible: {
            type: Boolean,
            default: false
        },
        collapsedKeys: {
            type: null,
            default: null
        },
        selectionKeys: {
            type: null,
            default: null
        },
        selectionMode: {
            type: String,
            default: null
        }
    },
    methods: {
        onNodeClick(event) {
            if (DomHandler.hasClass(event.target, 'p-node-toggler') || DomHandler.hasClass(event.target, 'p-node-toggler-icon')) {
                return;
            }

            if (this.selectionMode) {
                this.$emit('node-click', this.node);
            }
        },
        onChildNodeClick(node) {
            this.$emit('node-click', node);
        },
        toggleNode() {
            this.$emit('node-toggle', this.node);
        },
        onChildNodeToggle(node) {
            this.$emit('node-toggle', node);
        }
    },
    computed: {
        nodeContentClass() {
            return ['p-organizationchart-node-content', this.node.styleClass, {'p-organizationchart-selectable-node': this.selectable, 'p-highlight': this.selected}];
        },
        leaf() {
            return this.node.leaf === false ? false : !(this.node.children && this.node.children.length);
        },
        colspan() {
            return (this.node.children && this.node.children.length) ? this.node.children.length * 2: null;
        },
        childStyle() {
            return {
                visibility: !this.leaf && this.expanded ? 'inherit' : 'hidden'
            }
        },
        expanded() {
            return this.collapsedKeys[this.node.key] === undefined;
        },
        selectable() {
            return this.selectionMode && this.node.selectable !== false;
        },
        selected() {
            return this.selectable && this.selectionKeys && this.selectionKeys[this.node.key] === true;
        },
        toggleable() {
            return this.collapsible && this.node.collapsible !== false && !this.leaf;
        }
    }
};

const _hoisted_1$1 = { class: "p-organizationchart-table" };
const _hoisted_2 = { key: 0 };
const _hoisted_3 = /*#__PURE__*/createVNode("div", { class: "p-organizationchart-line-down" }, null, -1 /* HOISTED */);
const _hoisted_4 = /*#__PURE__*/createVNode("div", { class: "p-organizationchart-line-down" }, null, -1 /* HOISTED */);

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_OrganizationChartNode = resolveComponent("OrganizationChartNode", true);

  return (openBlock(), createBlock("table", _hoisted_1$1, [
    createVNode("tbody", null, [
      ($props.node)
        ? (openBlock(), createBlock("tr", _hoisted_2, [
            createVNode("td", { colspan: $options.colspan }, [
              createVNode("div", {
                class: $options.nodeContentClass,
                onClick: _cache[3] || (_cache[3] = (...args) => ($options.onNodeClick && $options.onNodeClick(...args)))
              }, [
                (openBlock(), createBlock(resolveDynamicComponent($props.templates[$props.node.type]||$props.templates['default']), { node: $props.node }, null, 8 /* PROPS */, ["node"])),
                ($options.toggleable)
                  ? (openBlock(), createBlock("a", {
                      key: 0,
                      tabindex: "0",
                      class: "p-node-toggler",
                      onClick: _cache[1] || (_cache[1] = (...args) => ($options.toggleNode && $options.toggleNode(...args))),
                      onKeydown: _cache[2] || (_cache[2] = withKeys((...args) => ($options.toggleNode && $options.toggleNode(...args)), ["enter"]))
                    }, [
                      createVNode("i", {
                        class: ["p-node-toggler-icon pi", {'pi-chevron-down': $options.expanded, 'pi-chevron-up': !$options.expanded}]
                      }, null, 2 /* CLASS */)
                    ], 32 /* HYDRATE_EVENTS */))
                  : createCommentVNode("v-if", true)
              ], 2 /* CLASS */)
            ], 8 /* PROPS */, ["colspan"])
          ]))
        : createCommentVNode("v-if", true),
      createVNode("tr", {
        style: $options.childStyle,
        class: "p-organizationchart-lines"
      }, [
        createVNode("td", { colspan: $options.colspan }, [
          _hoisted_3
        ], 8 /* PROPS */, ["colspan"])
      ], 4 /* STYLE */),
      createVNode("tr", {
        style: $options.childStyle,
        class: "p-organizationchart-lines"
      }, [
        ($props.node.children && $props.node.children.length === 1)
          ? (openBlock(), createBlock("td", {
              key: 0,
              colspan: $options.colspan
            }, [
              _hoisted_4
            ], 8 /* PROPS */, ["colspan"]))
          : createCommentVNode("v-if", true),
        ($props.node.children && $props.node.children.length > 1)
          ? (openBlock(true), createBlock(Fragment, { key: 1 }, renderList($props.node.children, (child, i) => {
              return (openBlock(), createBlock(Fragment, {
                key: child.key
              }, [
                createVNode("td", {
                  class: ["p-organizationchart-line-left", {'p-organizationchart-line-top': !(i === 0)}]
                }, " ", 2 /* CLASS */),
                createVNode("td", {
                  class: ["p-organizationchart-line-right", {'p-organizationchart-line-top': !(i === ($props.node.children.length - 1))}]
                }, " ", 2 /* CLASS */)
              ], 64 /* STABLE_FRAGMENT */))
            }), 128 /* KEYED_FRAGMENT */))
          : createCommentVNode("v-if", true)
      ], 4 /* STYLE */),
      createVNode("tr", {
        style: $options.childStyle,
        class: "p-organizationchart-nodes"
      }, [
        (openBlock(true), createBlock(Fragment, null, renderList($props.node.children, (child) => {
          return (openBlock(), createBlock("td", {
            key: child.key,
            colspan: "2"
          }, [
            createVNode(_component_OrganizationChartNode, {
              node: child,
              templates: $props.templates,
              collapsedKeys: $props.collapsedKeys,
              onNodeToggle: $options.onChildNodeToggle,
              collapsible: $props.collapsible,
              selectionMode: $props.selectionMode,
              selectionKeys: $props.selectionKeys,
              onNodeClick: $options.onChildNodeClick
            }, null, 8 /* PROPS */, ["node", "templates", "collapsedKeys", "onNodeToggle", "collapsible", "selectionMode", "selectionKeys", "onNodeClick"])
          ]))
        }), 128 /* KEYED_FRAGMENT */))
      ], 4 /* STYLE */)
    ])
  ]))
}

script$1.render = render$1;
script$1.__file = "src/components/organizationchart/OrganizationChartNode.vue";

var script = {
    name: 'OrganizationChart',
    emits: ['node-unselect', 'node-select', 'update:selectionKeys', 'node-expand', 'node-collapse', 'update:collapsedKeys'],
    props: {
        value: {
            type: null,
            default: null
        },
        selectionKeys: {
            type: null,
            default: null
        },
        selectionMode: {
            type: String,
            default: null
        },
        collapsible: {
            type: Boolean,
            default: false
        },
        collapsedKeys: {
            type: null,
            default: null
        }
    },
    data() {
        return {
            d_collapsedKeys: this.collapsedKeys || {}
        }
    },
    watch: {
        collapsedKeys(newValue) {
            this.d_collapsedKeys = newValue;
        }
    },
    methods: {
        onNodeClick(node) {
            const key = node.key;

            if (this.selectionMode) {
                let _selectionKeys = this.selectionKeys ? {...this.selectionKeys} : {};

                if (_selectionKeys[key]) {
                    delete _selectionKeys[key];
                    this.$emit('node-unselect', node);
                }
                else {
                    if (this.selectionMode === 'single') {
                        _selectionKeys = {};
                    }

                    _selectionKeys[key] = true;
                    this.$emit('node-select', node);
                }

                this.$emit('update:selectionKeys', _selectionKeys);
            }
        },
        onNodeToggle(node) {
            const key = node.key;

            if (this.d_collapsedKeys[key]) {
                delete this.d_collapsedKeys[key];
                this.$emit('node-expand', node);
            }
            else {
                this.d_collapsedKeys[key] = true;
                this.$emit('node-collapse', node);
            }

            this.d_collapsedKeys = {...this.d_collapsedKeys};
            this.$emit('update:collapsedKeys', this.d_collapsedKeys);
        }
    },
    components: {
        'OrganizationChartNode': script$1
    }
};

const _hoisted_1 = { class: "p-organizationchart p-component" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_OrganizationChartNode = resolveComponent("OrganizationChartNode");

  return (openBlock(), createBlock("div", _hoisted_1, [
    createVNode(_component_OrganizationChartNode, {
      node: $props.value,
      templates: _ctx.$slots,
      onNodeToggle: $options.onNodeToggle,
      collapsedKeys: $data.d_collapsedKeys,
      collapsible: $props.collapsible,
      onNodeClick: $options.onNodeClick,
      selectionMode: $props.selectionMode,
      selectionKeys: $props.selectionKeys
    }, null, 8 /* PROPS */, ["node", "templates", "onNodeToggle", "collapsedKeys", "collapsible", "onNodeClick", "selectionMode", "selectionKeys"])
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

var css_248z = "\n.p-organizationchart-table {\r\n    border-spacing: 0;\r\n    border-collapse: separate;\r\n    margin: 0 auto;\n}\n.p-organizationchart-table > tbody > tr > td {\r\n    text-align: center;\r\n    vertical-align: top;\r\n    padding: 0 .75rem;\n}\n.p-organizationchart-node-content {\r\n    display: inline-block;\r\n    position: relative;\n}\n.p-organizationchart-node-content .p-node-toggler {\r\n    position: absolute;\r\n    bottom: -.75rem;\r\n    margin-left: -.75rem;\r\n    z-index: 2;\r\n    left: 50%;\r\n    -webkit-user-select: none;\r\n       -moz-user-select: none;\r\n        -ms-user-select: none;\r\n            user-select: none;\r\n    cursor: pointer;\r\n    width: 1.5rem;\r\n    height: 1.5rem;\r\n    text-decoration: none;\n}\n.p-organizationchart-node-content .p-node-toggler .p-node-toggler-icon {\r\n    position: relative;\r\n    top: .25rem;\n}\n.p-organizationchart-line-down {\r\n    margin: 0 auto;\r\n    height: 20px;\r\n    width: 1px;\n}\n.p-organizationchart-line-right {\r\n    border-radius: 0px;\n}\n.p-organizationchart-line-left {\r\n    border-radius: 0;\n}\n.p-organizationchart-selectable-node {\r\n    cursor: pointer;\n}\r\n";
styleInject(css_248z);

script.render = render;
script.__file = "src/components/organizationchart/OrganizationChart.vue";

export { script as default };
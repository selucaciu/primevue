'use strict';

var utils = require('primevue/utils');
var Ripple = require('primevue/ripple');
var vue = require('vue');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Ripple__default = /*#__PURE__*/_interopDefaultLegacy(Ripple);

var script$1 = {
    name: 'TreeNode',
    emits: ['node-toggle', 'node-click', 'checkbox-change'],
    props: {
        node: {
            type: null,
            default: null
        },
        expandedKeys: {
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
        templates: {
            type: null,
            default: null
        }
    },
    nodeTouched: false,
    methods: {
        toggle() {
            this.$emit('node-toggle', this.node);
        },
        label(node) {
            return (typeof node.label === 'function' ? node.label() : node.label);
        },
        onChildNodeToggle(node) {
            this.$emit('node-toggle', node);
        },
        onClick(event) {
            if (utils.DomHandler.hasClass(event.target, 'p-tree-toggler') || utils.DomHandler.hasClass(event.target.parentElement, 'p-tree-toggler')) {
                return;
            }

            if (this.isCheckboxSelectionMode()) {
                this.toggleCheckbox();
            }
            else {
                this.$emit('node-click', {
                    originalEvent: event,
                    nodeTouched: this.nodeTouched,
                    node: this.node
                });
            }

            this.nodeTouched = false;
        },
        onChildNodeClick(event) {
            this.$emit('node-click', event);
        },
        onTouchEnd() {
            this.nodeTouched = true;
        },
        onKeyDown(event) {
            const nodeElement = event.target.parentElement;

            switch (event.which) {
                //down arrow
                case 40:
                    var listElement = nodeElement.children[1];
                    if (listElement) {
                        this.focusNode(listElement.children[0]);
                    }
                    else {
                        const nextNodeElement = nodeElement.nextElementSibling;
                        if (nextNodeElement) {
                            this.focusNode(nextNodeElement);
                        }
                        else {
                            let nextSiblingAncestor = this.findNextSiblingOfAncestor(nodeElement);
                            if (nextSiblingAncestor) {
                                this.focusNode(nextSiblingAncestor);
                            }
                        }
                    }

                    event.preventDefault();
                break;

                //up arrow
                case 38:
                    if (nodeElement.previousElementSibling) {
                        this.focusNode(this.findLastVisibleDescendant(nodeElement.previousElementSibling));
                    }
                    else {
                        let parentNodeElement = this.getParentNodeElement(nodeElement);
                        if (parentNodeElement) {
                            this.focusNode(parentNodeElement);
                        }
                    }

                    event.preventDefault();
                break;

                //right-left arrows
                case 37:
                case 39:
                    this.$emit('node-toggle', this.node);

                    event.preventDefault();
                break;

                //enter
                case 13:
                    this.onClick(event);
                    event.preventDefault();
                break;
            }
        },
        toggleCheckbox() {
            let _selectionKeys = this.selectionKeys ? {...this.selectionKeys} : {};
            const _check = !this.checked;

            this.propagateDown(this.node, _check, _selectionKeys);

            this.$emit('checkbox-change', {
                node: this.node,
                check: _check,
                selectionKeys: _selectionKeys
            });
        },
        propagateDown(node, check, selectionKeys) {
            if (check)
                selectionKeys[node.key] = {checked: true, partialChecked: false};
            else
                delete selectionKeys[node.key];

            if (node.children && node.children.length) {
                for (let child of node.children) {
                    this.propagateDown(child, check, selectionKeys);
                }
            }
        },
        propagateUp(event) {
            let check = event.check;
            let _selectionKeys = {...event.selectionKeys};
            let checkedChildCount = 0;
            let childPartialSelected = false;

            for (let child of this.node.children) {
                if(_selectionKeys[child.key] && _selectionKeys[child.key].checked)
                    checkedChildCount++;
                else if(_selectionKeys[child.key] && _selectionKeys[child.key].partialChecked)
                    childPartialSelected = true;
            }

            if(check && checkedChildCount === this.node.children.length) {
                _selectionKeys[this.node.key] = {checked: true, partialChecked: false};
            }
            else {
                if (!check) {
                    delete _selectionKeys[this.node.key];
                }

                if (childPartialSelected || (checkedChildCount > 0 && checkedChildCount !== this.node.children.length))
                    _selectionKeys[this.node.key] = {checked: false, partialChecked: true};
                else
                    delete _selectionKeys[this.node.key];
            }

            this.$emit('checkbox-change', {
                node: event.node,
                check: event.check,
                selectionKeys: _selectionKeys
            });
        },
        onChildCheckboxChange(event) {
            this.$emit('checkbox-change', event);
        },
        findNextSiblingOfAncestor(nodeElement) {
            let parentNodeElement = this.getParentNodeElement(nodeElement);
            if (parentNodeElement) {
                if (parentNodeElement.nextElementSibling)
                    return parentNodeElement.nextElementSibling;
                else
                    return this.findNextSiblingOfAncestor(parentNodeElement);
            }
            else {
                return null;
            }
        },
        findLastVisibleDescendant(nodeElement) {
            const childrenListElement = nodeElement.children[1];
            if (childrenListElement) {
                const lastChildElement = childrenListElement.children[childrenListElement.children.length - 1];

                return this.findLastVisibleDescendant(lastChildElement);
            }
            else {
                return nodeElement;
            }
        },
        getParentNodeElement(nodeElement) {
            const parentNodeElement = nodeElement.parentElement.parentElement;

            return utils.DomHandler.hasClass(parentNodeElement, 'p-treenode') ? parentNodeElement : null;
        },
        focusNode(element) {
            element.children[0].focus();
        },
        isCheckboxSelectionMode() {
            return this.selectionMode === 'checkbox';
        }
    },
    computed: {
        hasChildren() {
            return this.node.children && this.node.children.length > 0;
        },
        expanded() {
            return this.expandedKeys && this.expandedKeys[this.node.key] === true;
        },
        leaf() {
            return this.node.leaf === false ? false : !(this.node.children && this.node.children.length);
        },
        selectable() {
            return this.node.selectable === false ? false : this.selectionMode != null;
        },
        selected() {
            return (this.selectionMode && this.selectionKeys) ? this.selectionKeys[this.node.key] === true : false;
        },
        containerClass() {
            return ['p-treenode', {'p-treenode-leaf': this.leaf}];
        },
        contentClass() {
            return ['p-treenode-content', this.node.styleClass, {
                'p-treenode-selectable': this.selectable,
                'p-highlight': this.checkboxMode ? this.checked : this.selected
            }];
        },
        icon() {
            return ['p-treenode-icon', this.node.icon];
        },
        toggleIcon() {
            return ['p-tree-toggler-icon pi pi-fw', {
                'pi-chevron-down': this.expanded,
                'pi-chevron-right': !this.expanded
            }];
        },
        checkboxClass() {
            return ['p-checkbox-box', {'p-highlight': this.checked, 'p-indeterminate': this.partialChecked}];
        },
        checkboxIcon() {
            return ['p-checkbox-icon', {'pi pi-check': this.checked, 'pi pi-minus': this.partialChecked}];
        },
        checkboxMode() {
            return this.selectionMode === 'checkbox' && this.node.selectable !== false;
        },
        checked() {
            return this.selectionKeys ? this.selectionKeys[this.node.key] && this.selectionKeys[this.node.key].checked: false;
        },
        partialChecked() {
            return this.selectionKeys ? this.selectionKeys[this.node.key] && this.selectionKeys[this.node.key].partialChecked: false;
        }
    },
    directives: {
        'ripple': Ripple__default["default"]
    }
};

const _hoisted_1$1 = {
  key: 0,
  class: "p-checkbox p-component"
};
const _hoisted_2$1 = { class: "p-treenode-label" };
const _hoisted_3$1 = {
  key: 0,
  class: "p-treenode-children",
  role: "group"
};

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_TreeNode = vue.resolveComponent("TreeNode", true);
  const _directive_ripple = vue.resolveDirective("ripple");

  return (vue.openBlock(), vue.createBlock("li", { class: $options.containerClass }, [
    vue.createVNode("div", {
      class: $options.contentClass,
      tabindex: "0",
      role: "treeitem",
      "aria-expanded": $options.expanded,
      onClick: _cache[2] || (_cache[2] = (...args) => ($options.onClick && $options.onClick(...args))),
      onKeydown: _cache[3] || (_cache[3] = (...args) => ($options.onKeyDown && $options.onKeyDown(...args))),
      onTouchend: _cache[4] || (_cache[4] = (...args) => ($options.onTouchEnd && $options.onTouchEnd(...args))),
      style: $props.node.style
    }, [
      vue.withDirectives(vue.createVNode("button", {
        type: "button",
        class: "p-tree-toggler p-link",
        onClick: _cache[1] || (_cache[1] = (...args) => ($options.toggle && $options.toggle(...args))),
        tabindex: "-1"
      }, [
        vue.createVNode("span", { class: $options.toggleIcon }, null, 2 /* CLASS */)
      ], 512 /* NEED_PATCH */), [
        [_directive_ripple]
      ]),
      ($options.checkboxMode)
        ? (vue.openBlock(), vue.createBlock("div", _hoisted_1$1, [
            vue.createVNode("div", {
              class: $options.checkboxClass,
              role: "checkbox",
              "aria-checked": $options.checked
            }, [
              vue.createVNode("span", { class: $options.checkboxIcon }, null, 2 /* CLASS */)
            ], 10 /* CLASS, PROPS */, ["aria-checked"])
          ]))
        : vue.createCommentVNode("v-if", true),
      vue.createVNode("span", { class: $options.icon }, null, 2 /* CLASS */),
      vue.createVNode("span", _hoisted_2$1, [
        ($props.templates[$props.node.type]||$props.templates['default'])
          ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent($props.templates[$props.node.type]||$props.templates['default']), {
              key: 0,
              node: $props.node
            }, null, 8 /* PROPS */, ["node"]))
          : (vue.openBlock(), vue.createBlock(vue.Fragment, { key: 1 }, [
              vue.createTextVNode(vue.toDisplayString($options.label($props.node)), 1 /* TEXT */)
            ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
      ])
    ], 46 /* CLASS, STYLE, PROPS, HYDRATE_EVENTS */, ["aria-expanded"]),
    ($options.hasChildren && $options.expanded)
      ? (vue.openBlock(), vue.createBlock("ul", _hoisted_3$1, [
          (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($props.node.children, (childNode) => {
            return (vue.openBlock(), vue.createBlock(_component_TreeNode, {
              key: childNode.key,
              node: childNode,
              templates: $props.templates,
              expandedKeys: $props.expandedKeys,
              onNodeToggle: $options.onChildNodeToggle,
              onNodeClick: $options.onChildNodeClick,
              selectionMode: $props.selectionMode,
              selectionKeys: $props.selectionKeys,
              onCheckboxChange: $options.propagateUp
            }, null, 8 /* PROPS */, ["node", "templates", "expandedKeys", "onNodeToggle", "onNodeClick", "selectionMode", "selectionKeys", "onCheckboxChange"]))
          }), 128 /* KEYED_FRAGMENT */))
        ]))
      : vue.createCommentVNode("v-if", true)
  ], 2 /* CLASS */))
}

script$1.render = render$1;

var script = {
    name: 'Tree',
    emits: ['node-expand', 'node-collapse', 'update:expandedKeys', 'update:selectionKeys', 'node-select', 'node-unselect'],
    props: {
        value: {
            type: null,
            default: null
        },
        expandedKeys: {
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
        metaKeySelection: {
            type: Boolean,
            default: true
        },
        loading: {
            type: Boolean,
            default: false
        },
        loadingIcon: {
            type: String,
            default: 'pi pi-spinner'
        },
        filter: {
            type: Boolean,
            default: false
        },
        filterBy: {
            type: String,
            default: 'label'
        },
        filterMode: {
            type: String,
            default: 'lenient'
        },
        filterPlaceholder: {
            type: String,
            default: null
        },
        filterLocale: {
            type: String,
            default: undefined
        },
        scrollHeight: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            d_expandedKeys: this.expandedKeys || {},
            filterValue: null
        }
    },
    watch: {
        expandedKeys(newValue) {
            this.d_expandedKeys = newValue;
        }
    },
    methods: {
        onNodeToggle(node) {
            const key = node.key;

            if (this.d_expandedKeys[key]) {
                delete this.d_expandedKeys[key];
                this.$emit('node-collapse', node);
            }
            else {
                this.d_expandedKeys[key] = true;
                this.$emit('node-expand', node);
            }

            this.d_expandedKeys = {...this.d_expandedKeys};
            this.$emit('update:expandedKeys', this.d_expandedKeys);
        },
        onNodeClick(event) {
            if (this.selectionMode != null && event.node.selectable !== false) {
                const metaSelection = event.nodeTouched ? false : this.metaKeySelection;
                const _selectionKeys = metaSelection ? this.handleSelectionWithMetaKey(event) : this.handleSelectionWithoutMetaKey(event);

                this.$emit('update:selectionKeys', _selectionKeys);
            }
        },
        onCheckboxChange(event) {
            this.$emit('update:selectionKeys', event.selectionKeys);

            if (event.check)
                this.$emit('node-select', event.node);
            else
                this.$emit('node-unselect', event.node);
        },
        handleSelectionWithMetaKey(event) {
            const originalEvent = event.originalEvent;
            const node = event.node;
            const metaKey = (originalEvent.metaKey||originalEvent.ctrlKey);
            const selected = this.isNodeSelected(node);
            let _selectionKeys;

            if (selected && metaKey) {
                if (this.isSingleSelectionMode()) {
                    _selectionKeys = {};
                }
                else {
                    _selectionKeys = {...this.selectionKeys};
                    delete _selectionKeys[node.key];
                }

                this.$emit('node-unselect', node);
            }
            else {
                if (this.isSingleSelectionMode()) {
                    _selectionKeys = {};
                }
                else if (this.isMultipleSelectionMode()) {
                    _selectionKeys = !metaKey ? {} : (this.selectionKeys ? {...this.selectionKeys} : {});
                }

                _selectionKeys[node.key] = true;
                this.$emit('node-select', node);
            }

            return _selectionKeys;
        },
        handleSelectionWithoutMetaKey(event) {
            const node = event.node;
            const selected = this.isNodeSelected(node);
            let _selectionKeys;

            if (this.isSingleSelectionMode()) {
                if (selected) {
                    _selectionKeys = {};
                    this.$emit('node-unselect', node);
                }
                else {
                    _selectionKeys = {};
                    _selectionKeys[node.key] = true;
                    this.$emit('node-select', node);
                }
            }
            else {
                if (selected) {
                    _selectionKeys = {...this.selectionKeys};
                    delete _selectionKeys[node.key];

                    this.$emit('node-unselect', node);
                }
                else {
                    _selectionKeys = this.selectionKeys ? {...this.selectionKeys} : {};
                    _selectionKeys[node.key] = true;

                    this.$emit('node-select', node);
                }
            }

            return _selectionKeys;
        },
        isSingleSelectionMode() {
            return this.selectionMode === 'single';
        },
        isMultipleSelectionMode() {
            return this.selectionMode === 'multiple';
        },
        isNodeSelected(node) {
            return (this.selectionMode && this.selectionKeys) ? this.selectionKeys[node.key] === true : false;
        },
        isChecked(node) {
            return this.selectionKeys ? this.selectionKeys[node.key] && this.selectionKeys[node.key].checked: false;
        },
        isNodeLeaf(node) {
            return node.leaf === false ? false : !(node.children && node.children.length);
        },
        onFilterKeydown(event) {
            if (event.which === 13) {
                event.preventDefault();
            }
        },
        findFilteredNodes(node, paramsWithoutNode) {
            if (node) {
                let matched = false;
                if (node.children) {
                    let childNodes = [...node.children];
                    node.children = [];
                    for (let childNode of childNodes) {
                        let copyChildNode = {...childNode};
                        if (this.isFilterMatched(copyChildNode, paramsWithoutNode)) {
                            matched = true;
                            node.children.push(copyChildNode);
                        }
                    }
                }

                if (matched) {
                    return true;
                }
            }
        },
        isFilterMatched(node, {searchFields, filterText, strict}) {
            let matched = false;
            for(let field of searchFields) {
                let fieldValue = String(utils.ObjectUtils.resolveFieldData(node, field)).toLocaleLowerCase(this.filterLocale);
                if(fieldValue.indexOf(filterText) > -1) {
                    matched = true;
                }
            }

            if (!matched || (strict && !this.isNodeLeaf(node))) {
                matched = this.findFilteredNodes(node, {searchFields, filterText, strict}) || matched;
            }

            return matched;
        }
    },
    computed: {
        containerClass() {
            return ['p-tree p-component', {
                'p-tree-selectable': this.selectionMode != null,
                'p-tree-loading': this.loading,
                'p-tree-flex-scrollable': this.scrollHeight === 'flex'
            }];
        },
        loadingIconClass() {
            return ['p-tree-loading-icon pi-spin', this.loadingIcon];
        },
        filteredValue() {
            let filteredNodes = [];
            const searchFields = this.filterBy.split(',');
            const filterText = this.filterValue.trim().toLocaleLowerCase(this.filterLocale);
            const strict = this.filterMode === 'strict';

            for (let node of this.value) {
                let _node = {...node};
                let paramsWithoutNode = {searchFields, filterText, strict};

                if ((strict && (this.findFilteredNodes(_node, paramsWithoutNode) || this.isFilterMatched(_node, paramsWithoutNode))) ||
                    (!strict && (this.isFilterMatched(_node, paramsWithoutNode) || this.findFilteredNodes(_node, paramsWithoutNode)))) {
                    filteredNodes.push(_node);
                }
            }

            return filteredNodes;
        },
        valueToRender() {
            if (this.filterValue && this.filterValue.trim().length > 0)
                return this.filteredValue;
            else
                return this.value;
        }
    },
    components: {
        'TreeNode': script$1
    }
};

const _hoisted_1 = {
  key: 0,
  class: "p-tree-loading-overlay p-component-overlay"
};
const _hoisted_2 = {
  key: 1,
  class: "p-tree-filter-container"
};
const _hoisted_3 = /*#__PURE__*/vue.createVNode("span", { class: "p-tree-filter-icon pi pi-search" }, null, -1 /* HOISTED */);
const _hoisted_4 = {
  class: "p-tree-container",
  role: "tree"
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_TreeNode = vue.resolveComponent("TreeNode");

  return (vue.openBlock(), vue.createBlock("div", { class: $options.containerClass }, [
    ($props.loading)
      ? (vue.openBlock(), vue.createBlock("div", _hoisted_1, [
          vue.createVNode("i", { class: $options.loadingIconClass }, null, 2 /* CLASS */)
        ]))
      : vue.createCommentVNode("v-if", true),
    ($props.filter)
      ? (vue.openBlock(), vue.createBlock("div", _hoisted_2, [
          vue.withDirectives(vue.createVNode("input", {
            type: "text",
            autocomplete: "off",
            class: "p-tree-filter p-inputtext p-component",
            placeholder: $props.filterPlaceholder,
            onKeydown: _cache[1] || (_cache[1] = (...args) => ($options.onFilterKeydown && $options.onFilterKeydown(...args))),
            "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ($data.filterValue = $event))
          }, null, 40 /* PROPS, HYDRATE_EVENTS */, ["placeholder"]), [
            [vue.vModelText, $data.filterValue]
          ]),
          _hoisted_3
        ]))
      : vue.createCommentVNode("v-if", true),
    vue.createVNode("div", {
      class: "p-tree-wrapper",
      style: {maxHeight: $props.scrollHeight}
    }, [
      vue.createVNode("ul", _hoisted_4, [
        (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($options.valueToRender, (node) => {
          return (vue.openBlock(), vue.createBlock(_component_TreeNode, {
            key: node.key,
            node: node,
            templates: _ctx.$slots,
            expandedKeys: $data.d_expandedKeys,
            onNodeToggle: $options.onNodeToggle,
            onNodeClick: $options.onNodeClick,
            selectionMode: $props.selectionMode,
            selectionKeys: $props.selectionKeys,
            onCheckboxChange: $options.onCheckboxChange
          }, null, 8 /* PROPS */, ["node", "templates", "expandedKeys", "onNodeToggle", "onNodeClick", "selectionMode", "selectionKeys", "onCheckboxChange"]))
        }), 128 /* KEYED_FRAGMENT */))
      ])
    ], 4 /* STYLE */)
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

var css_248z = "\n.p-tree-container {\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style-type: none;\r\n    overflow: auto;\n}\n.p-treenode-children {\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style-type: none;\n}\n.p-tree-wrapper {\r\n    overflow: auto;\n}\n.p-treenode-selectable {\r\n    cursor: pointer;\r\n    -webkit-user-select: none;\r\n       -moz-user-select: none;\r\n        -ms-user-select: none;\r\n            user-select: none;\n}\n.p-tree-toggler {\r\n    cursor: pointer;\r\n    -webkit-user-select: none;\r\n       -moz-user-select: none;\r\n        -ms-user-select: none;\r\n            user-select: none;\r\n    display: -webkit-inline-box;\r\n    display: -ms-inline-flexbox;\r\n    display: inline-flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    overflow: hidden;\r\n    position: relative;\n}\n.p-treenode-leaf > .p-treenode-content .p-tree-toggler {\r\n    visibility: hidden;\n}\n.p-treenode-content {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\n}\n.p-tree-filter {\r\n    width: 100%;\n}\n.p-tree-filter-container {\r\n    position: relative;\r\n    display: block;\r\n    width: 100%;\n}\n.p-tree-filter-icon {\r\n    position: absolute;\r\n    top: 50%;\r\n    margin-top: -.5rem;\n}\n.p-tree-loading {\r\n    position: relative;\r\n    min-height: 4rem;\n}\n.p-tree .p-tree-loading-overlay {\r\n    position: absolute;\r\n    z-index: 1;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\n}\n.p-tree-flex-scrollable {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-flex: 1;\r\n        -ms-flex: 1;\r\n            flex: 1;\r\n    height: 100%;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\n}\n.p-tree-flex-scrollable .p-tree-wrapper {\r\n    -webkit-box-flex: 1;\r\n        -ms-flex: 1;\r\n            flex: 1;\n}\r\n";
styleInject(css_248z);

script.render = render;

module.exports = script;
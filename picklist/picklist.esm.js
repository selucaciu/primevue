import Button from 'primevue/button';
import { ObjectUtils, DomHandler, UniqueComponentId } from 'primevue/utils';
import Ripple from 'primevue/ripple';
import { resolveComponent, resolveDirective, openBlock, createBlock, createVNode, renderSlot, createCommentVNode, TransitionGroup, withCtx, Fragment, renderList, withDirectives } from 'vue';

var script = {
    name: 'PickList',
    emits: ['update:modelValue', 'reorder', 'update:selection', 'selection-change', 'move-to-target', 'move-to-source', 'move-all-to-target', 'move-all-to-source'],
    props: {
        modelValue: {
            type: Array,
            default: () => [[],[]]
        },
        selection: {
            type: Array,
            default: () => [[],[]]
        },
        dataKey: {
            type: String,
            default: null
        },
        listStyle: {
            type: null,
            default: null
        },
        metaKeySelection: {
            type: Boolean,
            default: true
        },
        responsive: {
            type: Boolean,
            default: true
        },
        breakpoint: {
            type: String,
            default: '960px'
        }
    },
    itemTouched: false,
    reorderDirection: null,
    styleElement: null,
    data() {
        return {
            d_selection: this.selection
        }
    },
    updated() {
        if (this.reorderDirection) {
            this.updateListScroll(this.$refs.sourceList.$el);
            this.updateListScroll(this.$refs.targetList.$el);
            this.reorderDirection = null;
        }
    },
    beforeUnmount() {
        this.destroyStyle();
    },
    mounted() {
        if (this.responsive) {
            this.createStyle();
        }
    },
    watch: {
        selection(newValue) {
            this.d_selection = newValue;
        }
    },
    methods: {
        getItemKey(item, index) {
            return this.dataKey ? ObjectUtils.resolveFieldData(item, this.dataKey): index;
        },
        isSelected(item, listIndex) {
            return ObjectUtils.findIndexInList(item, this.d_selection[listIndex]) != -1;
        },
        moveUp(event, listIndex) {
            if (this.d_selection && this.d_selection[listIndex]) {
                let valueList = [...this.modelValue[listIndex]];
                let selectionList = this.d_selection[listIndex];

                for (let i = 0; i < selectionList.length; i++) {
                    let selectedItem = selectionList[i];
                    let selectedItemIndex = ObjectUtils.findIndexInList(selectedItem, valueList);

                    if (selectedItemIndex !== 0) {
                        let movedItem = valueList[selectedItemIndex];
                        let temp = valueList[selectedItemIndex - 1];
                        valueList[selectedItemIndex - 1] = movedItem;
                        valueList[selectedItemIndex] = temp;
                    }
                    else {
                        break;
                    }
                }

                let value = [...this.modelValue];
                value[listIndex] = valueList;

                this.reorderDirection = 'up';
                this.$emit('update:modelValue', value);
                this.$emit('reorder', {
                    originalEvent: event,
                    value: value,
                    direction: this.reorderDirection,
                    listIndex: listIndex
                });
            }
        },
        moveTop(event, listIndex) {
            if(this.d_selection) {
                let valueList = [...this.modelValue[listIndex]];
                let selectionList = this.d_selection[listIndex];

                for (let i = 0; i < selectionList.length; i++) {
                    let selectedItem = selectionList[i];
                    let selectedItemIndex = ObjectUtils.findIndexInList(selectedItem, valueList);

                    if (selectedItemIndex !== 0) {
                        let movedItem = valueList.splice(selectedItemIndex, 1)[0];
                        valueList.unshift(movedItem);
                    }
                    else {
                        break;
                    }
                }

                let value = [...this.modelValue];
                value[listIndex] = valueList;

                this.reorderDirection = 'top';
                this.$emit('update:modelValue', value);
                this.$emit('reorder', {
                    originalEvent: event,
                    value: value,
                    direction: this.reorderDirection,
                    listIndex: listIndex
                });
            }
        },
        moveDown(event, listIndex) {
            if(this.d_selection) {
                let valueList = [...this.modelValue[listIndex]];
                let selectionList = this.d_selection[listIndex];

                for (let i = selectionList.length - 1; i >= 0; i--) {
                    let selectedItem = selectionList[i];
                    let selectedItemIndex = ObjectUtils.findIndexInList(selectedItem, valueList);

                    if (selectedItemIndex !== (valueList.length - 1)) {
                        let movedItem = valueList[selectedItemIndex];
                        let temp = valueList[selectedItemIndex + 1];
                        valueList[selectedItemIndex + 1] = movedItem;
                        valueList[selectedItemIndex] = temp;
                    }
                    else {
                        break;
                    }
                }

                let value = [...this.modelValue];
                value[listIndex] = valueList;

                this.reorderDirection = 'down';
                this.$emit('update:modelValue', value);
                this.$emit('reorder', {
                    originalEvent: event,
                    value: value,
                    direction: this.reorderDirection,
                    listIndex: listIndex
                });
            }
        },
        moveBottom(event, listIndex) {
            if (this.d_selection) {
                let valueList = [...this.modelValue[listIndex]];
                let selectionList = this.d_selection[listIndex];

                for (let i = selectionList.length - 1; i >= 0; i--) {
                    let selectedItem = selectionList[i];
                    let selectedItemIndex = ObjectUtils.findIndexInList(selectedItem, valueList);

                    if (selectedItemIndex !== (valueList.length - 1)) {
                        let movedItem = valueList.splice(selectedItemIndex, 1)[0];
                        valueList.push(movedItem);
                    }
                    else {
                        break;
                    }
                }

                let value = [...this.modelValue];
                value[listIndex] = valueList;

                this.reorderDirection = 'bottom';
                this.$emit('update:modelValue', value);
                this.$emit('reorder', {
                    originalEvent: event,
                    value: value,
                    direction: this.reorderDirection,
                    listIndex: listIndex
                });
            }
        },
        moveToTarget(event) {
            let selection = this.d_selection && this.d_selection[0] ? this.d_selection[0] : null;
            let sourceList = [...this.modelValue[0]];
            let targetList = [...this.modelValue[1]];

            if (selection) {
                for (let i = 0; i < selection.length; i++) {
                    let selectedItem = selection[i];

                    if (ObjectUtils.findIndexInList(selectedItem, targetList) == -1) {
                        targetList.push(sourceList.splice(ObjectUtils.findIndexInList(selectedItem, sourceList),1)[0]);
                    }
                }

                let value = [...this.modelValue];
                value[0] = sourceList;
                value[1] = targetList;
                this.$emit('update:modelValue', value);

                this.$emit('move-to-target', {
                    originalEvent: event,
                    items: selection
                });

                this.d_selection[0] = [];
                this.$emit('update:selection', this.d_selection);
                this.$emit('selection-change', {
                    originalEvent: event,
                    value: this.d_selection
                });
            }
        },
        moveAllToTarget(event) {
            if (this.modelValue[0]) {
                let sourceList = [...this.modelValue[0]];
                let targetList = [...this.modelValue[1]];

                this.$emit('move-all-to-target', {
                    originalEvent: event,
                    items: sourceList
                });

                targetList = [...targetList, ...sourceList];
                sourceList = [];

                let value = [...this.modelValue];
                value[0] = sourceList;
                value[1] = targetList;
                this.$emit('update:modelValue', value);

                this.d_selection[0] = [];
                this.$emit('update:selection', this.d_selection);
                this.$emit('selection-change', {
                    originalEvent: event,
                    value: this.d_selection
                });
            }
        },
        moveToSource(event) {
            let selection = this.d_selection && this.d_selection[1] ? this.d_selection[1] : null;
            let sourceList = [...this.modelValue[0]];
            let targetList = [...this.modelValue[1]];

            if (selection) {
                for (let i = 0; i < selection.length; i++) {
                    let selectedItem = selection[i];

                    if (ObjectUtils.findIndexInList(selectedItem, sourceList) == -1) {
                        sourceList.push(targetList.splice(ObjectUtils.findIndexInList(selectedItem, targetList),1)[0]);
                    }
                }

                let value = [...this.modelValue];
                value[0] = sourceList;
                value[1] = targetList;
                this.$emit('update:modelValue', value);

                this.$emit('move-to-source', {
                    originalEvent: event,
                    items: selection
                });

                this.d_selection[1] = [];
                this.$emit('update:selection', this.d_selection);
                this.$emit('selection-change', {
                    originalEvent: event,
                    value: this.d_selection
                });
            }
        },
        moveAllToSource(event) {
            if (this.modelValue[1]) {
                let sourceList = [...this.modelValue[0]];
                let targetList = [...this.modelValue[1]];

                this.$emit('move-all-to-source', {
                    originalEvent: event,
                    items: targetList
                });

                sourceList = [...sourceList, ...targetList];
                targetList = [];

                let value = [...this.modelValue];
                value[0] = sourceList;
                value[1] = targetList;
                this.$emit('update:modelValue', value);

                this.d_selection[1] = [];
                this.$emit('update:selection', this.d_selection);
                this.$emit('selection-change', {
                    originalEvent: event,
                    value: this.d_selection
                });
            }
        },
        onItemClick(event, item, listIndex) {
            this.itemTouched = false;
            const selectionList = this.d_selection[listIndex];
            const selectedIndex = ObjectUtils.findIndexInList(item, selectionList);
            const selected = (selectedIndex != -1);
            const metaSelection = this.itemTouched ? false : this.metaKeySelection;
            let _selection;

            if (metaSelection) {
                let metaKey = (event.metaKey || event.ctrlKey);

                if (selected && metaKey) {
                    _selection = selectionList.filter((val, index) => index !== selectedIndex);
                }
                else {
                    _selection = (metaKey) ? selectionList ? [...selectionList] : [] : [];
                    _selection.push(item);
                }
            }
            else {
                if (selected) {
                    _selection = selectionList.filter((val, index) => index !== selectedIndex);
                }
                else {
                    _selection = selectionList ? [...selectionList] : [];
                    _selection.push(item);
                }
            }

            let newSelection = [...this.d_selection];
            newSelection[listIndex] = _selection;
            this.d_selection = newSelection;

            this.$emit('update:selection', this.d_selection);
            this.$emit('selection-change', {
                originalEvent:event,
                value: this.d_selection
            });
        },
        onItemDblClick(event, item, listIndex) {
            if (listIndex === 0)
                this.moveToTarget(event);
            else if (listIndex === 1)
                this.moveToSource(event);
        },
        onItemTouchEnd() {
            this.itemTouched = true;
        },
        onItemKeyDown(event, item, listIndex) {
            let listItem = event.currentTarget;

            switch(event.which) {
                //down
                case 40:
                    var nextItem = this.findNextItem(listItem);
                    if (nextItem) {
                        nextItem.focus();
                    }

                    event.preventDefault();
                break;

                //up
                case 38:
                    var prevItem = this.findPrevItem(listItem);
                    if (prevItem) {
                        prevItem.focus();
                    }

                    event.preventDefault();
                break;

                //enter
                case 13:
                    this.onItemClick(event, item, listIndex);
                    event.preventDefault();
                break;
            }
        },
        findNextItem(item) {
            let nextItem = item.nextElementSibling;

            if (nextItem)
                return !DomHandler.hasClass(nextItem, 'p-picklist-item') ? this.findNextItem(nextItem) : nextItem;
            else
                return null;
        },
        findPrevItem(item) {
            let prevItem = item.previousElementSibling;

            if (prevItem)
                return !DomHandler.hasClass(prevItem, 'p-picklist-item') ? this.findPrevItem(prevItem) : prevItem;
            else
                return null;
        },
        updateListScroll(listElement) {
            const listItems = DomHandler.find(listElement, '.p-picklist-item.p-highlight');

            if (listItems && listItems.length) {
                switch(this.reorderDirection) {
                    case 'up':
                        DomHandler.scrollInView(listElement, listItems[0]);
                    break;

                    case 'top':
                        listElement.scrollTop = 0;
                    break;

                    case 'down':
                        DomHandler.scrollInView(listElement, listItems[listItems.length - 1]);
                    break;

                    case 'bottom':
                        listElement.scrollTop = listElement.scrollHeight;
                    break;
                }
            }
        },
        createStyle() {
			if (!this.styleElement) {
                this.$el.setAttribute(this.attributeSelector, '');
				this.styleElement = document.createElement('style');
				this.styleElement.type = 'text/css';
				document.head.appendChild(this.styleElement);

                let innerHTML = `
@media screen and (max-width: ${this.breakpoint}) {
    .p-picklist[${this.attributeSelector}] {
        flex-direction: column;
    }

    .p-picklist[${this.attributeSelector}] .p-picklist-buttons {
        padding: var(--content-padding);
        flex-direction: row;
    }

    .p-picklist[${this.attributeSelector}] .p-picklist-buttons .p-button {
        margin-right: var(--inline-spacing);
        margin-bottom: 0;
    }

    .p-picklist[${this.attributeSelector}] .p-picklist-buttons .p-button:last-child {
        margin-right: 0;
    }

    .p-picklist[${this.attributeSelector}] .pi-angle-right:before {
        content: "\\e930"
    }

    .p-picklist[${this.attributeSelector}] .pi-angle-double-right:before {
        content: "\\e92c"
    }

    .p-picklist[${this.attributeSelector}] .pi-angle-left:before {
        content: "\\e933"
    }

    .p-picklist[${this.attributeSelector}] .pi-angle-double-left:before {
        content: "\\e92f"
    }
}
`;

                this.styleElement.innerHTML = innerHTML;
			}
		},
        destroyStyle() {
            if (this.styleElement) {
                document.head.removeChild(this.styleElement);
                this.styleElement = null;
            }
        }
    },
    computed: {
        sourceList() {
            return this.modelValue && this.modelValue[0] ? this.modelValue[0] : null;
        },
        targetList() {
            return this.modelValue && this.modelValue[1] ? this.modelValue[1] : null;
        },
        attributeSelector() {
            return UniqueComponentId();
        }
    },
    components: {
        'PLButton': Button
    },
    directives: {
        'ripple': Ripple
    }
};

const _hoisted_1 = { class: "p-picklist p-component" };
const _hoisted_2 = { class: "p-picklist-buttons p-picklist-source-controls" };
const _hoisted_3 = { class: "p-picklist-list-wrapper p-picklist-source-wrapper" };
const _hoisted_4 = {
  key: 0,
  class: "p-picklist-header"
};
const _hoisted_5 = { class: "p-picklist-buttons p-picklist-transfer-buttons" };
const _hoisted_6 = { class: "p-picklist-list-wrapper p-picklist-target-wrapper" };
const _hoisted_7 = {
  key: 0,
  class: "p-picklist-header"
};
const _hoisted_8 = { class: "p-picklist-buttons p-picklist-target-controls" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PLButton = resolveComponent("PLButton");
  const _directive_ripple = resolveDirective("ripple");

  return (openBlock(), createBlock("div", _hoisted_1, [
    createVNode("div", _hoisted_2, [
      renderSlot(_ctx.$slots, "sourcecontrolsstart"),
      createVNode(_component_PLButton, {
        type: "button",
        icon: "pi pi-angle-up",
        onClick: _cache[1] || (_cache[1] = $event => ($options.moveUp($event, 0)))
      }),
      createVNode(_component_PLButton, {
        type: "button",
        icon: "pi pi-angle-double-up",
        onClick: _cache[2] || (_cache[2] = $event => ($options.moveTop($event, 0)))
      }),
      createVNode(_component_PLButton, {
        type: "button",
        icon: "pi pi-angle-down",
        onClick: _cache[3] || (_cache[3] = $event => ($options.moveDown($event, 0)))
      }),
      createVNode(_component_PLButton, {
        type: "button",
        icon: "pi pi-angle-double-down",
        onClick: _cache[4] || (_cache[4] = $event => ($options.moveBottom($event, 0)))
      }),
      renderSlot(_ctx.$slots, "sourcecontrolsend")
    ]),
    createVNode("div", _hoisted_3, [
      (_ctx.$slots.sourceheader)
        ? (openBlock(), createBlock("div", _hoisted_4, [
            renderSlot(_ctx.$slots, "sourceheader")
          ]))
        : createCommentVNode("v-if", true),
      createVNode(TransitionGroup, {
        ref: "sourceList",
        name: "p-picklist-flip",
        tag: "ul",
        class: "p-picklist-list p-picklist-source",
        style: $props.listStyle,
        role: "listbox",
        "aria-multiselectable": "multiple"
      }, {
        default: withCtx(() => [
          (openBlock(true), createBlock(Fragment, null, renderList($options.sourceList, (item, i) => {
            return withDirectives((openBlock(), createBlock("li", {
              key: $options.getItemKey(item, i),
              tabindex: "0",
              class: ['p-picklist-item', {'p-highlight': $options.isSelected(item, 0)}],
              onClick: $event => ($options.onItemClick($event, item, 0)),
              onDblclick: $event => ($options.onItemDblClick($event, item, 0)),
              onKeydown: $event => ($options.onItemKeyDown($event, item, 0)),
              onTouchend: _cache[5] || (_cache[5] = (...args) => ($options.onItemTouchEnd && $options.onItemTouchEnd(...args))),
              role: "option",
              "aria-selected": $options.isSelected(item, 0)
            }, [
              renderSlot(_ctx.$slots, "item", {
                item: item,
                index: i
              })
            ], 42 /* CLASS, PROPS, HYDRATE_EVENTS */, ["onClick", "onDblclick", "onKeydown", "aria-selected"])), [
              [_directive_ripple]
            ])
          }), 128 /* KEYED_FRAGMENT */))
        ]),
        _: 3 /* FORWARDED */
      }, 8 /* PROPS */, ["style"])
    ]),
    createVNode("div", _hoisted_5, [
      renderSlot(_ctx.$slots, "movecontrolsstart"),
      createVNode(_component_PLButton, {
        type: "button",
        icon: "pi pi-angle-right",
        onClick: $options.moveToTarget
      }, null, 8 /* PROPS */, ["onClick"]),
      createVNode(_component_PLButton, {
        type: "button",
        icon: "pi pi-angle-double-right",
        onClick: $options.moveAllToTarget
      }, null, 8 /* PROPS */, ["onClick"]),
      createVNode(_component_PLButton, {
        type: "button",
        icon: "pi pi-angle-left",
        onClick: $options.moveToSource
      }, null, 8 /* PROPS */, ["onClick"]),
      createVNode(_component_PLButton, {
        type: "button",
        icon: "pi pi-angle-double-left",
        onClick: $options.moveAllToSource
      }, null, 8 /* PROPS */, ["onClick"]),
      renderSlot(_ctx.$slots, "movecontrolsend")
    ]),
    createVNode("div", _hoisted_6, [
      (_ctx.$slots.targetheader)
        ? (openBlock(), createBlock("div", _hoisted_7, [
            renderSlot(_ctx.$slots, "targetheader")
          ]))
        : createCommentVNode("v-if", true),
      createVNode(TransitionGroup, {
        ref: "targetList",
        name: "p-picklist-flip",
        tag: "ul",
        class: "p-picklist-list p-picklist-target",
        style: $props.listStyle,
        role: "listbox",
        "aria-multiselectable": "multiple"
      }, {
        default: withCtx(() => [
          (openBlock(true), createBlock(Fragment, null, renderList($options.targetList, (item, i) => {
            return withDirectives((openBlock(), createBlock("li", {
              key: $options.getItemKey(item, i),
              tabindex: "0",
              class: ['p-picklist-item', {'p-highlight': $options.isSelected(item, 1)}],
              onClick: $event => ($options.onItemClick($event, item, 1)),
              onDblclick: $event => ($options.onItemDblClick($event, item, 1)),
              onKeydown: $event => ($options.onItemKeyDown($event, item, 1)),
              onTouchend: _cache[6] || (_cache[6] = (...args) => ($options.onItemTouchEnd && $options.onItemTouchEnd(...args))),
              role: "option",
              "aria-selected": $options.isSelected(item, 1)
            }, [
              renderSlot(_ctx.$slots, "item", {
                item: item,
                index: i
              })
            ], 42 /* CLASS, PROPS, HYDRATE_EVENTS */, ["onClick", "onDblclick", "onKeydown", "aria-selected"])), [
              [_directive_ripple]
            ])
          }), 128 /* KEYED_FRAGMENT */))
        ]),
        _: 3 /* FORWARDED */
      }, 8 /* PROPS */, ["style"])
    ]),
    createVNode("div", _hoisted_8, [
      renderSlot(_ctx.$slots, "targetcontrolsstart"),
      createVNode(_component_PLButton, {
        type: "button",
        icon: "pi pi-angle-up",
        onClick: _cache[7] || (_cache[7] = $event => ($options.moveUp($event, 1)))
      }),
      createVNode(_component_PLButton, {
        type: "button",
        icon: "pi pi-angle-double-up",
        onClick: _cache[8] || (_cache[8] = $event => ($options.moveTop($event, 1)))
      }),
      createVNode(_component_PLButton, {
        type: "button",
        icon: "pi pi-angle-down",
        onClick: _cache[9] || (_cache[9] = $event => ($options.moveDown($event, 1)))
      }),
      createVNode(_component_PLButton, {
        type: "button",
        icon: "pi pi-angle-double-down",
        onClick: _cache[10] || (_cache[10] = $event => ($options.moveBottom($event, 1)))
      }),
      renderSlot(_ctx.$slots, "targetcontrolsend")
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

var css_248z = "\n.p-picklist {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\n}\n.p-picklist-buttons {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\n}\n.p-picklist-list-wrapper {\r\n    -webkit-box-flex: 1;\r\n        -ms-flex: 1 1 50%;\r\n            flex: 1 1 50%;\n}\n.p-picklist-list {\r\n    list-style-type: none;\r\n    margin: 0;\r\n    padding: 0;\r\n    overflow: auto;\r\n    min-height: 12rem;\r\n    max-height: 24rem;\n}\n.p-picklist-item {\r\n    cursor: pointer;\r\n    overflow: hidden;\r\n    position: relative;\n}\n.p-picklist-item.p-picklist-flip-enter-active.p-picklist-flip-enter-to,\r\n.p-picklist-item.p-picklist-flip-leave-active.p-picklist-flip-leave-to {\r\n    -webkit-transition: none !important;\r\n    transition: none !important;\n}\r\n";
styleInject(css_248z);

script.render = render;

export { script as default };
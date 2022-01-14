import Button from 'primevue/button';
import { ObjectUtils, DomHandler, UniqueComponentId } from 'primevue/utils';
import Ripple from 'primevue/ripple';
import { resolveComponent, resolveDirective, openBlock, createBlock, createVNode, renderSlot, createCommentVNode, TransitionGroup, withCtx, Fragment, renderList, withDirectives } from 'vue';

var script = {
    name: 'OrderList',
    emits: ['update:modelValue', 'reorder', 'update:selection', 'selection-change'],
    props: {
        modelValue: {
            type: Array,
            default: null
        },
        selection: {
            type: Array,
            default: null
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
    beforeUnmount() {
        this.destroyStyle();
    },
    updated() {
        if (this.reorderDirection) {
            this.updateListScroll();
            this.reorderDirection = null;
        }
    },
    mounted() {
        if (this.responsive) {
            this.createStyle();
        }
    },
    methods: {
        getItemKey(item, index) {
            return this.dataKey ? ObjectUtils.resolveFieldData(item, this.dataKey): index;
        },
        isSelected(item) {
            return ObjectUtils.findIndexInList(item, this.d_selection) != -1;
        },
        moveUp() {
            if (this.d_selection) {
                let value = [...this.modelValue];

                for (let i = 0; i < this.d_selection.length; i++) {
                    let selectedItem = this.d_selection[i];
                    let selectedItemIndex = ObjectUtils.findIndexInList(selectedItem, value);

                    if (selectedItemIndex !== 0) {
                        let movedItem = value[selectedItemIndex];
                        let temp = value[selectedItemIndex - 1];
                        value[selectedItemIndex - 1] = movedItem;
                        value[selectedItemIndex] = temp;
                    }
                    else {
                        break;
                    }
                }

                this.reorderDirection = 'up';
                this.$emit('update:modelValue', value);
                this.$emit('reorder', {
                    originalEvent: event,
                    value: value,
                    direction: this.reorderDirection
                });
            }
        },
        moveTop() {
            if(this.d_selection) {
                let value = [...this.modelValue];

                for (let i = 0; i < this.d_selection.length; i++) {
                    let selectedItem = this.d_selection[i];
                    let selectedItemIndex = ObjectUtils.findIndexInList(selectedItem, value);

                    if (selectedItemIndex !== 0) {
                        let movedItem = value.splice(selectedItemIndex, 1)[0];
                        value.unshift(movedItem);
                    }
                    else {
                        break;
                    }
                }

                this.reorderDirection = 'top';
                this.$emit('update:modelValue', value);
                this.$emit('reorder', {
                    originalEvent: event,
                    value: value,
                    direction: this.reorderDirection
                });
            }
        },
        moveDown() {
            if(this.d_selection) {
                let value = [...this.modelValue];

                for (let i = this.d_selection.length - 1; i >= 0; i--) {
                    let selectedItem = this.d_selection[i];
                    let selectedItemIndex = ObjectUtils.findIndexInList(selectedItem, value);

                    if (selectedItemIndex !== (value.length - 1)) {
                        let movedItem = value[selectedItemIndex];
                        let temp = value[selectedItemIndex + 1];
                        value[selectedItemIndex + 1] = movedItem;
                        value[selectedItemIndex] = temp;
                    }
                    else {
                        break;
                    }
                }

                this.reorderDirection = 'down';
                this.$emit('update:modelValue', value);
                this.$emit('reorder', {
                    originalEvent: event,
                    value: value,
                    direction: this.reorderDirection
                });
            }
        },
        moveBottom() {
            if (this.d_selection) {
                let value = [...this.modelValue];

                for (let i = this.d_selection.length - 1; i >= 0; i--) {
                    let selectedItem = this.d_selection[i];
                    let selectedItemIndex = ObjectUtils.findIndexInList(selectedItem, value);

                    if (selectedItemIndex !== (value.length - 1)) {
                        let movedItem = value.splice(selectedItemIndex, 1)[0];
                        value.push(movedItem);
                    }
                    else {
                        break;
                    }
                }

                this.reorderDirection = 'bottom';
                this.$emit('update:modelValue', value);
                this.$emit('reorder', {
                    originalEvent: event,
                    value: value,
                    direction: this.reorderDirection
                });
            }
        },
        onItemClick(event, item, index) {
            this.itemTouched = false;
            let selectedIndex = ObjectUtils.findIndexInList(item, this.d_selection);
            let selected = (selectedIndex != -1);
            let metaSelection = this.itemTouched ? false : this.metaKeySelection;

            if (metaSelection) {
                let metaKey = (event.metaKey || event.ctrlKey);

                if (selected && metaKey) {
                    this.d_selection = this.d_selection.filter((val, index) => index !== selectedIndex);
                }
                else {
                    this.d_selection = (metaKey) ? this.d_selection ? [...this.d_selection] : [] : [];
                    ObjectUtils.insertIntoOrderedArray(item, index, this.d_selection, this.modelValue);
                }
            }
            else {
                if (selected) {
                    this.d_selection = this.d_selection.filter((val, index) => index !== selectedIndex);
                }
                else {
                    this.d_selection = this.d_selection ? [...this.d_selection] : [];
                    ObjectUtils.insertIntoOrderedArray(item, index, this.d_selection, this.modelValue);
                }
            }

            this.$emit('update:selection', this.d_selection);
            this.$emit('selection-change', {
                originalEvent:event,
                value: this.d_selection
            });
        },
        onItemTouchEnd() {
            this.itemTouched = true;
        },
        onItemKeyDown(event, item, index) {
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
                    this.onItemClick(event, item, index);
                    event.preventDefault();
                break;
            }
        },
        findNextItem(item) {
            let nextItem = item.nextElementSibling;

            if (nextItem)
                return !DomHandler.hasClass(nextItem, 'p-orderlist-item') ? this.findNextItem(nextItem) : nextItem;
            else
                return null;
        },
        findPrevItem(item) {
            let prevItem = item.previousElementSibling;

            if (prevItem)
                return !DomHandler.hasClass(prevItem, 'p-orderlist-item') ? this.findPrevItem(prevItem) : prevItem;
            else
                return null;
        },
        updateListScroll() {
            const listItems = DomHandler.find(this.$refs.list.$el, '.p-orderlist-item.p-highlight');

            if (listItems && listItems.length) {
                switch(this.reorderDirection) {
                    case 'up':
                        DomHandler.scrollInView(this.$refs.list.$el, listItems[0]);
                    break;

                    case 'top':
                        this.$refs.list.$el.scrollTop = 0;
                    break;

                    case 'down':
                        DomHandler.scrollInView(this.$refs.list.$el, listItems[listItems.length - 1]);
                    break;

                    case 'bottom':
                        this.$refs.list.$el.scrollTop = this.$refs.list.$el.scrollHeight;
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
    .p-orderlist[${this.attributeSelector}] {
        flex-direction: column;
    }

    .p-orderlist[${this.attributeSelector}] .p-orderlist-controls {
        padding: var(--content-padding);
        flex-direction: row;
    }

    .p-orderlist[${this.attributeSelector}] .p-orderlist-controls .p-button {
        margin-right: var(--inline-spacing);
        margin-bottom: 0;
    }

    .p-orderlist[${this.attributeSelector}] .p-orderlist-controls .p-button:last-child {
        margin-right: 0;
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
        attributeSelector() {
            return UniqueComponentId();
        }
    },
    components: {
        'OLButton': Button
    },
    directives: {
        'ripple': Ripple
    }
};

const _hoisted_1 = { class: "p-orderlist p-component" };
const _hoisted_2 = { class: "p-orderlist-controls" };
const _hoisted_3 = { class: "p-orderlist-list-container" };
const _hoisted_4 = {
  key: 0,
  class: "p-orderlist-header"
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_OLButton = resolveComponent("OLButton");
  const _directive_ripple = resolveDirective("ripple");

  return (openBlock(), createBlock("div", _hoisted_1, [
    createVNode("div", _hoisted_2, [
      renderSlot(_ctx.$slots, "controlsstart"),
      createVNode(_component_OLButton, {
        type: "button",
        icon: "pi pi-angle-up",
        onClick: $options.moveUp
      }, null, 8 /* PROPS */, ["onClick"]),
      createVNode(_component_OLButton, {
        type: "button",
        icon: "pi pi-angle-double-up",
        onClick: $options.moveTop
      }, null, 8 /* PROPS */, ["onClick"]),
      createVNode(_component_OLButton, {
        type: "button",
        icon: "pi pi-angle-down",
        onClick: $options.moveDown
      }, null, 8 /* PROPS */, ["onClick"]),
      createVNode(_component_OLButton, {
        type: "button",
        icon: "pi pi-angle-double-down",
        onClick: $options.moveBottom
      }, null, 8 /* PROPS */, ["onClick"]),
      renderSlot(_ctx.$slots, "controlsend")
    ]),
    createVNode("div", _hoisted_3, [
      (_ctx.$slots.header)
        ? (openBlock(), createBlock("div", _hoisted_4, [
            renderSlot(_ctx.$slots, "header")
          ]))
        : createCommentVNode("v-if", true),
      createVNode(TransitionGroup, {
        ref: "list",
        name: "p-orderlist-flip",
        tag: "ul",
        class: "p-orderlist-list",
        style: $props.listStyle,
        role: "listbox",
        "aria-multiselectable": "multiple"
      }, {
        default: withCtx(() => [
          (openBlock(true), createBlock(Fragment, null, renderList($props.modelValue, (item, i) => {
            return withDirectives((openBlock(), createBlock("li", {
              key: $options.getItemKey(item, i),
              tabindex: "0",
              class: ['p-orderlist-item', {'p-highlight': $options.isSelected(item)}],
              onClick: $event => ($options.onItemClick($event, item, i)),
              onKeydown: $event => ($options.onItemKeyDown($event, item, i)),
              onTouchend: _cache[1] || (_cache[1] = (...args) => ($options.onItemTouchEnd && $options.onItemTouchEnd(...args))),
              role: "option",
              "aria-selected": $options.isSelected(item)
            }, [
              renderSlot(_ctx.$slots, "item", {
                item: item,
                index: i
              })
            ], 42 /* CLASS, PROPS, HYDRATE_EVENTS */, ["onClick", "onKeydown", "aria-selected"])), [
              [_directive_ripple]
            ])
          }), 128 /* KEYED_FRAGMENT */))
        ]),
        _: 3 /* FORWARDED */
      }, 8 /* PROPS */, ["style"])
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

var css_248z = "\n.p-orderlist {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\n}\n.p-orderlist-controls {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\n}\n.p-orderlist-list-container {\r\n    -webkit-box-flex: 1;\r\n        -ms-flex: 1 1 auto;\r\n            flex: 1 1 auto;\n}\n.p-orderlist-list {\r\n    list-style-type: none;\r\n    margin: 0;\r\n    padding: 0;\r\n    overflow: auto;\r\n    min-height: 12rem;\r\n    max-height: 24rem;\n}\n.p-orderlist-item {\r\n    cursor: pointer;\r\n    overflow: hidden;\r\n    position: relative;\n}\n.p-orderlist.p-state-disabled .p-orderlist-item,\r\n.p-orderlist.p-state-disabled .p-button {\r\n    cursor: default;\n}\n.p-orderlist.p-state-disabled .p-orderlist-list {\r\n    overflow: hidden;\n}\r\n";
styleInject(css_248z);

script.render = render;

export { script as default };

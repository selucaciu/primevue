'use strict';

var utils = require('primevue/utils');
var OverlayEventBus = require('primevue/overlayeventbus');
var Button = require('primevue/button');
var Ripple = require('primevue/ripple');
var VirtualScroller = require('primevue/virtualscroller');
var vue = require('vue');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var OverlayEventBus__default = /*#__PURE__*/_interopDefaultLegacy(OverlayEventBus);
var Button__default = /*#__PURE__*/_interopDefaultLegacy(Button);
var Ripple__default = /*#__PURE__*/_interopDefaultLegacy(Ripple);
var VirtualScroller__default = /*#__PURE__*/_interopDefaultLegacy(VirtualScroller);

var script = {
    name: 'AutoComplete',
    inheritAttrs: false,
    emits: ['update:modelValue', 'item-select', 'item-unselect', 'dropdown-click', 'clear', 'complete'],
    props: {
        modelValue: null,
        suggestions: {
            type: Array,
            default: null
        },
        field: {
            type: [String,Function],
            default: null
        },
        optionGroupLabel: null,
        optionGroupChildren: null,
        scrollHeight: {
            type: String,
            default: '200px'
        },
        dropdown: {
            type: Boolean,
            default: false
        },
        dropdownMode: {
            type: String,
            default: 'blank'
        },
        autoHighlight: {
            type: Boolean,
            default: false
        },
        multiple: {
            type: Boolean,
            default: false
        },
        minLength: {
            type: Number,
            default: 1
        },
        delay: {
            type: Number,
            default: 300
        },
        appendTo: {
            type: String,
            default: 'body'
        },
        forceSelection: {
            type: Boolean,
            default: false
        },
        completeOnFocus: {
            type: Boolean,
            default: false
        },
        inputClass: null,
        inputStyle: null,
        class: null,
        style: null,
        panelClass: null,
        virtualScrollerOptions: {
            type: Object,
            default: null
        }
    },
    timeout: null,
    outsideClickListener: null,
    resizeListener: null,
    scrollHandler: null,
    overlay: null,
    virtualScroller: null,
    data() {
        return {
            searching: false,
            focused: false,
            overlayVisible: false,
            inputTextValue: null,
            highlightItem: null
        };
    },
    watch: {
        suggestions() {
            if (this.searching) {
                if (this.suggestions && this.suggestions.length)
                    this.showOverlay();
                else
                    this.hideOverlay();

                this.searching = false;
            }
        }
    },
    beforeUnmount() {
        this.unbindOutsideClickListener();
        this.unbindResizeListener();

        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }

        if (this.overlay) {
            utils.ZIndexUtils.clear(this.overlay);
            this.overlay = null;
        }
    },
    updated() {
        if (this.overlayVisible) {
            this.alignOverlay();
        }
    },
    methods: {
        getOptionIndex(index, fn) {
            return this.virtualScrollerDisabled ? index : (fn && fn(index)['index']);
        },
        getOptionRenderKey(option) {
            return this.getItemContent(option);
        },
        getOptionGroupRenderKey(optionGroup) {
            return utils.ObjectUtils.resolveFieldData(optionGroup, this.optionGroupLabel);
        },
        getOptionGroupLabel(optionGroup) {
            return utils.ObjectUtils.resolveFieldData(optionGroup, this.optionGroupLabel);
        },
        getOptionGroupChildren(optionGroup) {
            return utils.ObjectUtils.resolveFieldData(optionGroup, this.optionGroupChildren);
        },
        onOverlayEnter(el) {
            utils.ZIndexUtils.set('overlay', el, this.$primevue.config.zIndex.overlay);
            this.alignOverlay();
            this.bindOutsideClickListener();
            this.bindScrollListener();
            this.bindResizeListener();

            if (this.autoHighlight && this.suggestions && this.suggestions.length) {
                utils.DomHandler.addClass(this.list.firstElementChild, 'p-highlight');
            }
        },
        onOverlayLeave() {
            this.unbindOutsideClickListener();
            this.unbindScrollListener();
            this.unbindResizeListener();
            this.overlay = null;
        },
        onOverlayAfterLeave(el) {
            utils.ZIndexUtils.clear(el);
        },
        alignOverlay() {
            let target = this.multiple ? this.$refs.multiContainer : this.$refs.input;
            if (this.appendDisabled) {
                utils.DomHandler.relativePosition(this.overlay, target);
            }
            else {
                this.overlay.style.minWidth = utils.DomHandler.getOuterWidth(target) + 'px';
                utils.DomHandler.absolutePosition(this.overlay, target);
            }
        },
        bindOutsideClickListener() {
            if (!this.outsideClickListener) {
                this.outsideClickListener = (event) => {
                    if (this.overlayVisible && this.overlay && this.isOutsideClicked(event)) {
                        this.hideOverlay();
                    }
                };
                document.addEventListener('click', this.outsideClickListener);
            }
        },
        bindScrollListener() {
            if (!this.scrollHandler) {
                this.scrollHandler = new utils.ConnectedOverlayScrollHandler(this.$refs.container, () => {
                    if (this.overlayVisible) {
                        this.hideOverlay();
                    }
                });
            }

            this.scrollHandler.bindScrollListener();
        },
        unbindScrollListener() {
            if (this.scrollHandler) {
                this.scrollHandler.unbindScrollListener();
            }
        },
        bindResizeListener() {
            if (!this.resizeListener) {
                this.resizeListener = () => {
                    if (this.overlayVisible) {
                        this.hideOverlay();
                    }
                };
                window.addEventListener('resize', this.resizeListener);
            }
        },
        unbindResizeListener() {
            if (this.resizeListener) {
                window.removeEventListener('resize', this.resizeListener);
                this.resizeListener = null;
            }
        },
        isOutsideClicked(event) {
            return !this.overlay.contains(event.target) && !this.isInputClicked(event) && !this.isDropdownClicked(event);
        },
        isInputClicked(event) {
            if (this.multiple)
                return event.target === this.$refs.multiContainer || this.$refs.multiContainer.contains(event.target);
            else
                return event.target === this.$refs.input;
        },
        isDropdownClicked(event) {
            return this.$refs.dropdownButton ? (event.target === this.$refs.dropdownButton || this.$refs.dropdownButton.$el.contains(event.target)) : false;
        },
        unbindOutsideClickListener() {
            if (this.outsideClickListener) {
                document.removeEventListener('click', this.outsideClickListener);
                this.outsideClickListener = null;
            }
        },
        selectItem(event, item) {
            if (this.multiple) {
                this.$refs.input.value = '';
                this.inputTextValue = '';

                if (!this.isSelected(item)) {
                    let newValue = this.modelValue ? [...this.modelValue, item] : [item];
                    this.$emit('update:modelValue', newValue);
                }
            }
            else {
                this.$emit('update:modelValue', item);
            }

            this.$emit('item-select', {
                originalEvent: event,
                value: item
            });

            this.focus();
            this.hideOverlay();
        },
        onMultiContainerClick(event) {
            this.focus();
            if(this.completeOnFocus) {
                this.search(event, '', 'click');
            }
        },
        removeItem(event, index) {
            let removedValue = this.modelValue[index];
            let newValue = this.modelValue.filter((val, i) => (index !== i));
            this.$emit('update:modelValue', newValue);
            this.$emit('item-unselect', {
                originalEvent: event,
                value: removedValue
            });
        },
        onDropdownClick(event) {
            this.focus();
            const query = this.$refs.input.value;

            if (this.dropdownMode === 'blank')
                this.search(event, '', 'dropdown');
            else if (this.dropdownMode === 'current')
                this.search(event, query, 'dropdown');

            this.$emit('dropdown-click', {
                originalEvent: event,
                query: query
            });
        },
        getItemContent(item) {
            return this.field ? utils.ObjectUtils.resolveFieldData(item, this.field) : item;
        },
        showOverlay() {
            this.overlayVisible = true;
        },
        hideOverlay() {
            this.overlayVisible = false;
        },
        focus() {
            this.$refs.input.focus();
        },
        search(event, query, source) {
            //allow empty string but not undefined or null
            if (query === undefined || query === null) {
                return;
            }

            //do not search blank values on input change
            if (source === 'input' && query.trim().length === 0) {
                return;
            }

            this.searching = true;
            this.$emit('complete', {
                originalEvent: event,
                query: query
            });
        },
        onInputClicked(event) {
            if(this.completeOnFocus) {
                this.search(event, '', 'click');
            }
        },
        onInput(event) {
            this.inputTextValue = event.target.value;

            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            let query = event.target.value;
            if (!this.multiple) {
                this.$emit('update:modelValue', query);
            }

            if (query.length === 0) {
                this.hideOverlay();
                this.$emit('clear');
            }
            else {
                if (query.length >= this.minLength) {
                    this.timeout = setTimeout(() => {
                        this.search(event, query, 'input');
                    }, this.delay);
                }
                else {
                    this.hideOverlay();
                }
            }
        },
        onFocus() {
            this.focused = true;
        },
        onBlur() {
            this.focused = false;
        },
        onKeyDown(event) {
            if (this.overlayVisible) {
                let highlightItem = utils.DomHandler.findSingle(this.list, 'li.p-highlight');

                switch(event.which) {
                    //down
                    case 40:
                        if (highlightItem) {
                            let nextElement = this.findNextItem(highlightItem);
                            if (nextElement) {
                                utils.DomHandler.addClass(nextElement, 'p-highlight');
                                utils.DomHandler.removeClass(highlightItem, 'p-highlight');
                                nextElement.scrollIntoView({ block: 'nearest', inline: 'start' });
                            }
                        }
                        else {
                            highlightItem = this.list.firstElementChild;
                            if (utils.DomHandler.hasClass(highlightItem, 'p-autocomplete-item-group')) {
                                highlightItem = this.findNextItem(highlightItem);
                            }

                            if (highlightItem) {
                                utils.DomHandler.addClass(highlightItem, 'p-highlight');
                            }
                        }

                        event.preventDefault();
                    break;

                    //up
                    case 38:
                        if (highlightItem) {
                            let previousElement = this.findPrevItem(highlightItem);
                            if (previousElement) {
                                utils.DomHandler.addClass(previousElement, 'p-highlight');
                                utils.DomHandler.removeClass(highlightItem, 'p-highlight');
                                previousElement.scrollIntoView({ block: 'nearest', inline: 'start' });
                            }
                        }

                        event.preventDefault();
                    break;

                    //enter
                    case 13:
                        if (highlightItem) {
                            this.selectHighlightItem(event, highlightItem);
                            this.hideOverlay();
                        }

                        event.preventDefault();
                    break;

                    //escape
                    case 27:
                        this.hideOverlay();
                        event.preventDefault();
                    break;

                    //tab
                    case 9:
                        if (highlightItem) {
                            this.selectHighlightItem(event, highlightItem);
                        }

                        this.hideOverlay();
                    break;
                }
            }

            if (this.multiple) {
                switch(event.which) {
                    //backspace
                    case 8:
                        if (this.modelValue && this.modelValue.length && !this.$refs.input.value) {
                            let removedValue = this.modelValue[this.modelValue.length - 1];
                            let newValue = this.modelValue.slice(0, -1);

                            this.$emit('update:modelValue', newValue);
                            this.$emit('item-unselect', {
                                originalEvent: event,
                                value: removedValue
                            });
                        }
                    break;
                }
            }
        },
        selectHighlightItem(event, item) {
            if (this.optionGroupLabel) {
                let optionGroup = this.suggestions[item.dataset.group];
                this.selectItem(event, this.getOptionGroupChildren(optionGroup)[item.dataset.index]);
            }
            else {
                this.selectItem(event, this.suggestions[item.dataset.index]);
            }
        },
        findNextItem(item) {
            let nextItem = item.nextElementSibling;

            if (nextItem)
                return utils.DomHandler.hasClass(nextItem, 'p-autocomplete-item-group') ? this.findNextItem(nextItem) : nextItem;
            else
                return null;
        },
        findPrevItem(item) {
            let prevItem = item.previousElementSibling;

            if (prevItem)
                return utils.DomHandler.hasClass(prevItem, 'p-autocomplete-item-group') ? this.findPrevItem(prevItem) : prevItem;
            else
                return null;
        },
        onChange(event) {
            if (this.forceSelection) {
                let valid = false;
                let inputValue = event.target.value.trim();

                if (this.suggestions)  {
                    for (let item of this.suggestions) {
                        let itemValue = this.field ? utils.ObjectUtils.resolveFieldData(item, this.field) : item;
                        if (itemValue && inputValue === itemValue.trim()) {
                            valid = true;
                            this.selectItem(event, item);
                            break;
                        }
                    }
                }

                if (!valid) {
                    this.$refs.input.value = '';
                    this.inputTextValue = '';
                    this.$emit('clear');
                    if (!this.multiple) {
                        this.$emit('update:modelValue', null);
                    }
                }
            }
        },
        isSelected(val) {
            let selected = false;
            if (this.modelValue && this.modelValue.length) {
                for (let i = 0; i < this.modelValue.length; i++) {
                    if (utils.ObjectUtils.equals(this.modelValue[i], val)) {
                        selected = true;
                        break;
                    }
                }
            }

            return selected;
        },
        overlayRef(el) {
            this.overlay = el;
        },
        listRef(el, contentRef) {
            this.list = el;
            contentRef && contentRef(el); // for virtualScroller
        },
        virtualScrollerRef(el) {
            this.virtualScroller = el;
        },
        onOverlayClick(event) {
            OverlayEventBus__default["default"].emit('overlay-click', {
                originalEvent: event,
                target: this.$el
            });
        }
    },
    computed: {
        containerClass() {
            return ['p-autocomplete p-component p-inputwrapper', this.class, {
                'p-autocomplete-dd': this.dropdown,
                'p-autocomplete-multiple': this.multiple,
                'p-inputwrapper-filled': ((this.modelValue) || (this.inputTextValue && this.inputTextValue.length)),
                'p-inputwrapper-focus': this.focused
            }];
        },
        inputFieldClass() {
            return ['p-autocomplete-input p-inputtext p-component', this.inputClass, {
                'p-autocomplete-dd-input': this.dropdown,
                'p-disabled': this.$attrs.disabled
            }];
        },
        multiContainerClass() {
            return ['p-autocomplete-multiple-container p-component p-inputtext', {
                'p-disabled': this.$attrs.disabled,
                'p-focus': this.focused
            }];
        },
        panelStyleClass() {
            return [
                'p-autocomplete-panel p-component', this.panelClass, {
                'p-input-filled': this.$primevue.config.inputStyle === 'filled',
                'p-ripple-disabled': this.$primevue.config.ripple === false
            }];
        },
        inputValue() {
            if (this.modelValue) {
                if (this.field && typeof this.modelValue === 'object') {
                    const resolvedFieldData = utils.ObjectUtils.resolveFieldData(this.modelValue, this.field);
                    return resolvedFieldData != null ? resolvedFieldData : this.modelValue;
                }
                else
                    return this.modelValue;
            }
            else {
                return '';
            }
        },
        listId() {
            return utils.UniqueComponentId() + '_list';
        },
        appendDisabled() {
            return this.appendTo === 'self';
        },
        appendTarget() {
            return this.appendDisabled ? null : this.appendTo;
        },
        virtualScrollerDisabled() {
            return !this.virtualScrollerOptions;
        }
    },
    components: {
        'Button': Button__default["default"],
        'VirtualScroller': VirtualScroller__default["default"]
    },
    directives: {
        'ripple': Ripple__default["default"]
    }
};

const _hoisted_1 = { class: "p-autocomplete-token-label" };
const _hoisted_2 = { class: "p-autocomplete-input-token" };
const _hoisted_3 = {
  key: 2,
  class: "p-autocomplete-loader pi pi-spinner pi-spin"
};
const _hoisted_4 = { class: "p-autocomplete-item-group" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Button = vue.resolveComponent("Button");
  const _component_VirtualScroller = vue.resolveComponent("VirtualScroller");
  const _directive_ripple = vue.resolveDirective("ripple");

  return (vue.openBlock(), vue.createBlock("span", {
    ref: "container",
    class: $options.containerClass,
    "aria-haspopup": "listbox",
    "aria-owns": $options.listId,
    "aria-expanded": $data.overlayVisible,
    style: $props.style
  }, [
    (!$props.multiple)
      ? (vue.openBlock(), vue.createBlock("input", vue.mergeProps({
          key: 0,
          ref: "input",
          class: $options.inputFieldClass,
          style: $props.inputStyle
        }, _ctx.$attrs, {
          value: $options.inputValue,
          onClick: _cache[1] || (_cache[1] = (...args) => ($options.onInputClicked && $options.onInputClicked(...args))),
          onInput: _cache[2] || (_cache[2] = (...args) => ($options.onInput && $options.onInput(...args))),
          onFocus: _cache[3] || (_cache[3] = (...args) => ($options.onFocus && $options.onFocus(...args))),
          onBlur: _cache[4] || (_cache[4] = (...args) => ($options.onBlur && $options.onBlur(...args))),
          onKeydown: _cache[5] || (_cache[5] = (...args) => ($options.onKeyDown && $options.onKeyDown(...args))),
          onChange: _cache[6] || (_cache[6] = (...args) => ($options.onChange && $options.onChange(...args))),
          type: "text",
          autoComplete: "off",
          role: "searchbox",
          "aria-autocomplete": "list",
          "aria-controls": $options.listId
        }), null, 16 /* FULL_PROPS */, ["value", "aria-controls"]))
      : vue.createCommentVNode("v-if", true),
    ($props.multiple)
      ? (vue.openBlock(), vue.createBlock("ul", {
          key: 1,
          ref: "multiContainer",
          class: $options.multiContainerClass,
          onClick: _cache[12] || (_cache[12] = (...args) => ($options.onMultiContainerClick && $options.onMultiContainerClick(...args)))
        }, [
          (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($props.modelValue, (item, i) => {
            return (vue.openBlock(), vue.createBlock("li", {
              key: i,
              class: "p-autocomplete-token"
            }, [
              vue.renderSlot(_ctx.$slots, "chip", { value: item }, () => [
                vue.createVNode("span", _hoisted_1, vue.toDisplayString($options.getItemContent(item)), 1 /* TEXT */)
              ]),
              vue.createVNode("span", {
                class: "p-autocomplete-token-icon pi pi-times-circle",
                onClick: $event => ($options.removeItem($event, i))
              }, null, 8 /* PROPS */, ["onClick"])
            ]))
          }), 128 /* KEYED_FRAGMENT */)),
          vue.createVNode("li", _hoisted_2, [
            vue.createVNode("input", vue.mergeProps({
              ref: "input",
              type: "text",
              autoComplete: "off"
            }, _ctx.$attrs, {
              onInput: _cache[7] || (_cache[7] = (...args) => ($options.onInput && $options.onInput(...args))),
              onFocus: _cache[8] || (_cache[8] = (...args) => ($options.onFocus && $options.onFocus(...args))),
              onBlur: _cache[9] || (_cache[9] = (...args) => ($options.onBlur && $options.onBlur(...args))),
              onKeydown: _cache[10] || (_cache[10] = (...args) => ($options.onKeyDown && $options.onKeyDown(...args))),
              onChange: _cache[11] || (_cache[11] = (...args) => ($options.onChange && $options.onChange(...args))),
              role: "searchbox",
              "aria-autocomplete": "list",
              "aria-controls": $options.listId
            }), null, 16 /* FULL_PROPS */, ["aria-controls"])
          ])
        ], 2 /* CLASS */))
      : vue.createCommentVNode("v-if", true),
    ($data.searching)
      ? (vue.openBlock(), vue.createBlock("i", _hoisted_3))
      : vue.createCommentVNode("v-if", true),
    ($props.dropdown)
      ? (vue.openBlock(), vue.createBlock(_component_Button, {
          key: 3,
          ref: "dropdownButton",
          type: "button",
          icon: "pi pi-chevron-down",
          class: "p-autocomplete-dropdown",
          disabled: _ctx.$attrs.disabled,
          onClick: $options.onDropdownClick
        }, null, 8 /* PROPS */, ["disabled", "onClick"]))
      : vue.createCommentVNode("v-if", true),
    (vue.openBlock(), vue.createBlock(vue.Teleport, {
      to: $options.appendTarget,
      disabled: $options.appendDisabled
    }, [
      vue.createVNode(vue.Transition, {
        name: "p-connected-overlay",
        onEnter: $options.onOverlayEnter,
        onLeave: $options.onOverlayLeave,
        onAfterLeave: $options.onOverlayAfterLeave
      }, {
        default: vue.withCtx(() => [
          ($data.overlayVisible)
            ? (vue.openBlock(), vue.createBlock("div", {
                key: 0,
                ref: $options.overlayRef,
                class: $options.panelStyleClass,
                style: {'max-height': $options.virtualScrollerDisabled ? $props.scrollHeight : ''},
                onClick: _cache[13] || (_cache[13] = (...args) => ($options.onOverlayClick && $options.onOverlayClick(...args)))
              }, [
                vue.renderSlot(_ctx.$slots, "header", {
                  value: $props.modelValue,
                  suggestions: $props.suggestions
                }),
                vue.createVNode(_component_VirtualScroller, vue.mergeProps({ ref: $options.virtualScrollerRef }, $props.virtualScrollerOptions, {
                  style: {'height': $props.scrollHeight},
                  items: $props.suggestions,
                  disabled: $options.virtualScrollerDisabled
                }), vue.createSlots({
                  content: vue.withCtx(({ styleClass, contentRef, items, getItemOptions }) => [
                    vue.createVNode("ul", {
                      id: $options.listId,
                      ref: (el) => $options.listRef(el, contentRef),
                      class: ['p-autocomplete-items', styleClass],
                      role: "listbox"
                    }, [
                      (!$props.optionGroupLabel)
                        ? (vue.openBlock(true), vue.createBlock(vue.Fragment, { key: 0 }, vue.renderList(items, (item, i) => {
                            return vue.withDirectives((vue.openBlock(), vue.createBlock("li", {
                              class: "p-autocomplete-item",
                              key: $options.getOptionRenderKey(item),
                              onClick: $event => ($options.selectItem($event, item)),
                              role: "option",
                              "data-index": $options.getOptionIndex(i, getItemOptions)
                            }, [
                              vue.renderSlot(_ctx.$slots, "item", {
                                item: item,
                                index: $options.getOptionIndex(i, getItemOptions)
                              }, () => [
                                vue.createTextVNode(vue.toDisplayString($options.getItemContent(item)), 1 /* TEXT */)
                              ])
                            ], 8 /* PROPS */, ["onClick", "data-index"])), [
                              [_directive_ripple]
                            ])
                          }), 128 /* KEYED_FRAGMENT */))
                        : (vue.openBlock(true), vue.createBlock(vue.Fragment, { key: 1 }, vue.renderList(items, (optionGroup, i) => {
                            return (vue.openBlock(), vue.createBlock(vue.Fragment, {
                              key: $options.getOptionGroupRenderKey(optionGroup)
                            }, [
                              vue.createVNode("li", _hoisted_4, [
                                vue.renderSlot(_ctx.$slots, "optiongroup", {
                                  item: optionGroup,
                                  index: $options.getOptionIndex(i, getItemOptions)
                                }, () => [
                                  vue.createTextVNode(vue.toDisplayString($options.getOptionGroupLabel(optionGroup)), 1 /* TEXT */)
                                ])
                              ]),
                              (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($options.getOptionGroupChildren(optionGroup), (item, j) => {
                                return vue.withDirectives((vue.openBlock(), vue.createBlock("li", {
                                  class: "p-autocomplete-item",
                                  key: j,
                                  onClick: $event => ($options.selectItem($event, item)),
                                  role: "option",
                                  "data-group": i,
                                  "data-index": $options.getOptionIndex(j, getItemOptions)
                                }, [
                                  vue.renderSlot(_ctx.$slots, "item", {
                                    item: item,
                                    index: $options.getOptionIndex(j, getItemOptions)
                                  }, () => [
                                    vue.createTextVNode(vue.toDisplayString($options.getItemContent(item)), 1 /* TEXT */)
                                  ])
                                ], 8 /* PROPS */, ["onClick", "data-group", "data-index"])), [
                                  [_directive_ripple]
                                ])
                              }), 128 /* KEYED_FRAGMENT */))
                            ], 64 /* STABLE_FRAGMENT */))
                          }), 128 /* KEYED_FRAGMENT */))
                    ], 10 /* CLASS, PROPS */, ["id"])
                  ]),
                  _: 2 /* DYNAMIC */
                }, [
                  (_ctx.$slots.loader)
                    ? {
                        name: "loader",
                        fn: vue.withCtx(({ options }) => [
                          vue.renderSlot(_ctx.$slots, "loader", { options: options })
                        ])
                      }
                    : undefined
                ]), 1040 /* FULL_PROPS, DYNAMIC_SLOTS */, ["style", "items", "disabled"]),
                vue.renderSlot(_ctx.$slots, "footer", {
                  value: $props.modelValue,
                  suggestions: $props.suggestions
                })
              ], 6 /* CLASS, STYLE */))
            : vue.createCommentVNode("v-if", true)
        ]),
        _: 3 /* FORWARDED */
      }, 8 /* PROPS */, ["onEnter", "onLeave", "onAfterLeave"])
    ], 8 /* PROPS */, ["to", "disabled"]))
  ], 14 /* CLASS, STYLE, PROPS */, ["aria-owns", "aria-expanded"]))
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

var css_248z = "\n.p-autocomplete {\r\n    display: -webkit-inline-box;\r\n    display: -ms-inline-flexbox;\r\n    display: inline-flex;\r\n    position: relative;\n}\n.p-autocomplete-loader {\r\n    position: absolute;\r\n    top: 50%;\r\n    margin-top: -.5rem;\n}\n.p-autocomplete-dd .p-autocomplete-input {\r\n    -webkit-box-flex: 1;\r\n        -ms-flex: 1 1 auto;\r\n            flex: 1 1 auto;\r\n    width: 1%;\n}\n.p-autocomplete-dd .p-autocomplete-input,\r\n.p-autocomplete-dd .p-autocomplete-multiple-container {\r\n     border-top-right-radius: 0;\r\n     border-bottom-right-radius: 0;\n}\n.p-autocomplete-dd .p-autocomplete-dropdown {\r\n     border-top-left-radius: 0;\r\n     border-bottom-left-radius: 0px;\n}\n.p-autocomplete .p-autocomplete-panel {\r\n    min-width: 100%;\n}\n.p-autocomplete-panel {\r\n    position: absolute;\r\n    overflow: auto;\r\n    top: 0;\r\n    left: 0;\n}\n.p-autocomplete-items {\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style-type: none;\n}\n.p-autocomplete-item {\r\n    cursor: pointer;\r\n    white-space: nowrap;\r\n    position: relative;\r\n    overflow: hidden;\n}\n.p-autocomplete-multiple-container {\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style-type: none;\r\n    cursor: text;\r\n    overflow: hidden;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -ms-flex-wrap: wrap;\r\n        flex-wrap: wrap;\n}\n.p-autocomplete-token {\r\n    cursor: default;\r\n    display: -webkit-inline-box;\r\n    display: -ms-inline-flexbox;\r\n    display: inline-flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-flex: 0;\r\n        -ms-flex: 0 0 auto;\r\n            flex: 0 0 auto;\n}\n.p-autocomplete-token-icon {\r\n    cursor: pointer;\n}\n.p-autocomplete-input-token {\r\n    -webkit-box-flex: 1;\r\n        -ms-flex: 1 1 auto;\r\n            flex: 1 1 auto;\r\n    display: -webkit-inline-box;\r\n    display: -ms-inline-flexbox;\r\n    display: inline-flex;\n}\n.p-autocomplete-input-token input {\r\n    border: 0 none;\r\n    outline: 0 none;\r\n    background-color: transparent;\r\n    margin: 0;\r\n    padding: 0;\r\n    -webkit-box-shadow: none;\r\n            box-shadow: none;\r\n    border-radius: 0;\r\n    width: 100%;\n}\n.p-fluid .p-autocomplete {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\n}\n.p-fluid .p-autocomplete-dd .p-autocomplete-input {\r\n    width: 1%;\n}\r\n";
styleInject(css_248z);

script.render = render;

module.exports = script;
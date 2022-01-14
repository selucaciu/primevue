this.primevue = this.primevue || {};
this.primevue.multiselect = (function (utils, OverlayEventBus, api, Ripple, VirtualScroller, vue) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var OverlayEventBus__default = /*#__PURE__*/_interopDefaultLegacy(OverlayEventBus);
    var Ripple__default = /*#__PURE__*/_interopDefaultLegacy(Ripple);
    var VirtualScroller__default = /*#__PURE__*/_interopDefaultLegacy(VirtualScroller);

    var script = {
        name: 'MultiSelect',
        emits: ['update:modelValue', 'before-show', 'before-hide', 'change', 'show', 'hide', 'filter', 'selectall-change'],
        props: {
            modelValue: null,
            options: Array,
            optionLabel: null,
            optionValue: null,
            optionDisabled: null,
            optionGroupLabel: null,
            optionGroupChildren: null,
    		scrollHeight: {
    			type: String,
    			default: '200px'
    		},
    		placeholder: String,
    		disabled: Boolean,
            tabindex: String,
            inputId: String,
            dataKey: null,
            filter: Boolean,
            filterPlaceholder: String,
            filterLocale: String,
            filterMatchMode: {
                type: String,
                default: 'contains'
            },
            filterFields: {
                type: Array,
                default: null
            },
            ariaLabelledBy: null,
            appendTo: {
                type: String,
                default: 'body'
            },
            emptyFilterMessage: {
                type: String,
                default: null
            },
            emptyMessage: {
                type: String,
                default: null
            },
            display: {
                type: String,
                default: 'comma'
            },
            panelClass: null,
            selectedItemsLabel: {
                type: String,
                default: '{0} items selected'
            },
            maxSelectedLabels: {
                type: Number,
                default: null
            },
            selectionLimit: {
                type: Number,
                default: null
            },
            showToggleAll: {
                type: Boolean,
                default: true
            },
            loading: {
                type: Boolean,
                default: false
            },
            loadingIcon: {
                type: String,
                default: 'pi pi-spinner pi-spin'
            },
            virtualScrollerOptions: {
                type: Object,
                default: null
            },
            selectAll: {
                type: Boolean,
                default: null
            }
        },
        data() {
            return {
                focused: false,
                headerCheckboxFocused: false,
                filterValue: null,
                overlayVisible: false
            };
        },
        outsideClickListener: null,
        resizeListener: null,
        scrollHandler: null,
        overlay: null,
        virtualScroller: null,
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
        methods: {
            getOptionIndex(index, fn) {
                return this.virtualScrollerDisabled ? index : (fn && fn(index)['index']);
            },
            getOptionLabel(option) {
                return this.optionLabel ? utils.ObjectUtils.resolveFieldData(option, this.optionLabel) : option;
            },
            getOptionValue(option) {
                return this.optionValue ? utils.ObjectUtils.resolveFieldData(option, this.optionValue) : option;
            },
            getOptionRenderKey(option) {
                return this.dataKey ? utils.ObjectUtils.resolveFieldData(option, this.dataKey) : this.getOptionLabel(option);
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
            isOptionDisabled(option) {
                if (this.maxSelectionLimitReached && !this.isSelected(option)) {
                    return true;
                }

                return this.optionDisabled ? utils.ObjectUtils.resolveFieldData(option, this.optionDisabled) : false;
            },
            getSelectedOptionIndex() {
                if (this.modelValue != null && this.options) {
                    if (this.optionGroupLabel) {
                        for (let i = 0; i < this.options.length; i++) {
                            let selectedOptionIndex = this.findOptionIndexInList(this.modelValue, this.getOptionGroupChildren(this.options[i]));
                            if (selectedOptionIndex !== -1) {
                                return {group: i, option: selectedOptionIndex};
                            }
                        }
                    }
                    else {
                        return this.findOptionIndexInList(this.modelValue, this.options);
                    }
                }

                return -1;
            },
            findOptionIndexInList(value, list) {
                return value ? list.findIndex(item => value.some(val => utils.ObjectUtils.equals(val, this.getOptionValue(item), this.equalityKey))) : -1;
            },
            isSelected(option) {
                if (this.modelValue) {
                    let optionValue = this.getOptionValue(option);
                    let key = this.equalityKey;

                    return this.modelValue.some(val => utils.ObjectUtils.equals(val, optionValue, key));
                }

                return false;
            },
            show() {
                this.$emit('before-show');
                this.overlayVisible = true;
            },
            hide() {
                this.$emit('before-hide');
                this.overlayVisible = false;
            },
            onFocus() {
                this.focused = true;
            },
            onBlur() {
                this.focused = false;
            },
            onHeaderCheckboxFocus() {
                this.headerCheckboxFocused = true;
            },
            onHeaderCheckboxBlur() {
                this.headerCheckboxFocused = false;
            },
            onClick(event) {
                if (this.disabled || this.loading) {
                    return;
                }

                if ((!this.overlay || !this.overlay.contains(event.target)) && !utils.DomHandler.hasClass(event.target, 'p-multiselect-close')) {
                    utils.DomHandler.hasClass(event.target, 'p-multiselect-close');
                    if (this.overlayVisible)
                        this.hide();
                    else
                        this.show();

                    this.$refs.focusInput.focus();
                }
            },
            onCloseClick() {
                this.hide();
            },
            onKeyDown(event) {
                switch(event.which) {
                    //down
                    case 40:
                        if (this.visibleOptions && !this.overlayVisible && event.altKey) {
                            this.show();
                        }
                    break;

                    //space
                    case 32:
                        if (!this.overlayVisible) {
                            this.show();
                            event.preventDefault();
                        }
                    break;

                    //enter and escape
                    case 13:
                    case 27:
                        if (this.overlayVisible) {
                            this.hide();
                            event.preventDefault();
                        }
                    break;

                    //tab
                    case 9:
                        this.hide();
                    break;
                }
            },
            onOptionSelect(event, option) {
                if (this.disabled || this.isOptionDisabled(option)) {
                    return;
                }

                let selected = this.isSelected(option);
                let value = null;

                if (selected)
                    value = this.modelValue.filter(val => !utils.ObjectUtils.equals(val, this.getOptionValue(option), this.equalityKey));
                else
                    value = [...(this.modelValue || []), this.getOptionValue(option)];

                this.$emit('update:modelValue', value);
                this.$emit('change', {originalEvent: event, value: value});
            },
            onOptionKeyDown(event, option) {
                let listItem = event.target;

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
                        this.onOptionSelect(event, option);
                        event.preventDefault();
                    break;
                }
            },
            findNextItem(item) {
                let nextItem = item.nextElementSibling;

                if (nextItem)
                    return utils.DomHandler.hasClass(nextItem, 'p-disabled') || utils.DomHandler.hasClass(nextItem, 'p-multiselect-item-group') ? this.findNextItem(nextItem) : nextItem;
                else
                    return null;
            },
            findPrevItem(item) {
                let prevItem = item.previousElementSibling;

                if (prevItem)
                    return utils.DomHandler.hasClass(prevItem, 'p-disabled') || utils.DomHandler.hasClass(prevItem, 'p-multiselect-item-group') ? this.findPrevItem(prevItem) : prevItem;
                else
                    return null;
            },
            onOverlayEnter(el) {
                utils.ZIndexUtils.set('overlay', el, this.$primevue.config.zIndex.overlay);
                this.alignOverlay();
                this.bindOutsideClickListener();
                this.bindScrollListener();
                this.bindResizeListener();

                if (this.filter) {
                    this.$refs.filterInput.focus();
                }

                if (!this.virtualScrollerDisabled) {
                    const selectedIndex = this.getSelectedOptionIndex();
                    if (selectedIndex !== -1) {
                        this.virtualScroller.scrollToIndex(selectedIndex);
                    }
                }

                this.$emit('show');
            },
            onOverlayLeave() {
                this.unbindOutsideClickListener();
                this.unbindScrollListener();
                this.unbindResizeListener();
                this.$emit('hide');
                this.overlay = null;
            },
            onOverlayAfterLeave(el) {
                utils.ZIndexUtils.clear(el);
            },
            alignOverlay() {
                if (this.appendDisabled) {
                    utils.DomHandler.relativePosition(this.overlay, this.$el);
                }
                else {
                    this.overlay.style.minWidth = utils.DomHandler.getOuterWidth(this.$el) + 'px';
                    utils.DomHandler.absolutePosition(this.overlay, this.$el);
                }
            },
            bindOutsideClickListener() {
                if (!this.outsideClickListener) {
                    this.outsideClickListener = (event) => {
                        if (this.overlayVisible && this.isOutsideClicked(event)) {
                            this.hide();
                        }
                    };
                    document.addEventListener('click', this.outsideClickListener);
                }
            },
            unbindOutsideClickListener() {
                if (this.outsideClickListener) {
                    document.removeEventListener('click', this.outsideClickListener);
                    this.outsideClickListener = null;
                }
            },
            bindScrollListener() {
                if (!this.scrollHandler) {
                    this.scrollHandler = new utils.ConnectedOverlayScrollHandler(this.$refs.container, () => {
                        if (this.overlayVisible) {
                            this.hide();
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
                        if (this.overlayVisible && !utils.DomHandler.isAndroid()) {
                            this.hide();
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
                return !(this.$el.isSameNode(event.target) || this.$el.contains(event.target) || (this.overlay && this.overlay.contains(event.target)));
            },
            getLabelByValue(val) {
                let option;
                if (this.options) {
                    if (this.optionGroupLabel) {
                        for (let optionGroup of this.options) {
                            option = this.findOptionByValue(val, this.getOptionGroupChildren(optionGroup));
                            if (option) {
                                break;
                            }
                        }
                    }
                    else {
                        option = this.findOptionByValue(val, this.options);
                    }
                }

                return option ? this.getOptionLabel(option): null;
            },
            findOptionByValue(val, list) {
                for (let option of list) {
                    let optionValue = this.getOptionValue(option);

                    if(utils.ObjectUtils.equals(optionValue, val, this.equalityKey)) {
                        return option;
                    }
                }

                return null;
            },
            getSelectedItemsLabel() {
                let pattern = /{(.*?)}/;
                if (pattern.test(this.selectedItemsLabel)) {
                    return this.selectedItemsLabel.replace(this.selectedItemsLabel.match(pattern)[0], this.modelValue.length + '');
                }

                return this.selectedItemsLabel;
            },
            onToggleAll(event) {
                if (this.selectAll !== null) {
                    this.$emit('selectall-change', {originalEvent: event, checked: !this.allSelected});
                }
                else {
                    let value = null;

                    if (this.allSelected) {
                        value = [];
                    }
                    else if (this.visibleOptions) {
                        if (this.optionGroupLabel) {
                            value = [];
                            this.visibleOptions.forEach(optionGroup => value = [...value, ...this.getOptionGroupChildren(optionGroup)]);
                        }
                        else  {
                            value = this.visibleOptions.map(option => this.getOptionValue(option));
                        }
                    }

                    this.$emit('update:modelValue', value);
                    this.$emit('change', {originalEvent: event, value: value});
                }
            },
            onFilterChange(event) {
                this.$emit('filter', {originalEvent: event, value: event.target.value});
                if (this.overlayVisible) {
                    this.alignOverlay();
                }
            },
            overlayRef(el) {
                this.overlay = el;
            },
            virtualScrollerRef(el) {
                this.virtualScroller = el;
            },
            removeChip(item) {
                let value = this.modelValue.filter(val => !utils.ObjectUtils.equals(val, item, this.equalityKey));

                this.$emit('update:modelValue', value);
                this.$emit('change', {originalEvent: event, value: value});
            },
            onOverlayClick(event) {
                OverlayEventBus__default["default"].emit('overlay-click', {
                    originalEvent: event,
                    target: this.$el
                });
            }
        },
        computed: {
             visibleOptions() {
                if (this.filterValue) {
                    if (this.optionGroupLabel) {
                        let filteredGroups = [];
                        for (let optgroup of this.options) {
                            let filteredSubOptions = api.FilterService.filter(this.getOptionGroupChildren(optgroup), this.searchFields, this.filterValue, this.filterMatchMode, this.filterLocale);
                            if (filteredSubOptions && filteredSubOptions.length) {
                                filteredGroups.push({...optgroup, ...{items: filteredSubOptions}});
                            }
                        }
                        return filteredGroups
                    }
                    else {
                        return api.FilterService.filter(this.options, this.searchFields, this.filterValue, 'contains', this.filterLocale);
                    }
                }
                else {
                    return this.options;
                }
            },
            containerClass() {
                return ['p-multiselect p-component p-inputwrapper', {
                    'p-multiselect-chip': this.display === 'chip',
                    'p-disabled': this.disabled,
                    'p-focus': this.focused,
                    'p-inputwrapper-filled': this.modelValue && this.modelValue.length,
                    'p-inputwrapper-focus': this.focused || this.overlayVisible
                }];
            },
            labelClass() {
                return ['p-multiselect-label', {
                    'p-placeholder': this.label === this.placeholder,
                    'p-multiselect-label-empty': !this.placeholder && (!this.modelValue || this.modelValue.length === 0)
                }];
            },
            panelStyleClass() {
                return ['p-multiselect-panel p-component', this.panelClass, {
                    'p-input-filled': this.$primevue.config.inputStyle === 'filled',
                    'p-ripple-disabled': this.$primevue.config.ripple === false
                }];
            },
            label() {
                let label;

                if (this.modelValue && this.modelValue.length) {
                    if (!this.maxSelectedLabels || this.modelValue.length <= this.maxSelectedLabels) {
                        label = '';
                        for(let i = 0; i < this.modelValue.length; i++) {
                            if(i !== 0) {
                                label += ', ';
                            }

                            label += this.getLabelByValue(this.modelValue[i]);
                        }
                    }
                    else {
                        return this.getSelectedItemsLabel();
                    }
                }
                else {
                    label = this.placeholder;
                }

                return label;
            },
            allSelected() {
                if (this.selectAll !== null) {
                    return this.selectAll;
                }
                else {
                    if (this.filterValue && this.filterValue.trim().length > 0) {
                        if (this.visibleOptions.length === 0) {
                            return false;
                        }

                        if (this.optionGroupLabel) {
                            for (let optionGroup of this.visibleOptions) {
                                for (let option of this.getOptionGroupChildren(optionGroup)) {
                                    if (!this.isSelected(option)) {
                                        return false;
                                    }
                                }
                            }
                        }
                        else {
                            for (let option of this.visibleOptions) {
                                if (!this.isSelected(option)) {
                                    return false;
                                }
                            }
                        }

                        return true;
                    }
                    else {
                        if (this.modelValue && this.options) {
                            let optionCount = 0;
                            if (this.optionGroupLabel)
                                this.options.forEach(optionGroup => optionCount += this.getOptionGroupChildren(optionGroup).length);
                            else
                                optionCount = this.options.length;

                            return optionCount > 0 && optionCount === this.modelValue.length;
                        }

                        return false;
                    }
                }
            },
            equalityKey() {
                return this.optionValue ? null : this.dataKey;
            },
            searchFields() {
                return this.filterFields || [this.optionLabel];
            },
            emptyFilterMessageText() {
                return this.emptyFilterMessage || this.$primevue.config.locale.emptyFilterMessage;
            },
            emptyMessageText() {
                return this.emptyMessage || this.$primevue.config.locale.emptyMessage;
            },
            appendDisabled() {
                return this.appendTo === 'self';
            },
            appendTarget() {
                return this.appendDisabled ? null : this.appendTo;
            },
            virtualScrollerDisabled() {
                return !this.virtualScrollerOptions;
            },
            maxSelectionLimitReached() {
                return this.selectionLimit && (this.modelValue && this.modelValue.length === this.selectionLimit);
            },
            dropdownIconClass() {
                return ['p-multiselect-trigger-icon', this.loading ? this.loadingIcon : 'pi pi-chevron-down'];
            }
        },
        directives: {
            'ripple': Ripple__default["default"]
        },
        components: {
            'VirtualScroller': VirtualScroller__default["default"]
        }
    };

    const _hoisted_1 = { class: "p-hidden-accessible" };
    const _hoisted_2 = { class: "p-multiselect-label-container" };
    const _hoisted_3 = { class: "p-multiselect-token-label" };
    const _hoisted_4 = { class: "p-multiselect-trigger" };
    const _hoisted_5 = {
      key: 0,
      class: "p-multiselect-header"
    };
    const _hoisted_6 = { class: "p-hidden-accessible" };
    const _hoisted_7 = {
      key: 1,
      class: "p-multiselect-filter-container"
    };
    const _hoisted_8 = /*#__PURE__*/vue.createVNode("span", { class: "p-multiselect-filter-icon pi pi-search" }, null, -1 /* HOISTED */);
    const _hoisted_9 = /*#__PURE__*/vue.createVNode("span", { class: "p-multiselect-close-icon pi pi-times" }, null, -1 /* HOISTED */);
    const _hoisted_10 = { class: "p-checkbox p-component" };
    const _hoisted_11 = { class: "p-multiselect-item-group" };
    const _hoisted_12 = { class: "p-checkbox p-component" };
    const _hoisted_13 = {
      key: 2,
      class: "p-multiselect-empty-message"
    };
    const _hoisted_14 = {
      key: 3,
      class: "p-multiselect-empty-message"
    };

    function render(_ctx, _cache, $props, $setup, $data, $options) {
      const _component_VirtualScroller = vue.resolveComponent("VirtualScroller");
      const _directive_ripple = vue.resolveDirective("ripple");

      return (vue.openBlock(), vue.createBlock("div", {
        ref: "container",
        class: $options.containerClass,
        onClick: _cache[11] || (_cache[11] = (...args) => ($options.onClick && $options.onClick(...args)))
      }, [
        vue.createVNode("div", _hoisted_1, [
          vue.createVNode("input", {
            ref: "focusInput",
            type: "text",
            role: "listbox",
            id: $props.inputId,
            readonly: "",
            disabled: $props.disabled,
            onFocus: _cache[1] || (_cache[1] = (...args) => ($options.onFocus && $options.onFocus(...args))),
            onBlur: _cache[2] || (_cache[2] = (...args) => ($options.onBlur && $options.onBlur(...args))),
            onKeydown: _cache[3] || (_cache[3] = (...args) => ($options.onKeyDown && $options.onKeyDown(...args))),
            tabindex: $props.tabindex,
            "aria-haspopup": "true",
            "aria-expanded": $data.overlayVisible,
            "aria-labelledby": $props.ariaLabelledBy
          }, null, 40 /* PROPS, HYDRATE_EVENTS */, ["id", "disabled", "tabindex", "aria-expanded", "aria-labelledby"])
        ]),
        vue.createVNode("div", _hoisted_2, [
          vue.createVNode("div", { class: $options.labelClass }, [
            vue.renderSlot(_ctx.$slots, "value", {
              value: $props.modelValue,
              placeholder: $props.placeholder
            }, () => [
              ($props.display === 'comma')
                ? (vue.openBlock(), vue.createBlock(vue.Fragment, { key: 0 }, [
                    vue.createTextVNode(vue.toDisplayString($options.label || 'empty'), 1 /* TEXT */)
                  ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
                : ($props.display === 'chip')
                  ? (vue.openBlock(), vue.createBlock(vue.Fragment, { key: 1 }, [
                      (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($props.modelValue, (item) => {
                        return (vue.openBlock(), vue.createBlock("div", {
                          class: "p-multiselect-token",
                          key: $options.getLabelByValue(item)
                        }, [
                          vue.renderSlot(_ctx.$slots, "chip", { value: item }, () => [
                            vue.createVNode("span", _hoisted_3, vue.toDisplayString($options.getLabelByValue(item)), 1 /* TEXT */)
                          ]),
                          (!$props.disabled)
                            ? (vue.openBlock(), vue.createBlock("span", {
                                key: 0,
                                class: "p-multiselect-token-icon pi pi-times-circle",
                                onClick: $event => ($options.removeChip(item))
                              }, null, 8 /* PROPS */, ["onClick"]))
                            : vue.createCommentVNode("v-if", true)
                        ]))
                      }), 128 /* KEYED_FRAGMENT */)),
                      (!$props.modelValue || $props.modelValue.length === 0)
                        ? (vue.openBlock(), vue.createBlock(vue.Fragment, { key: 0 }, [
                            vue.createTextVNode(vue.toDisplayString($props.placeholder || 'empty'), 1 /* TEXT */)
                          ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))
                        : vue.createCommentVNode("v-if", true)
                    ], 64 /* STABLE_FRAGMENT */))
                  : vue.createCommentVNode("v-if", true)
            ])
          ], 2 /* CLASS */)
        ]),
        vue.createVNode("div", _hoisted_4, [
          vue.renderSlot(_ctx.$slots, "indicator", {}, () => [
            vue.createVNode("span", { class: $options.dropdownIconClass }, null, 2 /* CLASS */)
          ])
        ]),
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
                    onClick: _cache[10] || (_cache[10] = (...args) => ($options.onOverlayClick && $options.onOverlayClick(...args)))
                  }, [
                    vue.renderSlot(_ctx.$slots, "header", {
                      value: $props.modelValue,
                      options: $options.visibleOptions
                    }),
                    (($props.showToggleAll && $props.selectionLimit == null) || $props.filter)
                      ? (vue.openBlock(), vue.createBlock("div", _hoisted_5, [
                          ($props.showToggleAll && $props.selectionLimit == null)
                            ? (vue.openBlock(), vue.createBlock("div", {
                                key: 0,
                                class: "p-checkbox p-component",
                                onClick: _cache[6] || (_cache[6] = (...args) => ($options.onToggleAll && $options.onToggleAll(...args))),
                                role: "checkbox",
                                "aria-checked": $options.allSelected
                              }, [
                                vue.createVNode("div", _hoisted_6, [
                                  vue.createVNode("input", {
                                    type: "checkbox",
                                    readonly: "",
                                    onFocus: _cache[4] || (_cache[4] = (...args) => ($options.onHeaderCheckboxFocus && $options.onHeaderCheckboxFocus(...args))),
                                    onBlur: _cache[5] || (_cache[5] = (...args) => ($options.onHeaderCheckboxBlur && $options.onHeaderCheckboxBlur(...args)))
                                  }, null, 32 /* HYDRATE_EVENTS */)
                                ]),
                                vue.createVNode("div", {
                                  class: ['p-checkbox-box', {'p-highlight': $options.allSelected, 'p-focus': $data.headerCheckboxFocused}],
                                  role: "checkbox",
                                  "aria-checked": $options.allSelected
                                }, [
                                  vue.createVNode("span", {
                                    class: ['p-checkbox-icon', {'pi pi-check': $options.allSelected}]
                                  }, null, 2 /* CLASS */)
                                ], 10 /* CLASS, PROPS */, ["aria-checked"])
                              ], 8 /* PROPS */, ["aria-checked"]))
                            : vue.createCommentVNode("v-if", true),
                          ($props.filter)
                            ? (vue.openBlock(), vue.createBlock("div", _hoisted_7, [
                                vue.withDirectives(vue.createVNode("input", {
                                  type: "text",
                                  ref: "filterInput",
                                  "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ($data.filterValue = $event)),
                                  class: "p-multiselect-filter p-inputtext p-component",
                                  placeholder: $props.filterPlaceholder,
                                  onInput: _cache[8] || (_cache[8] = (...args) => ($options.onFilterChange && $options.onFilterChange(...args)))
                                }, null, 40 /* PROPS, HYDRATE_EVENTS */, ["placeholder"]), [
                                  [vue.vModelText, $data.filterValue]
                                ]),
                                _hoisted_8
                              ]))
                            : vue.createCommentVNode("v-if", true),
                          vue.withDirectives(vue.createVNode("button", {
                            class: "p-multiselect-close p-link",
                            onClick: _cache[9] || (_cache[9] = (...args) => ($options.onCloseClick && $options.onCloseClick(...args))),
                            type: "button"
                          }, [
                            _hoisted_9
                          ], 512 /* NEED_PATCH */), [
                            [_directive_ripple]
                          ])
                        ]))
                      : vue.createCommentVNode("v-if", true),
                    vue.createVNode("div", {
                      class: "p-multiselect-items-wrapper",
                      style: {'max-height': $options.virtualScrollerDisabled ? $props.scrollHeight : ''}
                    }, [
                      vue.createVNode(_component_VirtualScroller, vue.mergeProps({ ref: $options.virtualScrollerRef }, $props.virtualScrollerOptions, {
                        items: $options.visibleOptions,
                        style: {'height': $props.scrollHeight},
                        disabled: $options.virtualScrollerDisabled
                      }), vue.createSlots({
                        content: vue.withCtx(({ styleClass, contentRef, items, getItemOptions }) => [
                          vue.createVNode("ul", {
                            ref: contentRef,
                            class: ['p-multiselect-items p-component', styleClass],
                            role: "listbox",
                            "aria-multiselectable": "true"
                          }, [
                            (!$props.optionGroupLabel)
                              ? (vue.openBlock(true), vue.createBlock(vue.Fragment, { key: 0 }, vue.renderList(items, (option, i) => {
                                  return vue.withDirectives((vue.openBlock(), vue.createBlock("li", {
                                    class: ['p-multiselect-item', {'p-highlight': $options.isSelected(option), 'p-disabled': $options.isOptionDisabled(option)}],
                                    role: "option",
                                    "aria-selected": $options.isSelected(option),
                                    key: $options.getOptionRenderKey(option),
                                    onClick: $event => ($options.onOptionSelect($event, option)),
                                    onKeydown: $event => ($options.onOptionKeyDown($event, option)),
                                    tabindex: $props.tabindex||'0',
                                    "aria-label": $options.getOptionLabel(option)
                                  }, [
                                    vue.createVNode("div", _hoisted_10, [
                                      vue.createVNode("div", {
                                        class: ['p-checkbox-box', {'p-highlight': $options.isSelected(option)}]
                                      }, [
                                        vue.createVNode("span", {
                                          class: ['p-checkbox-icon', {'pi pi-check': $options.isSelected(option)}]
                                        }, null, 2 /* CLASS */)
                                      ], 2 /* CLASS */)
                                    ]),
                                    vue.renderSlot(_ctx.$slots, "option", {
                                      option: option,
                                      index: $options.getOptionIndex(i, getItemOptions)
                                    }, () => [
                                      vue.createVNode("span", null, vue.toDisplayString($options.getOptionLabel(option)), 1 /* TEXT */)
                                    ])
                                  ], 42 /* CLASS, PROPS, HYDRATE_EVENTS */, ["aria-selected", "onClick", "onKeydown", "tabindex", "aria-label"])), [
                                    [_directive_ripple]
                                  ])
                                }), 128 /* KEYED_FRAGMENT */))
                              : (vue.openBlock(true), vue.createBlock(vue.Fragment, { key: 1 }, vue.renderList(items, (optionGroup, i) => {
                                  return (vue.openBlock(), vue.createBlock(vue.Fragment, {
                                    key: $options.getOptionGroupRenderKey(optionGroup)
                                  }, [
                                    vue.createVNode("li", _hoisted_11, [
                                      vue.renderSlot(_ctx.$slots, "optiongroup", {
                                        option: optionGroup,
                                        index: $options.getOptionIndex(i, getItemOptions)
                                      }, () => [
                                        vue.createTextVNode(vue.toDisplayString($options.getOptionGroupLabel(optionGroup)), 1 /* TEXT */)
                                      ])
                                    ]),
                                    (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($options.getOptionGroupChildren(optionGroup), (option, i) => {
                                      return vue.withDirectives((vue.openBlock(), vue.createBlock("li", {
                                        class: ['p-multiselect-item', {'p-highlight': $options.isSelected(option), 'p-disabled': $options.isOptionDisabled(option)}],
                                        role: "option",
                                        "aria-selected": $options.isSelected(option),
                                        key: $options.getOptionRenderKey(option),
                                        onClick: $event => ($options.onOptionSelect($event, option)),
                                        onKeydown: $event => ($options.onOptionKeyDown($event, option)),
                                        tabindex: $props.tabindex||'0',
                                        "aria-label": $options.getOptionLabel(option)
                                      }, [
                                        vue.createVNode("div", _hoisted_12, [
                                          vue.createVNode("div", {
                                            class: ['p-checkbox-box', {'p-highlight': $options.isSelected(option)}]
                                          }, [
                                            vue.createVNode("span", {
                                              class: ['p-checkbox-icon', {'pi pi-check': $options.isSelected(option)}]
                                            }, null, 2 /* CLASS */)
                                          ], 2 /* CLASS */)
                                        ]),
                                        vue.renderSlot(_ctx.$slots, "option", {
                                          option: option,
                                          index: $options.getOptionIndex(i, getItemOptions)
                                        }, () => [
                                          vue.createVNode("span", null, vue.toDisplayString($options.getOptionLabel(option)), 1 /* TEXT */)
                                        ])
                                      ], 42 /* CLASS, PROPS, HYDRATE_EVENTS */, ["aria-selected", "onClick", "onKeydown", "tabindex", "aria-label"])), [
                                        [_directive_ripple]
                                      ])
                                    }), 128 /* KEYED_FRAGMENT */))
                                  ], 64 /* STABLE_FRAGMENT */))
                                }), 128 /* KEYED_FRAGMENT */)),
                            ($data.filterValue && (!items || (items && items.length === 0)))
                              ? (vue.openBlock(), vue.createBlock("li", _hoisted_13, [
                                  vue.renderSlot(_ctx.$slots, "emptyfilter", {}, () => [
                                    vue.createTextVNode(vue.toDisplayString($options.emptyFilterMessageText), 1 /* TEXT */)
                                  ])
                                ]))
                              : ((!$props.options || ($props.options && $props.options.length === 0)))
                                ? (vue.openBlock(), vue.createBlock("li", _hoisted_14, [
                                    vue.renderSlot(_ctx.$slots, "empty", {}, () => [
                                      vue.createTextVNode(vue.toDisplayString($options.emptyMessageText), 1 /* TEXT */)
                                    ])
                                  ]))
                                : vue.createCommentVNode("v-if", true)
                          ], 2 /* CLASS */)
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
                      ]), 1040 /* FULL_PROPS, DYNAMIC_SLOTS */, ["items", "style", "disabled"])
                    ], 4 /* STYLE */),
                    vue.renderSlot(_ctx.$slots, "footer", {
                      value: $props.modelValue,
                      options: $options.visibleOptions
                    })
                  ], 2 /* CLASS */))
                : vue.createCommentVNode("v-if", true)
            ]),
            _: 3 /* FORWARDED */
          }, 8 /* PROPS */, ["onEnter", "onLeave", "onAfterLeave"])
        ], 8 /* PROPS */, ["to", "disabled"]))
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

    var css_248z = "\n.p-multiselect {\r\n    display: -webkit-inline-box;\r\n    display: -ms-inline-flexbox;\r\n    display: inline-flex;\r\n    cursor: pointer;\r\n    position: relative;\r\n    -webkit-user-select: none;\r\n       -moz-user-select: none;\r\n        -ms-user-select: none;\r\n            user-select: none;\n}\n.p-multiselect-trigger {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    -ms-flex-negative: 0;\r\n        flex-shrink: 0;\n}\n.p-multiselect-label-container {\r\n    overflow: hidden;\r\n    -webkit-box-flex: 1;\r\n        -ms-flex: 1 1 auto;\r\n            flex: 1 1 auto;\r\n    cursor: pointer;\n}\n.p-multiselect-label  {\r\n    display: block;\r\n    white-space: nowrap;\r\n    cursor: pointer;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\n}\n.p-multiselect-label-empty {\r\n    overflow: hidden;\r\n    visibility: hidden;\n}\n.p-multiselect-token {\r\n    cursor: default;\r\n    display: -webkit-inline-box;\r\n    display: -ms-inline-flexbox;\r\n    display: inline-flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-flex: 0;\r\n        -ms-flex: 0 0 auto;\r\n            flex: 0 0 auto;\n}\n.p-multiselect-token-icon {\r\n    cursor: pointer;\n}\n.p-multiselect .p-multiselect-panel {\r\n    min-width: 100%;\n}\n.p-multiselect-panel {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\n}\n.p-multiselect-items-wrapper {\r\n    overflow: auto;\n}\n.p-multiselect-items {\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style-type: none;\n}\n.p-multiselect-item {\r\n    cursor: pointer;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    font-weight: normal;\r\n    white-space: nowrap;\r\n    position: relative;\r\n    overflow: hidden;\n}\n.p-multiselect-item-group {\r\n    cursor: auto;\n}\n.p-multiselect-header {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: justify;\r\n        -ms-flex-pack: justify;\r\n            justify-content: space-between;\n}\n.p-multiselect-filter-container {\r\n    position: relative;\r\n    -webkit-box-flex: 1;\r\n        -ms-flex: 1 1 auto;\r\n            flex: 1 1 auto;\n}\n.p-multiselect-filter-icon {\r\n    position: absolute;\r\n    top: 50%;\r\n    margin-top: -.5rem;\n}\n.p-multiselect-filter-container .p-inputtext {\r\n    width: 100%;\n}\n.p-multiselect-close {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    -ms-flex-negative: 0;\r\n        flex-shrink: 0;\r\n    overflow: hidden;\r\n    position: relative;\r\n    margin-left: auto;\n}\n.p-fluid .p-multiselect {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\n}\r\n";
    styleInject(css_248z);

    script.render = render;

    return script;

})(primevue.utils, primevue.overlayeventbus, primevue.api, primevue.ripple, primevue.virtualscroller, Vue);

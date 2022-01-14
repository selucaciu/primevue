import { ObjectUtils } from 'primevue/utils';
import Ripple from 'primevue/ripple';
import { resolveDirective, openBlock, createBlock, Fragment, renderList, withDirectives, withKeys, withModifiers, renderSlot, createVNode, toDisplayString } from 'vue';

var script = {
    name: 'SelectButton',
    emits: ['update:modelValue', 'focus', 'blur', 'change'],
    props: {
        modelValue: null,
        options: Array,
        optionLabel: null,
        optionValue: null,
        optionDisabled: null,
		multiple: Boolean,
        disabled: Boolean,
        dataKey: null,
        ariaLabelledBy: null
    },
    methods: {
        getOptionLabel(option) {
            return this.optionLabel ? ObjectUtils.resolveFieldData(option, this.optionLabel) : option;
        },
        getOptionValue(option) {
            return this.optionValue ? ObjectUtils.resolveFieldData(option, this.optionValue) : option;
        },
        getOptionRenderKey(option) {
            return this.dataKey ? ObjectUtils.resolveFieldData(option, this.dataKey) : this.getOptionLabel(option);
        },
        isOptionDisabled(option) {
            return this.optionDisabled ? ObjectUtils.resolveFieldData(option, this.optionDisabled) : false;
        },
        onOptionSelect(event, option) {
            if (this.disabled || this.isOptionDisabled(option)) {
                return;
            }

            let selected = this.isSelected(option);
            let optionValue = this.getOptionValue(option);
            let newValue;

            if(this.multiple) {
                if (selected)
                    newValue = this.modelValue.filter(val => !ObjectUtils.equals(val, optionValue, this.equalityKey));
                else
                    newValue = this.modelValue ? [...this.modelValue, optionValue]: [optionValue];
            }
            else {
                newValue = optionValue;
            }

            this.$emit('update:modelValue', newValue);
            this.$emit('change', {event: event, value: newValue});
        },
        isSelected(option) {
            let selected = false;
            let optionValue = this.getOptionValue(option);

            if (this.multiple) {
                if (this.modelValue) {
                    for (let val of this.modelValue) {
                        if (ObjectUtils.equals(val, optionValue, this.equalityKey)) {
                            selected = true;
                            break;
                        }
                    }
                }
            }
            else {
                selected = ObjectUtils.equals(this.modelValue, optionValue, this.equalityKey);
            }

            return selected;
        },
        onFocus(event) {
            this.$emit('focus', event);
        },
        onBlur(event) {
            this.$emit('blur', event);
        },
        getButtonClass(option) {
            return ['p-button p-component', {
                'p-highlight': this.isSelected(option),
                'p-disabled': this.isOptionDisabled(option)
            }];
        }
    },
	computed: {
        containerClass() {
            return ['p-selectbutton p-buttonset p-component', {
                'p-disabled': this.disabled
            }];
        },
        equalityKey() {
            return this.optionValue ? null : this.dataKey;
        }
    },
    directives: {
        'ripple': Ripple
    }
};

const _hoisted_1 = { class: "p-button-label" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = resolveDirective("ripple");

  return (openBlock(), createBlock("div", {
    class: $options.containerClass,
    role: "group"
  }, [
    (openBlock(true), createBlock(Fragment, null, renderList($props.options, (option, i) => {
      return withDirectives((openBlock(), createBlock("div", {
        key: $options.getOptionRenderKey(option),
        "aria-label": $options.getOptionLabel(option),
        role: "button",
        "aria-pressed": $options.isSelected(option),
        onClick: $event => ($options.onOptionSelect($event, option, i)),
        onKeydown: [
          withKeys(withModifiers($event => ($options.onOptionSelect($event, option, i)), ["prevent"]), ["enter"]),
          withKeys(withModifiers($event => ($options.onOptionSelect($event, option)), ["prevent"]), ["space"])
        ],
        tabindex: $options.isOptionDisabled(option) ? null : '0',
        onFocus: _cache[1] || (_cache[1] = $event => ($options.onFocus($event))),
        onBlur: _cache[2] || (_cache[2] = $event => ($options.onBlur($event))),
        "aria-labelledby": $props.ariaLabelledBy,
        class: $options.getButtonClass(option)
      }, [
        renderSlot(_ctx.$slots, "option", {
          option: option,
          index: i
        }, () => [
          createVNode("span", _hoisted_1, toDisplayString($options.getOptionLabel(option)), 1 /* TEXT */)
        ])
      ], 42 /* CLASS, PROPS, HYDRATE_EVENTS */, ["aria-label", "aria-pressed", "onClick", "onKeydown", "tabindex", "aria-labelledby"])), [
        [_directive_ripple]
      ])
    }), 128 /* KEYED_FRAGMENT */))
  ], 2 /* CLASS */))
}

script.render = render;
script.__file = "src/components/selectbutton/SelectButton.vue";

export { script as default };

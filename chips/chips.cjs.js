'use strict';

var vue = require('vue');

var script = {
    name: 'Chips',
    inheritAttrs: false,
    emits: ['update:modelValue', 'add', 'remove'],
    props: {
        modelValue: {
            type: Array,
            default: null
        },
        max: {
            type: Number,
            default: null
        },
        separator: {
            type: String,
            default: null
        },
        addOnBlur: {
            type: Boolean,
            default: null
        },
        allowDuplicate: {
            type: Boolean,
            default: true
        },
        class: null,
        style: null
    },
    data() {
        return {
            inputValue: null,
            focused: false
        };
    },
    methods: {
        onWrapperClick() {
            this.$refs.input.focus();
        },
        onInput(event) {
            this.inputValue = event.target.value;
        },
        onFocus() {
            this.focused = true;
        },
        onBlur(event) {
            this.focused = false;
            if (this.addOnBlur) {
                this.addItem(event, event.target.value, false);
            }
        },
        onKeyDown(event) {
            const inputValue = event.target.value;

            switch(event.which) {
                //backspace
                case 8:
                    if (inputValue.length === 0 && this.modelValue && this.modelValue.length > 0) {
                        this.removeItem(event, this.modelValue.length - 1);
                    }
                break;

                //enter
                case 13:
                    if (inputValue && inputValue.trim().length && !this.maxedOut) {
                        this.addItem(event, inputValue, true);
                    }
                break;

                default:
                    if (this.separator) {
                        if (this.separator === ',' && event.which === 188) {
                            this.addItem(event, inputValue, true);
                        }
                    }
                break;
            }
        },
        onPaste(event) {
            if (this.separator) {
                let pastedData = (event.clipboardData || window['clipboardData']).getData('Text');
                if (pastedData) {
                    let value = this.modelValue || [];
                    let pastedValues = pastedData.split(this.separator);
                    pastedValues = pastedValues.filter(val => (this.allowDuplicate || value.indexOf(val) === -1));
                    value = [...value, ...pastedValues];
                    this.updateModel(event, value, true);
                }
            }
        },
        updateModel(event, value, preventDefault) {
            this.$emit('update:modelValue', value);
            this.$emit('add', {
                originalEvent: event,
                value: value
            });
            this.$refs.input.value = '';
            this.inputValue = '';

            if (preventDefault) {
                event.preventDefault();
            }
        },
        addItem(event, item, preventDefault) {
            if (item && item.trim().length) {
                let value = this.modelValue ? [...this.modelValue]: [];
                if (this.allowDuplicate || value.indexOf(item) === -1) {
                    value.push(item);
                    this.updateModel(event, value, preventDefault);
                }
            }
        },
        removeItem(event, index) {
            if (this.$attrs.disabled) {
                return;
            }

            let values = [...this.modelValue];
            const removedItem = values.splice(index, 1);
            this.$emit('update:modelValue', values);
            this.$emit('remove', {
                originalEvent: event,
                value: removedItem
            });
        }
    },
    computed: {
        maxedOut() {
            return this.max && this.modelValue && this.max === this.modelValue.length;
        },
        containerClass() {
            return ['p-chips p-component p-inputwrapper', this.class, {
                'p-inputwrapper-filled': ((this.modelValue && this.modelValue.length) || (this.inputValue && this.inputValue.length)),
                'p-inputwrapper-focus': this.focused
            }];
        }
    }
};

const _hoisted_1 = { class: "p-chips-token-label" };
const _hoisted_2 = { class: "p-chips-input-token" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (vue.openBlock(), vue.createBlock("div", {
    class: $options.containerClass,
    style: $props.style
  }, [
    vue.createVNode("ul", {
      class: ['p-inputtext p-chips-multiple-container', {'p-disabled': _ctx.$attrs.disabled, 'p-focus': $data.focused}],
      onClick: _cache[6] || (_cache[6] = $event => ($options.onWrapperClick()))
    }, [
      (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($props.modelValue, (val, i) => {
        return (vue.openBlock(), vue.createBlock("li", {
          key: `${i}_${val}`,
          class: "p-chips-token"
        }, [
          vue.renderSlot(_ctx.$slots, "chip", { value: val }, () => [
            vue.createVNode("span", _hoisted_1, vue.toDisplayString(val), 1 /* TEXT */)
          ]),
          vue.createVNode("span", {
            class: "p-chips-token-icon pi pi-times-circle",
            onClick: $event => ($options.removeItem($event, i))
          }, null, 8 /* PROPS */, ["onClick"])
        ]))
      }), 128 /* KEYED_FRAGMENT */)),
      vue.createVNode("li", _hoisted_2, [
        vue.createVNode("input", vue.mergeProps({
          ref: "input",
          type: "text"
        }, _ctx.$attrs, {
          onFocus: _cache[1] || (_cache[1] = (...args) => ($options.onFocus && $options.onFocus(...args))),
          onBlur: _cache[2] || (_cache[2] = $event => ($options.onBlur($event))),
          onInput: _cache[3] || (_cache[3] = (...args) => ($options.onInput && $options.onInput(...args))),
          onKeydown: _cache[4] || (_cache[4] = $event => ($options.onKeyDown($event))),
          onPaste: _cache[5] || (_cache[5] = $event => ($options.onPaste($event))),
          disabled: _ctx.$attrs.disabled || $options.maxedOut
        }), null, 16 /* FULL_PROPS */, ["disabled"])
      ])
    ], 2 /* CLASS */)
  ], 6 /* CLASS, STYLE */))
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

var css_248z = "\n.p-chips {\r\n    display: -webkit-inline-box;\r\n    display: -ms-inline-flexbox;\r\n    display: inline-flex;\n}\n.p-chips-multiple-container {\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style-type: none;\r\n    cursor: text;\r\n    overflow: hidden;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -ms-flex-wrap: wrap;\r\n        flex-wrap: wrap;\n}\n.p-chips-token {\r\n    cursor: default;\r\n    display: -webkit-inline-box;\r\n    display: -ms-inline-flexbox;\r\n    display: inline-flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-flex: 0;\r\n        -ms-flex: 0 0 auto;\r\n            flex: 0 0 auto;\n}\n.p-chips-input-token {\r\n    -webkit-box-flex: 1;\r\n        -ms-flex: 1 1 auto;\r\n            flex: 1 1 auto;\r\n    display: -webkit-inline-box;\r\n    display: -ms-inline-flexbox;\r\n    display: inline-flex;\n}\n.p-chips-token-icon {\r\n    cursor: pointer;\n}\n.p-chips-input-token input {\r\n    border: 0 none;\r\n    outline: 0 none;\r\n    background-color: transparent;\r\n    margin: 0;\r\n    padding: 0;\r\n    -webkit-box-shadow: none;\r\n            box-shadow: none;\r\n    border-radius: 0;\r\n    width: 100%;\n}\n.p-fluid .p-chips {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\n}\r\n";
styleInject(css_248z);

script.render = render;
script.__file = "src/components/chips/Chips.vue";

module.exports = script;

import { openBlock, createBlock, renderSlot, createCommentVNode, toDisplayString, withKeys } from 'vue';

var script = {
    name: 'Chip',
    emits: ['remove'],
    props: {
        label: {
            type: String,
            default: null
        },
        icon: {
            type: String,
            default: null
        },
        image: {
            type: String,
            default: null
        },
        removable: {
            type: Boolean,
            default: false
        },
        removeIcon: {
            type: String,
            default: 'pi pi-times-circle'
        }
    },
    data() {
        return {
            visible: true
        }
    },
    methods: {
        close(event) {
            this.visible = false;
            this.$emit('remove', event);
        }
    },
    computed: {
        containerClass() {
            return ['p-chip p-component', {
                'p-chip-image': this.image != null
            }];
        },
        iconClass() {
            return ['p-chip-icon', this.icon];
        },
        removeIconClass() {
            return ['p-chip-remove-icon', this.removeIcon];
        }
    }
};

const _hoisted_1 = {
  key: 2,
  class: "p-chip-text"
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return ($data.visible)
    ? (openBlock(), createBlock("div", {
        key: 0,
        class: $options.containerClass
      }, [
        renderSlot(_ctx.$slots, "default", {}, () => [
          ($props.image)
            ? (openBlock(), createBlock("img", {
                key: 0,
                src: $props.image
              }, null, 8 /* PROPS */, ["src"]))
            : ($props.icon)
              ? (openBlock(), createBlock("span", {
                  key: 1,
                  class: $options.iconClass
                }, null, 2 /* CLASS */))
              : createCommentVNode("v-if", true),
          ($props.label)
            ? (openBlock(), createBlock("div", _hoisted_1, toDisplayString($props.label), 1 /* TEXT */))
            : createCommentVNode("v-if", true)
        ]),
        ($props.removable)
          ? (openBlock(), createBlock("span", {
              key: 0,
              tabindex: "0",
              class: $options.removeIconClass,
              onClick: _cache[1] || (_cache[1] = (...args) => ($options.close && $options.close(...args))),
              onKeydown: _cache[2] || (_cache[2] = withKeys((...args) => ($options.close && $options.close(...args)), ["enter"]))
            }, null, 34 /* CLASS, HYDRATE_EVENTS */))
          : createCommentVNode("v-if", true)
      ], 2 /* CLASS */))
    : createCommentVNode("v-if", true)
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

var css_248z = "\n.p-chip {\r\n    display: -webkit-inline-box;\r\n    display: -ms-inline-flexbox;\r\n    display: inline-flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\n}\n.p-chip-text {\r\n    line-height: 1.5;\n}\n.p-chip-icon.pi {\r\n    line-height: 1.5;\n}\n.p-chip-remove-icon {\r\n    line-height: 1.5;\r\n    cursor: pointer;\n}\n.p-chip img {\r\n    border-radius: 50%;\n}\r\n";
styleInject(css_248z);

script.render = render;
script.__file = "src/components/chip/Chip.vue";

export { script as default };

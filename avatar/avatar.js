this.primevue = this.primevue || {};
this.primevue.avatar = (function (vue) {
    'use strict';

    var script = {
        name: 'Avatar',
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
            size: {
                type: String,
                default: 'normal'
            },
            shape: {
                type: String,
                default: "square"
            }
        },
        computed: {
            containerClass() {
                return ['p-avatar p-component', {
                    'p-avatar-image': this.image != null,
                    'p-avatar-circle': this.shape === 'circle',
                    'p-avatar-lg': this.size === 'large',
                    'p-avatar-xl': this.size === 'xlarge'
                }];
            },
            iconClass() {
                return ['p-avatar-icon', this.icon];
            }
        }
    };

    const _hoisted_1 = {
      key: 0,
      class: "p-avatar-text"
    };

    function render(_ctx, _cache, $props, $setup, $data, $options) {
      return (vue.openBlock(), vue.createBlock("div", { class: $options.containerClass }, [
        vue.renderSlot(_ctx.$slots, "default", {}, () => [
          ($props.label)
            ? (vue.openBlock(), vue.createBlock("span", _hoisted_1, vue.toDisplayString($props.label), 1 /* TEXT */))
            : ($props.icon)
              ? (vue.openBlock(), vue.createBlock("span", {
                  key: 1,
                  class: $options.iconClass
                }, null, 2 /* CLASS */))
              : ($props.image)
                ? (vue.openBlock(), vue.createBlock("img", {
                    key: 2,
                    src: $props.image
                  }, null, 8 /* PROPS */, ["src"]))
                : vue.createCommentVNode("v-if", true)
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

    var css_248z = "\n.p-avatar {\r\n    display: -webkit-inline-box;\r\n    display: -ms-inline-flexbox;\r\n    display: inline-flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    width: 2rem;\r\n    height: 2rem;\r\n    font-size: 1rem;\n}\n.p-avatar.p-avatar-image {\r\n    background-color: transparent;\n}\n.p-avatar.p-avatar-circle {\r\n    border-radius: 50%;\n}\n.p-avatar-circle img {\r\n    border-radius: 50%;\n}\n.p-avatar .p-avatar-icon {\r\n    font-size: 1rem;\n}\n.p-avatar img {\r\n    width: 100%;\r\n    height: 100%;\n}\r\n";
    styleInject(css_248z);

    script.render = render;

    return script;

})(Vue);

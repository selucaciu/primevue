this.primevue = this.primevue || {};
this.primevue.progressbar = (function (vue) {
    'use strict';

    var script = {
        name: 'ProgressBar',
        props: {
            value: {
                type: Number,
                default: null
            },
            mode: {
                type: String,
                default: 'determinate'
            },
            showValue: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            containerClass() {
                return [
                    'p-progressbar p-component',
                    {
                        'p-progressbar-determinate': this.determinate,
                        'p-progressbar-indeterminate': this.indeterminate
                    }
                ];
            },
            progressStyle() {
                return {
                    width: this.value + '%',
                    display: 'flex'
                };
            },
            indeterminate() {
                return this.mode === 'indeterminate';
            },
            determinate() {
                return this.mode === 'determinate';
            }
        }
    };

    const _hoisted_1 = {
      key: 0,
      class: "p-progressbar-label"
    };
    const _hoisted_2 = {
      key: 1,
      class: "p-progressbar-indeterminate-container"
    };
    const _hoisted_3 = /*#__PURE__*/vue.createVNode("div", { class: "p-progressbar-value p-progressbar-value-animate" }, null, -1 /* HOISTED */);

    function render(_ctx, _cache, $props, $setup, $data, $options) {
      return (vue.openBlock(), vue.createBlock("div", {
        role: "progressbar",
        class: $options.containerClass,
        "aria-valuemin": "0",
        "aria-valuenow": $props.value,
        "aria-valuemax": "100"
      }, [
        ($options.determinate)
          ? (vue.openBlock(), vue.createBlock("div", {
              key: 0,
              class: "p-progressbar-value p-progressbar-value-animate",
              style: $options.progressStyle
            }, [
              (($props.value != null && $props.value !== 0) && $props.showValue)
                ? (vue.openBlock(), vue.createBlock("div", _hoisted_1, [
                    vue.renderSlot(_ctx.$slots, "default", {}, () => [
                      vue.createTextVNode(vue.toDisplayString($props.value + '%'), 1 /* TEXT */)
                    ])
                  ]))
                : vue.createCommentVNode("v-if", true)
            ], 4 /* STYLE */))
          : vue.createCommentVNode("v-if", true),
        ($options.indeterminate)
          ? (vue.openBlock(), vue.createBlock("div", _hoisted_2, [
              _hoisted_3
            ]))
          : vue.createCommentVNode("v-if", true)
      ], 10 /* CLASS, PROPS */, ["aria-valuenow"]))
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

    var css_248z = "\n.p-progressbar {\r\n    position: relative;\r\n    overflow: hidden;\n}\n.p-progressbar-determinate .p-progressbar-value {\r\n    height: 100%;\r\n    width: 0%;\r\n    position: absolute;\r\n    display: none;\r\n    border: 0 none;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    overflow: hidden;\n}\n.p-progressbar-determinate .p-progressbar-label {\r\n    display: -webkit-inline-box;\r\n    display: -ms-inline-flexbox;\r\n    display: inline-flex;\n}\n.p-progressbar-determinate .p-progressbar-value-animate {\r\n    -webkit-transition: width 1s ease-in-out;\r\n    transition: width 1s ease-in-out;\n}\n.p-progressbar-indeterminate .p-progressbar-value::before {\r\n      content: '';\r\n      position: absolute;\r\n      background-color: inherit;\r\n      top: 0;\r\n      left: 0;\r\n      bottom: 0;\r\n      will-change: left, right;\r\n      -webkit-animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;\r\n              animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;\n}\n.p-progressbar-indeterminate .p-progressbar-value::after {\r\n    content: '';\r\n    position: absolute;\r\n    background-color: inherit;\r\n    top: 0;\r\n    left: 0;\r\n    bottom: 0;\r\n    will-change: left, right;\r\n    -webkit-animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\r\n            animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\r\n    -webkit-animation-delay: 1.15s;\r\n            animation-delay: 1.15s;\n}\n@-webkit-keyframes p-progressbar-indeterminate-anim {\n0% {\r\n    left: -35%;\r\n    right: 100%;\n}\n60% {\r\n    left: 100%;\r\n    right: -90%;\n}\n100% {\r\n    left: 100%;\r\n    right: -90%;\n}\n}\n@keyframes p-progressbar-indeterminate-anim {\n0% {\r\n    left: -35%;\r\n    right: 100%;\n}\n60% {\r\n    left: 100%;\r\n    right: -90%;\n}\n100% {\r\n    left: 100%;\r\n    right: -90%;\n}\n}\n@-webkit-keyframes p-progressbar-indeterminate-anim-short {\n0% {\r\n    left: -200%;\r\n    right: 100%;\n}\n60% {\r\n    left: 107%;\r\n    right: -8%;\n}\n100% {\r\n    left: 107%;\r\n    right: -8%;\n}\n}\n@keyframes p-progressbar-indeterminate-anim-short {\n0% {\r\n    left: -200%;\r\n    right: 100%;\n}\n60% {\r\n    left: 107%;\r\n    right: -8%;\n}\n100% {\r\n    left: 107%;\r\n    right: -8%;\n}\n}\r\n";
    styleInject(css_248z);

    script.render = render;

    return script;

})(Vue);

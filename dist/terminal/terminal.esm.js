import TerminalService from 'primevue/terminalservice';
import { openBlock, createBlock, toDisplayString, createCommentVNode, createVNode, Fragment, renderList, withDirectives, vModelText } from 'vue';

var script = {
    name: 'Terminal',
    props: {
        welcomeMessage: {
            type: String,
            default: null
        },
        prompt: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            commandText: null,
            commands: []
        }
    },
    mounted() {
        TerminalService.on('response', this.responseListener);
        this.$refs.input.focus();
    },
    updated() {
        this.$el.scrollTop = this.$el.scrollHeight;
    },
    beforeUnmount() {
        TerminalService.off('response', this.responseListener);
    },
    methods: {
        onClick() {
            this.$refs.input.focus();
        },
        onKeydown(event) {
            if (event.keyCode === 13 && this.commandText) {
                this.commands.push({text: this.commandText});
                TerminalService.emit('command', this.commandText);
                this.commandText = '';
            }
        },
        responseListener(response) {
            this.commands[this.commands.length - 1].response = response;
        }
    }
};

const _hoisted_1 = { key: 0 };
const _hoisted_2 = { class: "p-terminal-content" };
const _hoisted_3 = { class: "p-terminal-prompt" };
const _hoisted_4 = { class: "p-terminal-command" };
const _hoisted_5 = { class: "p-terminal-response" };
const _hoisted_6 = { class: "p-terminal-prompt-container" };
const _hoisted_7 = { class: "p-terminal-prompt" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("div", {
    class: "p-terminal p-component",
    onClick: _cache[3] || (_cache[3] = (...args) => ($options.onClick && $options.onClick(...args)))
  }, [
    ($props.welcomeMessage)
      ? (openBlock(), createBlock("div", _hoisted_1, toDisplayString($props.welcomeMessage), 1 /* TEXT */))
      : createCommentVNode("v-if", true),
    createVNode("div", _hoisted_2, [
      (openBlock(true), createBlock(Fragment, null, renderList($data.commands, (command, i) => {
        return (openBlock(), createBlock("div", {
          key: command.text + i.toString()
        }, [
          createVNode("span", _hoisted_3, toDisplayString($props.prompt), 1 /* TEXT */),
          createVNode("span", _hoisted_4, toDisplayString(command.text), 1 /* TEXT */),
          createVNode("div", _hoisted_5, toDisplayString(command.response), 1 /* TEXT */)
        ]))
      }), 128 /* KEYED_FRAGMENT */))
    ]),
    createVNode("div", _hoisted_6, [
      createVNode("span", _hoisted_7, toDisplayString($props.prompt), 1 /* TEXT */),
      withDirectives(createVNode("input", {
        ref: "input",
        type: "text",
        "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ($data.commandText = $event)),
        class: "p-terminal-input",
        autocomplete: "off",
        onKeydown: _cache[2] || (_cache[2] = (...args) => ($options.onKeydown && $options.onKeydown(...args)))
      }, null, 544 /* HYDRATE_EVENTS, NEED_PATCH */), [
        [vModelText, $data.commandText]
      ])
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

var css_248z = "\n.p-terminal {\r\n    height: 18rem;\r\n    overflow: auto;\n}\n.p-terminal-prompt-container {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\n}\n.p-terminal-input {\r\n    -webkit-box-flex: 1;\r\n        -ms-flex: 1 1 auto;\r\n            flex: 1 1 auto;\r\n    border: 0 none;\r\n    background-color: transparent;\r\n    color: inherit;\r\n    padding: 0;\r\n    outline: 0 none;\n}\n.p-terminal-input::-ms-clear {\r\n    display: none;\n}\r\n";
styleInject(css_248z);

script.render = render;
script.__file = "src/components/terminal/Terminal.vue";

export { script as default };
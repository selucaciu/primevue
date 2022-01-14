'use strict';

var vue = require('vue');

var script = {
    name: 'SplitterPanel',
    props: {
        size: {
            type: Number,
            default: null
        },
        minSize: {
            type: Number,
            default: null
        }
    },
    computed: {
        containerClass() {
            return ['p-splitter-panel', {'p-splitter-panel-nested': this.isNested}];
        },
        isNested() {
            return this.$slots.default().some(child => {
                return child.type.name === 'Splitter';
            });
        }
    }
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (vue.openBlock(), vue.createBlock("div", {
    ref: "container",
    class: $options.containerClass
  }, [
    vue.renderSlot(_ctx.$slots, "default")
  ], 2 /* CLASS */))
}

script.render = render;
script.__file = "src/components/splitterpanel/SplitterPanel.vue";

module.exports = script;

'use strict';

var vue = require('vue');

var script = {
    name: 'TabPanel',
    props: {
        header: null,
        disabled: Boolean
    }
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.renderSlot(_ctx.$slots, "default")
}

script.render = render;
script.__file = "src/components/tabpanel/TabPanel.vue";

module.exports = script;

import { openBlock, createBlock, renderSlot, createCommentVNode } from 'vue';

var script = {
    name: 'DeferredContent',
    emits: ['load'],
    data() {
        return {
           loaded: false
        }
    },
    mounted() {
        if (!this.loaded) {
            if (this.shouldLoad())
                this.load();
            else
                this.bindScrollListener();
        }
    },
    beforeUnmount() {
        this.unbindScrollListener();
    },
    methods: {
        bindScrollListener() {
            this.documentScrollListener = () => {
                if (this.shouldLoad()) {
                    this.load();
                    this.unbindScrollListener();
                }
            };

            window.addEventListener('scroll', this.documentScrollListener);
        },
        unbindScrollListener() {
            if (this.documentScrollListener) {
                window.removeEventListener('scroll', this.documentScrollListener);
                this.documentScrollListener = null;
            }
        },
        shouldLoad() {
            if (this.loaded) {
                return false;
            }
            else {
                const rect = this.$refs.container.getBoundingClientRect();
                const docElement = document.documentElement;
                const winHeight = docElement.clientHeight;

                return (winHeight >= rect.top);
            }
        },
        load() {
            this.loaded = true;
            this.$emit('load', event);
        }
    }
};

const _hoisted_1 = { ref: "container" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("div", _hoisted_1, [
    ($data.loaded)
      ? renderSlot(_ctx.$slots, "default", { key: 0 })
      : createCommentVNode("v-if", true)
  ], 512 /* NEED_PATCH */))
}

script.render = render;

export { script as default };
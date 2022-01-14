import { DomHandler, ObjectUtils } from 'primevue/utils';
import { openBlock, createBlock, Fragment, renderList, resolveDynamicComponent, createCommentVNode, createVNode } from 'vue';

var script = {
    name: 'Splitter',
    emits: ['resizeend'],
    props: {
        layout: {
            type: String,
            default: 'horizontal'
        },
        gutterSize: {
            type: Number,
            default: 4
        },
        stateKey: {
            type: String,
            default: null
        },
        stateStorage: {
            type: String,
            default: 'session'
        }
    },
    dragging: false,
    mouseMoveListener: null,
    mouseUpListener: null,
    size: null,
    gutterElement: null,
    startPos: null,
    prevPanelElement: null,
    nextPanelElement: null,
    nextPanelSize: null,
    prevPanelSize: null,
    panelSizes: null,
    prevPanelIndex: null,
    mounted() {
        if (this.panels && this.panels.length) {
            let initialized = false;
            if (this.isStateful()) {
                initialized = this.restoreState();
            }

            if (!initialized) {
                let children = [...this.$el.children].filter(child => DomHandler.hasClass(child, 'p-splitter-panel'));
                let _panelSizes = [];

                this.panels.map((panel, i) => {
                    let panelInitialSize = panel.props && panel.props.size ? panel.props.size: null;
                    let panelSize = panelInitialSize || (100 / this.panels.length);
                    _panelSizes[i] = panelSize;
                    children[i].style.flexBasis = 'calc(' + panelSize + '% - ' + ((this.panels.length - 1) * this.gutterSize) + 'px)';
                });

                this.panelSizes = _panelSizes;
            }
        }
    },
    beforeUnmount() {
        this.clear();
        this.unbindMouseListeners();
    },
    methods: {
        isSplitterPanel(child) {
            return child.type.name === 'SplitterPanel';
        },
        onResizeStart(event, index) {
            this.gutterElement = event.currentTarget;
            this.size = this.horizontal ? DomHandler.getWidth(this.$el) : DomHandler.getHeight(this.$el);
            this.dragging = true;
            this.startPos = this.layout === 'horizontal' ? event.pageX : event.pageY;
            this.prevPanelElement = this.gutterElement.previousElementSibling;
            this.nextPanelElement = this.gutterElement.nextElementSibling;
            this.prevPanelSize = 100 * (this.horizontal ? DomHandler.getOuterWidth(this.prevPanelElement, true): DomHandler.getOuterHeight(this.prevPanelElement, true)) / this.size;
            this.nextPanelSize = 100 * (this.horizontal ? DomHandler.getOuterWidth(this.nextPanelElement, true): DomHandler.getOuterHeight(this.nextPanelElement, true)) / this.size;
            this.prevPanelIndex = index;
            DomHandler.addClass(this.gutterElement, 'p-splitter-gutter-resizing');
            DomHandler.addClass(this.$el, 'p-splitter-resizing');
        },
        onResize(event) {
            let newPos;
            if (this.horizontal)
                newPos = (event.pageX * 100 / this.size) - (this.startPos * 100 / this.size);
            else
                newPos = (event.pageY * 100 / this.size) - (this.startPos * 100 / this.size);

            let newPrevPanelSize = this.prevPanelSize + newPos;
            let newNextPanelSize = this.nextPanelSize - newPos;

            if (this.validateResize(newPrevPanelSize, newNextPanelSize)) {
                this.prevPanelElement.style.flexBasis = 'calc(' + newPrevPanelSize + '% - ' + ((this.panels.length - 1) * this.gutterSize) + 'px)';
                this.nextPanelElement.style.flexBasis = 'calc(' + newNextPanelSize + '% - ' + ((this.panels.length - 1) * this.gutterSize) + 'px)';
                this.panelSizes[this.prevPanelIndex] = newPrevPanelSize;
                this.panelSizes[this.prevPanelIndex + 1] = newNextPanelSize;
            }
        },
        onResizeEnd(event) {
            if (this.isStateful()) {
                this.saveState();
            }

            this.$emit('resizeend', {originalEvent: event, sizes: this.panelSizes});
            DomHandler.removeClass(this.gutterElement, 'p-splitter-gutter-resizing');
            DomHandler.removeClass(this.$el, 'p-splitter-resizing');
            this.clear();
        },
        onGutterMouseDown(event, index) {
            this.onResizeStart(event, index);
            this.bindMouseListeners();
        },
        onGutterTouchStart(event, index) {
            this.onResizeStart(event, index);
            event.preventDefault();
        },
        onGutterTouchMove(event) {
            this.onResize(event);
            event.preventDefault();
        },
        onGutterTouchEnd(event) {
            this.onResizeEnd(event);
            event.preventDefault();
        },
        bindMouseListeners() {
            if (!this.mouseMoveListener) {
                this.mouseMoveListener = event => this.onResize(event);
                document.addEventListener('mousemove', this.mouseMoveListener);
            }

            if (!this.mouseUpListener) {
                this.mouseUpListener = event => {
                    this.onResizeEnd(event);
                    this.unbindMouseListeners();
                };
                document.addEventListener('mouseup', this.mouseUpListener);
            }
        },
        validateResize(newPrevPanelSize, newNextPanelSize) {
            let prevPanelMinSize = ObjectUtils.getVNodeProp(this.panels[0], 'minSize');
            if (this.panels[0].props && prevPanelMinSize && prevPanelMinSize > newPrevPanelSize) {
                return false;
            }

            let newPanelMinSize = ObjectUtils.getVNodeProp(this.panels[1], 'minSize');
            if (this.panels[1].props && newPanelMinSize && newPanelMinSize > newNextPanelSize) {
                return false;
            }

            return true;
        },
        unbindMouseListeners() {
            if (this.mouseMoveListener) {
                document.removeEventListener('mousemove', this.mouseMoveListener);
                this.mouseMoveListener = null;
            }

            if (this.mouseUpListener) {
                document.removeEventListener('mouseup', this.mouseUpListener);
                this.mouseUpListener = null;
            }
        },
        clear() {
            this.dragging = false;
            this.size = null;
            this.startPos = null;
            this.prevPanelElement = null;
            this.nextPanelElement = null;
            this.prevPanelSize = null;
            this.nextPanelSize = null;
            this.gutterElement = null;
            this.prevPanelIndex = null;
        },
        isStateful() {
            return this.stateKey != null;
        },
        getStorage() {
            switch(this.stateStorage) {
                case 'local':
                    return window.localStorage;

                case 'session':
                    return window.sessionStorage;

                default:
                    throw new Error(this.stateStorage + ' is not a valid value for the state storage, supported values are "local" and "session".');
            }
        },
        saveState() {
            this.getStorage().setItem(this.stateKey, JSON.stringify(this.panelSizes));
        },
        restoreState() {
            const storage = this.getStorage();
            const stateString = storage.getItem(this.stateKey);

            if (stateString) {
                this.panelSizes = JSON.parse(stateString);
                let children = [...this.$el.children].filter(child => DomHandler.hasClass(child, 'p-splitter-panel'));
                children.forEach((child, i) => {
                    child.style.flexBasis = 'calc(' + this.panelSizes[i] + '% - ' + ((this.panels.length - 1) * this.gutterSize) + 'px)';
                });

                return true;
            }

            return false;
        }
    },
    computed: {
        containerClass() {
            return ['p-splitter p-component', 'p-splitter-' + this.layout];
        },
        panels() {
            const panels = [];
            this.$slots.default().forEach(child => {
                    if (this.isSplitterPanel(child)) {
                        panels.push(child);
                    }
                    else if (child.children.length instanceof Array) {
                        child.children.forEach(nestedChild => {
                            if (this.isSplitterPanel(nestedChild)) {
                                panels.push(nestedChild);
                            }
                        });
                    }
                }
            );
            return panels;
        },
        gutterStyle() {
            if (this.horizontal)
                return {width: this.gutterSize + 'px'};
            else
                return {height: this.gutterSize + 'px'};
        },
        horizontal() {
            return this.layout === 'horizontal';
        }
    }
};

const _hoisted_1 = /*#__PURE__*/createVNode("div", { class: "p-splitter-gutter-handle" }, null, -1 /* HOISTED */);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("div", { class: $options.containerClass }, [
    (openBlock(true), createBlock(Fragment, null, renderList($options.panels, (panel, i) => {
      return (openBlock(), createBlock(Fragment, { key: i }, [
        (openBlock(), createBlock(resolveDynamicComponent(panel))),
        (i !== ($options.panels.length -1))
          ? (openBlock(), createBlock("div", {
              key: 0,
              class: "p-splitter-gutter",
              style: $options.gutterStyle,
              onMousedown: $event => ($options.onGutterMouseDown($event, i)),
              onTouchstart: $event => ($options.onGutterTouchStart($event, i)),
              onTouchmove: $event => ($options.onGutterTouchMove($event, i)),
              onTouchend: $event => ($options.onGutterTouchEnd($event, i))
            }, [
              _hoisted_1
            ], 44 /* STYLE, PROPS, HYDRATE_EVENTS */, ["onMousedown", "onTouchstart", "onTouchmove", "onTouchend"]))
          : createCommentVNode("v-if", true)
      ], 64 /* STABLE_FRAGMENT */))
    }), 128 /* KEYED_FRAGMENT */))
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

var css_248z = "\n.p-splitter {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -ms-flex-wrap: nowrap;\r\n        flex-wrap: nowrap;\n}\n.p-splitter-vertical {\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\n}\n.p-splitter-panel {\r\n    -webkit-box-flex: 1;\r\n        -ms-flex-positive: 1;\r\n            flex-grow: 1;\n}\n.p-splitter-panel-nested {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\n}\n.p-splitter-panel .p-splitter {\r\n    -webkit-box-flex: 1;\r\n        -ms-flex-positive: 1;\r\n            flex-grow: 1;\r\n    border: 0 none;\n}\n.p-splitter-gutter {\r\n    -webkit-box-flex: 0;\r\n        -ms-flex-positive: 0;\r\n            flex-grow: 0;\r\n    -ms-flex-negative: 0;\r\n        flex-shrink: 0;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    cursor: col-resize;\n}\n.p-splitter-horizontal.p-splitter-resizing {\r\n    cursor: col-resize;\r\n    -webkit-user-select: none;\r\n       -moz-user-select: none;\r\n        -ms-user-select: none;\r\n            user-select: none;\n}\n.p-splitter-horizontal > .p-splitter-gutter > .p-splitter-gutter-handle {\r\n    height: 24px;\r\n    width: 100%;\n}\n.p-splitter-horizontal > .p-splitter-gutter {\r\n    cursor: col-resize;\n}\n.p-splitter-vertical.p-splitter-resizing {\r\n    cursor: row-resize;\r\n    -webkit-user-select: none;\r\n       -moz-user-select: none;\r\n        -ms-user-select: none;\r\n            user-select: none;\n}\n.p-splitter-vertical > .p-splitter-gutter {\r\n    cursor: row-resize;\n}\n.p-splitter-vertical > .p-splitter-gutter > .p-splitter-gutter-handle {\r\n    width: 24px;\r\n    height: 100%;\n}\r\n";
styleInject(css_248z);

script.render = render;
script.__file = "src/components/splitter/Splitter.vue";

export { script as default };

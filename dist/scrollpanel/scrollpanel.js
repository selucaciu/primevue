this.primevue = this.primevue || {};
this.primevue.scrollpanel = (function (utils, vue) {
    'use strict';

    var script = {
        name: 'ScrollPanel',
        initialized: false,
        documentResizeListener: null,
        documentMouseMoveListener: null,
        documentMouseUpListener: null,
        frame: null,
        scrollXRatio: null,
        scrollYRatio: null,
        isXBarClicked: false,
        isYBarClicked: false,
        lastPageX: null,
        lastPageY: null,
        mounted() {
            if (this.$el.offsetParent) {
                this.initialize();
            }
        },
        updated() {
            if (!this.initialized && this.$el.offsetParent) {
                this.initialize();
            }
        },
        beforeUnmount() {
            this.unbindDocumentResizeListener();

            if (this.frame) {
                window.cancelAnimationFrame(this.frame);
            }
        },
        methods: {
            initialize() {
                this.moveBar();
                this.bindDocumentResizeListener();
                this.calculateContainerHeight();
            },
            calculateContainerHeight() {
                let containerStyles = getComputedStyle(this.$el),
                xBarStyles = getComputedStyle(this.$refs.xBar),
                pureContainerHeight = utils.DomHandler.getHeight(this.$el) - parseInt(xBarStyles['height'], 10);

                if (containerStyles['max-height'] !== "none" && pureContainerHeight === 0) {
                    if(this.$refs.content.offsetHeight + parseInt(xBarStyles['height'], 10) > parseInt(containerStyles['max-height'], 10)) {
                        this.$el.style.height = containerStyles['max-height'];
                    }
                    else {
                        this.$el.style.height = this.$refs.content.offsetHeight + parseFloat(containerStyles.paddingTop) + parseFloat(containerStyles.paddingBottom) + parseFloat(containerStyles.borderTopWidth) + parseFloat(containerStyles.borderBottomWidth) + "px";
                    }
                }
            },
            moveBar() {
                /* horizontal scroll */
                let totalWidth = this.$refs.content.scrollWidth;
                let ownWidth = this.$refs.content.clientWidth;
                let bottom = (this.$el.clientHeight - this.$refs.xBar.clientHeight) * -1;

                this.scrollXRatio = ownWidth / totalWidth;

                /* vertical scroll */
                let totalHeight = this.$refs.content.scrollHeight;
                let ownHeight = this.$refs.content.clientHeight;
                let right = (this.$el.clientWidth - this.$refs.yBar.clientWidth) * -1;

                this.scrollYRatio = ownHeight / totalHeight;

                this.frame = this.requestAnimationFrame(() => {
                    if (this.scrollXRatio >= 1) {
                        utils.DomHandler.addClass(this.$refs.xBar, 'p-scrollpanel-hidden');
                    }
                    else {
                        utils.DomHandler.removeClass(this.$refs.xBar, 'p-scrollpanel-hidden');
                        this.$refs.xBar.style.cssText = 'width:' + Math.max(this.scrollXRatio * 100, 10) + '%; left:' + (this.$refs.content.scrollLeft / totalWidth) * 100 + '%;bottom:' + bottom + 'px;';
                    }

                    if (this.scrollYRatio >= 1) {
                        utils.DomHandler.addClass(this.$refs.yBar, 'p-scrollpanel-hidden');
                    }
                    else {
                        utils.DomHandler.removeClass(this.$refs.yBar, 'p-scrollpanel-hidden');
                        this.$refs.yBar.style.cssText = 'height:' + Math.max(this.scrollYRatio * 100, 10) + '%; top: calc(' + (this.$refs.content.scrollTop / totalHeight) * 100 + '% - ' + this.$refs.xBar.clientHeight + 'px);right:' + right + 'px;';
                    }
                });
            },
            onYBarMouseDown(e) {
                this.isYBarClicked = true;
                this.lastPageY = e.pageY;
                utils.DomHandler.addClass(this.$refs.yBar, 'p-scrollpanel-grabbed');
                utils.DomHandler.addClass(document.body, 'p-scrollpanel-grabbed');

                this.bindDocumentMouseListeners();
                e.preventDefault();
            },
            onXBarMouseDown(e) {
                this.isXBarClicked = true;
                this.lastPageX = e.pageX;
                utils.DomHandler.addClass(this.$refs.xBar, 'p-scrollpanel-grabbed');
                utils.DomHandler.addClass(document.body, 'p-scrollpanel-grabbed');

                this.bindDocumentMouseListeners();
                e.preventDefault();
            },
            onDocumentMouseMove(e) {
                if (this.isXBarClicked) {
                    this.onMouseMoveForXBar(e);
                }
                else if (this.isYBarClicked) {
                    this.onMouseMoveForYBar(e);
                }
                else {
                    this.onMouseMoveForXBar(e);
                    this.onMouseMoveForYBar(e);
                }
            },
            onMouseMoveForXBar(e) {
                let deltaX = e.pageX - this.lastPageX;
                this.lastPageX = e.pageX;

                this.frame = this.requestAnimationFrame(() => {
                    this.$refs.content.scrollLeft += deltaX / this.scrollXRatio;
                });
            },
            onMouseMoveForYBar(e) {
                let deltaY = e.pageY - this.lastPageY;
                this.lastPageY = e.pageY;

                this.frame = this.requestAnimationFrame(() => {
                    this.$refs.content.scrollTop += deltaY / this.scrollYRatio;
                });
            },
            onDocumentMouseUp() {
                utils.DomHandler.removeClass(this.$refs.yBar, 'p-scrollpanel-grabbed');
                utils.DomHandler.removeClass(this.$refs.xBar, 'p-scrollpanel-grabbed');
                utils.DomHandler.removeClass(document.body, 'p-scrollpanel-grabbed');

                this.unbindDocumentMouseListeners();
                this.isXBarClicked = false;
                this.isYBarClicked = false;
            },
            requestAnimationFrame(f) {
                let frame = window.requestAnimationFrame || this.timeoutFrame;
                return frame(f);
            },
            refresh() {
                this.moveBar();
            },
            scrollTop(scrollTop) {
                let scrollableHeight = this.$refs.content.scrollHeight - this.$refs.content.clientHeight;
                scrollTop = scrollTop > scrollableHeight ? scrollableHeight : scrollTop > 0 ? scrollTop : 0;
                this.$refs.contentscrollTop = scrollTop;
            },
            bindDocumentMouseListeners() {
    			if (!this.documentMouseMoveListener) {
    				this.documentMouseMoveListener = (e) => {
    					this.onDocumentMouseMove(e);
    				};

    				document.addEventListener('mousemove', this.documentMouseMoveListener);
                }

                if (!this.documentMouseUpListener) {
    				this.documentMouseUpListener = (e) => {
    					this.onDocumentMouseUp(e);
    				};

    				document.addEventListener('mouseup', this.documentMouseUpListener);
    			}
    		},
    		unbindDocumentMouseListeners() {
    			if (this.documentMouseMoveListener) {
    				document.removeEventListener('mousemove', this.documentMouseMoveListener);
    				this.documentMouseMoveListener = null;
                }

                if(this.documentMouseUpListener) {
    				document.removeEventListener('mouseup', this.documentMouseUpListener);
    				this.documentMouseUpListener = null;
    			}
    		},
            bindDocumentResizeListener() {
    			if (!this.documentResizeListener) {
    				this.documentResizeListener = () => {
    					this.moveBar();
    				};

    				window.addEventListener('resize', this.documentResizeListener);
    			}
    		},
    		unbindDocumentResizeListener() {
    			if(this.documentResizeListener) {
    				window.removeEventListener('resize', this.documentResizeListener);
    				this.documentResizeListener = null;
    			}
    		}
        }
    };

    const _hoisted_1 = { class: "p-scrollpanel p-component" };
    const _hoisted_2 = { class: "p-scrollpanel-wrapper" };

    function render(_ctx, _cache, $props, $setup, $data, $options) {
      return (vue.openBlock(), vue.createBlock("div", _hoisted_1, [
        vue.createVNode("div", _hoisted_2, [
          vue.createVNode("div", {
            ref: "content",
            class: "p-scrollpanel-content",
            onScroll: _cache[1] || (_cache[1] = (...args) => ($options.moveBar && $options.moveBar(...args))),
            onMouseenter: _cache[2] || (_cache[2] = (...args) => ($options.moveBar && $options.moveBar(...args)))
          }, [
            vue.renderSlot(_ctx.$slots, "default")
          ], 544 /* HYDRATE_EVENTS, NEED_PATCH */)
        ]),
        vue.createVNode("div", {
          ref: "xBar",
          class: "p-scrollpanel-bar p-scrollpanel-bar-x",
          onMousedown: _cache[3] || (_cache[3] = (...args) => ($options.onXBarMouseDown && $options.onXBarMouseDown(...args)))
        }, null, 544 /* HYDRATE_EVENTS, NEED_PATCH */),
        vue.createVNode("div", {
          ref: "yBar",
          class: "p-scrollpanel-bar p-scrollpanel-bar-y",
          onMousedown: _cache[4] || (_cache[4] = (...args) => ($options.onYBarMouseDown && $options.onYBarMouseDown(...args)))
        }, null, 544 /* HYDRATE_EVENTS, NEED_PATCH */)
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

    var css_248z = "\n.p-scrollpanel-wrapper {\r\n    overflow: hidden;\r\n    width: 100%;\r\n    height: 100%;\r\n    position: relative;\r\n    z-index: 1;\r\n    float: left;\n}\n.p-scrollpanel-content {\r\n    height: calc(100% + 18px);\r\n    width: calc(100% + 18px);\r\n    padding: 0 18px 18px 0;\r\n    position: relative;\r\n    overflow: scroll;\r\n    -webkit-box-sizing: border-box;\r\n            box-sizing: border-box;\n}\n.p-scrollpanel-bar {\r\n    position: relative;\r\n    background: #c1c1c1;\r\n    border-radius: 3px;\r\n    z-index: 2;\r\n    cursor: pointer;\r\n    opacity: 0;\r\n    -webkit-transition: opacity 0.25s linear;\r\n    transition: opacity 0.25s linear;\n}\n.p-scrollpanel-bar-y {\r\n    width: 9px;\r\n    top: 0;\n}\n.p-scrollpanel-bar-x {\r\n    height: 9px;\r\n    bottom: 0;\n}\n.p-scrollpanel-hidden {\r\n    visibility: hidden;\n}\n.p-scrollpanel:hover .p-scrollpanel-bar,\r\n.p-scrollpanel:active .p-scrollpanel-bar {\r\n    opacity: 1;\n}\n.p-scrollpanel-grabbed {\r\n    -webkit-user-select: none;\r\n       -moz-user-select: none;\r\n        -ms-user-select: none;\r\n            user-select: none;\n}\r\n";
    styleInject(css_248z);

    script.render = render;
    script.__file = "src/components/scrollpanel/ScrollPanel.vue";

    return script;

})(primevue.utils, Vue);
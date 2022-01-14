'use strict';

var utils = require('primevue/utils');
var Ripple = require('primevue/ripple');
var vue = require('vue');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Ripple__default = /*#__PURE__*/_interopDefaultLegacy(Ripple);

var script = {
    name: 'Carousel',
	emits: ['update:page'],
	props: {
		value: null,
		page: {
			type: Number,
			default: 0
		},
		numVisible: {
			type: Number,
			default: 1
		},
		numScroll: {
			type: Number,
			default: 1
		},
		responsiveOptions: Array,
		orientation: {
			type: String,
			default: 'horizontal'
		},
		verticalViewPortHeight: {
			type: String,
			default: '300px'
		},
		contentClass: String,
		containerClass: String,
		indicatorsContentClass: String,
		circular: {
			type: Boolean,
			default: false
		},
		autoplayInterval: {
			type: Number,
			default:0
		}
	},
	data() {
		return {
			id : utils.UniqueComponentId(),
			remainingItems: 0,
			d_numVisible: this.numVisible,
			d_numScroll: this.numScroll,
			d_oldNumScroll: 0,
			d_oldNumVisible: 0,
			d_oldValue: null,
			d_page: this.page,
			totalShiftedItems: this.page * this.numScroll * -1,
			allowAutoplay : !!this.autoplayInterval,
			d_circular : this.circular || this.allowAutoplay,
			swipeThreshold: 20
		}
	},
	isRemainingItemsAdded: false,
	watch: {
		page(newValue) {
			this.d_page = newValue;
		},
		circular(newValue) {
			this.d_circular = newValue;
		},
		numVisible(newValue, oldValue) {
			this.d_numVisible = newValue;
			this.d_oldNumVisible = oldValue;
		},
		numScroll(newValue, oldValue) {
			this.d_oldNumScroll = oldValue;
			this.d_numScroll = newValue;
		},
		value(oldValue) {
			this.d_oldValue =oldValue;
		}
	},
	methods: {
		step(dir, page) {
			let totalShiftedItems = this.totalShiftedItems;
			const isCircular = this.isCircular();

			if (page != null) {
				totalShiftedItems = (this.d_numScroll * page) * -1;

				if (isCircular) {
					totalShiftedItems -= this.d_numVisible;
				}

				this.isRemainingItemsAdded = false;
			}
			else {
				totalShiftedItems += (this.d_numScroll * dir);
				if (this.isRemainingItemsAdded) {
					totalShiftedItems += this.remainingItems - (this.d_numScroll * dir);
					this.isRemainingItemsAdded = false;
				}

				let originalShiftedItems = isCircular ? (totalShiftedItems + this.d_numVisible) : totalShiftedItems;
				page = Math.abs(Math.floor(originalShiftedItems / this.d_numScroll));
			}

			if (isCircular && this.d_page === (this.totalIndicators - 1) && dir === -1) {
				totalShiftedItems = -1 * (this.value.length + this.d_numVisible);
				page = 0;
			}
			else if (isCircular && this.d_page === 0 && dir === 1) {
				totalShiftedItems = 0;
				page = (this.totalIndicators - 1);
			}
			else if (page === (this.totalIndicators - 1) && this.remainingItems > 0) {
				totalShiftedItems += ((this.remainingItems * -1) - (this.d_numScroll * dir));
				this.isRemainingItemsAdded = true;
			}

			if (this.$refs.itemsContainer) {
				utils.DomHandler.removeClass(this.$refs.itemsContainer, 'p-items-hidden');
				this.$refs.itemsContainer.style.transform = this.isVertical() ? `translate3d(0, ${totalShiftedItems * (100/ this.d_numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100/ this.d_numVisible)}%, 0, 0)`;
				this.$refs.itemsContainer.style.transition = 'transform 500ms ease 0s';
			}

			this.totalShiftedItems = totalShiftedItems;

			this.$emit('update:page', page);
			this.d_page = page;
		},
		calculatePosition() {
			if (this.$refs.itemsContainer && this.responsiveOptions) {
				let windowWidth = window.innerWidth;
				let matchedResponsiveOptionsData = {
					numVisible: this.numVisible,
					numScroll: this.numScroll
				};

				for (let i = 0; i < this.responsiveOptions.length; i++) {
					let res = this.responsiveOptions[i];

					if (parseInt(res.breakpoint, 10) >= windowWidth) {
						matchedResponsiveOptionsData = res;
					}
				}

				if (this.d_numScroll !== matchedResponsiveOptionsData.numScroll) {
					let page = this.d_page;
					page = parseInt((page * this.d_numScroll) / matchedResponsiveOptionsData.numScroll);

					this.totalShiftedItems = (matchedResponsiveOptionsData.numScroll * page) * -1;

					if (this.isCircular()) {
						this.totalShiftedItems -= matchedResponsiveOptionsData.numVisible;
					}

					this.d_numScroll = matchedResponsiveOptionsData.numScroll;

					this.$emit('update:page', page);
					this.d_page = page;
				}

				if (this.d_numVisible !== matchedResponsiveOptionsData.numVisible) {
					this.d_numVisible = matchedResponsiveOptionsData.numVisible;
				}
			}
		},
		navBackward(e,index){
			if (this.d_circular || this.d_page !== 0) {
				this.step(1, index);
			}

			this.allowAutoplay = false;

			if (e.cancelable) {
				e.preventDefault();
			}
		},
		navForward(e,index){
			if (this.d_circular || this.d_page < (this.totalIndicators - 1)) {
				this.step(-1, index);
			}

			this.allowAutoplay = false;

			if (e.cancelable) {
				e.preventDefault();
			}
		},
		onIndicatorClick(e, index) {
			let page = this.d_page;

			if (index > page) {
				this.navForward(e, index);
			}
			else if (index < page) {
				this.navBackward(e, index);
			}
		},
		onTransitionEnd() {
			if (this.$refs.itemsContainer) {
				utils.DomHandler.addClass(this.$refs.itemsContainer, 'p-items-hidden');
				this.$refs.itemsContainer.style.transition = '';

				if ((this.d_page === 0 || this.d_page === (this.totalIndicators - 1)) && this.isCircular()) {
					this.$refs.itemsContainer.style.transform = this.isVertical() ? `translate3d(0, ${this.totalShiftedItems * (100/ this.d_numVisible)}%, 0)` : `translate3d(${this.totalShiftedItems * (100/ this.d_numVisible)}%, 0, 0)`;
				}
			}
		},
		onTouchStart(e) {
			let touchobj = e.changedTouches[0];

			this.startPos = {
				x: touchobj.pageX,
				y: touchobj.pageY
			};
		},
		onTouchMove(e) {
			if (e.cancelable) {
				e.preventDefault();
			}
		},
		onTouchEnd(e) {
			let touchobj = e.changedTouches[0];

			if (this.isVertical()) {
				this.changePageOnTouch(e, (touchobj.pageY - this.startPos.y));
			}
			else {
				this.changePageOnTouch(e, (touchobj.pageX - this.startPos.x));
			}
		},
		changePageOnTouch(e, diff) {
			if (Math.abs(diff) > this.swipeThreshold) {
				if (diff < 0) {           // left
					this.navForward(e);
				}
				else {                    // right
					this.navBackward(e);
				}
			}
		},
		bindDocumentListeners() {
			if (!this.documentResizeListener) {
				this.documentResizeListener = (e) => {
					this.calculatePosition(e);
				};

				window.addEventListener('resize', this.documentResizeListener);
			}
		},
		unbindDocumentListeners() {
			if(this.documentResizeListener) {
				window.removeEventListener('resize', this.documentResizeListener);
				this.documentResizeListener = null;
			}
		},
		startAutoplay() {
			this.interval = setInterval(() => {
					if(this.d_page === (this.totalIndicators - 1)) {
						this.step(-1, 0);
					}
					else {
						this.step(-1, this.d_page + 1);
					}
				},
				this.autoplayInterval);
		},
		stopAutoplay() {
			if (this.interval) {
				clearInterval(this.interval);
			}
		},
		createStyle() {
			if (!this.carouselStyle) {
				this.carouselStyle = document.createElement('style');
				this.carouselStyle.type = 'text/css';
				document.body.appendChild(this.carouselStyle);
			}

			let innerHTML = `
            #${this.id} .p-carousel-item {
                flex: 1 0 ${ (100/ this.d_numVisible) }%
            }
        `;

			if (this.responsiveOptions) {
				let _responsiveOptions = [...this.responsiveOptions];
				_responsiveOptions.sort((data1, data2) => {
					const value1 = data1.breakpoint;
					const value2 = data2.breakpoint;
					let result = null;

					if (value1 == null && value2 != null)
						result = -1;
					else if (value1 != null && value2 == null)
						result = 1;
					else if (value1 == null && value2 == null)
						result = 0;
					else if (typeof value1 === 'string' && typeof value2 === 'string')
						result = value1.localeCompare(value2, undefined, { numeric: true });
					else
						result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

					return -1 * result;
				});

				for (let i = 0; i < _responsiveOptions.length; i++) {
					let res = _responsiveOptions[i];

					innerHTML += `
                    @media screen and (max-width: ${res.breakpoint}) {
                        #${this.id} .p-carousel-item {
                            flex: 1 0 ${ (100/ res.numVisible) }%
                        }
                    }
                `;
				}
			}

			this.carouselStyle.innerHTML = innerHTML;
		},
		isVertical() {
			return this.orientation === 'vertical';
		},
		isCircular() {
			return this.value && this.d_circular && this.value.length >= this.d_numVisible;
		},
		isAutoplay() {
			return this.autoplayInterval && this.allowAutoplay;
		},
		firstIndex() {
			return this.isCircular()? (-1 * (this.totalShiftedItems + this.d_numVisible)) : (this.totalShiftedItems * -1);
		},
		lastIndex() {
			return (this.firstIndex() + this.d_numVisible - 1);
		}
	},
	mounted() {
		this.createStyle();
		this.calculatePosition();

		if (this.responsiveOptions) {
			this.bindDocumentListeners();
		}
	},
	updated() {
		const isCircular = this.isCircular();
		let stateChanged = false;
		let totalShiftedItems = this.totalShiftedItems;

		if (this.autoplayInterval) {
			this.stopAutoplay();
		}

		if(this.d_oldNumScroll !== this.d_numScroll || this.d_oldNumVisible !== this.d_numVisible || this.d_oldValue.length !== this.value.length) {
			this.remainingItems = (this.value.length - this.d_numVisible) % this.d_numScroll;

			let page = this.d_page;
			if (this.totalIndicators !== 0 && page >= this.totalIndicators) {
				page = this.totalIndicators - 1;

				this.$emit('update:page', page);
				this.d_page = page;

				stateChanged = true;
			}

			totalShiftedItems = (page * this.d_numScroll) * -1;
			if (isCircular) {
				totalShiftedItems -= this.d_numVisible;
			}

			if (page === (this.totalIndicators - 1) && this.remainingItems > 0) {
				totalShiftedItems += (-1 * this.remainingItems) + this.d_numScroll;
				this.isRemainingItemsAdded = true;
			}
			else {
				this.isRemainingItemsAdded = false;
			}

			if (totalShiftedItems !== this.totalShiftedItems) {
				this.totalShiftedItems = totalShiftedItems;

				stateChanged = true;
			}

			this.d_oldNumScroll = this.d_numScroll;
			this.d_oldNumVisible = this.d_numVisible;
			this.d_oldValue = this.value;

			this.$refs.itemsContainer.style.transform = this.isVertical() ? `translate3d(0, ${totalShiftedItems * (100/ this.d_numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100/ this.d_numVisible)}%, 0, 0)`;
		}

		if (isCircular) {
			if (this.d_page === 0) {
				totalShiftedItems = -1 * this.d_numVisible;
			}
			else if (totalShiftedItems === 0) {
				totalShiftedItems = -1 * this.value.length;
				if (this.remainingItems > 0) {
					this.isRemainingItemsAdded = true;
				}
			}

			if (totalShiftedItems !== this.totalShiftedItems) {
				this.totalShiftedItems = totalShiftedItems;

				stateChanged = true;
			}
		}

		if (!stateChanged && this.isAutoplay()) {
			this.startAutoplay();
		}
	},
	beforeUnmount() {
		if (this.responsiveOptions) {
			this.unbindDocumentListeners();
		}

		if (this.autoplayInterval) {
			this.stopAutoplay();
		}
	},
	computed: {
		totalIndicators() {
			return this.value ? Math.ceil((this.value.length - this.d_numVisible) / this.d_numScroll) + 1 : 0;
		},
		backwardIsDisabled() {
			return (this.value && (!this.circular || this.value.length < this.d_numVisible) && this.d_page === 0);
		},
		forwardIsDisabled() {
			return (this.value && (!this.circular || this.value.length < this.d_numVisible) && (this.d_page === (this.totalIndicators - 1) || this.totalIndicators === 0));
		},
		containerClasses() {
			return ['p-carousel-container', this.containerClass];
		},
		contentClasses() {
			return ['p-carousel-content ', this.contentClass];
		},
		indicatorsContentClasses() {
			return ['p-carousel-indicators p-reset', this.indicatorsContentClass];
		},
    },
    directives: {
        'ripple': Ripple__default["default"]
    }
};

const _hoisted_1 = {
  key: 0,
  class: "p-carousel-header"
};
const _hoisted_2 = {
  key: 1,
  class: "p-carousel-footer"
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = vue.resolveDirective("ripple");

  return (vue.openBlock(), vue.createBlock("div", {
    id: $data.id,
    class: ['p-carousel p-component', {'p-carousel-vertical': $options.isVertical(), 'p-carousel-horizontal': !$options.isVertical()}]
  }, [
    (_ctx.$slots.header)
      ? (vue.openBlock(), vue.createBlock("div", _hoisted_1, [
          vue.renderSlot(_ctx.$slots, "header")
        ]))
      : vue.createCommentVNode("v-if", true),
    vue.createVNode("div", { class: $options.contentClasses }, [
      vue.createVNode("div", { class: $options.containerClasses }, [
        vue.withDirectives(vue.createVNode("button", {
          class: ['p-carousel-prev p-link', {'p-disabled': $options.backwardIsDisabled}],
          disabled: $options.backwardIsDisabled,
          onClick: _cache[1] || (_cache[1] = (...args) => ($options.navBackward && $options.navBackward(...args))),
          type: "button"
        }, [
          vue.createVNode("span", {
            class: ['p-carousel-prev-icon pi', {'pi-chevron-left': !$options.isVertical(),'pi-chevron-up': $options.isVertical()}]
          }, null, 2 /* CLASS */)
        ], 10 /* CLASS, PROPS */, ["disabled"]), [
          [_directive_ripple]
        ]),
        vue.createVNode("div", {
          class: "p-carousel-items-content",
          style: [{'height': $options.isVertical() ? $props.verticalViewPortHeight : 'auto'}],
          onTouchend: _cache[3] || (_cache[3] = (...args) => ($options.onTouchEnd && $options.onTouchEnd(...args))),
          onTouchstart: _cache[4] || (_cache[4] = (...args) => ($options.onTouchStart && $options.onTouchStart(...args))),
          onTouchmove: _cache[5] || (_cache[5] = (...args) => ($options.onTouchMove && $options.onTouchMove(...args)))
        }, [
          vue.createVNode("div", {
            ref: "itemsContainer",
            class: "p-carousel-items-container",
            onTransitionend: _cache[2] || (_cache[2] = (...args) => ($options.onTransitionEnd && $options.onTransitionEnd(...args)))
          }, [
            ($options.isCircular())
              ? (vue.openBlock(true), vue.createBlock(vue.Fragment, { key: 0 }, vue.renderList($props.value.slice(-1 * $data.d_numVisible), (item, index) => {
                  return (vue.openBlock(), vue.createBlock("div", {
                    key: index + '_scloned',
                    class: ['p-carousel-item p-carousel-item-cloned',
								{'p-carousel-item-active': ($data.totalShiftedItems * -1) === ($props.value.length + $data.d_numVisible),
								'p-carousel-item-start': 0 === index,
								'p-carousel-item-end': $props.value.slice(-1 * $data.d_numVisible).length - 1 === index}]
                  }, [
                    vue.renderSlot(_ctx.$slots, "item", {
                      data: item,
                      index: index
                    })
                  ], 2 /* CLASS */))
                }), 128 /* KEYED_FRAGMENT */))
              : vue.createCommentVNode("v-if", true),
            (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($props.value, (item, index) => {
              return (vue.openBlock(), vue.createBlock("div", {
                key: index,
                class: ['p-carousel-item',
							{'p-carousel-item-active': $options.firstIndex() <= index && $options.lastIndex() >= index,
							'p-carousel-item-start': $options.firstIndex() === index,
							'p-carousel-item-end': $options.lastIndex() === index}]
              }, [
                vue.renderSlot(_ctx.$slots, "item", {
                  data: item,
                  index: index
                })
              ], 2 /* CLASS */))
            }), 128 /* KEYED_FRAGMENT */)),
            ($options.isCircular())
              ? (vue.openBlock(true), vue.createBlock(vue.Fragment, { key: 1 }, vue.renderList($props.value.slice(0, $data.d_numVisible), (item, index) => {
                  return (vue.openBlock(), vue.createBlock("div", {
                    key: index + '_fcloned',
                    class: ['p-carousel-item p-carousel-item-cloned',
								{'p-carousel-item-active': $data.totalShiftedItems === 0,
								'p-carousel-item-start': 0 === index,
								'p-carousel-item-end': $props.value.slice(0, $data.d_numVisible).length - 1 === index}]
                  }, [
                    vue.renderSlot(_ctx.$slots, "item", {
                      data: item,
                      index: index
                    })
                  ], 2 /* CLASS */))
                }), 128 /* KEYED_FRAGMENT */))
              : vue.createCommentVNode("v-if", true)
          ], 544 /* HYDRATE_EVENTS, NEED_PATCH */)
        ], 36 /* STYLE, HYDRATE_EVENTS */),
        vue.withDirectives(vue.createVNode("button", {
          class: ['p-carousel-next p-link', {'p-disabled': $options.forwardIsDisabled}],
          disabled: $options.forwardIsDisabled,
          onClick: _cache[6] || (_cache[6] = (...args) => ($options.navForward && $options.navForward(...args))),
          type: "button"
        }, [
          vue.createVNode("span", {
            class: ['p-carousel-prev-icon pi', {'pi-chevron-right': !$options.isVertical(),'pi-chevron-down': $options.isVertical()}]
          }, null, 2 /* CLASS */)
        ], 10 /* CLASS, PROPS */, ["disabled"]), [
          [_directive_ripple]
        ])
      ], 2 /* CLASS */),
      ($options.totalIndicators >= 0)
        ? (vue.openBlock(), vue.createBlock("ul", {
            key: 0,
            class: $options.indicatorsContentClasses
          }, [
            (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($options.totalIndicators, (indicator, i) => {
              return (vue.openBlock(), vue.createBlock("li", {
                key: 'p-carousel-indicator-' + i.toString(),
                class: ['p-carousel-indicator', {'p-highlight': $data.d_page === i}]
              }, [
                vue.createVNode("button", {
                  class: "p-link",
                  onClick: $event => ($options.onIndicatorClick($event, i)),
                  type: "button"
                }, null, 8 /* PROPS */, ["onClick"])
              ], 2 /* CLASS */))
            }), 128 /* KEYED_FRAGMENT */))
          ], 2 /* CLASS */))
        : vue.createCommentVNode("v-if", true)
    ], 2 /* CLASS */),
    (_ctx.$slots.footer)
      ? (vue.openBlock(), vue.createBlock("div", _hoisted_2, [
          vue.renderSlot(_ctx.$slots, "footer")
        ]))
      : vue.createCommentVNode("v-if", true)
  ], 10 /* CLASS, PROPS */, ["id"]))
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

var css_248z = "\n.p-carousel {\r\n\tdisplay: -webkit-box;\r\n\tdisplay: -ms-flexbox;\r\n\tdisplay: flex;\r\n\t-webkit-box-orient: vertical;\r\n\t-webkit-box-direction: normal;\r\n\t    -ms-flex-direction: column;\r\n\t        flex-direction: column;\n}\n.p-carousel-content {\r\n\tdisplay: -webkit-box;\r\n\tdisplay: -ms-flexbox;\r\n\tdisplay: flex;\r\n\t-webkit-box-orient: vertical;\r\n\t-webkit-box-direction: normal;\r\n\t    -ms-flex-direction: column;\r\n\t        flex-direction: column;\r\n\toverflow: auto;\n}\n.p-carousel-prev,\r\n.p-carousel-next {\r\n\t-ms-flex-item-align: center;\r\n\t    align-self: center;\r\n\t-webkit-box-flex: 0;\r\n\t    -ms-flex-positive: 0;\r\n\t        flex-grow: 0;\r\n    -ms-flex-negative: 0;\r\n        flex-shrink: 0;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    overflow: hidden;\r\n    position: relative;\n}\n.p-carousel-container {\r\n\tdisplay: -webkit-box;\r\n\tdisplay: -ms-flexbox;\r\n\tdisplay: flex;\r\n\t-webkit-box-orient: horizontal;\r\n\t-webkit-box-direction: normal;\r\n\t    -ms-flex-direction: row;\r\n\t        flex-direction: row;\n}\n.p-carousel-items-content {\r\n\toverflow: hidden;\r\n    width: 100%;\n}\n.p-carousel-items-container {\r\n\tdisplay: -webkit-box;\r\n\tdisplay: -ms-flexbox;\r\n\tdisplay: flex;\r\n\t-webkit-box-orient: horizontal;\r\n\t-webkit-box-direction: normal;\r\n\t    -ms-flex-direction: row;\r\n\t        flex-direction: row;\n}\n.p-carousel-indicators {\r\n\tdisplay: -webkit-box;\r\n\tdisplay: -ms-flexbox;\r\n\tdisplay: flex;\r\n\t-webkit-box-orient: horizontal;\r\n\t-webkit-box-direction: normal;\r\n\t    -ms-flex-direction: row;\r\n\t        flex-direction: row;\r\n\t-webkit-box-pack: center;\r\n\t    -ms-flex-pack: center;\r\n\t        justify-content: center;\r\n\t-ms-flex-wrap: wrap;\r\n\t    flex-wrap: wrap;\n}\n.p-carousel-indicator > button {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-align: center;\r\n        -ms-flex-align: center;\r\n            align-items: center;\r\n    -webkit-box-pack: center;\r\n        -ms-flex-pack: center;\r\n            justify-content: center;\n}\r\n\r\n/* Vertical */\n.p-carousel-vertical .p-carousel-container {\r\n\t-webkit-box-orient: vertical;\r\n\t-webkit-box-direction: normal;\r\n\t    -ms-flex-direction: column;\r\n\t        flex-direction: column;\n}\n.p-carousel-vertical .p-carousel-items-container {\r\n\t-webkit-box-orient: vertical;\r\n\t-webkit-box-direction: normal;\r\n\t    -ms-flex-direction: column;\r\n\t        flex-direction: column;\r\n\theight: 100%;\n}\r\n\r\n/* Keyboard Support */\n.p-items-hidden .p-carousel-item {\r\n\tvisibility: hidden;\n}\n.p-items-hidden .p-carousel-item.p-carousel-item-active {\r\n\tvisibility: visible;\n}\r\n";
styleInject(css_248z);

script.render = render;
script.__file = "src/components/carousel/Carousel.vue";

module.exports = script;

// Credits to https://github.com/enesozturk/rn-swipeable-panel version 1.2.1
// Removed background elements to fix Android bugs

const React = require("react")
const reactNative = require("react-native")

function _extends() {
  _extends =
    Object.assign ||
    function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key]
          }
        }
      }

      return target
    }

  return _extends.apply(this, arguments)
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype)
  subClass.prototype.constructor = subClass
  subClass.__proto__ = superClass
}

const Bar = function Bar(_ref) {
  const barStyle = _ref.barStyle
  return /*#__PURE__*/ React.createElement(
    reactNative.View,
    {
      style: BarStyles.barContainer,
    },
    /*#__PURE__*/ React.createElement(reactNative.View, {
      style: [BarStyles.bar, barStyle],
    }),
  )
}
const BarStyles = reactNative.StyleSheet.create({
  barContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bar: {
    width: "10%",
    height: 5,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#e2e2e2",
  },
})

const Close = function Close(_ref) {
  const _onPress = _ref.onPress,
    rootStyle = _ref.rootStyle,
    iconStyle = _ref.iconStyle
  return /*#__PURE__*/ React.createElement(
    reactNative.TouchableOpacity,
    {
      activeOpacity: 0.5,
      onPress: function onPress() {
        return _onPress()
      },
      style: [CloseStyles.closeButton, rootStyle],
    },
    /*#__PURE__*/ React.createElement(reactNative.View, {
      style: [
        CloseStyles.iconLine,
        iconStyle,
        {
          transform: [
            {
              rotateZ: "45deg",
            },
          ],
        },
      ],
    }),
    /*#__PURE__*/ React.createElement(reactNative.View, {
      style: [
        CloseStyles.iconLine,
        iconStyle,
        {
          transform: [
            {
              rotateZ: "135deg",
            },
          ],
        },
      ],
    }),
  )
}
const CloseStyles = reactNative.StyleSheet.create({
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    position: "absolute",
    right: 15,
    top: 15,
    backgroundColor: "#e2e2e2",
    zIndex: 3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  iconLine: {
    position: "absolute",
    width: 18,
    height: 2,
    borderRadius: 2,
    backgroundColor: "white",
  },
})

let FULL_HEIGHT = reactNative.Dimensions.get("window").height
let FULL_WIDTH = reactNative.Dimensions.get("window").width
let PANEL_HEIGHT = FULL_HEIGHT - 100
const STATUS = {
  CLOSED: 0,
  SMALL: 1,
  LARGE: 2,
}

const SwipeablePanel = /*#__PURE__*/ (function(_React$Component) {
  _inheritsLoose(SwipeablePanel, _React$Component)

  function SwipeablePanel(props) {
    let _this

    _this = _React$Component.call(this, props) || this

    _this.componentDidMount = function() {
      const _this$props = _this.props,
        isActive = _this$props.isActive,
        openLarge = _this$props.openLarge,
        onlyLarge = _this$props.onlyLarge,
        onlySmall = _this$props.onlySmall

      _this.animatedValueY = 0

      _this.state.pan.y.addListener(function(value) {
        return (_this.animatedValueY = value.value)
      })

      _this.setState({
        isActive: isActive,
      })

      if (isActive)
        _this._animateTo(
          onlySmall
            ? STATUS.SMALL
            : openLarge
            ? STATUS.LARGE
            : onlyLarge
            ? STATUS.LARGE
            : STATUS.SMALL,
        )
      reactNative.Dimensions.addEventListener(
        "change",
        _this._onOrientationChange,
      )
    }

    _this._onOrientationChange = function() {
      const dimensions = reactNative.Dimensions.get("screen")
      FULL_HEIGHT = dimensions.height
      FULL_WIDTH = dimensions.width
      PANEL_HEIGHT = FULL_HEIGHT - 100

      _this.setState({
        orientation:
          dimensions.height >= dimensions.width ? "portrait" : "landscape",
        deviceWidth: FULL_WIDTH,
        deviceHeight: FULL_HEIGHT,
        panelHeight: PANEL_HEIGHT,
      })

      _this.props.onClose()
    }

    _this._animateTo = function(newStatus) {
      if (newStatus === void 0) {
        newStatus = 0
      }

      let newY = 0
      if (newStatus === STATUS.CLOSED) newY = PANEL_HEIGHT
      else if (newStatus === STATUS.SMALL)
        newY =
          _this.state.orientation === "portrait"
            ? FULL_HEIGHT - 400
            : FULL_HEIGHT / 3
      else if (newStatus === STATUS.LARGE) newY = 0

      _this.setState({
        showComponent: true,
        status: newStatus,
      })

      reactNative.Animated.spring(_this.state.pan, {
        toValue: {
          x: 0,
          y: newY,
        },
        tension: 90,
        friction: newStatus === STATUS.LARGE ? 15 : 10,
        useNativeDriver: true,
        restDisplacementThreshold: 0.1,
        overshootClamping: newStatus === STATUS.LARGE,
        restSpeedThreshold: 1,
      }).start(function() {
        if (newStatus === 0) {
          _this.props.onClose()

          _this.setState({
            showComponent: false,
          })
        } else
          _this.setState({
            canScroll: newStatus === STATUS.LARGE,
          })
      })
    }

    _this.state = {
      status: STATUS.CLOSED,
      isActive: false,
      showComponent: false,
      canScroll: false,
      opacity: new reactNative.Animated.Value(0),
      pan: new reactNative.Animated.ValueXY({
        x: 0,
        y: FULL_HEIGHT,
      }),
      orientation: FULL_HEIGHT >= FULL_WIDTH ? "portrait" : "landscape",
      deviceWidth: FULL_WIDTH,
      deviceHeight: FULL_HEIGHT,
      panelHeight: PANEL_HEIGHT,
    }
    _this.pan = new reactNative.Animated.ValueXY({
      x: 0,
      y: FULL_HEIGHT,
    })
    _this.isClosing = false
    _this.animatedValueY = 0
    _this._panResponder = reactNative.PanResponder.create({
      onStartShouldSetPanResponder: function onStartShouldSetPanResponder(
        evt,
        gestureState,
      ) {
        return true
      },
      onPanResponderGrant: function onPanResponderGrant(evt, gestureState) {
        _this.state.pan.setOffset({
          x: 0,
          y: _this.animatedValueY,
        })

        _this.state.pan.setValue({
          x: 0,
          y: 0,
        })
      },
      onPanResponderMove: function onPanResponderMove(evt, gestureState) {
        const {pan, status} = _this.state,
          {dy} = gestureState,
          y = pan.y

        if (
          (status === 1 && Math.abs(dy) <= y._offset) ||
          (status === 2 && y._value >= 0 && dy > 0)
        ) {
          pan.setValue({
            x: 0,
            y: dy,
          })
        }
      },
      onPanResponderRelease: function onPanResponderRelease(evt, gestureState) {
        const _this$props2 = _this.props,
          onlyLarge = _this$props2.onlyLarge,
          onlySmall = _this$props2.onlySmall,
          status = _this.state.status,
          {dy, vy} = gestureState

        let newStatus = status

        _this.state.pan.flattenOffset()

        if ((dy < -80 || vy < -0.5) && vy <= 0) {
          if (status === STATUS.SMALL)
            newStatus = onlySmall ? STATUS.SMALL : STATUS.LARGE
          else newStatus = STATUS.LARGE
        } else if (dy > 80 || vy > 0.5) {
          if ((dy > 120 && vy >= 0) || status === STATUS.SMALL)
            newStatus = STATUS.CLOSED
          else if (status === STATUS.LARGE)
            newStatus = onlyLarge ? STATUS.CLOSED : STATUS.SMALL
        }

        _this._animateTo(newStatus)
      },
    })
    return _this
  }

  const _proto = SwipeablePanel.prototype

  _proto.componentDidUpdate = function componentDidUpdate(
    prevProps,
    prevState,
  ) {
    const _this$props3 = this.props,
      isActive = _this$props3.isActive,
      openLarge = _this$props3.openLarge,
      onlyLarge = _this$props3.onlyLarge,
      onlySmall = _this$props3.onlySmall

    if (prevProps.isActive !== isActive) {
      this.setState({
        isActive: isActive,
      })

      if (isActive) {
        this._animateTo(
          onlySmall
            ? STATUS.SMALL
            : openLarge
            ? STATUS.LARGE
            : onlyLarge
            ? STATUS.LARGE
            : STATUS.SMALL,
        )
      } else {
        this._animateTo()
      }
    }

    if (prevState.orientation !== this.state.orientation)
      this._animateTo(this.state.status)
  }

  _proto.render = function render() {
    const _this$state = this.state,
      showComponent = _this$state.showComponent,
      deviceWidth = _this$state.deviceWidth,
      panelHeight = _this$state.panelHeight
    const _this$props4 = this.props,
      style = _this$props4.style,
      barStyle = _this$props4.barStyle,
      closeRootStyle = _this$props4.closeRootStyle,
      closeIconStyle = _this$props4.closeIconStyle
    return showComponent
      ? /*#__PURE__*/ React.createElement(
          reactNative.Animated.View,
          _extends(
            {
              style: [
                SwipeablePanelStyles.panel,
                {
                  width: deviceWidth,
                  height: panelHeight,
                },
                {
                  transform: this.state.pan.getTranslateTransform(),
                },
                style,
              ],
            },
            this._panResponder.panHandlers,
          ),
          !this.props.noBar &&
            /*#__PURE__*/ React.createElement(Bar, {
              barStyle: barStyle,
            }),
          this.props.showCloseButton &&
            /*#__PURE__*/ React.createElement(Close, {
              rootStyle: closeRootStyle,
              iconStyle: closeIconStyle,
              onPress: this.props.onClose,
            }),
          /*#__PURE__*/ React.createElement(
            reactNative.View,
            {
              contentContainerStyle:
                SwipeablePanelStyles.scrollViewContentContainerStyle,
            },
            this.props.children,
          ),
        )
      : null
  }

  return SwipeablePanel
})(React.Component)

const SwipeablePanelStyles = reactNative.StyleSheet.create({
  background: {
    position: "absolute",
    zIndex: 1,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  panel: {
    position: "absolute",
    height: PANEL_HEIGHT,
    width: FULL_WIDTH - 50,
    transform: [
      {
        translateY: FULL_HEIGHT - 100,
      },
    ],
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    zIndex: 2,
  },
  scrollViewContentContainerStyle: {
    width: "100%",
  },
})
const SMALL_PANEL_CONTENT_HEIGHT = PANEL_HEIGHT - (FULL_HEIGHT - 400) - 25
const LARGE_PANEL_CONTENT_HEIGHT = PANEL_HEIGHT - 25

exports.LARGE_PANEL_CONTENT_HEIGHT = LARGE_PANEL_CONTENT_HEIGHT
exports.SMALL_PANEL_CONTENT_HEIGHT = SMALL_PANEL_CONTENT_HEIGHT
exports.SwipeablePanel = SwipeablePanel
//# sourceMappingURL=index.js.map
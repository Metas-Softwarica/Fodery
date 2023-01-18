import { useRef } from 'react';
import { Animated } from 'react-native';

const getCloser = (value, checkOne, checkTwo) => {
  Math.abs(value - checkOne) < Math.abs(value - checkTwo) ? checkOne : checkTwo;
};

const useHeaderSnap = (headerHeight, ref, ratio = 2) => {
  const { diffClamp } = Animated;
  const scrollY = useRef(new Animated.Value(0));
  const scrollYClamped = diffClamp(scrollY.current, 0, headerHeight);
  const handleScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: { y: scrollY.current },
        },
      },
    ],
    {
      useNativeDriver: true,
    }
  );

  const translateY = scrollYClamped.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -(headerHeight / ratio)],
  });
  const translateYNumber = useRef();
  translateY.addListener(({ value }) => {
    translateYNumber.current = value;
  });

  const handleSnap = ({ nativeEvent }) => {
    const offsetY = nativeEvent.contentOffset.y;
    if (
      !(
        translateYNumber.current === 0 ||
        translateYNumber.current === -headerHeight / ratio
      )
    ) {
      if (ref.current) {
        ref.current.scrollToOffset({
          offset:
            getCloser(translateYNumber.current, -headerHeight / ratio, 0) ===
            -headerHeight / ratio
              ? offsetY + headerHeight / ratio
              : offsetY - headerHeight / ratio,
        });
      }
    }
  };

  return { handleScroll, handleSnap, translateY };
};

export default useHeaderSnap;

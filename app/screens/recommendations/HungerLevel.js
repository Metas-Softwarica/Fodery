import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import VerticalSlider from 'react-native-vertical-slider-component';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from '../../components/recommendations/Container';
import { fonts } from '../../configs/commonStyles';
import { constraints } from '../../configs/constants';
import {
  selectState,
  setCurrentScreen,
  setHungerLvl,
} from '../../store/slices/recommendationSlice';
import { themeState } from '../../store/slices/themeSlice';

export default function HungerLevel({ navigation }) {
  const hungerLvl = useSelector(selectState).hungerLvl;
  const dispatch = useDispatch();

  const colors = useSelector(themeState).colors;
  const [hungerLevel, setHungerLevel] = useState(1);

  const hungerLevelTypes = {
    1: 'Not Hungry',
    2: 'Not Full But Not That Hungry',
    3: 'Mid Hungry',
    4: 'Very Hungry',
    5: 'Starving',
  };

  useEffect(() => {
    dispatch(setCurrentScreen({ title: 'Quick Order', route: 'HungerLevel' }));
  }, []);

  function storeHungerLevel(level) {
    dispatch(setHungerLvl(level));
  }

  return (
    <Container
      continueButtonDisabled={!hungerLevel}
      onNext={() => navigation.push('Suggestion')}
      title="Set your hunger level."
      progress={5}
    >
      <View style={{ width: '100%', alignItems: 'center', marginTop: 60 }}>
        <SliderIndicator />
        <VerticalSlider
          value={hungerLevel}
          disabled={false}
          min={0}
          max={5}
          onChange={setHungerLevel}
          onComplete={storeHungerLevel}
          width={80}
          height={300}
          step={1}
          borderRadius={8}
          minimumTrackTintColor={colors.accentColor}
          maximumTrackTintColor={colors.cardColorSecondary}
          shadowProps={{ elevation: 10 }}
          showBackgroundShadow
        />
        <Text
          style={{
            ...fonts.regular,
            marginTop: constraints.screenPaddingHorizontal,
            color: colors.textColorPrimary,
          }}
        >
          {hungerLevelTypes[hungerLevel] || '...'}
        </Text>
      </View>
    </Container>
  );
}

export function SliderIndicator() {
  const colors = useSelector(themeState).colors;

  const textStyle = StyleSheet.create([
    {
      ...fonts.bold,
      color: colors.textColorPrimary,
      lineHeight: 60,
    },
  ]);
  return (
    <View
      style={{
        width: 80,
        height: 300,
        position: 'absolute',
        elevation: 11,
        // zIndex: (Platform.OS === "ios") ? 11: 0,
        justifyContent: 'space-evenly',
        alignItems: 'center',
      }}
    >
      <Text style={textStyle}>5</Text>
      <Text style={textStyle}>4</Text>
      <Text style={textStyle}>3</Text>
      <Text style={textStyle}>2</Text>
      <Text style={textStyle}>1</Text>
    </View>
  );
}

import MultiSlider from '@ptomasroos/react-native-multi-slider';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from '../../components/recommendations/Container';
import { fonts } from '../../configs/commonStyles';
import { constraints } from '../../configs/constants';
import { utilStyles } from '../../configs/utilStyles';
import {
  selectState,
  setBudget,
  setCurrentScreen,
} from '../../store/slices/recommendationSlice';
import { themeState } from '../../store/slices/themeSlice';

export default function BudgetRange({ navigation }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentScreen({ title: 'Quick Order', route: 'BudgetRange' }));
  }, []);

  return (
    <Container
      continueButtonDisabled={false}
      onNext={() => navigation.navigate('HungerLevel')}
      title="Set your budget."
      progress={4}
    >
      <RangeComponent />
    </Container>
  );
}

function RangeComponent() {
  const dispatch = useDispatch();
  const budget = useSelector(selectState).budget;
  const [values, setValues] = useState({
    from: budget.budgetMin,
    to: budget.budgetMax,
  });

  const colors = useSelector(themeState).colors;

  function onValuesChangeFinish(values) {
    dispatch(setBudget({ budgetMin: values[0], budgetMax: values[1] }));
  }

  return (
    <View
      style={{
        marginTop: constraints.screenPaddingHorizontal,
        ...utilStyles.centerXY,
      }}
    >
      <Text style={{ ...fonts.bold, color: colors.textColorPrimary }}>
        Rs. {values.from} - Rs. {values.to}
      </Text>
      <Text
        style={{
          ...fonts.regular,
          fontSize: constraints.textSizeLabel3,
          color: colors.textColorPrimary,
        }}
      >
        Current average: Rs. {(values.from + values.to) / 2}
      </Text>

      <MultiSlider
        containerStyle={{ marginTop: constraints.sectionGap }}
        markerContainerStyle={{ flex: 1, ...utilStyles.centerY }}
        markerStyle={{
          height: 24,
          width: 24,
          borderWidth: 3,
          borderRadius: 100,
          borderColor: colors.accentColor,
          backgroundColor: colors.backgroundColor,
        }}
        touchDimensions={{
          height: 200,
          width: 200,
          borderRadius: 99,
        }}
        trackStyle={{
          backgroundColor: colors.textColorSecondary,
          borderRadius: 99,
          height: 3,
          top: -1,
        }}
        selectedStyle={{ backgroundColor: colors.accentColor }}
        values={[values.from, values.to]}
        onValuesChange={(prices) =>
          setValues({ from: prices[0], to: prices[1] })
        }
        onValuesChangeFinish={onValuesChangeFinish}
        allowOverlap={false}
        min={0}
        max={30000}
        minMarkerOverlapDistance={5}
      />
    </View>
  );
}

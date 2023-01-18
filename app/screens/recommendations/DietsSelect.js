import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SelectItem } from '../../components/inputs/select/SelectItem';
import { Container } from '../../components/recommendations/Container';
import { useAxiosObject } from '../../contexts/axios-context';
import { getAllDiets } from '../../services/quickOrderService';
import {
  selectState,
  setCurrentScreen,
  setDiets,
  setSelectedDiet,
} from '../../store/slices/recommendationSlice';
import { themeState } from '../../store/slices/themeSlice';

const dietSchema = {
  id: 1,
  name: 'Vegan',
  description: 'Vegan',
};

export default function DietsSelect({ navigation }) {
  const selector = useSelector(selectState);
  const dispatch = useDispatch();
  const diets = selector.diets;

  const colors = useSelector(themeState).colors;
  const styles = getDietsCountStyles(colors);

  const axiosInstance = useAxiosObject();

  const asyncFunction = async () => {
    dispatch(setCurrentScreen({ title: 'Quick Order', route: 'DietsSelect' }));
    const diets = await getAllDiets(axiosInstance);
    dispatch(setDiets(diets));
  };

  useEffect(() => {
    asyncFunction();
  }, []);

  // useEffect(()=>{
  // }, [selector.selectedDiet]);

  return (
    <Container
      continueButtonDisabled={Object.keys(selector.selectedDiet).length < 1}
      onNext={() => navigation.push('FoodMultiType')}
      title="Pick diets."
      progress={2}
    >
      <View style={styles.controlsWrapper}>
        {Object.keys(diets).map((id) => {
          return (
            <SelectItem
              key={id}
              name={diets[id].name}
              isSelected={selector.selectedDiet.id === +id}
              onPress={() => {
                dispatch(setSelectedDiet(diets[id]));
              }}
            />
          );
        })}
      </View>
    </Container>
  );
}

function getDietsCountStyles(colors) {
  return StyleSheet.create({
    controlsWrapper: {
      width: '100%',
      borderBottomColor: colors.borderColor,
      borderBottomWidth: 1,
    },
  });
}

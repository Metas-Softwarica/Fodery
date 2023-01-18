import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SelectItem } from '../../components/inputs/select/SelectItem';
import { Container } from '../../components/recommendations/Container';
import { Gap } from '../../components/util/Gap';
import { fonts } from '../../configs/commonStyles';
import { constraints } from '../../configs/constants';
import { useAxiosObject } from '../../contexts/axios-context';
import { getAllFoodTypes } from '../../services/quickOrderService';
import {
  selectState,
  setCurrentScreen,
  setSelectedTypes,
} from '../../store/slices/recommendationSlice';
import { themeState } from '../../store/slices/themeSlice';

function CheckAllButton({ onSelectAll, onUnSelectAll, selectedTypes }) {
  const colors = useSelector(themeState).colors;

  return (
    <View
      style={{
        flexDirection: 'row',
      }}
    >
      <TouchableOpacity onPress={onSelectAll}>
        <Text style={{ ...fonts.regular, color: colors.textColorSecondary }}>
          Check All
        </Text>
      </TouchableOpacity>

      {selectedTypes.length > 0 && (
        <>
          <Gap x={constraints.sectionGap} />
          <TouchableOpacity onPress={onUnSelectAll}>
            <Text
              style={{ ...fonts.regular, color: colors.textColorSecondary }}
            >
              Uncheck All
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

export default function FoodMultiType({ navigation }) {
  const [types, setTypes] = useState([]);

  const selectedTypes = useSelector(selectState).selectedTypes;
  const dispatch = useDispatch();
  const axiosInstance = useAxiosObject();

  function isSelected(element) {
    return selectedTypes.find((e) => e.id === element.id);
  }

  function addToSelected(element) {
    if (!isSelected(element)) {
      dispatch(setSelectedTypes([...selectedTypes, element]));
    }
  }

  function removeFromSelected(element) {
    if (isSelected(element)) {
      let newTypes = selectedTypes.filter((e) => e.id !== element.id);
      dispatch(setSelectedTypes(newTypes));
    }
  }

  function toggleSelect(element) {
    if (isSelected(element)) {
      let newTypes = selectedTypes.filter((e) => e.id !== element.id);
      dispatch(setSelectedTypes(newTypes));
    } else {
      dispatch(setSelectedTypes([...selectedTypes, element]));
    }
  }

  function selectAll() {
    dispatch(setSelectedTypes(types));
  }

  function unselectAll() {
    dispatch(setSelectedTypes([]));
  }

  const asyncFunction = async () => {
    dispatch(
      setCurrentScreen({ title: 'Quick Order', route: 'FoodMultiType' })
    );

    let types = (await getAllFoodTypes(axiosInstance)) || [];
    setTypes(types);
  };

  useEffect(() => {
    asyncFunction();
  }, []);

  return (
    <Container
      continueButtonDisabled={selectedTypes.length === 0}
      onNext={() => navigation.push('BudgetRange')}
      title="Select food type"
      progress={3}
      leftTitleChild={
        <CheckAllButton
          onSelectAll={selectAll}
          selectedTypes={selectedTypes}
          onUnSelectAll={unselectAll}
        />
      }
    >
      <View style={{ width: '100%' }}>
        {types.map((type) => {
          return (
            <SelectItem
              key={type.id}
              name={type.name}
              showRightTick
              showRightArrow={false}
              isSelected={isSelected(type)}
              onPress={() => toggleSelect(type)}
            />
          );
        })}
      </View>
    </Container>
  );
}

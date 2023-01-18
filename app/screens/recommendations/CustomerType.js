import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SelectItem } from '../../components/inputs/select/SelectItem';
import { Container } from '../../components/recommendations/Container';
import { fonts } from '../../configs/commonStyles';
import { useAxiosObject } from '../../contexts/axios-context';
import { getAllPeopleGroupTypes } from '../../services/quickOrderService';
import {
  selectState,
  setCurrentScreen,
  setSelectedPeopleGroupType,
  setToInitial,
} from '../../store/slices/recommendationSlice';

export default function CustomerType({ navigation }) {
  const [types, setTypes] = useState([]);
  const selector = useSelector(selectState);
  const dispatch = useDispatch();

  const axiosInstance = useAxiosObject();

  const asyncFunction = async () => {
    dispatch(setToInitial());
    dispatch(setCurrentScreen({ title: 'Quick Order', route: 'CustomerType' }));

    const groupTypes = await getAllPeopleGroupTypes(axiosInstance);
    setTypes(groupTypes);
  };

  useEffect(() => {
    asyncFunction();
  }, []);

  function handleOnNext() {
    const peopleCount = selector.selectedPeopleGroupType.numberOfPeople;
    switch (peopleCount) {
      case 1:
        navigation.push('DietsSelect');
        return;
      case 2:
        navigation.push('DietsCount');
        return;
      case 100:
        navigation.push('DietsCount');
        return;
      default:
        navigation.push('DietsSelect');
    }
  }

  return (
    <Container
      continueButtonDisabled={
        selector.selectedPeopleGroupType.numberOfPeople === 0
      }
      onNext={handleOnNext}
      title="Who would you like to order for?"
      progress={1}
    >
      <View style={styles.buttonWrapper}>
        {types.map((type) => (
          <SelectItem
            key={type.id}
            name={type.name}
            isSelected={selector.selectedPeopleGroupType.id === type.id}
            onPress={() => {
              dispatch(setSelectedPeopleGroupType(type));
            }}
          />
        ))}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  text: {
    ...fonts.poppinsBold,
    fontSize: 18,
    paddingLeft: 20,
    width: 300,
    marginTop: 40,
  },
  buttonWrapper: {
    width: '100%',
  },
});

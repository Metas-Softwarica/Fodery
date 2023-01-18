import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from '../../components/recommendations/Container';
import { fonts } from '../../configs/commonStyles';
import { constraints } from '../../configs/constants';
import { useAxiosObject } from '../../contexts/axios-context';
import { getAllDiets } from '../../services/quickOrderService';
import {
  decrementDiet,
  incrementDiet,
  selectState,
  setCurrentScreen,
  setDiets,
} from '../../store/slices/recommendationSlice';
import { themeState } from '../../store/slices/themeSlice';

const dietSchema = {
  id: 1,
  name: 'Vegan',
  description: 'Vegan',
};

export default function DietsCount({ navigation }) {
  const selector = useSelector(selectState);
  const dispatch = useDispatch();
  const diets = selector.diets;

  const colors = useSelector(themeState).colors;
  const styles = getDietsCountStyles(colors);

  const axiosInstance = useAxiosObject();

  const asyncFunction = async () => {
    dispatch(setCurrentScreen({ title: 'Quick Order', route: 'DietsCount' }));

    const diets = await getAllDiets(axiosInstance);
    dispatch(setDiets(diets));
  };

  useEffect(() => {
    asyncFunction();
  }, []);

  function getTotalDietCount() {
    let array = Object.values(diets || {});
    if (array.length < 1) return 0;
    return array.reduce((prev, curr) => {
      return { ...curr, count: (prev.count || 0) + (curr.count || 0) };
    }).count;
  }

  const totalDietCount = getTotalDietCount();

  function addDiet(id) {
    if (getTotalDietCount() < selector.selectedPeopleGroupType.numberOfPeople)
      dispatch(incrementDiet(id));
  }

  return (
    <Container
      continueButtonDisabled={totalDietCount === 0}
      onNext={() => navigation.push('FoodMultiType')}
      title="Pick diets."
      progress={2}
    >
      <View style={styles.controlsWrapper}>
        {Object.keys(diets).map((id) => {
          return (
            <CountOptionItem
              key={id}
              title={diets[id].name}
              description={diets[id].description}
              count={diets[id].count || 0}
              onPressMinus={() => {
                dispatch(decrementDiet(id));
              }}
              onPressAdd={() => addDiet(id)}
            />
          );
        })}
      </View>
      <Text style={styles.total}>{`Total: ${totalDietCount}`}</Text>
      <Text
        style={styles.totalDescription}
      >{`Max: ${selector.selectedPeopleGroupType.numberOfPeople}`}</Text>
      <Text style={styles.totalDescription}>
        {selector.selectedPeopleGroupType.name}
      </Text>
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

    total: {
      marginTop: constraints.sectionGap,
      marginBottom: constraints.sectionGap / 2,
      ...fonts.bold,
      alignSelf: 'flex-end',
      fontSize: constraints.textSizeHeading4,
      color: colors.textColorPrimary,
    },
    totalDescription: {
      ...fonts.light,
      alignSelf: 'flex-end',
      fontSize: constraints.textSizeLabel2,
      color: colors.textColorSecondary,
    },
  });
}

function CountOptionItem({
  title,
  count,
  description,
  onPressAdd,
  onPressMinus,
}) {
  const colors = useSelector(themeState).colors;
  const styles = getCountOptionItemStyles(colors);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.countTitle}>{`${count} ${title}`}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={{ alignItems: 'center', flexDirection: 'row' }}>
        <TouchableOpacity style={styles.button} onPress={onPressMinus}>
          <Icon
            name="minus"
            fill={colors.backgroundColor}
            width={15}
            height={15}
          />
        </TouchableOpacity>
        <Text style={styles.count}>{`${count}`}</Text>
        <TouchableOpacity style={styles.button} onPress={onPressAdd}>
          <Icon
            name="plus"
            fill={colors.backgroundColor}
            width={15}
            height={15}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getCountOptionItemStyles(colors) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    countTitle: {
      ...fonts.regular,
      fontSize: constraints.textSizeHeading3,
      lineHeight: constraints.lineHeightHeading3,
      color: colors.textColorPrimary,
    },
    description: {
      ...fonts.light,
      fontSize: constraints.textSizeLabel2,
      color: colors.textColorPrimary,
    },

    button: {
      width: 25,
      height: 25,
      borderRadius: constraints.borderRadiusMin,
      backgroundColor: colors.textColorPrimary,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    count: {
      ...fonts.regular,
      marginHorizontal: constraints.sectionGap,
      fontSize: constraints.textSizeHeading3,
      color: colors.textColorPrimary,
      minWidth: constraints.textSizeHeading4 + 4,
      textAlign: 'center',
    },
  });
}

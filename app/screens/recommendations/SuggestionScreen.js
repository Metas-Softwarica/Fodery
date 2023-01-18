import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Swipeout from 'react-native-swipeout';
import { useDispatch, useSelector } from 'react-redux';
import ButtonRipple from '../../components/inputs/buttons/ButtonRipple';
import ScreenSpinner from '../../components/spinners/ScreenSpinner';
import { fonts } from '../../configs/commonStyles';
import { constants, constraints } from '../../configs/constants';
import { useAxiosObject } from '../../contexts/axios-context';
import {
  placeMassCart,
  requestSuggestions,
} from '../../services/quickOrderService';
import {
  addSuggestionCount,
  deleteItem,
  selectState,
  setCurrentScreen,
  setSuggestions,
  updateTotal,
} from '../../store/slices/recommendationSlice';
import { themeState } from '../../store/slices/themeSlice';
import { CartItem, SwipeBtnDelete } from '../CartScreen';

const suggestionItemSchema = [
  {
    item: {
      coverImage: 'media/cappuccino-national-cappuccino-day.gif',
      id: 4,
      newPrice: 170,
      title: 'Café Mocha',
    },
    itemId: 4,
    quantity: 11,
  },
];

export default function SuggestionScreen() {
  // TODO: change to suggestions Selector
  const selector = useSelector(selectState);
  const colors = useSelector(themeState).colors;
  const theme = useSelector(themeState).theme;
  const navigator = useNavigation();

  const [loading, setLoading] = useState(false);

  const {
    hungerLvl,
    selectedPeopleGroupType,
    selectedTypes,
    selectedDiet,
    diets,
    budget,
    suggestions,
    total,
  } = useSelector(selectState);

  const dispatch = useDispatch();
  const axiosInstance = useAxiosObject();

  const asyncFunction = async () => {
    // TODO: Change title but reset route
    dispatch(setCurrentScreen({ title: 'Suggestions', route: 'CustomerType' }));

    dispatch(setSuggestions([]));
    setLoading(true);

    let suggestions = (
      (await requestSuggestions(axiosInstance, getSuggestionsRequest())) || {
        data: [],
      }
    ).data;

    dispatch(setSuggestions(suggestions));
    dispatch(updateTotal());
    setLoading(false);
  };

  React.useEffect(() => {
    asyncFunction();
  }, []);

  function getSuggestionsRequest() {
    return {
      hungryLvl: hungerLvl,
      budgetMin: budget.budgetMin,
      budgetMax: budget.budgetMax,
      groupId: selectedPeopleGroupType.id,
      food_types: selectedTypes.map((item) => item.id),
      diets: getSelectedDiets(),
    };
  }

  function getSelectedDiets() {
    if (selectedPeopleGroupType.numberOfPeople === 1) {
      return [{ diet: selectedDiet.id, people: 1 }];
    }
    return Object.values(diets).map((item) => ({
      diet: item.id,
      people: item.count || 0,
    }));
  }

  // async function addToCart(suggesstions) {

  // }

  const addToCart = async (suggestions) => {
    let dataForMassCart = suggestions.map((ints) => ({
      item: ints.item.id,
      variant: ints.item.varientId,
      quantity: ints.quantity,
    }));

    // showMessage({
    //     message: "Items added to cart!!",
    //     type: "success"
    // })
    let response = await placeMassCart(axiosInstance, {
      products: dataForMassCart,
    });

    navigator.replace('Cart');
  };

  function deleteOneItem(itemId) {
    dispatch(deleteItem({ itemId }));
    dispatch(updateTotal());
  }

  function incrementItem(food, count) {
    dispatch(addSuggestionCount({ food, count }));
    dispatch(updateTotal());
  }

  function decrementItem(food, count, item) {
    if (item.quantity === 1) {
      return;
    }
    dispatch(addSuggestionCount({ food, count: -count }));
    dispatch(updateTotal());
  }

  return (
    <>
      <FlatList
        data={suggestions}
        renderItem={({ item }) => (
          <SuggestionRenderItem
            item={item}
            onDelete={() => deleteOneItem(item.itemId)}
            onIncrement={(food, count) => incrementItem(food, count)}
            onDecrement={(food, count) => decrementItem(food, count, item)}
          />
        )}
        keyExtractor={(item) => item.item.id}
        contentContainerStyle={{ flexGrow: 1 }}
      />
      <View style={{ backgroundColor: colors.backgroundColor }}>
        <ButtonRipple
          containerStyle={{
            borderRadius: 6,
            backgroundColor: colors.cardColor,
            marginVertical: 12,
            marginHorizontal: 20,
          }}
          style={{
            paddingVertical: 10,
            borderRadius: 6,
            backgroundColor:
              theme == 'dark' ? colors.accentColor : colors.black,
          }}
          textStyle={{
            ...fonts.extraBold,
            fontSize: 14,
            color: theme == 'dark' ? colors.black : colors.accentColor,
          }}
          title="ADD TO CART"
          children={
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text
                style={{
                  ...fonts.regular,
                  fontSize: constraints.textSizeHeading4,
                  color: theme == 'dark' ? colors.black : colors.accentColor,
                }}
              >
                Total : Rs. {total}
              </Text>
              <View
                style={{
                  width: 1.5,
                  backgroundColor: colors.black,
                  marginLeft: 18,
                  marginRight: 12,
                  marginVertical: 3,
                }}
              ></View>
            </View>
          }
          onPress={() => {
            addToCart(suggestions);
          }}
        />
      </View>
      {loading && <ScreenSpinner />}
      {!loading && suggestions.length === 0 && (
        <View
          style={{
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{ ...fonts.regular, fontSize: constraints.textSizeHeading4 }}
          >
            Sorry, we have no suggestions for you at the moment.
          </Text>
        </View>
      )}
    </>
  );
}

export function SuggestionRenderItem({
  item,
  onDelete,
  onIncrement,
  onDecrement,
}) {
  const colors = useSelector(themeState).colors;

  return (
    <Swipeout
      style={{
        borderRadius: 8,
        marginHorizontal: 16,
        marginTop: 6,
      }}
      backgroundColor={colors.accentColor2}
      left={[
        {
          component: <SwipeBtnDelete deleteCallback={onDelete} />,
        },
      ]}
      right={[
        {
          component: <SwipeBtnDelete deleteCallback={onDelete} />,
        },
      ]}
    >
      <CartItem
        isForSuggesstionItem={true}
        food={item.item}
        imageSource={constants.baseURL + item.item.coverImage}
        onIncrement={(food, count) => onIncrement(food, count)}
        onDecrement={(food, count) => onDecrement(food, count)}
        count={item.quantity}
      />
    </Swipeout>
  );
}

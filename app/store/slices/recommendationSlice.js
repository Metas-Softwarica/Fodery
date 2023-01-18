import { createSlice } from '@reduxjs/toolkit';
import { convertToObjectWithIdAsKey } from '../../helpers';

const initialState = {
  customerType: '',
  hungerLvl: 1,
  diets: {},
  selectedDiet: {},
  selectedTypes: [],
  selectedPeopleGroupType: { id: null, numberOfPeople: 0, name: '' },
  currentScreen: { route: 'CustomerType', title: 'Custom Order' },
  budget: { budgetMin: 0, budgetMax: 2000 },
  suggestions: [],
  total: 0,
};

const recommendationSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    setToInitial(state) {
      state.customerType = '';
      state.hungerLvl = 1;
      state.diets = {};
      state.selectedDiet = {};
      state.selectedTypes = [];
      state.selectedPeopleGroupType = { id: null, numberOfPeople: 0, name: '' };
      state.currentScreen = { route: 'CustomerType', title: 'Custom Order' };
      state.budget = { budgetMin: 0, budgetMax: 2000 };
      state.suggestions = [];
      state.total = 0;
    },
    setCustomerType(state, action) {
      state.customerType = action.payload;
    },
    setDiets(state, { payload }) {
      let diets = convertToObjectWithIdAsKey(payload);

      for (const dietsKey in diets) {
        state.diets[dietsKey] = {
          ...diets[dietsKey],
          ...state.diets[dietsKey],
        };
      }
    },
    incrementDiet(state, { payload }) {
      if (!state.diets[payload].count) state.diets[payload].count = 0;
      ++state.diets[payload].count;
    },
    decrementDiet(state, { payload }) {
      if (!state.diets[payload].count || state.diets[payload].count === 0)
        return;

      --state.diets[payload].count;
    },
    setSelectedDiet(state, { payload }) {
      state.selectedDiet = payload;
    },
    setSelectedTypes(state, { payload }) {
      state.selectedTypes = payload;
    },
    setSelectedPeopleGroupType(state, { payload }) {
      state.selectedPeopleGroupType = payload;
    },
    setCurrentScreen(state, { payload }) {
      state.currentScreen = payload;
    },
    setBudget(state, { payload }) {
      state.budget = payload;
    },
    setHungerLvl(state, { payload }) {
      state.hungerLvl = payload;
    },
    setSuggestions(state, { payload }) {
      state.suggestions = payload;
    },
    addSuggestionCount(state, { payload }) {
      const { food, count } = payload;
      state.suggestions = state.suggestions.map((item) => {
        if (item.item.id === food.id) {
          return { ...item, ...{ quantity: item.quantity + count } };
        }
        return item;
      });
    },
    updateTotal(state) {
      if (!!state.suggestions) {
        let xtotal = 0;
        state.suggestions.forEach((element) => {
          xtotal += element.quantity * element.item.newPrice;
        });
        // for (const key in state.suggestions) {
        //     console.log(key + " here");
        //     console.log(Number.isInteger(key) + " here");
        //     if (Number.isInteger(key)){
        //         const element = state.suggestions[key];
        //         // let extraPrice = 0;
        //         // element.extra.forEach(extra => {
        //         //     extraPrice += extra.price
        //         // });\

        //     }
        // }
        xtotal = xtotal.toFixed(2);
        state.total = xtotal;
      }
    },
    deleteItem(state, { payload }) {
      const { itemId } = payload;
      state.suggestions.splice(
        state.suggestions.indexOf(
          state.suggestions.find((x) => x.itemId === itemId)
        ),
        1
      );
    },
  },
});

export const {
  setCustomerType,
  incrementDiet,
  decrementDiet,
  setToInitial,
  setDiets,
  setSelectedDiet,
  setSelectedTypes,
  setSelectedPeopleGroupType,
  setCurrentScreen,
  setBudget,
  setHungerLvl,
  setSuggestions,
  updateTotal,
  addSuggestionCount,
  deleteItem,
} = recommendationSlice.actions;
export const selectState = (state) => state.recommendations;
export default recommendationSlice.reducer;

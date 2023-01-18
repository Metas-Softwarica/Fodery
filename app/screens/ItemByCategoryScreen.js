import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { useSelector } from 'react-redux';
import Actionbar from '../components/Actionbar';
import InsertToCart from '../components/InsertToCart';
import SearchView from '../components/SearchView';
import ItemCardForCollection from '../components/item/ItemCardForCollection';
import ItemCardList from '../components/item/ItemCardList';
import SearchFilterModal from '../components/modals/SearchFilterModal';
import ScreenSpinner from '../components/spinners/ScreenSpinner';
import { Gap } from '../components/util/Gap';
import { fonts } from '../configs/commonStyles';
import { constants, constraints } from '../configs/constants';
import { useAxiosObject } from '../contexts/axios-context';
import useHeaderSnap from '../hooks/useHeaderSnap';
import {
  getMoreSearchResult,
  getSearchResult,
} from '../services/searchService';
import { themeState } from '../store/slices/themeSlice';

export default function ItemByCategoryScreen({ route, navigation }) {
  const {
    title = 'Category',
    subTitle = 'Sweets',
    categoryId,
  } = route ? (route.params ? route.params : {}) : {};
  const [isLoading, setIsLoading] = useState(true);
  const [listType, setListType] = useState(2);
  const headerHeight = 120;
  const ref = useRef();
  const { handleScroll, handleSnap, translateY } = useHeaderSnap(
    headerHeight,
    ref,
    3
  );
  const [filterVisible, setFilterVisible] = useState(false);
  const axiosInstance = useAxiosObject();
  const { width, height } = useWindowDimensions();
  const bottomRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const initFilters = {
    keyword: null,
    filters: {
      categories: [],
      price_range: { from: 0, to: 100000.0 },
      rating: 0,
    },
    touched: false,
  };

  const [filters, setFilters] = useState(initFilters);
  const [foods, setFoods] = useState([]);
  const colors = useSelector(themeState).colors;
  const styles = getStyles(colors, headerHeight);
  const listNoOfColumns = listType === 1 ? 1 : 10;
  const [nextPageUrl, setNextPageUrl] = useState(null);

  useEffect(() => {
    if (filters.keyword !== null) onSearch();
  }, [filters.keyword]);

  useEffect(() => {
    registerModalTouched();
  }, [filterVisible]);

  useEffect(() => {
    let newFilter;
    // filters.keyword = ;

    if (!filters.touched) {
      newFilter = filters;
      if (!categoryId) {
        newFilter.filters.categories.push(categoryId);
      }
    } else {
      newFilter = filters;
      if (!categoryId) {
        newFilter.filters.categories.push(categoryId);
      }
    }
    setIsLoading(true);
    // const foodsRequest = (await getItemsInCategory(axiosInstance, categoryId))
    // const foods = foodsRequest.results || [];
    // setFoods(foods);
    // setIsLoading(false);
    // let next = null;

    // if (foodsRequest.next) {
    //     next = foodsRequest.next.replace(constants.baseURL, '');
    // }
    // setNextPageUrl(next);
    getSearchResult(axiosInstance, newFilter).then((r) => {
      setFoods(r.results || []);
      setIsLoading(false);
      let next = null;
      if (r.next) {
        next = r.next.replace(constants.baseURL, '');
      }
      setNextPageUrl(next);
    });
  }, [categoryId]);

  useEffect(() => {
    if (selectedItem) {
      bottomRef.current.present();
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      function () {
        if (selectedItem) {
          bottomRef.current.dismiss();
          return true;
        }
        return false;
      }
    );
    return () => backHandler.remove();
  }, [selectedItem]);

  function onSearch() {
    let newFilter;
    // filters.keyword = ;

    if (!filters.touched) {
      newFilter = { keyword: filters.keyword || '' };
    } else {
      newFilter = filters;
    }

    setIsLoading(true);

    getSearchResult(axiosInstance, newFilter).then((r) => {
      setFoods(r.results || []);
      setIsLoading(false);
      let next = null;
      if (r.next) {
        next = r.next.replace(constants.baseURL, '');
      }
      setNextPageUrl(next);
    });
  }
  function onLoadMore() {
    if (nextPageUrl == null) {
      return;
    }
    let newFilter;
    // filters.keyword = ;

    if (!filters.touched) {
      newFilter = { keyword: filters.keyword || '' };
    } else {
      newFilter = filters;
    }
    setIsLoading(true);
    getMoreSearchResult(axiosInstance, nextPageUrl, newFilter).then((r) => {
      setFoods((food) => [...food, ...(r.results || [])]);
      setIsLoading(false);
      let next = null;
      if (r.next) {
        next = r.next.replace(constants.baseURL, '');
      }
      setNextPageUrl(next);
    });
  }

  function onReset() {
    setFilters((filters) => {
      filters = { ...initFilters, keyword: filters.keyword, touched: true };
      return { ...filters };
    });
  }

  function registerModalTouched() {
    setFilters((filters) => {
      filters.touched = true;
      return { ...filters };
    });
  }

  function updateKeyword(keyword) {
    setFilters((filters) => {
      filters.keyword = keyword;

      return { ...filters };
    });
  }

  function cartPressHandler(item) {
    setSelectedItem(item);
  }

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior={'close'}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
        <Actionbar showBackBtn showChild navigation={navigation} showButton>
          <Text style={{ fontSize: 18, lineHeight: 21 }}>{title}</Text>
        </Actionbar>
        <SearchView
          style={{ marginTop: 0 }}
          textChangeHandler={(keyword) => updateKeyword(keyword)}
          text={filters.keyword}
          immediateFocus={route.params.isSearch ?? false}
        />

        <View style={styles.toggleWrapper}>
          <View style={styles.iconWrapper}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => setFilterVisible(true)}
            >
              <Text style={styles.filterLabel}>FILTERS</Text>
              <Icon
                name="funnel-outline"
                width={18}
                height={18}
                fill={colors.textColorSecondary}
              />
            </TouchableOpacity>

            <View style={{ flexDirection: 'row' }}>
              <Icon
                onPress={() => {
                  setListType(1);
                }}
                style={styles.icon}
                name={listType === 1 ? 'list' : 'list-outline'}
                fill={
                  listType === 1
                    ? colors.accentColor
                    : colors.textColorSecondary
                }
                width={24}
                height={24}
              />

              <Icon
                onPress={() => {
                  setListType(2);
                }}
                style={styles.icon}
                name={listType === 2 ? 'grid' : 'grid-outline'}
                fill={
                  listType === 2
                    ? colors.accentColor
                    : colors.textColorSecondary
                }
                width={24}
                height={24}
              />
            </View>
          </View>
        </View>
        <Text style={{ ...styles.text }}>{subTitle}</Text>
      </Animated.View>
      {foods.length > 0 ? (
        <Animated.FlatList
          ListFooterComponent={isLoading ? <ScreenSpinner /> : null}
          onEndReachedThreshold={0.1}
          onEndReached={() => {
            onLoadMore();
          }}
          data={foods}
          key={listType}
          style={styles.flatList}
          contentContainerStyle={styles.listContentContainer}
          columnWrapperStyle={
            listType !== 1
              ? {
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }
              : false
          }
          renderItem={({ item, index }) => {
            if (listType === 1) {
              return (
                <ItemCardList
                  isSearch={true}
                  item={item}
                  variant={!!item.allAttributes}
                  startingPrice={
                    item.allAttributes
                      ? item.variant.startingPrice
                      : item.newPrice
                  }
                  cartPressHandler={cartPressHandler}
                  cardStyle={{ marginBottom: 10 }}
                />
              );
            }
            return (
              <ItemCardForCollection
                isSearch={true}
                width={
                  width / 2 -
                  constraints.screenPaddingHorizontal -
                  constraints.sectionGap
                }
                aspectRatio={1}
                startingPrice={
                  item.allAttributes
                    ? item.variant.startingPrice
                    : item.newPrice
                }
                item={item}
                cartPressHandler={cartPressHandler}
                containerStyle={{ margin: constraints.sectionGap / 2 }}
              />
            );
          }}
          ItemSeparatorComponent={() => <Gap y={constraints.sectionGap} />}
          keyExtractor={(item) => item.id}
          scrollEventThrottle={16}
          onScroll={Platform.OS === 'android' ? handleScroll : null}
          // onMomentumScrollEnd={handleSnap}
          numColumns={listNoOfColumns}
          ref={ref}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ ...fonts.bold, color: colors.textColorSecondary }}>
            No Results.
          </Text>
        </View>
      )}

      <SearchFilterModal
        modalVisible={filterVisible}
        setModalVisible={setFilterVisible}
        setFilters={setFilters}
        filters={filters}
        onSubmit={() => onSearch()}
        onReset={() => onReset()}
        filterOptions={
          categoryId ? { showCategory: false, categoryId: categoryId } : {}
        }
      />

      <BottomSheetModal
        index={0}
        snapPoints={[400]}
        ref={bottomRef}
        backdropComponent={renderBackdrop}
        onDismiss={() => {
          setSelectedItem(null);
        }}
        backgroundStyle={{ backgroundColor: colors.backgroundColor }}
        handleStyle={{ color: colors.backgroundColor }}
        handleIndicatorStyle={{ backgroundColor: colors.textColorPrimary }}
      >
        <InsertToCart selectedItem={selectedItem} />
      </BottomSheetModal>
    </View>
  );
}

function getStyles(colors, headerHeight) {
  return StyleSheet.create({
    header: {
      position: 'absolute',
      left: 0,
      right: 0,
      width: '100%',
      zIndex: 1,
      backgroundColor: colors.backgroundColor,
    },
    toggleWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: constraints.screenPaddingHorizontal,
      backgroundColor: colors.backgroundColor,
    },
    filterLabel: {
      ...fonts.regular,
      fontSize: constraints.textSizeLabel2,
      color: colors.textColorSecondary,
    },
    text: {
      ...fonts.bold,
      fontSize: constraints.textSizeLabel2,
      paddingHorizontal: constraints.screenPaddingHorizontal,
      paddingTop: constraints.sectionGap,
      paddingBottom: constraints.sectionGap,
      color: colors.textColorPrimary,
    },
    iconWrapper: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: colors.backgroundColor,
    },
    icon: {
      marginLeft: 10,
    },
    flatList: {
      marginTop:
        constraints.screenPaddingHorizontal + 30 + constraints.sectionGap * 3,
    },
    listContentContainer: {
      paddingHorizontal: constraints.screenPaddingHorizontal,
      paddingTop: headerHeight + 25,
      paddingBottom: 20,
    },
  });
}

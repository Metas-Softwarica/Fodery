import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Image,
  RefreshControl,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SwipeablePanel } from 'rn-swipeable-panel';
import { constants, constraints } from '../../configs/constants';
import { useAxiosObject } from '../../contexts/axios-context';
import { getMoreUserFeed, getUserFeed } from '../../services/appService';
import {
  getFeaturedCategories,
  getHomeCategories,
} from '../../services/categoryService';
import { getOffers } from '../../services/itemService';
import {
  selectState,
  setToInitial,
} from '../../store/slices/recommendationSlice';
import { themeState } from '../../store/slices/themeSlice';
import Categories from '../Categories';
import Featured from '../Featured';
import InsertToCart from '../InsertToCart';
import ItemCardLarge from '../home/ItemCardLarge';
import ItemImage from '../home/ItemImage';
import ListCollection from '../home/ListCollection';
import ListVertical from '../home/ListVertical';
import { Gap } from '../util/Gap';
import Actionbar from './../Actionbar';
import ItemCardLargeMultiImage from './../home/ItemCardLargeMultiImage';
import ItemCardWithReview from './../home/ItemCardWithReview';
import ListCardHorizontal from './../home/ListCardHorizontal';

export default function Home() {
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const axiosInstance = useAxiosObject();
  const [feedLoading, setFeedLoading] = useState(false);
  const [feed, setFeed] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [offers, setOffers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const bottomRef = useRef(null);
  const colors = useSelector(themeState).colors;
  const theme = useSelector(themeState).theme;
  const [bottomSheetScroll, setBottomSheetScroll] = useState(false);
  const selector = useSelector(selectState);
  const dispatch = useDispatch();
  const [panelProps, setPanelProps] = useState({
    fullWidth: true,
    openLarge: false,
    showCloseButton: false,
    smallPanelHeight: 500,
    onClose: () => closePanel(),
    onPressCloseButton: () => closePanel(),
    // ...or any prop you want
  });
  const [isPanelActive, setIsPanelActive] = useState(false);

  const openPanel = () => {
    setIsPanelActive(true);
  };

  const closePanel = () => {
    setIsPanelActive(false);
    setSelectedItem(null);
  };

  async function loadFeaturedCategories() {
    let res = await getFeaturedCategories(axiosInstance);
    if (res) {
      setFeaturedCategories(res);
    }
    const _categories = (await getHomeCategories(axiosInstance)).results;
    if (_categories) {
      setCategories(_categories);
    }
  }

  async function loadFeed() {
    setFeedLoading(true);
    let res = await getUserFeed(axiosInstance);
    setFeedLoading(false);
    if (res) {
      setFeed(res.results);
      let next = null;
      if (res.next) {
        next = res.next.replace(constants.baseURL, '');
      }
      setNextPageUrl(next);
    }
  }
  async function loadMoreFeed() {
    if (nextPageUrl == null) {
      // showMessage({
      //     message: "End reached",
      //     type: "info",
      // })
      return;
    }
    setFeedLoading(true);
    let res = await getMoreUserFeed(axiosInstance, nextPageUrl);
    setFeedLoading(false);
    if (res) {
      setFeed((feed) => [...feed, ...res.results]);
      let next = null;
      if (res.next) {
        next = res.next.replace(constants.baseURL, '');
      }
      setNextPageUrl(next);
    }
  }
  async function loadOffers() {
    let res = (await getOffers(axiosInstance)).data;
    if (res) {
      setOffers(res);
    }
  }

  useEffect(() => {
    loadFeaturedCategories();
    loadOffers();
    loadFeed();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      // bottomRef.current.present();
      openPanel();
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      function () {
        if (selectedItem) {
          // bottomRef.current.dismiss();
          closePanel();
          return true;
        }
        return false;
      }
    );
    return () => backHandler.remove();
  }, [selectedItem]);

  const refreshHandler = async () => {
    true;
    await loadFeaturedCategories();
    await loadOffers();
    await loadFeed();
    dispatch(setToInitial());
    setRefreshing(false);
  };

  const cartPressHandler = (item) => {
    setSelectedItem(item);
  };

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
      <StatusBar
        translucent
        backgroundColor={colors.statusbarColor}
        style={theme == 'dark' ? 'light' : 'dark'}
      />
      <Actionbar showButton showSearchBtn greetUser showProfile>
        <Image
          source={require('../../../assets/logo.png')}
          style={{ width: 70, resizeMode: 'contain' }}
        />
      </Actionbar>
      <FlatList
        refreshing={feedLoading}
        onEndReachedThreshold={0.1}
        onEndReached={() => {
          loadMoreFeed();
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            progressViewOffset={80}
            onRefresh={refreshHandler}
            refreshing={refreshing}
          />
        }
        ListHeaderComponent={
          <View>
            <Gap y={constraints.screenPaddingHorizontal} />
            <Categories categories={categories} />
            <Featured offers={offers} />
          </View>
        }
        ListFooterComponent={
          feedLoading ? (
            <ActivityIndicator size={'small'} color={colors.accentColor} />
          ) : null
        }
        data={feed}
        renderItem={({ item }) => {
          return feedItemSelector(item, cartPressHandler, colors);
        }}
        keyExtractor={(item, index) => item + index}
      />

      <SwipeablePanel
        {...panelProps}
        isActive={isPanelActive}
        style={{ backgroundColor: colors.backgroundColor }}
      >
        <InsertToCart selectedItem={selectedItem} />
      </SwipeablePanel>
    </View>
  );
}

function feedItemSelector(item, cartPressHandler, colors) {
  switch (item.type) {
    case 'gallery':
      return (
        <ItemCardLargeMultiImage
          images={item.gallery}
          item={item.item}
          cartPressHandler={cartPressHandler}
        />
      );
    case 'featured':
      return (
        <ItemCardLarge
          cartPressHandler={cartPressHandler}
          item={item.item}
          coverImage={item.coverImage}
        />
      );
    case 'mayLike':
      console.log('here');
      if (item.items.length === 0) {
        return;
      }
      return (
        <ListVertical
          items={item.items}
          cartPressHandler={cartPressHandler}
          eachCardStyle={{ backgroundColor: colors.cardColorSecondary }}
        />
      );
    case 'favorite':
      if (item.length === 0) {
        return;
      }
      return (
        <ListCardHorizontal items={item} cartPressHandler={cartPressHandler} />
      );
    case 'reviews':
      return (
        <ItemCardWithReview
          item={item.item}
          cartPressHandler={cartPressHandler}
          reviews={item.reviews}
        />
      );
    case 'seasonal':
      return (
        <ListCollection
          title={item.collection.title}
          items={item.collection.foods}
          cartPressHandler={cartPressHandler}
        />
      );
    case 'offer':
      return <ItemImage image={item.coverImage} item={item.item} />;
  }
}

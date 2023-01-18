import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { ExpandingDot } from 'react-native-animated-pagination-dots';
import { useDispatch, useSelector } from 'react-redux';
import Actionbar from '../components/Actionbar';
import InsertToCart from '../components/InsertToCart';
import Reviews from '../components/Reviews';
import ListCollection from '../components/home/ListCollection';
import ListVertical from '../components/home/ListVertical';
import AddToCartButton from '../components/item/AddToCart';
import ItemDescription, {
  ItemDescriptionText,
} from '../components/item/ItemDescription';
import ItemOptionList from '../components/item/ItemOptionList';
import ReviewModal from '../components/modals/ReviewModal';
import ScreenSpinner from '../components/spinners/ScreenSpinner';
import { Gap } from '../components/util/Gap';
import { fonts } from '../configs/commonStyles';
import { constants } from '../configs/constants';
import { utilStyles } from '../configs/utilStyles';
import { useAxiosObject } from '../contexts/axios-context';
import { customShowMessage } from '../customMessage';
import { useVariant } from '../hooks/useVariant';
import {
  addCartItem,
  deleteMyReview,
  getAllReviews,
  getFavoriteStatus,
  getItemInfo,
  getMyReview,
  postReview,
  setFavoriteStatus,
  updateMyReview,
} from '../services/itemService';
import { updateCount } from '../store/slices/cartSlice';
import { themeState } from '../store/slices/themeSlice';

export default function Item({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const axiosInstance = useAxiosObject();
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const modalMode = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [bottomSheetScroll, setBottomSheetScroll] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const bottomRef = useRef(null);
  const colors = useSelector(themeState).colors;
  const [nextPageUrl, setNextPageUrl] = useState(null);

  const {
    itemInfo,
    setItemInfo,
    extraSum,
    priceLoading,
    variantInfo,
    createVariantPicker,
    pickExtraItem,
    pickVariantItem,
    extraOption,
    variantOption,
    checkVariantStatus,
    count,
    setCount,
  } = useVariant(dispatch, updateCount);

  async function getItemInfoInit() {
    let res = await getItemInfo(axiosInstance, route.params.slug);
    if (res) {
      res.gallery.unshift(res.coverImage);
      setItemInfo(res);
      createVariantPicker(res);
      if (res.variant) {
        let obj = res.variant.attribute;
        for (const key in obj) {
          const element = obj[key];
          pickVariantItem(key, element);
        }
      }
      return;
    }
    setError(true);
  }

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

  const getItemInfoData = async () => {
    setLoading(true);
    await getItemInfoInit();
    setLoading(false);
  };

  useEffect(() => {
    getItemInfoData();
  }, []);

  const getFavoriteStatusData = async () => {
    let res = await getFavoriteStatus(axiosInstance, {
      product: route.params.slug,
    });
    if (res) {
      setFavorite(res.isFavourite);
    }
  };

  useEffect(() => {
    getFavoriteStatusData();
  }, []);

  const getAllReviewsData = async () => {
    let reviews = await getAllReviews(axiosInstance, route.params.slug);
    if (reviews) {
      setReviews(reviews.results);
      let next = null;
      if (reviews.next) {
        console.log('next' + reviews.next);
        next = reviews.next.replace(constants.baseURL, '');
      }
      setNextPageUrl(next);
    }
  };

  useEffect(() => {
    getAllReviewsData();
  }, []);

  const getMyReviewData = async () => {
    let myReviewData = await getMyReview(axiosInstance, route.params.slug);
    if (myReviewData) {
      setMyReview(myReviewData);
    }
  };

  useEffect(() => {
    getMyReviewData();
  }, []);

  const cartHandler = (item) => {
    setSelectedItem(item);
  };

  const addtoCartHandler = async (item) => {
    if (itemInfo.allAttributes && !checkVariantStatus()) {
      customShowMessage('Please pick all the food options!!', 'danger', colors);
      return;
    }
    let obj = {
      item: itemInfo.id,
      quantity: count,
      extra: extraOption.map((item) => item.id),
    };
    if (itemInfo.allAttributes) {
      obj = { ...obj, variant: variantInfo.id };
    }
    let res = await addCartItem(axiosInstance, obj);
    if (res) {
      // showMessage({
      //     message: "Items added to cart!!",
      //     type: "success"
      // })
      dispatch(updateCount(count));
    }
  };

  const cartPressHandler = (item) => {
    setSelectedItem(item);
  };

  const favoriteHandler = async () => {
    let curr = favorite;
    setFavorite((prevState) => !prevState);
    let res = await setFavoriteStatus(axiosInstance, {
      product: route.params.slug,
    });
    if (res) {
      setFavorite(res.isFavourite);
      return;
    }
    customShowMessage('Error setting item as favorite!!', 'danger', colors);
    setFavorite(curr);
  };

  const updateReview = async () => {
    let payload = {
      rate: rating,
      description: reviewText,
    };
    let res = await updateMyReview(axiosInstance, myReview.id, payload);
    if (res) {
      setMyReview(res);
      customShowMessage('Review updated', 'success', colors);
      return;
    }
    customShowMessage(
      'Error updating your review. Try Again !!',
      'danger',
      colors
    );
  };

  const submitNewReview = async () => {
    let payload = {
      description: reviewText,
      rate: rating,
      food: route.params.slug,
    };
    let res = await postReview(axiosInstance, payload);
    if (res) {
      setMyReview(res);
      setRating(0);
      setReviewText('');
      customShowMessage('Review Added.', 'success', colors);
      return;
    }
    customShowMessage('Error adding review. Try again!!', 'danger', colors);
  };

  const deleteReview = async (item) => {
    let res = await deleteMyReview(axiosInstance, item);
    if (res) {
      setMyReview(null);
      setRating(0);
      setReviewText('');
      customShowMessage('Review deleted successfully.', 'success', colors);
      return;
    }
    customShowMessage('Error deleting review!!', 'danger', colors);
  };

  const submitReview = () => {
    if (modalMode.current === 'Edit') {
      updateReview();
    } else {
      submitNewReview();
    }
  };

  const refreshHandler = () => {
    setRefreshing(true);
    getItemInfoInit();
    setRefreshing(false);
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
    <View style={{ flex: 1, position: 'relative' }}>
      <Actionbar
        navigation={navigation}
        showBackBtn
        showButton
        title={itemInfo.title}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderHiddenOnScroll
        refreshControl={
          <RefreshControl
            progressViewOffset={80}
            onRefresh={refreshHandler}
            refreshing={refreshing}
          />
        }
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
      >
        {loading ? (
          <ScreenSpinner />
        ) : error ? (
          <Text style={{ ...fonts.regular }}>Error Loading</Text>
        ) : (
          <>
            <Gallery gallery={itemInfo.gallery} />
            <Gap y={24} />
            <ItemDescription
              avgRating={itemInfo.avgRating}
              category={itemInfo.category}
              title={itemInfo.title}
              reviewCount={itemInfo.reviewCount}
              categoryStyle={{ marginLeft: 10 }}
            />
            {itemInfo.offers && itemInfo.offers.length > 0 ? (
              <View style={{ margin: 10, flexDirection: 'row' }}>
                {itemInfo.offers.map((item) => {
                  return (
                    <View
                      style={{
                        marginHorizontal: 5,
                        borderRadius: 99,
                        borderColor: colors.accentColor,
                        borderWidth: 0.5,
                        backgroundColor: 'rgba(2,156,41,.6)',
                      }}
                    >
                      <Text
                        style={{
                          ...fonts.regular,
                          fontSize: 14,
                          marginHorizontal: 12,
                          marginVertical: 8,
                          color: 'white',
                        }}
                      >
                        {item.typeOfOffer == 'percentage'
                          ? item.value + '%'
                          : 'Rs.' + item.value}{' '}
                        off
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              <></>
            )}
            {itemInfo.description && itemInfo.description.length > 0 ? (
              <ItemDescriptionText description={itemInfo.description} />
            ) : (
              <></>
            )}

            {variantOption
              ? itemInfo.allAttributes.map((item) => {
                  return (
                    <ItemOptionList
                      mode="Variant"
                      onItemPick={pickVariantItem}
                      title={item.title}
                      data={item.items}
                      listKey={item.id}
                      variantOption={variantOption}
                    />
                  );
                })
              : null}

            {itemInfo.extra && (
              <ItemOptionList
                onItemPick={pickExtraItem}
                title="Toppins"
                extraOption={extraOption}
                data={itemInfo.extra}
                mode="Extra"
              />
            )}

            {itemInfo.nutritions && itemInfo.nutritions.length > 0 ? (
              <Nutrition nutritions={itemInfo.nutritions} />
            ) : (
              <></>
            )}

            <Gap y={18} />

            <Reviews
              myReview={myReview}
              setMyReview={setMyReview}
              reviews={reviews}
              setModal={setModal}
              modalMode={modalMode}
              setRating={setRating}
              setReviewText={setReviewText}
              deleteReview={deleteReview}
              navigation={navigation}
              nextReviewUrl={nextPageUrl}
            />

            {itemInfo.related_product && (
              <ListCollection
                title="Related Products"
                items={itemInfo.related_product}
                cartPressHandler={cartHandler}
              />
            )}

            {itemInfo && itemInfo.mayLike && itemInfo.mayLike.length > 0 && (
              <ListVertical
                items={itemInfo.mayLike}
                cartPressHandler={cartPressHandler}
              />
            )}
          </>
        )}
      </ScrollView>

      {!loading && !error && (
        <AddToCartButton
          cartHandler={addtoCartHandler}
          count={count}
          priceLoading={priceLoading}
          newPrice={!itemInfo.variant ? itemInfo.newPrice : 0}
          setCount={setCount}
          variantPrice={
            variantInfo
              ? variantInfo.price
              : itemInfo.variant && itemInfo.variant.startingPrice
          }
          extraSum={extraSum}
          favoriteHandler={favoriteHandler}
          favorite={favorite}
        />
      )}

      <ReviewModal
        modalVisible={modal}
        setModalVisible={setModal}
        onSubmit={submitReview}
        rating={rating}
        setRating={setRating}
        setText={setReviewText}
        text={reviewText}
        modalMode={modalMode.current}
      />

      <BottomSheetModal
        index={0}
        snapPoints={['60%', '96%']}
        ref={bottomRef}
        backdropComponent={renderBackdrop}
        onDismiss={() => {
          setSelectedItem(null);
        }}
        backgroundStyle={{ backgroundColor: colors.backgroundColor }}
        handleStyle={{ color: colors.backgroundColor }}
        handleIndicatorStyle={{ backgroundColor: colors.textColorPrimary }}
        onChange={(index) => {
          if (index === 1) {
            setBottomSheetScroll(true);
            return;
          }
          setBottomSheetScroll(false);
        }}
      >
        <InsertToCart
          selectedItem={selectedItem}
          scrollActive={bottomSheetScroll}
        />
      </BottomSheetModal>
    </View>
  );
}

function Gallery({ gallery = [{}] }) {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  const styles = StyleSheet.create({
    imgWrapper: {
      height: 320,
      width: width,
    },
    img: {
      width: '100%',
      height: '100%',
    },
  });

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.imgWrapper}>
        <Image
          style={styles.img}
          source={{
            uri: constants.baseURL + item,
          }}
        />
      </View>
    );
  };

  return (
    <>
      <FlatList
        data={gallery || []}
        renderItem={renderItem}
        pagingEnabled
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          }
        )}
        keyExtractor={(item) => item.id}
        horizontal
        decelerationRate={'normal'}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      />
      <View>
        <ExpandingDot
          data={gallery || []}
          expandingDotWidth={20}
          scrollX={scrollX}
          inActiveDotOpacity={0.6}
          dotStyle={{
            width: 8,
            height: 8,
            borderRadius: 5,
            marginHorizontal: 5,
          }}
          activeDotColor="white"
          inActiveDotColor="white"
        />
      </View>
    </>
  );
}

function Nutrition({ nutritions }) {
  const colors = useSelector(themeState).colors;
  return (
    <View
      style={{
        marginTop: 20,
      }}
    >
      <Text
        style={[
          fonts.poppinsBold,
          { color: colors.textColorPrimary, letterSpacing: 1, marginLeft: 20 },
        ]}
      >
        Nutrients
      </Text>

      <FlatList
        style={{ marginTop: 15 }}
        data={nutritions}
        contentContainerStyle={{ paddingLeft: 20 }}
        renderItem={({ item }) => (
          <>
            <NutrientsCard value={item.quantity} valueType={item.title} />
          </>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.title}
        overScrollMode="never"
      />
    </View>
  );
}

const NutrientsCard = ({ value, valueType }) => {
  const colors = useSelector(themeState).colors;
  const nutrientStyle = StyleSheet.create({
    view: {
      width: 60,
      height: 60,
      borderRadius: 5,
      backgroundColor: colors.cardColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 6,
    },
  });

  return (
    <View style={{ ...utilStyles.centerX, marginRight: 15 }}>
      <View style={nutrientStyle.view}>
        <Text
          style={{
            ...fonts.poppinsBold,
            marginTop: 6,
            fontSize: 12,
            color: colors.textColorPrimary,
          }}
        >
          {value}
        </Text>
        <Text
          style={{
            ...fonts.montserratRegular,
            fontSize: 12,
            fontWeight: 'bold',
            textAlign: 'center',
            color: colors.textColorPrimary,
          }}
        >
          {valueType}
        </Text>
      </View>
      <Text style={{ ...fonts.poppinsLight, fontSize: 12, lineHeight: 15 }}>
        {valueType}
      </Text>
    </View>
  );
};

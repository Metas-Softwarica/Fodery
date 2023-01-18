import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-eva-icons';
import Swipeout from 'react-native-swipeout';
import { useDispatch, useSelector } from 'react-redux';
import { SwipeablePanel } from 'rn-swipeable-panel';
import Actionbar from '../components/Actionbar';
import ButtonRipple from '../components/inputs/buttons/ButtonRipple';
import Input from '../components/inputs/text/Input';
import ScreenSpinner from '../components/spinners/ScreenSpinner';
import { fonts } from '../configs/commonStyles';
import { constants, constraints } from '../configs/constants';
import { useAxiosObject } from '../contexts/axios-context';
import { customShowMessage } from '../customMessage';
import {
  applyCoupon,
  calculateCheckoutAmt,
  deleteExtra,
  getCartItems,
  getSubTotalAmount,
  removeCartItem,
  updateItemQuantity,
} from '../services/cartService';
import {
  addToCart,
  cartState,
  decrementCart,
  deleteCartItem,
  loadCount,
  populateCart,
  removeExtras,
  updateCoupon,
} from '../store/slices/cartSlice';
import { themeState } from '../store/slices/themeSlice';

export default function CartScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const selector = useSelector(cartState);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const axiosInstance = useAxiosObject();
  const colors = useSelector(themeState).colors;
  const theme = useSelector(themeState).theme;
  const [isPanelActive, setIsPanelActive] = useState(false);

  const [panelProps, setPanelProps] = useState({
    fullWidth: true,
    openLarge: false,
    onlySmall: true,
    showCloseButton: true,
    noBar: false,
    closeRootStyle: {
      backgroundColor: colors.black,
      width: 26,
      height: 26,
    },
    closeIconStyle: {
      backgroundColor: colors.accentColor2,
      width: 12,
      height: 2,
    },
    smallPanelHeight: 400,
    onClose: () => setIsPanelActive(false),
    onPressCloseButton: () => setIsPanelActive(false),
    // ...or any prop you want
  });

  const initAsync = async () => {
    await init();
  };

  useEffect(() => {
    setLoading(true);
    // setIsPanelActive(true);
    initAsync();
    setLoading(false);
  }, []);

  async function init() {
    let res = await getCartItems(axiosInstance);
    if (res) {
      dispatch(populateCart(res.items));
      dispatch(loadCount(loadCartCount(res.items)));
    } else {
      customShowMessage('Error fetching cart items.', 'danger', colors);
      setError(true);
    }
  }

  function loadCartCount(items) {
    let totalCount = 0;
    items.forEach((element) => {
      totalCount += element.quantity;
    });
    return totalCount;
  }

  async function incrementCartItem(food, count) {
    dispatch(addToCart({ ...food, count }));
    let res = await updateItemQuantity(axiosInstance, {
      id: food.cart_id,
      quantity: food.quantity + count,
    });
    await init();
    if (!res) {
      dispatch(addToCart({ ...food, count: -1 * count }));
      customShowMessage(
        'Error updating item count. Try again!!',
        'danger',
        colors
      );
    }
  }

  async function decrementCartItem(food, count) {
    if (food.quantity === 1) {
      return;
    }
    dispatch(decrementCart({ ...food, count }));
    let res = await updateItemQuantity(axiosInstance, {
      id: food.cart_id,
      quantity: food.quantity - count,
    });
    await init();
    if (!res) {
      dispatch(addToCart({ ...food, count }));
      customShowMessage(
        'Error updating item count. Try again!!',
        'danger',
        colors
      );
    }
  }

  async function deleteOneCartItem(item) {
    dispatch(deleteCartItem(item));
    let res = await removeCartItem(axiosInstance, { id: item.cart_id });
    if (res) {
      customShowMessage('Cart item deleted', 'success', colors);
      return;
    }
    dispatch(addToCart({ ...item, count: item.quantity }));
    customShowMessage(
      'Error deleting cart item. Try again!!',
      'danger',
      colors
    );
  }

  function refreshHandler() {
    setRefreshing(true);
    init();
    setRefreshing(false);
  }

  return (
    <>
      <Actionbar showBackBtn showFavoriteBtn title="Cart" />
      <FlatList
        data={Object.values(selector.products)}
        renderItem={({ item }) => (
          <CartRenderItem
            item={item}
            onDelete={() => deleteOneCartItem(item)}
            onIncrement={(food, count) => incrementCartItem(food, count)}
            onDecrement={(food, count) => decrementCartItem(food, count)}
          />
        )}
        keyExtractor={(item) => item.cart_id}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            progressViewOffset={0}
            onRefresh={refreshHandler}
            refreshing={refreshing}
          />
        }
        ListFooterComponentStyle={{ marginTop: 'auto' }}
      />
      {/* <BottomSheet
            index={1}
            snapPoints={[180, 400]}
            backgroundStyle={{ backgroundColor: colors.cardColorSecondary, zIndex: 1 }}
            handleIndicatorStyle={{ backgroundColor: colors.textColorSecondary }}
        > */}
      <SwipeablePanel
        {...panelProps}
        isActive={isPanelActive}
        style={{ backgroundColor: colors.cardColorSecondary }}
      >
        <CheckoutDetails navigation={navigation} error={error} />
        <View style={{ alignItems: 'center' }}>
          <ButtonRipple
            title="CHECKOUT NOW"
            containerStyle={{
              width: '100%',
              borderRadius: 2,
              padding: 4,
              maxWidth: 400,
              paddingHorizontal: 16,
            }}
            style={{
              justifyContent: 'center',
              borderRadius: 6,
              paddingVertical: 12,
              backgroundColor:
                theme == 'light' ? colors.black : colors.accentColor,
            }}
            textStyle={{
              ...fonts.bold,
              fontSize: constraints.textSizeHeading4,
              color: colors.backgroundColor,
            }}
            disabled={selector.count === 0 || error}
            onPress={() => {
              navigation.navigate('Checkout');
            }}
          />
        </View>
      </SwipeablePanel>
      <View style={{ paddingVertical: 16, alignItems: 'center' }}>
        <ButtonRipple
          title="Proceed"
          containerStyle={{
            width: '100%',
            borderRadius: 2,
            padding: 4,
            maxWidth: 400,
            paddingHorizontal: 16,
          }}
          style={{
            justifyContent: 'center',
            borderRadius: 6,
            paddingVertical: 12,
            backgroundColor:
              theme == 'light' ? colors.black : colors.accentColor,
          }}
          textStyle={{
            ...fonts.bold,
            fontSize: constraints.textSizeHeading4,
            color: colors.backgroundColor,
          }}
          onPress={() => {
            setIsPanelActive(true);
          }}
        />
      </View>
      {/* </BottomSheet> */}

      {loading && <ScreenSpinner />}
    </>
  );
}

export function CartRenderItem({ item, onDelete, onIncrement, onDecrement }) {
  const colors = useSelector(themeState).colors;

  return (
    <Swipeout
      style={{
        borderRadius: 8,
        marginHorizontal: 16,
        marginTop: 6,
      }}
      backgroundColor={colors.cardColor}
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
        food={item}
        imageSource={constants.baseURL + item.coverImage}
        onIncrement={(food, count) => onIncrement(food, count)}
        onDecrement={(food, count) => onDecrement(food, count)}
        count={item.quantity}
      />
    </Swipeout>
  );
}

function CheckoutDetails({ navigation, error }) {
  const [amount, setAmount] = useState({
    subTotal: 0,
    shipping: 200,
  });
  const selector = useSelector(cartState);
  const colors = useSelector(themeState).colors;

  let coupon = selector.coupon;
  useEffect(() => {
    setAmount({ ...amount, subTotal: getSubTotalAmount(selector) });
  }, [selector.products]);

  return (
    <View
      style={{
        width: '100%',
        marginBottom: constraints.cardPadding,
        marginTop: constraints.screenPaddingHorizontal,
        // borderTopWidth: 1,
        borderTopColor: colors.borderColor,
        backgroundColor: colors.cardColorSecondary,
      }}
    >
      {/* <ApplyCouponField error={error} noItems={selector.count === 0} /> */}

      <View
        style={{
          paddingVertical: 2,
          paddingHorizontal: constraints.screenPaddingHorizontal,
          // borderTopWidth: 1,
          borderTopColor: colors.borderColor,
        }}
      >
        <CartInfoText keyText="Sub-total" value={`Rs. ${amount.subTotal}`} />
        <CartInfoText
          keyText="Discount"
          value={`Rs. ${calculateCheckoutAmt(amount, coupon).discountAmount}`}
        />
        {/* <CartInfoText keyText="Taxable Amount"
                value={`Rs. ${amount.subTotal - calculateCheckoutAmt(amount, coupon).discountAmount}`} /> */}
      </View>

      <View
        style={{
          marginTop: constraints.cardPadding,
          paddingVertical: constraints.cardPadding,
          paddingHorizontal: constraints.screenPaddingHorizontal,
          borderTopWidth: 1,
          borderTopColor: colors.borderColor,
        }}
      >
        {/* <CartInfoText keyText="Tax" value={`Rs. ${calculateCheckoutAmt(amount, coupon).taxAmt}`} /> */}
        <CartInfoText keyText="Shipping" value={`Rs. ${amount.shipping}`} />
      </View>

      <View
        style={{
          paddingVertical: constraints.sectionGap,
          paddingHorizontal: constraints.screenPaddingHorizontal,
          borderTopWidth: 1,
          borderTopColor: colors.borderColor,
        }}
      >
        <CartInfoText
          keyText="Grand Total"
          value={`Rs. ${
            selector.count > 0
              ? calculateCheckoutAmt(amount, coupon).grandTotal
              : 0
          }`}
        />
      </View>

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: colors.borderColor,
          marginBottom: 16,
        }}
      />
    </View>
  );
}

export function CartItem({
  food,
  imageSource,
  onIncrement,
  onDecrement,
  count,
  isForSuggesstionItem = false,
}) {
  const incrementInterval = useRef(null);
  const decrementInterval = useRef(null);
  const [longPressCount, setLongPressCount] = useState(0);
  const longPressRef = useRef(0);
  const navigation = useNavigation();
  const colors = useSelector(themeState).colors;

  function activateIncrementTimer() {
    incrementInterval.current = setInterval(() => {
      if (incrementInterval.current === null) {
        return;
      }
      setLongPressCount(++longPressRef.current);
    }, 100);
  }

  function deactivateIncrementTimer() {
    if (longPressRef.current === 0) {
      return;
    }
    clearInterval(incrementInterval.current);
    incrementInterval.current = null;
    onIncrement(food, longPressCount);
    setLongPressCount(0);
    longPressRef.current = 0;
  }

  function activateDecrementTimer() {
    decrementInterval.current = setInterval(() => {
      if (
        decrementInterval.current === null ||
        count + longPressRef.current < 2
      ) {
        return;
      }
      setLongPressCount(--longPressRef.current);
    }, 100);
  }

  function deactivateDecrementTimer() {
    if (longPressRef.current === 0) {
      return;
    }
    clearInterval(decrementInterval.current);
    decrementInterval.current = null;
    onDecrement(food, longPressCount * -1 || 1);
    setLongPressCount(0);
    longPressRef.current = 0;
  }

  const { title, category, newPrice, item_id, id } = food;
  console.log(newPrice);
  return (
    <View
      style={{
        backgroundColor: colors.cardColor,
        borderRadius: constraints.borderRadiusSmall,
      }}
    >
      <Pressable
        onPress={() => {
          item_id
            ? navigation.navigate('Item', {
                slug: item_id,
              })
            : navigation.navigate('Item', {
                slug: id,
              });
        }}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Image
          style={{
            height: 90,
            width: 90,
            margin: 8,
            borderRadius: constraints.borderRadiusMin,
          }}
          source={{ uri: imageSource }}
        />
        <View style={{ flex: 1, marginHorizontal: 8 }}>
          <Text
            style={{
              fontSize: constraints.textSizeHeading4,
              ...fonts.regular,
              color: colors.textColorPrimary,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 10,
              ...fonts.light,
              color: colors.textColorSecondary,
            }}
          >
            {category && category.toUpperCase()}
          </Text>
          <Text
            style={{
              fontSize: 10,
              ...fonts.light,
              color: colors.textColorPrimary,
            }}
          >
            {food.variant ? food.variant.title.join('/') : ''}
          </Text>
          <Text
            style={{
              fontSize: constraints.textSizeHeading4,
              ...fonts.regular,
              color: colors.textColorPrimary,
            }}
          >
            Rs. {isForSuggesstionItem ? newPrice * count : newPrice}
          </Text>
        </View>

        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 'auto',
            marginHorizontal: 12,
            marginBottom: 12,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: colors.cardColorSecondary,
              borderRadius: constraints.borderRadiusMin,
            }}
            onPress={() => onIncrement(food, 1)}
            onLongPress={activateIncrementTimer}
            onPressOut={deactivateIncrementTimer}
          >
            <Icon
              name="arrow-ios-upward"
              fill={colors.textColorPrimary}
              style={{ margin: 2 }}
              width={25}
              height={25}
            />
          </TouchableOpacity>

          <Text
            style={{
              marginVertical: 4,
              ...fonts.bold,
              fontSize: 12,
              color: colors.textColorPrimary,
            }}
          >
            {' '}
            {(count || food.quantity) + longPressCount}{' '}
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: colors.cardColorSecondary,
              borderRadius: constraints.borderRadiusMin,
            }}
            onLongPress={activateDecrementTimer}
            onPress={() => onDecrement(food, 1)}
            onPressOut={deactivateDecrementTimer}
          >
            <Icon
              name="arrow-ios-downward"
              fill={colors.textColorPrimary}
              style={{ margin: 2 }}
              width={25}
              height={25}
            />
          </TouchableOpacity>
        </View>
      </Pressable>
      {food.extra && food.extra.length > 0 && (
        <FlatList
          data={food.extra}
          style={{ marginBottom: 16 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <ItemPreview
                imageUrl={item.coverImage}
                extra_id={item.id}
                cart_id={food.cart_id}
              />
            );
          }}
          contentContainerStyle={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            paddingTop: 5,
          }}
          horizontal
          overScrollMode="never"
          showsHorizontalScrollIndicator={false}
          onStartShouldSetResponder={() => true}
        />
      )}
    </View>
  );
}

export function ItemPreview({ imageUrl, extra_id, cart_id, name = '' }) {
  const dispatch = useDispatch();
  const axiosInstance = useAxiosObject();
  const colors = useSelector(themeState).colors;

  async function deleteExtraItem(extra_id, cart_id) {
    let res = await deleteExtra(axiosInstance, {
      id: cart_id,
      extra: extra_id,
    });
    if (res) {
      dispatch(removeExtras({ cart_id, extra_id }));
    }
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          deleteExtraItem(extra_id, cart_id);
        }}
        style={{
          position: 'absolute',
          zIndex: 1,
          right: 0,
          top: -6,
        }}
      >
        <Icon
          name="close-circle"
          fill={colors.accentColor2}
          width={20}
          height={20}
        />
      </TouchableOpacity>
      <View
        style={{
          width: 55,
          height: 55,
          marginRight: constraints.sectionGap,
          marginTop: constraints.sectionGap,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Image
          style={{
            flexGrow: 1,
            resizeMode: 'cover',
            width: '100%',
            height: '100%',
          }}
          source={{ uri: constants.baseURL + imageUrl }}
        />
        <Text style={{ ...fonts.light, fontSize: constraints.textSizeLabel3 }}>
          {name}
        </Text>
      </View>
    </>
  );
}

function CartInfoText({ keyText, value, style = {}, keyStyle }) {
  const colors = useSelector(themeState).colors;
  const styles = StyleSheet.create({
    view: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    key: {
      ...fonts.regular,
      fontSize: 12,
      color: colors.textColorSecondary,
    },
    value: {
      ...fonts.regular,
      fontSize: constraints.textSizeHeading5,
      color: colors.textColorPrimary,
    },
  });
  return (
    <View style={[styles.view, style]}>
      <Text style={[styles.key, keyStyle]}>{keyText}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function ApplyCouponField({ error, noItems }) {
  const axiosInstance = useAxiosObject();
  const [couponText, setCouponText] = useState('');
  const dispatch = useDispatch();
  const colors = useSelector(themeState).colors;
  const theme = useSelector(themeState).theme;

  async function couponHandler() {
    let res = await applyCoupon(axiosInstance, { code: couponText });
    if (res) {
      dispatch(updateCoupon(res));
      customShowMessage('Coupon applied successfully.', 'success', colors);
      setCouponText('');
    } else {
      customShowMessage('Coupon invalid or expired!!', 'danger', colors);
    }
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: constraints.screenPaddingHorizontal,
        paddingVertical: constraints.sectionGap,
      }}
    >
      <Input
        containerStyle={{
          flex: 1,
          justifyContent: 'center',
          marginRight: constraints.sectionGap,
          marginBottom: 0,
        }}
        inputStyle={{
          backgroundColor: colors.cardColor,
          borderRadius: constraints.borderRadiusSmall,
          height: 40,
          paddingHorizontal: constraints.sectionGap,
          textAlignVertical: 'center',
        }}
        setText={setCouponText}
        text={couponText}
        placeholder={'Coupon'}
        placeholderTextColor={colors.textColorSecondary}
      />

      <ButtonRipple
        title="Apply"
        containerStyle={{ borderRadius: 4 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: 0,
          paddingHorizontal: constraints.screenPaddingHorizontal,
          borderRadius: 6,
          paddingVertical: 12,
          backgroundColor: theme == 'light' ? colors.black : colors.accentColor,
        }}
        textStyle={{
          ...fonts.bold,
          fontSize: constraints.textSizeHeading4,
          color: colors.backgroundColor,
          margin: 0,
        }}
        titleStyle={{ marginRight: 0 }}
        onPress={couponHandler}
        disabled={error || noItems || !couponText}
      />
    </View>
  );
}

export function SwipeBtnDelete({ deleteCallback = () => 1 }) {
  const colors = useSelector(themeState).colors;
  return (
    <TouchableHighlight
      underlayColor="#ff8367"
      onPress={deleteCallback}
      style={{
        flex: 1,
        backgroundColor: colors.accentColor2,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Icon name="trash-2-outline" fill="white" width={24} height={24} />
    </TouchableHighlight>
  );
}

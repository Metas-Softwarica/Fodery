export async function getCartItems(axiosInstance) {
  try {
    let res = await axiosInstance.get('order/getCart/');
    return res.data;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data, 'getCartItems');
    }
    return false;
  }
}

export function getSubTotalAmount(selector) {
  let total = 0;
  for (const key in selector.products) {
    const element = selector.products[key];
    let extraPrice = 0;
    element.extra.forEach((extra) => {
      extraPrice += extra.price;
    });
    // total += element.quantity * (+element.newPrice + (element.variant ? +element.variant.price : 0) + extraPrice);
    total += element.newPrice;
  }
  return total.toFixed(2);
}

export function calculateCheckoutAmt(amount, coupon) {
  let { shipping, subTotal } = amount;
  let discountAmount =
    coupon.unitType === 'percent'
      ? subTotal * (0.01 * coupon.discount)
      : coupon.discount;
  // let taxAmt = (subTotal - discountAmount) * 0.13;
  let grandTotal = subTotal - discountAmount;
  return {
    // taxAmt: taxAmt.toFixed(2),
    grandTotal: grandTotal.toFixed(2),
    discountAmount: discountAmount.toFixed(2),
  };
}

export async function addShippingAddress(axiosInstance, values) {
  let obj = {
    ...values,
    state: 1,
    country: 1,
    city: 1,
    user: 1,
  };
  try {
    let res = await axiosInstance.post('user/addAddress/', obj);
    return res.data.id;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function applyCoupon(axiosInstance, payload) {
  try {
    let res = await axiosInstance.post('settings/getCouponByCode/', payload);
    return res.data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function updateItemQuantity(axiosInstance, payload) {
  try {
    await axiosInstance.post('order/change_item_quantity/', payload);
    return true;
  } catch (error) {
    console.log(error, 'incrementItemQuantity');
    return false;
  }
}

export async function deleteExtra(axiosInstance, payload) {
  try {
    await axiosInstance.post('order/delete_extra/', payload);
    return true;
  } catch (error) {
    console.log(error, 'deleteExtra');
    return false;
  }
}

export function removeExtraItem(extras, removalId) {
  let newExtras = extras.filter((extra) => {
    return extra.id !== removalId;
  });
  return newExtras;
}

export async function removeCartItem(axiosInstance, payload) {
  try {
    await axiosInstance.post('/order/deleteCart/', payload);
    return true;
  } catch (error) {
    return false;
  }
}

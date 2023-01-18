export async function getItemInfo(axiosInstance, slug) {
  try {
    let res = await axiosInstance.get(`/product/get_food/${slug}/`);
    return res.data;
  } catch (error) {
    console.log(error, 'getItemInfo');
    return false;
  }
}

export async function getFavoriteStatus(axiosInstance, payload) {
  try {
    // console.log("here");
    let res = await axiosInstance.post('product/check_favorite/', payload);
    return res.data;
  } catch (error) {
    console.log(error, 'getFavoriteStatus');
    return false;
  }
}

export async function setFavoriteStatus(axiosInstance, payload) {
  try {
    let res = await axiosInstance.post('product/make_favorite/', payload);
    return res.data;
  } catch (error) {
    console.log(error, 'setFavoriteStatus');
    return false;
  }
}

export async function postReview(axiosInstance, payload) {
  try {
    let res = await axiosInstance.post('general/addReview/', payload);
    return res.data;
  } catch (error) {
    console.log(error, 'postReview');
    return false;
  }
}

export async function getAllReviews(axiosInstance, id) {
  try {
    let res = await axiosInstance.get(`general/get_review_food/${id}`);
    return res.data;
  } catch (error) {
    console.log(error, 'getAllReviews');
    return false;
  }
}
export async function getMoreAllReviews(axiosInstance, url) {
  try {
    let res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    console.log(error, 'getMoreAllReviews');
    return false;
  }
}
export async function getMyReview(axiosInstance, item) {
  try {
    let res = await axiosInstance.get(`general/getUpdateDeleteReview/${item}`);
    return res.data;
  } catch (error) {
    console.log(error, 'getMyReview');
    return false;
  }
}

export async function updateMyReview(axiosInstance, item, payload) {
  try {
    let res = await axiosInstance.post(
      `general/getUpdateDeleteReview/${item}/`,
      payload
    );
    return res.data;
  } catch (error) {
    console.log(error, 'updateMyReview');
    return false;
  }
}

export async function deleteMyReview(axiosInstance, item) {
  try {
    let res = await axiosInstance.delete(
      `general/getUpdateDeleteReview/${item}/`
    );
    return res.data;
  } catch (error) {
    console.log(error, 'deleteMyReview');
    return false;
  }
}

export async function getUserFavorites(axiosInstance) {
  try {
    let res = await axiosInstance.get('product/get_favorite/');
    return res.data.data;
  } catch (error) {
    console.log(error, 'getUserFavorites');
    return false;
  }
}

export async function getVariantInfo(axiosInstance, payload) {
  try {
    let res = await axiosInstance.post('product/get_variant/', payload);
    return res.data;
  } catch (error) {
    console.log(error, 'getVariantInfo');
    return false;
  }
}

export async function addCartItem(axiosInstance, payload) {
  try {
    let res = await axiosInstance.post('order/addCart/', payload);
    return res.data;
  } catch (error) {
    console.log(error, 'addCartItem');
    return false;
  }
}

export async function getOffers(axiosInstance, payload) {
  try {
    let res = await axiosInstance.get('product/get_offers', payload);
    return res.data;
  } catch (error) {
    console.log(error, 'getOffers');
    return false;
  }
}

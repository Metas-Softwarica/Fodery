export async function getFeaturedCategories(axiosInstance) {
  try {
    let result = await axiosInstance.get('/product/get_collection/');
    return result.data;
  } catch (error) {
    console.log(error, 'getFeaturedCategories');
    return false;
  }
}

export async function getCategories(axiosInstance) {
  try {
    let result = await axiosInstance.get('/product/category/');
    return result.data;
  } catch (error) {
    console.log(error, 'getCategories');
    return error;
  }
}

export async function getHomeCategories(axiosInstance) {
  try {
    let result = await axiosInstance.get('/product/featured_category/');
    return result.data;
  } catch (error) {
    console.log(error, 'getCategories');
    return error;
  }
}

export async function getItemsByFeatured(axiosInstance, slug) {
  try {
    let result = await axiosInstance.get(`/product/get_item_by_coll/${slug}/`);
    return result.data;
  } catch (error) {
    console.log(error, 'getItemsByFeatured');
    return error;
  }
}

export async function getItemsInCategory(axiosInstance, categoryId) {
  try {
    let result = await axiosInstance.get(
      `/product/get_item_by_cat/${categoryId}/`
    );
    return result.data;
  } catch (error) {
    console.log(error, 'getItemsInCategory');
    return error;
  }
}

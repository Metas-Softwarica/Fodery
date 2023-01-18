export async function getSearchResult(axiosInstance, filters) {
  try {
    let result = await axiosInstance.post('product/search_product', filters);
    return result.data;
  } catch (error) {
    return error;
  }
}
export async function getMoreSearchResult(axiosInstance, url, filters) {
  try {
    let result = await axiosInstance.post(url, filters);
    return result.data;
  } catch (error) {
    return error;
  }
}

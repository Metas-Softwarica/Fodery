export async function getFAQCategories(axiosInstance) {
  try {
    let res = await axiosInstance.get('/settings/getFAQCategory/');
    return res.data.results;
  } catch (error) {
    return false;
  }
}

export async function getFAQCategoryTopics(axiosInstance, id) {
  try {
    let res = await axiosInstance.get('/settings/getFAQCategory/' + id);
    return res.data;
  } catch (error) {
    return false;
  }
}

export async function getFAQ(axiosInstance, id) {
  try {
    let res = await axiosInstance.get('/settings/getFAQ/' + id);
    return res.data;
  } catch (error) {
    return false;
  }
}

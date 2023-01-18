export async function getAllDiets(axiosInstance) {
  try {
    let res = await axiosInstance.get('quickOrder/allDiets');

    return res.data;
  } catch (error) {
    console.log(error, 'all diets');
    return false;
  }
}

export async function getAllFoodTypes(axiosInstance) {
  try {
    let res = await axiosInstance.get('quickOrder/allFoodTypes');
    return res.data;
  } catch (error) {
    console.log(error, 'all food types');
    return false;
  }
}

export async function getAllPeopleGroupTypes(axiosInstance) {
  try {
    let res = await axiosInstance.get('quickOrder/allPeopleGroupType');
    return res.data;
  } catch (error) {
    console.log(error, 'all group types');
    return false;
  }
}

export async function requestSuggestions(axiosInstance, obj) {
  try {
    let res = await axiosInstance.post('quickOrder/items', obj);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error, 'Request Suggestions');
    return false;
  }
}

export async function placeMassCart(axiosInstance, obj) {
  try {
    let res = await axiosInstance.post('order/add_mass_cart/', obj);
    return res.data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

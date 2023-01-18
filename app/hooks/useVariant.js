import { useEffect, useState } from 'react';
import { useAxiosObject } from '../contexts/axios-context';
import { getVariantInfo } from '../services/itemService';

export function useVariant(dispatch, updateCount) {
  const [itemInfo, setItemInfo] = useState({});
  const [extraSum, setExtraSum] = useState(0);
  const [variantInfo, setVariantInfo] = useState(null);
  const [extraOption, setExtrasOption] = useState([]);
  const [variantOption, setVariantOption] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const axiosInstance = useAxiosObject();
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (!itemInfo.extra) {
      return;
    }
    let sum = 0;
    extraOption.forEach((item) => {
      sum += item.price;
    });
    setExtraSum(sum);
  }, [extraOption.length]);

  const asyncFunction = async () => {
    if (checkVariantStatus()) {
      setVariantInfo(null);
      setPriceLoading(true);
      let res = await getVariantInfo(axiosInstance, variantOption);
      setPriceLoading(false);
      if (res) {
        setVariantInfo(res);
      }
    }
  };

  useEffect(() => {
    asyncFunction();
  }, []);

  function checkVariantStatus() {
    let status = false;
    for (const key in variantOption) {
      status = !!variantOption[key];
    }
    return status;
  }

  const createVariantPicker = ({ allAttributes }) => {
    if (!allAttributes) {
      return;
    }
    let variantObj = {};

    allAttributes.forEach((item) => {
      variantObj[item.id] = item.items[0].id;
    });
    setVariantOption(variantObj);
  };

  const pickExtraItem = (item) => {
    let extraItem = extraOption.find((extra) => extra.id === item.id);
    if (extraItem) {
      const newArray = extraOption.filter((item) => item.id !== extraItem.id);
      setExtrasOption(newArray);
      return;
    }
    setExtrasOption((prev) => {
      let newArray = [...prev];
      newArray.push(item);
      return newArray;
    });
  };

  const pickVariantItem = (key, value) => {
    let obj = { ...variantOption };
    obj[key] = value;
    setVariantOption(obj);
  };

  return {
    setItemInfo,
    itemInfo,
    extraSum,
    variantInfo,
    priceLoading,
    createVariantPicker,
    pickExtraItem,
    pickVariantItem,
    extraOption,
    variantOption,
    checkVariantStatus,
    count,
    setCount,
  };
}

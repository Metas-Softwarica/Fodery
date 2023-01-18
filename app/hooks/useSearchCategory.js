import { useCallback, useEffect, useState } from 'react';
import { useAxiosObject } from '../contexts/axios-context';
import { getCategories } from '../services/categoryService';

export default function useSearchCategory() {
  const [text, setText] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const axiosInstance = useAxiosObject();
  const [refreshing, setRefreshing] = useState(false);
  const asyncFunction = async () => {
    const _categories = await getCategories(axiosInstance);
    setCategories(_categories);
    setFilteredList(_categories);
  };

  useEffect(() => {
    asyncFunction();
  }, []);

  async function refreshHandler() {
    setRefreshing(true);
    const _categories = await getCategories(axiosInstance);

    setCategories(_categories);
    setRefreshing(false);
  }

  const textChangeHandler = useCallback(
    (inputText) => {
      setText(inputText);
      if (!inputText) {
        setFilteredList(categories);
        return;
      }
      let filteredArray = categories.filter((item) =>
        item.title.toLowerCase().includes(inputText.toLowerCase())
      );
      setFilteredList(filteredArray);
    },
    [categories]
  );

  return { text, textChangeHandler, filteredList, refreshHandler, refreshing };
}

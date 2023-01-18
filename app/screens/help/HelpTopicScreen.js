import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import Actionbar from '../../components/Actionbar';
import { QA } from '../../components/help/QA';
import ScreenSpinner from '../../components/spinners/ScreenSpinner';
import { fonts } from '../../configs/commonStyles';
import { useAxiosObject } from '../../contexts/axios-context';
import { getFAQCategoryTopics } from '../../services/helpService';
import { themeState } from '../../store/slices/themeSlice';

export default function HelpTopicScreen({ navigation, route }) {
  const { id } = route.params;
  const [QAs, setQAs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const colors = useSelector(themeState).colors;
  const axiosInstance = useAxiosObject();

  const asyncFunction = async () => {
    setQAs((await getFAQCategoryTopics(axiosInstance, id)) || []);
    setLoading(false);
  };

  useEffect(() => {
    asyncFunction();
  }, []);

  function isFAQSelected(id) {
    return id === selectedFAQ;
  }

  return (
    <View style={{ flex: 1 }}>
      {loading && <ScreenSpinner />}
      <Actionbar showChild showBackBtn>
        <Text
          style={{
            ...fonts.regular,
            fontSize: 16,
            color: colors.textColorPrimary,
          }}
        >
          Account
        </Text>
      </Actionbar>

      <FlatList
        data={QAs}
        renderItem={({ item }) => {
          return (
            <QA
              question={item.question}
              answer={item.answer}
              expand={isFAQSelected(item.id)}
              onPress={() => {
                !isFAQSelected(item.id)
                  ? setSelectedFAQ(item.id)
                  : setSelectedFAQ(null);
              }}
            />
          );
        }}
        keyExtractor={(item) => item.id}
        overScrollMode="never"
      />
    </View>
  );
}

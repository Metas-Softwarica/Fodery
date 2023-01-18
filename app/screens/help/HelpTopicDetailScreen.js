import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Actionbar from '../../components/Actionbar';
import { QA } from '../../components/help/QA';
import ScreenSpinner from '../../components/spinners/ScreenSpinner';
import { fonts } from '../../configs/commonStyles';
import { useAxiosObject } from '../../contexts/axios-context';
import { getFAQ } from '../../services/helpService';

export default function HelpTopicDetailScreen({ route }) {
  const { id } = route.params;

  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);

  const axiosInstance = useAxiosObject();
  const asyncFunction = async () => {
    setDetails((await getFAQ(axiosInstance, id)) || {});
    setLoading(false);
  };

  useEffect(() => {
    asyncFunction();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {loading && <ScreenSpinner />}
      <Actionbar showChild showBackBtn>
        <Text style={{ ...fonts.poppinsBold, fontSize: 16 }}>Details</Text>
      </Actionbar>

      <View style={{ marginTop: 16 }}>
        <QA
          question={details.question}
          answer={details.answer}
          enableBackground={false}
        />
      </View>
    </View>
  );
}

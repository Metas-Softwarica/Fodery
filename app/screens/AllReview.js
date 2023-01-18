import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import Actionbar from '../components/Actionbar';
import { ReviewItem } from '../components/ReviewItem';
import { fonts } from '../configs/commonStyles';
import { utilStyles } from '../configs/utilStyles';
import { useAxiosObject } from '../contexts/axios-context';
import { getAboutDetails } from '../services/appService';
import { getMoreAllReviews } from '../services/itemService';
import { themeState } from '../store/slices/themeSlice';

export default function AllReview({ navigation, route }) {
  const [appInfo, setAppInfo] = useState(null);
  const axiosInstance = useAxiosObject();
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviews, setReviews] = useState(route.params.reviews);
  const [nextPageUrl, setNextPageUrl] = useState(route.params.next);
  const colors = useSelector(themeState).colors;

  const getAboutData = async () => {
    let res = await getAboutDetails(axiosInstance);
    if (res) {
      setAppInfo(res);
    }
  };

  useEffect(() => {
    getAboutData();
  }, []);

  async function loadMoreReview() {
    console.log('loading more...' + nextPageUrl);
    if (nextPageUrl == null) {
      // showMessage({
      //     message: "End reached",
      //     type: "info",
      // })
      return;
    }
    setReviewLoading(true);
    let res = await getMoreAllReviews(axiosInstance, nextPageUrl);
    setReviewLoading(false);
    if (res) {
      setReviews((reviews) => [...reviews, ...res.results]);
      let next = null;
      if (res.next) {
        next = res.next.replace(constants.baseURL, '');
      }
      setNextPageUrl(next);
    }
  }

  const styles = StyleSheet.create({
    logoBrandWrapper: {
      ...utilStyles.centerXY,
      paddingVertical: 100,
    },
    logoParentWrapper: {
      width: 130,
      alignItems: 'center',
    },
    logo: {
      width: 125,
      height: 40,
      resizeMode: 'contain',
      marginBottom: 3,
    },
    brandName: {
      ...fonts.extraBold,
      fontSize: 25,
      letterSpacing: 10,
      color: colors.textColorPrimary,
    },
    socialsWrapper: {
      marginTop: 30,
      ...utilStyles.centerXY,
    },
    socials: {
      marginTop: 15,
      flexDirection: 'row',
      width: 150,
      justifyContent: 'space-between',
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <Actionbar showBackBtn title="Reviews" />
      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <FlatList
          refreshing={reviewLoading}
          onEndReachedThreshold={0.1}
          onEndReached={() => {
            loadMoreReview();
          }}
          showsVerticalScrollIndicator={false}
          // refreshControl={<RefreshControl
          //     progressViewOffset={80}
          //     onRefresh={refreshHandler}
          //     refreshing={refreshing}
          // />}
          ListFooterComponent={
            reviewLoading ? (
              <ActivityIndicator size={'small'} color={colors.accentColor} />
            ) : null
          }
          data={reviews}
          renderItem={({ item }) => {
            return (
              <ReviewItem
                key={item.id}
                username={item.username}
                avatar={item.avatar}
                updated_at={item.updated_at}
                description={item.description}
                rate={item.rate}
              />
            );
          }}
          keyExtractor={(item, index) => item + index}
        />
      </View>

      {/* <ScrollView contentContainerStyle={{ paddingBottom: 0, paddingHorizontal: 20 }} 
                refreshing={reviewLoading}
                onEndReached={() => { loadMoreReview() }}
                overScrollMode="never" >
                    <>
                    {route.params.reviews.slice(0, 3).map(item => {
                            return <ReviewItem
                                key={item.id}
                                username={item.username}
                                avatar={item.avatar}
                                updated_at={item.updated_at}
                                description={item.description}
                                rate={item.rate}
                            />
                        })}
                        {reviewLoading ? <ActivityIndicator size={"small"} color={colors.accentColor} /> : null}
                </>
            </ScrollView> */}
    </View>
  );
}

function AboutItems({ borderTop, borderBottom, keyText, value, pressHandler }) {
  const colors = useSelector(themeState).colors;
  return (
    <TouchableOpacity
      onPress={pressHandler}
      style={{
        borderTopWidth: borderTop ? 1 : 0,
        borderTopColor: colors.cardColor,
        borderBottomWidth: borderBottom ? 1 : 0,
        borderBottomColor: colors.cardColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
      }}
    >
      <Text style={{ color: colors.textColorPrimary }}>{keyText}</Text>
      {value && <Text style={{ color: colors.cardColorRipple }}>{value}</Text>}
    </TouchableOpacity>
  );
}

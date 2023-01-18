import React from "react";
import { StyleSheet, View, Image, useWindowDimensions, Pressable } from 'react-native';
import { constants } from '../configs/constants';
import Slider from './FeaturedNew';
import { useNavigation } from "@react-navigation/native";

export default function Featured({offers}) {
    return (
        <View style={{ display: "flex" }}>
            <Slider dataList={[...offers]}/>
            {/* <FlatList
                data={offers}
                renderItem={(offer) => <FeaturedItem offer={offer.item}/>}
                keyExtractor={item => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
            /> */}
        </View>
    );
}

export function FeaturedItem({key, offer}) {
    const { width } = useWindowDimensions();
    const navigation = useNavigation();

    const styles = StyleSheet.create({
        imageItem: {
            height: width/2.27,
            width: width
        }
    });

    const offerPressHandler = () => {
        navigation.navigate('Item', {
            slug: offer.item
        })
    }

    return (
        <Pressable onPress={offerPressHandler}>
            <Image
                style={styles.imageItem}
                source={{
                    uri: constants.baseURL + offer.coverImage,
                }}
                // progressiveRenderingEnabled
            />
        </Pressable>
    );
}


import React, { useState } from "react";
import { FlatList, Image, StyleSheet, useWindowDimensions, View } from "react-native";
import { useSelector } from "react-redux";
import { themeState } from "../../store/slices/themeSlice";

import { homeCardStyle } from "../../configs/commonStyles";
import ItemDescriptionBarHeader from "./ItemDescriptionBarHeader";
import { constants, constraints } from "../../configs/constants";


export default function ItemCardLargeMultiImage({ images, item, cartPressHandler }) {

    const { width } = useWindowDimensions();

    const cardWidth = (width * .66) + constraints.cardPadding;
    const colors = useSelector(themeState).colors;
    return (
        <View style={homeCardStyle(colors)}>

            <ItemDescriptionBarHeader
                variant={!!item.allAttributes}
                item={item}
                startingPrice={item.allAttributes ? item.variant.startingPrice : item.newPrice}
                cartPressHandler={cartPressHandler}
            />

            <FlatList
                data={images}
                renderItem={({ item }) => <FoodImage url={constants.baseURL + item} />}
                style={{ flexGrow: 1, padding: constraints.cardPadding, paddingTop: 0 }}
                contentContainerStyle={{ paddingRight: constraints.cardPadding }}
                horizontal
                overScrollMode="never"
                showsHorizontalScrollIndicator={false}
                snapToAlignment={"center"}
                pagingEnabled
                keyExtractor={(item, index) => { return index }}
                snapToOffsets={images.map((item, index) => index * cardWidth)}
            />
        </View>
    );
}


function FoodImage({ url }) {
    const { width } = useWindowDimensions();
    return <Image
        source={{ uri: url }}
        style={{
            width: width * .66,
            height: 300,
            marginRight: constraints.cardPadding,
            borderRadius: constraints.borderRadiusMedium
        }}
    />
}


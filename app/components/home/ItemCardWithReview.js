import React from 'react';
import { fonts, homeCardStyle } from "../../configs/commonStyles";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { themeState } from "../../store/slices/themeSlice";
import ItemDescriptionBarHeader from "./ItemDescriptionBarHeader";
import { constants, constraints } from "../../configs/constants";
import { ReviewItem } from "../ReviewItem";

function ItemCardWithReview({ item, cartPressHandler, reviews }) {
    const colors = useSelector(themeState).colors;

    return (
        <View style={homeCardStyle(colors)}>
            <ItemDescriptionBarHeader
                variant={!!item.allAttributes}
                item={item}
                startingPrice={item.allAttributes ? item.variant.startingPrice : item.newPrice}
                cartPressHandler={cartPressHandler}
            />

            <View style={{ paddingHorizontal: constraints.cardPadding }}>
                <Image
                    source={{ uri: "https://www.cookclickndevour.com/wp-content/uploads/2016/11/whole-wheat-momos-recipe-2.jpg" }}
                    style={{
                        width: "100%",
                        height: 180,
                        borderRadius: constraints.borderRadiusMedium,
                    }}
                />
            </View>

            <FlatList
                data={reviews}
                renderItem={({ item }) => {
                    return <ReviewItem
                        description={item.description}
                        username={item.username}
                        updated_at={item.updated_at}
                        rate={item.rate}
                        avatar={item.avatar}
                    />
                }}

                pagingEnabled
                overScrollMode="never"
                horizontal
            />
        </View>
    );
}

export default ItemCardWithReview;
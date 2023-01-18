import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fonts } from "../../configs/commonStyles";
import { constants, constraints } from "../../configs/constants";
import { addToCart } from "../../store/slices/cartSlice";
import { themeState } from "../../store/slices/themeSlice";
import Icon from "../Icon";

export default function ItemCard({
    startingPrice, variant, item, cartPressHandler, width=false, imageHeight=150
}) {
    const navigation = useNavigation();
    const windowWidth = useWindowDimensions().width;
    const colors = useSelector(themeState).colors;
    const theme = useSelector(themeState).theme;

    const styles = getStyles(colors, imageHeight);

    const cartHandler = () => {
        cartPressHandler(item);
    }

    return <Pressable style={[styles.container, { width: width ? width : windowWidth * .66 }]} onPress={() => {
        navigation.navigate('Item', {
            slug: item.id
        })
    }}>
        <View>
            <Image style={styles.itemImg}
                source={
                    {
                        uri: constants.baseURL + item.coverImage
                    }
                }
                progressiveRenderingEnabled
            />
        </View>
        <View style={{ marginHorizontal: 5 }}>
            <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
            <View style={styles.buttonWrapper}>
                <Text style={styles.price}>
                    {variant ? `Starting from Rs. ${startingPrice}` : `Only at Rs. ${startingPrice}`}
                </Text>
                <TouchableOpacity onPress={cartHandler}>
                    {(theme == "dark") ? <Icon name="plus_dark_active" size={22} /> : <Icon name="add_to_cart_plus_grey_shade" size={22} />}
                </TouchableOpacity>
            </View>
        </View>
    </Pressable>
}

function getStyles(colors, imageHeight) {
    const theme = useSelector(themeState).theme;
    return StyleSheet.create({
        container: {
            display: "flex",
            overflow: "hidden",
        },
        itemImg: {
            width: "100%",
            height: imageHeight,
            marginBottom: 10,
            resizeMode: "cover",
            borderRadius: constraints.borderRadiusMedium,
        },
        title: {
            ...fonts.regular,
            color: colors.textColorPrimary
        },

        buttonWrapper: {
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row"
        },
        price: {
            fontSize: constraints.captionSecondaryFontSize,
            color: colors.priceColor,
            fontFamily: (theme == "dark") ? fonts.regular.fontFamily : fonts.black.fontFamily
        },
    });
}
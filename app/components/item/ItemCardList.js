import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, Pressable, Text, TouchableOpacity, View, StyleSheet, TouchableHighlight } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fonts } from "../../configs/commonStyles";
import { addToCart } from "../../store/slices/cartSlice";
import { themeState } from "../../store/slices/themeSlice";
import { constants, constraints } from "../../configs/constants";
import StarRating from "react-native-star-rating-widget";
import Icon from "../Icon";
import { convertToFixed } from "../../services/orderService";

export default function ItemCardList({ item, cartPressHandler, startingPrice, cartStyle = {}, icon=false, isSearch=false}) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const colors = useSelector(themeState).colors;
    const theme = useSelector(themeState).theme;

    const styles = getStyles(colors);

    const cartHandler = (e) => {
        e.stopPropagation();
        cartPressHandler(item)
    }

    if (!item) return <></>;

    return <TouchableHighlight
        onPress={() => navigation.navigate('Item', { slug: item.id })}
        underlayColor={colors.cardColorSecondary}
        style={styles.cardTouchable}
    >
        <View style={[styles.card, cartStyle]}>
            <Image
                style={ styles.image}
                source={{ uri: constants.baseURL + item.coverImage }}
            />
            <View style={{ flexGrow: 1, marginHorizontal: 8, width: "45%" }}>
                <Text numberOfLines={1} style={styles.category}>{(item.categoryName ?? item.category).toUpperCase()}</Text>
                <Text numberOfLines={1} style={styles.title}>{item.title}</Text>

                <View style={styles.priceStarWrapper}>
                    <StarRating
                        onChange={() => {
                        }}
                        rating={item.avgRating}
                        color={colors.accentColor2}
                        starSize={18}
                        enableHalfStar
                        maxStars={1}
                        starStyle={{ marginLeft: 0, marginRight: 0 }}
                    />
                    <Text style={styles.rating}> {item.avgRating} •  </Text>
                    <Text style={styles.price}>
                        {item.variant ? `Starting from Rs. ${convertToFixed(startingPrice)}` :
                            `Only at Rs. ${convertToFixed(startingPrice)}`}
                    </Text>
                </View>
            </View>

            <TouchableOpacity style={styles.plus} onPress={cartHandler}>
                {
                    (isSearch) ? ((theme == "dark") ? <Icon name="plus_dark_active" size={22} /> : <Icon name="add_to_cart_plus_grey_shade" size={22}/>):((theme == "dark") ? <Icon name="plus_dark_black_shade" size={22} /> : <Icon name="add_to_cart_plus_white_shade" size={22}/>)
                }
            </TouchableOpacity>
        </View>
    </TouchableHighlight>
}

function getStyles(colors) {
    return StyleSheet.create({
        cardTouchable: {
            borderRadius: constraints.borderRadiusSmall,
        },
        card: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: colors.cardColor,
            borderRadius: constraints.borderRadiusSmall,
            overflow: "hidden",
        },
        image: {
            height: 90,
            width: 90,
            marginRight: constraints.sectionGap,
            resizeMode: "cover"
        },
        title: {
            ...fonts.regular,
            color: colors.textColorPrimary,
            fontSize: constraints.textSizeHeading4
        },
        category: {
            ...fonts.regular,
            color: colors.textColorSecondary,
            fontSize: constraints.spanTextFontSize
        },
        priceStarWrapper: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: constraints.sectionGap
        },
        price: {
            fontSize: constraints.captionSecondaryFontSize,
            color: colors.priceColor,
            ...fonts.light
        },
        rating: {
            fontSize: constraints.captionSecondaryFontSize,
            color: colors.textColorSecondary,
            ...fonts.regular
        },
        plus: {
            alignSelf: "flex-start",
            margin: constraints.sectionGap,
            zIndex: 1,
            elevation: 1
        }

    });
}
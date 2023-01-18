import { useNavigation } from "@react-navigation/native";
import React from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { fonts } from "../../configs/commonStyles";
import { constants, constraints } from "../../configs/constants";
import { convertToFixed } from '../../services/orderService';
import { themeState } from "../../store/slices/themeSlice";
import Icon from "../Icon";

function ItemCardForCollection({ width = 150, aspectRatio = 1, containerStyle = {},
    isSearch=false,
    startingPrice, variant, item, cartPressHandler
}) {
    const navigation = useNavigation();
    const colors = useSelector(themeState).colors;
    const theme = useSelector(themeState).theme;
    const styles = getStyles(isSearch, colors, aspectRatio, width, containerStyle);

    const cartHandler = () => {
        cartPressHandler(item);
    }

    return <Pressable style={[styles.container]} onPress={() => {
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
        <View style={styles.descriptionBlock}>
            <Text numberOfLines={1} style={styles.title}>{item.title}</Text>

            <Text numberOfLines={1} style={styles.category}>{item.categoryName}</Text>

            <View style={styles.buttonWrapper}>
                <Text style={styles.price}>Rs. {convertToFixed(startingPrice)}
                    {/* {item.variant ? `Starting from Rs. ${convertToFixed(startingPrice)}` : 
                        `Only at Rs. ${convertToFixed(startingPrice)}`} */}
                </Text>
                <TouchableOpacity style={styles.plus} onPress={cartHandler}>
                    {(isSearch) ? ((theme == "dark") ? <Icon name="plus_dark_active" size={22} /> : <Icon name="add_to_cart_plus_grey_shade" size={22}/>):((theme == "dark") ? <Icon name="plus_dark_black_shade" size={22} /> : <Icon name="add_to_cart_plus_white_shade" size={22}/>)}
                </TouchableOpacity>
            </View>
        </View>
    </Pressable>
}

function getStyles(isSearch, colors, aspectRatio, width, containerStyle) {
    return StyleSheet.create({
        container: {
            display: "flex",
            overflow: "hidden",
            backgroundColor:(isSearch) ? colors.cardColor : colors.cardColorSecondary,
            borderRadius: constraints.borderRadiusMedium,
            width,
            ...containerStyle
        },
        itemImg: {
            width: width,
            height: width * aspectRatio,
            marginBottom: constraints.sectionGap,
            resizeMode: "cover",
            borderRadius: constraints.borderRadiusMedium,
        },
        descriptionBlock: {
            paddingHorizontal: constraints.cardPadding,
            paddingBottom: constraints.sectionGap
        },
        title: {
            ...fonts.bold,
            color: colors.textColorPrimary,
            fontSize: constraints.textSizeHeading4
        },
        category: {
            ...fonts.regular,
            color: colors.textColorSecondary,
            fontSize: constraints.spanTextFontSize

        },

        buttonWrapper: {
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
        },
        price: {
            fontSize: constraints.textSizeLabel3,
            color: colors.priceColor,
            ...fonts.regular,
            lineHeight: constraints.lineHeightHeading4
        },
        // plus: {
        //     backgroundColor: colors.backgroundColor,
        // }
    });
}

export default ItemCardForCollection;
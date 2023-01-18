import { Pressable, StyleSheet, Text, View } from "react-native";
import { Gap } from "../util/Gap";
import StarRating from "react-native-star-rating-widget";
import ButtonRipple from "../inputs/buttons/ButtonRipple";
import { constraints } from "../../configs/constants";
import { fonts } from "../../configs/commonStyles";
import CartButtonIcon from "../../../assets/icons/svgs/add_to_cart_button_icon.svg";
import CartButtonIconBlack from "../../../assets/icons/svgs/add_to_cart_black.svg";
import React from "react";
import { useSelector } from "react-redux";
import { themeState } from "../../store/slices/themeSlice";
import { useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";

export function ItemDescriptionBar({ startingPrice, variant, id, item, cartPressHandler }) {

    const colors = useSelector(themeState).colors;
    const theme = useSelector(themeState).theme;
    const navigation = useNavigation();

    return <Pressable
        onPress={() => {
            navigation.navigate("Item", {
                slug: item.id
            })
        }}
        style={{
            ...styles(colors).descriptionBlock,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
        }}>
        <View style={{ width: "60%" }}>
            <Text style={styles(colors).heading}>{item.title}</Text>
            <Gap y={4} />
            <Text style={styles(colors).label}>{item.category}</Text>

            <StarRating
                rating={item.avgRating}
                color={colors.accentColor2}
                starSize={18}
                enableHalfStar
                maxStars={5}
                starStyle={{ marginLeft: 0, marginRight: 0, marginTop: 4 }}
                onChange={() => 1}
            />
        </View>

        <View style={{ alignItems: "center", maxWidth: "40%", marginLeft: 6 }}>
            <ButtonRipple
                title="ADD TO CART"
                containerStyle={{ borderRadius: constraints.borderRadiusSmall, borderWidth: (theme == "dark") ? 0 : 1, borderColor: colors.addToCartBorderColor }}
                style={{
                    backgroundColor: colors.addToCartButtonColor,
                    borderRadius: constraints.borderRadiusSmall,
                    paddingHorizontal: constraints.buttonPaddingHorizontal,
                    paddingVertical: constraints.buttonPaddingVertical
                }}
                textStyle={{ ...fonts.regular, fontSize: constraints.spanTextFontSize, color: colors.addToCartTextColor }}
                onPress={() => {
                    cartPressHandler(item)
                }}
            >
                {(theme == "dark") ? <CartButtonIcon width={constraints.buttonIconSize} height={constraints.buttonIconSize} /> : <CartButtonIconBlack width={constraints.buttonIconSize} height={constraints.buttonIconSize} />}
            </ButtonRipple>

            <Gap y={4} />
            <Text style={{
                ...fonts.regular,
                color: colors.textColorSecondary,
                fontSize: constraints.spanTextFontSize
            }}>{variant ? `Starting from Rs. ${startingPrice}` : `Only at Rs. ${startingPrice}`}</Text>
        </View>

    </Pressable >;
}

export function styles(colors) {
    const theme = useSelector(themeState).theme;
    return StyleSheet.create({
        descriptionBlock: {
            padding: constraints.cardPadding,
        },
        heading: {
            color: colors.textColorPrimary,
            fontSize: constraints.textSizeHeading4,
            fontFamily: (theme == "dark" ? fonts.black.fontFamily : fonts.regular.fontFamily),
            maxWidth: "100%",
        },
        label: {
            color: colors.textColorSecondary,
            fontSize: constraints.spanTextFontSize, ...fonts.regular,
            textTransform: "uppercase"
        },
        category: {
            color: colors.textColorSecondary,
            fontSize: constraints.spanTextFontSize,
            ...fonts.regular,
            textTransform: "uppercase"
        }

    });
}
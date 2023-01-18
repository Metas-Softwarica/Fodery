import { useNavigation } from "@react-navigation/native";
import React from 'react';
import { Pressable, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { useSelector } from "react-redux";
import CartButtonIconBlack from "../../../assets/icons/svgs/add_to_cart_black.svg";
import CartButtonIcon from "../../../assets/icons/svgs/add_to_cart_button_icon.svg";
import { fonts } from "../../configs/commonStyles";
import { constraints } from "../../configs/constants";
import { themeState } from "../../store/slices/themeSlice";
import ButtonRipple from "../inputs/buttons/ButtonRipple";
import { Gap } from "../util/Gap";
import { styles } from "./ItemDescriptionBar";

function ItemDescriptionBarHeader({ startingPrice, variant, id, item, cartPressHandler }) {

    const colors = useSelector(themeState).colors;
    const theme = useSelector(themeState).theme;
    const navigation = useNavigation();

    return <View style={{
        ...styles(colors).descriptionBlock,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    }}>
        <Pressable onPress={() => {
            navigation.navigate("Item", {
                slug: item.id
            })
        }} style={{ width: "60%" }}>
            <Text style={styles(colors).category}>{item.category}</Text>
            <Gap y={4} />
            <Text style={{ ...styles(colors).heading, textTransform: "uppercase", ...fonts.bold }}>{item.title}</Text>
        </Pressable>


        {/* <View style={{ width: "60%" }}>
            <Text style={styles(colors).category}>{item.title}</Text>
            <Text style={{ ...styles(colors).heading, textTransform: "uppercase", ...fonts.black }}>{subtitle}</Text>
            <StarRating
                rating={rating}
                color={colors.accentColor2}
                starSize={16}
                enableHalfStar
                maxStars={5}
                starStyle={{ marginLeft: 0, marginRight: 0, marginTop: 4 }}
                onChange={() => 1}
            />
        </View> */}


        <View style={{ alignItems: "center", maxWidth: "40%", marginLeft: 6 }}>
            <ButtonRipple
                title="ADD TO CART"
                containerStyle={{
                    borderRadius: constraints.borderRadiusSmall,
                    borderWidth: (theme == "dark") ? 0 : 1,
                    borderColor: colors.addToCartBorderColor
                }}
                style={{
                    backgroundColor: colors.addToCartButtonColor,
                    borderRadius: constraints.borderRadiusSmall,
                    paddingHorizontal: constraints.buttonPaddingHorizontal,
                    paddingVertical: constraints.buttonPaddingVertical
                }}
                onPress={() => {
                    cartPressHandler(item)
                }}
                textStyle={{
                    ...fonts.regular,
                    fontSize: constraints.spanTextFontSize,
                    color: colors.addToCartTextColor
                }}>
                {(theme == "dark") ?
                    <CartButtonIcon width={constraints.buttonIconSize} height={constraints.buttonIconSize} /> :
                    <CartButtonIconBlack width={constraints.buttonIconSize} height={constraints.buttonIconSize} />}
            </ButtonRipple>
            <Gap y={4} />
            <Text style={{
                ...fonts.regular,
                color: colors.textColorSecondary,
                fontSize: constraints.spanTextFontSize
            }}>{variant ? `Starting from Rs. ${startingPrice}` : `Only at Rs. ${startingPrice}`}</Text>
        </View>
    </View>
}

export default ItemDescriptionBarHeader;
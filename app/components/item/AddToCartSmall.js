import React from "react";
import {
    Pressable, StyleSheet,
    Text, View
} from "react-native";
import { Icon } from 'react-native-eva-icons';
import { TouchableOpacity } from "react-native";
import { fonts } from "../../configs/commonStyles";
import { useSelector, useDispatch } from 'react-redux';
import { themeState } from "../../store/slices/themeSlice";
import CartButtonIcon from "../../../assets/icons/svgs/add_to_cart_button_icon.svg";
import CartButtonIconBlack from "../../../assets/icons/svgs/add_to_cart_black.svg";
import { constraints } from "../../configs/constants";
import { showMessage } from "react-native-flash-message";

export default function AddToCartSmallButton({
    count,
    setCount,
    newPrice = 0,
    cartHandler,
    extraSum,
    priceLoading,
    variantPrice = 0,
    favorite,
    favoriteHandler
}) {
    const colors = useSelector(themeState).colors;
    const theme = useSelector(themeState).theme;
    const styles = StyleSheet.create({
        cartFlex: {
            // position: "absolute",
            // backgroundColor: "black",
            // bottom: 25,
            // left: 20,
            // width: "100%",
            // display: "flex",
            marginLeft: 20,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row"
        },
        cartController: {
            // backgroundColor: "black",
            maxWidth: 340,
            borderRadius: 6,
            padding: 0,
            // height: 50,
            flexDirection: "column",
            // justifyContent: "space-between",
            alignItems: "flex-start",
            marginHorizontal: 0
        },
        controller_wrapper: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        },
        btnWrapper: {
            display: "flex",
            flexDirection: "row",
            width: 75,
            justifyContent: "space-between",
            alignItems: "center",
        },
        order_count: {
            color: colors.textColorPrimary,
            fontSize: 15,
            marginTop: -2,
            fontFamily: fonts.regular.fontFamily,
        },
        btn: {
            width: 21,
            height: 21,
            borderRadius: 3,
            backgroundColor: colors.cardColorRipple,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        },
        divider: {
            width: 1,
            height: "100%",
            backgroundColor: "white",
            marginLeft: 5,
            marginRight: 5
        },
        totalPrice: {
            fontSize: 10,
            color: colors.textColorPrimary,
            fontFamily: fonts.regular.fontFamily,
            marginHorizontal: 12
        },
        price_value: {
            color: colors.textColorPrimary,
            fontSize: 15,
            fontFamily: fonts.bold.fontFamily,
            marginHorizontal: 12

        },
        add_btn: {
            paddingLeft: 16,
            paddingRight: 16,
            // paddingTop: 5,
            // paddingBottom: 5,
            // marginTop: 8,
            height: 36,
            backgroundColor: colors.backgroundColor,
            borderColor: colors.priceColor,
            borderWidth: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 3,
            flexDirection: "row"
            // shadowColor: "#000",
            // shadowOffset: {
            //     width: 0,
            //     height: 2,
            // },
            // shadowOpacity: 0.23,
            // shadowRadius: 2.62,
            // elevation: 4,
        }
    })

    return <View style={styles.cartFlex}>
        <View style={styles.cartController}>
            <View style={styles.controller_wrapper}>
                <View style={styles.btnWrapper}>
                    <Pressable style={styles.btn} onPress={
                        () => {
                            if (count === 1) {
                                return
                            }
                            setCount(prevCount => --prevCount)
                        }}>
                        <Icon name="minus" fill="black" width={18} height={18} />
                    </Pressable>
                    <Text style={styles.order_count}>{count}</Text>
                    <Pressable style={styles.btn} onPress={
                        () => {
                            setCount(prevCount => ++prevCount)
                        }}>
                        <Icon name="plus" fill="black" width={18} height={18} />
                    </Pressable>
                </View>

                <View>
                    <Text style={styles.totalPrice}>Total Price</Text>
                    <Text
                        style={styles.price_value}>{priceLoading ? "Loading..." : `Rs ${(newPrice + extraSum + variantPrice) * count}`}</Text>
                </View>
            </View>
            <View style={{ flexDirection: "row", marginTop: 8 }}>
                <View>
                    <TouchableOpacity style={styles.add_btn} onPress={() => {
                        cartHandler()
                        // showMessage({
                        //     message: "Items added to cart!!!",
                        //     type: "success",
                        // })
                    }} disabled={priceLoading}>
                        {(theme == "dark") ? <CartButtonIcon width={constraints.buttonIconSize} height={constraints.buttonIconSize} /> : <CartButtonIconBlack width={constraints.buttonIconSize} height={constraints.buttonIconSize} />}
                        <Text style={{ color: colors.addToCartTextColor, ...fonts.medium, fontSize: 12, marginLeft: 5 }}>ADD TO CART</Text>
                    </TouchableOpacity>
                </View>
                <View style={{}}>
                    <TouchableOpacity style={{ height: 36, width: 36, justifyContent: "center", marginLeft: 8, alignItems: "center", backgroundColor: "#0f0f0f", borderRadius: 5 }} onPress={favoriteHandler}>
                        <Icon name="heart" fill={favorite ? colors.accentColor2 : "#bfbfbf"} width={24} height={24} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </View>
}
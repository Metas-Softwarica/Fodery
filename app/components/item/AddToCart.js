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
import { showMessage } from "react-native-flash-message";

export default function AddToCartButton({
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
            position: "absolute",
            bottom: 25,
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row"
        },
        cartController: {
            backgroundColor: "#2E323B",
            maxWidth: 340,
            borderRadius: 6,
            padding: 9,
            height: 50,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: 3
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
            color: "white",
            fontSize: 15,
            marginTop: -2,
            fontFamily: fonts.regular.fontFamily,
        },
        btn: {
            width: 21,
            height: 21,
            borderRadius: 3,
            backgroundColor: "white",
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
            color: "white",
            fontFamily: fonts.light.fontFamily,
            marginHorizontal: 12
        },
        price_value: {
            color: "white",
            fontSize: 15,
            fontFamily: fonts.bold.fontFamily,
            marginHorizontal: 12

        },
        add_btn: {
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 5,
            paddingBottom: 5,
            backgroundColor: colors.accentColor,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 3,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
            elevation: 4,
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
            <View>
                <TouchableOpacity style={styles.add_btn} onPress={() => {
                    cartHandler()
                    // showMessage({
                    //     message: "Items added to cart!!!",
                    //     type: "success",
                    // })
                }} disabled={priceLoading}>
                    <Text style={{ color: "#0f0f0f", ...fonts.black }}>ADD TO CART</Text>
                </TouchableOpacity>
            </View>
        </View>

        <TouchableOpacity style={[styles.cartController, { paddingVertical: 10 }]} onPress={favoriteHandler}>
            <Icon name="heart" fill={favorite ? colors.accentColor2 : "#bfbfbf"} width={32} height={32} />
        </TouchableOpacity>
    </View>
}
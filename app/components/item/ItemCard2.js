import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { Icon } from 'react-native-eva-icons';
import { useDispatch } from "react-redux";
import { colors } from "../../configs/colors";
import { fonts } from "../../configs/commonStyles";
import { constants } from "../../configs/constants";
import { addToCart } from "../../store/slices/cartSlice";

export default function ItemCard2({ title, categoryTitle, price, imgURL, slug, aspectRatio = 4 / 3, width = 130 }) {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const cartHandler = () => {
        let obj = {
            id: slug,
            title: title,
            coverImage: imgURL,
            category: categoryTitle,
            count: 1
        }
        dispatch(addToCart(obj));
    }

    return <TouchableHighlight
        underlayColor={colors.GreyShadeLight}
        style={[styles.container, { width }]}
        onPress={() => {
            navigation.navigate('Item', {
                slug
            })
        }}>
        <View>
            <View style={{ borderRadius: borderRadius, overflow: "hidden" }}>

                <Image style={[styles.itemImg, { width, height: width * aspectRatio }]}
                    source={
                        {
                            uri: constants.baseURL + imgURL
                        }
                    }
                    progressiveRenderingEnabled
                />

                <LinearGradient
                    // Background Linear Gradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}

                    locations={[.7, 1]}
                    style={[styles.itemImg, { position: "absolute", top: 0, height: width * aspectRatio, width: width }]}
                />

                <View style={{
                    position: "absolute",
                    justifyContent: "center",
                    top: 12,
                    right: 0,
                    backgroundColor: "tomato",
                    borderTopStartRadius: 99,
                    borderBottomStartRadius: 99,
                    paddingStart: 8,
                    paddingEnd: 10,
                }}>
                    <Text style={styles.price}>{"Rs. " + (price || "--")}</Text>
                </View>

                <View style={
                    {
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingHorizontal: 16,
                        position: "absolute",
                        bottom: 8,
                        width: "100%"
                    }}>

                    <TouchableOpacity style={styles.addToCartBtn} onPress={cartHandler} disabled>
                        <Icon name="shopping-cart" fill="white" width={24} height={24} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.addToCartBtn} onPress={() => { }}>
                        <Icon name="heart" fill="white" width={24} height={24} />
                    </TouchableOpacity>
                </View>

            </View>
            <View style={styles.textWrapper}>
                <Text numberOfLines={1} style={[fonts.poppinsBold, { fontSize: 13 }]}>{title}</Text>
                <Text style={[styles.item, fonts.poppinsLight]}>{categoryTitle}</Text>


            </View>
        </View>
    </TouchableHighlight>
}

const borderRadius = 6;
export const styles = StyleSheet.create({
    container: {
        margin: 4,
        overflow: "hidden",
        borderRadius: borderRadius
    },
    itemImg: {
        // marginBottom: 10,
        resizeMode: "cover",
        borderRadius: borderRadius,
    },
    textWrapper: {
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    item: {
        color: colors.GreyRegular,
        fontSize: 12
    },
    price: {
        // color: colors.primary,
        color: "white",
        fontSize: 12,
        ...fonts.poppinsRegular,
        justifyContent: "center",
        marginTop: 2

    },
    addToCartBtn: {
        width: 28,
        height: 28,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.23,
        // shadowRadius: 2.62,
        // elevation: 6,
    },
})
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { fonts } from "../../configs/commonStyles";
import { Icon } from "react-native-eva-icons";
import ButtonRipple from "../inputs/buttons/ButtonRipple";
import React, {useState, useEffect} from "react";
import { Gap } from "../util/Gap";
import { convertToFixed } from "../../services/orderService";
import { OrderItem, orderStatus } from "../SharedOrderList";
import { constraints } from "../../configs/constants";
import { useSelector } from "react-redux";
import {useAxiosObject} from "../../contexts/axios-context";
import { themeState } from "../../store/slices/themeSlice";
import {deleteUserAddress, getUserAddresses} from "../../services/userService";



export function CompletionTab({ checkoutInfo }) {
    const colors = useSelector(themeState).colors;
    const theme = useSelector(themeState).theme;
    const [addresses, setAddresses] = useState([]);
    const { data, billNo, orderId } = checkoutInfo;
    const axiosInstance = useAxiosObject();
    const navigation = useNavigation();

    const getUserData = async()=>{
        let result = await getUserAddresses(axiosInstance) || [];
        setAddresses(result);

    }

    useEffect(() => {
        getUserData();
    }, []);
    const styles = StyleSheet.create({
        view: {},
        thanks: {
            paddingHorizontal: 20,
            paddingVertical: 10,
            flexDirection: "row",
            alignItems: "center",
            borderColor: colors.cardColorRipple,
            borderRadius: 10,
            borderWidth: 0.5,
            marginBottom: 18,
            marginHorizontal: constraints.screenPaddingHorizontal,
            marginTop: constraints.sectionGap * 2
        },
        thanksTextWrapper: {
            marginLeft: 20
        },
        thankU: {
            ...fonts.bold,
            fontSize: 15,
            color: colors.textColorPrimary
        },
        orderDetailsWrapper: {
            marginBottom: 18
        },
        headings: {
            ...fonts.poppinsBold,
            fontSize: 15,
            marginVertical: 6
        }
    })

    const buttonStyle = {
        borderRadius: constraints.borderRadiusMin,
        backgroundColor: colors.textColorPrimary,
        paddingHorizontal: constraints.screenPaddingHorizontal,
        paddingVertical: constraints.buttonPaddingVertical
    }


    function ProductInfoText({ keyText, value, style = {}, keyStyle }) {
        const styles = StyleSheet.create({
            view: {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            },
            key: {
                ...fonts.poppinsLight,
                color: colors.textColor
            }
        })
        return <View style={[styles.view, style]}>
            <Text style={[styles.key, keyStyle]}>{keyText}</Text>
            <Text numberOfLines={1} elipsis style={{ ...fonts.poppinsRegular, color: colors.textColor, maxWidth: 210 }}>{value}</Text>
        </View>
    }

    return <View style={{ flex: 1, }}>
        <View style={styles.thanks}>
            <Icon name="checkmark-circle-outline" fill={(theme == "light")? colors.black: colors.accentColor} width={50} height={50} />
            <View style={styles.thanksTextWrapper}>
                <Text style={styles.thankU}>THANK YOU!</Text>
                <Text style={{ ...fonts.poppinsRegular, color: colors.textColorSecondary }}>Your order has been received.</Text>
            </View>
        </View>
        <OrderItem
            address={data.address}
            couponAmount={data.couponAmount}
            createdAt={new Date(data.createdAt).toLocaleDateString()}
            discountAmount={data.discountAmount}
            grandAmount={data.grandAmount}
            items={data.items.map(item => item.coverImage_url)}
            onOrderClick={() => navigation.navigate("OrderInfo", {
                order_number: orderId,
                id: orderId
            })}
            order_number={data.order_number}
            status={orderStatus.pending}
            key={1}
        />



        <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: constraints.sectionGap * 3, paddingHorizontal: constraints.screenPaddingHorizontal }}>
            <ButtonRipple title="SHOW RECEIPT"
                containerStyle={{ borderRadius: constraints.borderRadiusMin, marginHorizontal: 4, flex: 1 }}
                style={buttonStyle}
                textStyle={{ ...fonts.bold, fontSize: 14, color: colors.backgroundColor }}
                onPress={() => {
                    navigation.navigate("OrderReceipt", {"id": orderId});
                }}
            />
            {/* <ButtonRipple title="ORDER AGAIN"
                rippleColor={colors.back}
                containerStyle={{ borderRadius: 4, marginHorizontal: 4, flex: 1, overflow: "hidden" }}
                style={{
                    ...buttonStyle,
                    backgroundColor: colors.backgroundColor,
                    borderColor: colors.textColorPrimary,
                    borderWidth: 2,
                    paddingVertical: constraints.buttonPaddingVertical - 2
                }}
                textStyle={{
                    ...fonts.bold,
                    fontSize: constraints.textSizeLabel2,
                    color: colors.textColorPrimary
                }}
            /> */}
        </View>
    </View>
}
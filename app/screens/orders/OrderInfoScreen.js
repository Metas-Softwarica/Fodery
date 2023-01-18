import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import Actionbar from "../../components/Actionbar";
import ButtonRipple from "../../components/inputs/buttons/ButtonRipple";
import ScreenSpinner from '../../components/spinners/ScreenSpinner';
import { colors } from "../../configs/colors";
import { fonts } from "../../configs/commonStyles";
import { constants, constraints } from "../../configs/constants";
import { useAxiosObject } from '../../contexts/axios-context';
import { customShowMessage } from "../../customMessage";
import { convertToFixed, getOrderDetail } from "../../services/orderService";
import { themeState } from "../../store/slices/themeSlice";


const headingStyle = StyleSheet.create([{
    ...fonts.regular, fontSize: 16, marginBottom: 8
}]);

export default function OrderInfoScreen({ navigation, route }) {
    const [loading, setLoading] = useState(false);
    const [orderDetails, setOrderDetails] = useState({});
    const axiosInstance = useAxiosObject();

    const asyncFunction = async()=>{
        setLoading(true);
        let res = await getOrderDetail(axiosInstance, route.params.id)
        setLoading(false)
        if (res) {
            setOrderDetails(res);
            return;
        }
        customShowMessage(
             "Error fetching order details. Try again!",
             "danger", colors
        )
    }
    

    useEffect(() => {
        asyncFunction();
    }, [])

    return <View style={{ flex: 1 }}>
        <Actionbar showBackBtn navigation={navigation} title={`Order #${route.params.order_number}`} />
        {!loading ? <View style={{ flex: 1 }}>
            <FlatList
                data={orderDetails.items || []}
                renderItem={({ item }) => <Food item={item} navigation={navigation} />}
                keyExtractor={({ item, index }) => index}
                ListHeaderComponent={() => <Text style={headingStyle}>Foods</Text>}
                ListFooterComponent={() => <PricingDetails
                    orderDetails={orderDetails}
                    onShowReceipt={() => navigation.navigate("OrderReceipt", { "id": route.params.id })} />}
                ListFooterComponentStyle={{ marginTop: 8 }}
                showsVerticalScrollIndicator={false}
                overScrollMode="never"
                contentContainerStyle={{ padding: 20 }}
            />
        </View> : <ScreenSpinner />}
    </View>
}

function Food({ item, navigation }) {

    const colors = useSelector(themeState).colors;

    return <TouchableOpacity
        onPress={() => {
            navigation.navigate('Item', {
                slug: item.id
            })
        }}
        style={{
            flexDirection: "row",
            alignItems: 'center',
            padding: constraints.cardPadding,
            marginBottom: constraints.sectionGap,
            borderRadius: constraints.borderRadiusSmall,
            backgroundColor: colors.cardColor
        }}>
        <Image style={{ width: 60, height: 60, resizeMode: "contain" }}
            source={{ uri: constants.baseURL + item.coverImage_url }} />

        <View style={{ flexGrow: 1, marginLeft: 16 }}>
            <Text style={{ ...fonts.bold, fontSize: constraints.textSizeLabel1, lineHeight: 18, color: colors.textColorPrimary }}>{item.name+ "\n" + item.variant_name + "\n" + item.extra_label}</Text>
            <Text style={{ ...fonts.regular, color: colors.textColorSecondary, fontSize: 11 }}>{item.category}</Text>
            <Text style={{ ...fonts.regular, fontSize: constraints.textSizeLabel2, color: colors.textColorSecondary }}>
                {`${item.quantity} X Rs. ${item.item_price} + Extras: Rs ${item.extras_price} = Rs. ${item.total_price}`}
            </Text>
        </View>
    </TouchableOpacity>;
}

function PricingDetails({ onShowReceipt, orderDetails }) {

    const colors = useSelector(themeState).colors;
    const buttonStyle = {
        borderRadius: constraints.borderRadiusMin,
        backgroundColor: colors.textColorPrimary,
        paddingHorizontal: constraints.screenPaddingHorizontal,
        paddingVertical: constraints.buttonPaddingVertical
    }

    return <>
        <Text style={headingStyle}>Pricing</Text>

        <View style={{
            paddingVertical: 2,
            paddingHorizontal: 16,
        }}>
            <PricingRow keyText="Sub-total" value={`Rs. ${convertToFixed(orderDetails.amount)}`} />
            <PricingRow keyText="Discount" value={`Rs. ${convertToFixed(orderDetails.discountAmount)}`} />
            <PricingRow keyText="Taxable Amount"
                value={`Rs. ${convertToFixed(orderDetails.amount - orderDetails.discountAmount)}`} />
        </View>

        {/* <View style={{
            marginTop: 12,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderTopWidth: 1,
            borderTopColor: colors.borderColor
        }}>
            <PricingRow keyText="Tax" value={`Rs. ${convertToFixed(orderDetails.taxAmount)}`} />
            <PricingRow keyText="Shipping" value={`Rs. ${convertToFixed(orderDetails.shipAmount)}`} />
        </View> */}

        <View style={{
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderTopWidth: 1,
            borderTopColor: colors.borderColor,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor
        }}>
            <PricingRow
                keyText="Grand Total"
                value={`Rs. ${convertToFixed(orderDetails.grandAmount)}`}
                keyStyle={{ fontSize: constraints.textSizeLabel1, color: colors.textColorPrimary, ...fonts.bold }}
                valueStyle={{ fontSize: constraints.textSizeLabel1, color: colors.textColorPrimary, ...fonts.bold }}
            />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginVertical: 32 }}>
            <ButtonRipple title="SHOW RECEIPT"
                containerStyle={{ borderRadius: constraints.borderRadiusMin, marginHorizontal: 4, flex: 1 }}
                style={buttonStyle}
                textStyle={{ ...fonts.bold, fontSize: 14, color: colors.backgroundColor }}
                onPress={onShowReceipt}
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
    </>;
}


function PricingRow({ keyText, value, style = {}, keyStyle, valueStyle }) {

    const colors = useSelector(themeState).colors;
    const styles = StyleSheet.create({
        view: {
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 4
        },
        key: {
            color: colors.textColorSecondary,
            ...fonts.regular,
            fontSize: constraints.textSizeLabel2
        },
        value: {
            ...fonts.regular,
            fontSize: constraints.textSizeLabel2,
            color: colors.textColorPrimary
        }
    })
    return <View style={[styles.view, style]}>
        <Text style={[styles.key, keyStyle]}>{keyText}</Text>
        <Text style={[styles.value, valueStyle]}>{value}</Text>
    </View>
}
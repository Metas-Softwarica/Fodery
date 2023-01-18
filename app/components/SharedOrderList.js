import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { useRef } from "react";
import { Animated, FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-eva-icons";
import { showMessage } from 'react-native-flash-message';
import ListEmptyComponent from '../components/ListEmptyComponent';
import ScreenSpinner from '../components/spinners/ScreenSpinner';
import { colors } from "../configs/colors";
import { fonts } from "../configs/commonStyles";
import { constants, constraints } from '../configs/constants';
import { utilStyles } from "../configs/utilStyles";
import { useAxiosObject } from '../contexts/axios-context';
import useHeaderSnap from "../hooks/useHeaderSnap";
import { getCompletedOrder, getPendingOrder } from '../services/orderService';
import Actionbar from "./Actionbar";
import { useSelector } from "react-redux";
import { themeState } from "../store/slices/themeSlice";
import { customShowMessage } from "../customMessage";

const tabs = { pending: 0, completed: 1 };
export const orderStatus = { pending: "pending", delivering: "delivering", delivered: "delivered" };

export default function SharedOrderList({ goBack }) {
    const ref = useRef(null);
    const headerHeight = 130;
    const { handleScroll, handleSnap, translateY } = useHeaderSnap(headerHeight, ref);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [selectedTab, setSelectedTab] = useState(tabs.pending);
    const axiosInstance = useAxiosObject();
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const colors = useSelector(themeState).colors;
    async function fetchItems() {
        let res = selectedTab === 0 ?
            await getPendingOrder(axiosInstance) : await getCompletedOrder(axiosInstance);
        setLoading(false);
        if (res) {
            setPendingOrders(res);
            return;
        }
        customShowMessage(
            "Error fetching orders!!",
            "danger",
            colors)
    }

    useEffect(() => {
        setLoading(true);
        fetchItems();
    }, [selectedTab])


    return (
        <View style={{ flex: 1 }}>
            <View style={{
                position: 'absolute',
                backgroundColor: colors.backgroundColor,
                left: 0,
                right: 0,
                width: '100%',
                zIndex: 1,
            }}>

                <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
            </View>

            {!loading ? <Animated.FlatList
                refreshing={loading}
                onRefresh={() => fetchItems()}
                onScroll={handleScroll}
                onMomentumScrollEnd={handleSnap}
                data={pendingOrders}
                renderItem={({ item }) => {
                    return <OrderItem
                        status={item.status}
                        address={item.address}
                        couponAmount={item.couponAmount}
                        createdAt={item.createdAt}
                        discountAmount={item.discountAmount}
                        grandAmount={item.grandAmount}
                        items={item.items}
                        order_number={item.order_number}
                        onOrderClick={() => navigation.navigate("OrderInfo", {
                            order_number: item.order_number,
                            id: item.id
                        })}
                    />
                }}
                keyExtractor={(item) => item.order_number}
                contentContainerStyle={{ paddingTop: constraints.screenPaddingHorizontal * 2, paddingBottom: 90 }}
                ref={ref}
                ListEmptyComponent={() => <ListEmptyComponent viewStyle={{ marginTop: headerHeight + 30 }}
                    message={"No orders found"} />}
            /> : <ScreenSpinner />}
        </View>
    );
};


function Tabs({ selectedTab, setSelectedTab }) {

    const colors = useSelector(themeState).colors;

    function tabBackgroundStyle(isSelected) {
        const styles = [{
            width: "50%",
            height: 35,
            backgroundColor: isSelected ? colors.textColorSecondary : colors.backgroundColor,
            borderRadius: 6,
            ...utilStyles.centerXY
        }];
        return StyleSheet.create(styles);
    }

    function headingStyle(isSelected) {
        const styles = [{
            color: isSelected ? colors.backgroundColor : colors.textColorSecondary,
            ...fonts.regular,
            fontSize: constraints.textSizeHeading4
        }];

        return StyleSheet.create(styles);
    }

    return <View style={{
        flexDirection: "row",
        backgroundColor: colors.textColorSecondary,
        marginHorizontal: constraints.screenPaddingHorizontal,
        marginTop: 10,
        marginBottom: 0,
        padding: 2,
        borderRadius: constraints.borderRadiusSmall,
        justifyContent: "space-between"
    }}>
        <Pressable
            style={tabBackgroundStyle(selectedTab === tabs.completed)}
            onPress={() => setSelectedTab(tabs.pending)}
        >
            <Text style={headingStyle(selectedTab === tabs.completed)}>
                Pending
            </Text>
        </Pressable>
        <Pressable
            style={tabBackgroundStyle(selectedTab === tabs.pending)}
            onPress={() => setSelectedTab(tabs.completed)}
        >
            <Text style={headingStyle(selectedTab === tabs.pending)}>
                Completed
            </Text>
        </Pressable>
    </View>;
}

export function OrderItem(
    {
        status, onOrderClick, order_number, couponAmount, discountAmount, grandAmount, createdAt, items, address
    }
) {

    const colors = useSelector(themeState).colors;

    const detailsFontStyle = StyleSheet.create([{
        color: colors.textColorSecondary,
        fontSize: constraints.textSizeHeading4,
        lineHeight: 20
    }]);

    const headingFontStyle = StyleSheet.create([{
        color: colors.textColorPrimary,
        fontSize: constraints.textSizeHeading3,
        ...fonts.bold,
    }]);

    let isoDate = new Date(createdAt).toUTCString().replace("GMT", "");

    function getStatusStyle(status) {
        return StyleSheet.create({
            container: {
                position: "absolute",
                top: 8,
                right: 8,
                height: 24,
                paddingHorizontal: 8,
                paddingVertical: 2,
                backgroundColor: getStatusBackGround(status),
                borderRadius: 4,
                justifyContent: "center"
            },
            text: {
                ...fonts.bold,
                fontSize: constraints.textSizeHeading5,
                color: colors.black,
                textTransform: "uppercase"
            }
        });
    }
    function getStatusBackGround(status) {
        if (status === orderStatus.pending) {
            return "yellow";
        } else if (status == orderStatus.delivering) {
            return colors.accentColor2;
        } else if (status == orderStatus.delivered) {
            return "grey";
        }
        return null
    }

    return <View
        style={{
            backgroundColor: colors.cardColor,
            marginHorizontal: constraints.screenPaddingHorizontal,
            marginTop: constraints.screenPaddingHorizontal,
            borderRadius: 8
        }}
    >
        <TouchableOpacity
            style={{
                position: "relative",
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 16,
                paddingBottom: 0
            }}
            onPress={onOrderClick}
        >
            <View style={getStatusStyle(status).container}>
                <Text style={getStatusStyle(status).text}>
                    {status}
                </Text>
            </View>
            <View style={{ maxWidth: "70%" }}>
                <Text style={headingFontStyle}>{`Order #${order_number}`}</Text>
                <Text style={detailsFontStyle}>{isoDate}</Text>

                <View style={{ flexDirection: "row", }}>
                    <Icon name="pin-outline" height={14} width={14} fill={colors.textColorSecondary} style={{ marginTop: 4 }} />
                    <Text numberOfLines={2} style={detailsFontStyle}>{address.streetAdd1}</Text>
                </View>
                {!!couponAmount && (couponAmount != 0) ? <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon name="radio-button-off-outline" height={14} width={14} fill={colors.textColorSecondary} />
                    <Text style={[detailsFontStyle, { fontSize: constraints.textSizeHeading5 }]}>{`${couponAmount} coupon used`}</Text>
                </View> : <></>}
                {!!discountAmount && (discountAmount != 0) ? <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon name="percent-outline" height={14} width={14} fill={colors.textColorSecondary} />
                    <Text style={[detailsFontStyle, { fontSize: constraints.textSizeHeading5 }]}>{`Discount Rs ${discountAmount}`}</Text>
                </View> : <></>}
            </View>
            <View style={{ justifyContent: "flex-end" }}>
                <View style={{ alignItems: "flex-end" }}>
                    <Text style={detailsFontStyle}>Grand Total</Text>
                    <Text style={[headingFontStyle, { fontSize: 16 }]}>Rs. {grandAmount}</Text>
                </View>
            </View>
        </TouchableOpacity>

        <FlatList
            data={items}
            keyExtractor={(item => item)}
            renderItem={({ item }) => {
                return <ItemPreview imageUrl={item} />
            }}
            contentContainerStyle={{ flexDirection: "row", padding: 16 }}
            horizontal
            overScrollMode="never"
            showsHorizontalScrollIndicator={false}
            onStartShouldSetResponder={() => true}
        />
    </View>;
}

function ItemPreview({ imageUrl }) {
    const colors = useSelector(themeState).colors;
    return <View style={{ width: 64, height: 64, padding: 4, marginRight: 8, backgroundColor: colors.cardColorSecondary, borderRadius: constraints.borderRadiusSmall }}>
        <Image style={{ flexGrow: 1, resizeMode: "contain" }}
            source={{ uri: constants.baseURL + imageUrl }} />
    </View>;
}

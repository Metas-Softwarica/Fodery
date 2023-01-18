import { useDispatch, useSelector } from "react-redux";
import { checkoutState, updatePayment } from "../../store/slices/checkoutSlice";
import { cartState, emptyCart } from "../../store/slices/cartSlice";
import { useAxiosObject } from "../../contexts/axios-context";
import { placeOrder } from "../../services/orderService";
import { showMessage } from "react-native-flash-message";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import ButtonRipple from "../inputs/buttons/ButtonRipple";
import ScreenSpinner from "../spinners/ScreenSpinner";
import React from "react";
import { fonts } from "../../configs/commonStyles";
import { constraints } from "../../configs/constants";
import { themeState } from "../../store/slices/themeSlice";
import Icon from "../../components/Icon";
import { customShowMessage } from "../../customMessage";

export function PaymentTab({ setCheckoutInfo, loadingStage, setLoadingStage, setPickedStep }) {
    const dispatch = useDispatch();
    const selector = useSelector(checkoutState);
    const cartSelector = useSelector(cartState);
    const axiosInstance = useAxiosObject();
    const colors = useSelector(themeState).colors;
    const theme = useSelector(themeState).theme;

    const styles = getPaymentTabStyles(colors);


    // const buttonStyle = getButtonStyle(colors);

    async function addOrder() {
        setLoadingStage(true);
        let list = [];
        for (const key in cartSelector.products) {
            const element = cartSelector.products[key];
            let obj = {
                quantity: element.quantity,
                item: element.item_id,
                variant: element.variant ? element.variant.id : null,
                extras: element.extra.map(item => item.id)
            }
            list.push(obj);
        }

        const orderObj = {
            listProduct: list,
            userAddress: selector.shipping.deliveryAddress,
            coupon: cartSelector.coupon.id
        }

        let res = await placeOrder(axiosInstance, orderObj);
        setLoadingStage(false);
        if (res) {
            setCheckoutInfo(res);
            setPickedStep(3);
            dispatch(emptyCart());
            return;
        }
        customShowMessage(
             "Error placing order. Try again!!",
             "danger",
            colors
        )
    }
    return <>
        <View style={styles.view}>

            <Text style={styles.text}>Select your payment method</Text>

            <View style={styles.btnWrapper}>
                <Pressable style={[styles.card, selector.payment.cod && styles.cardSelected]}
                    onPress={() => {
                        dispatch(updatePayment(true))
                    }}
                >
                     <Image
                            source={require("../../../assets/icons/cod_logo.png")}
                            style={styles.img}
                        />
                    <View style={{flexDirection:"row", justifyContent: "space-between", flex:1}}>
                        <Text style={[styles.btnText, selector.payment.cod && styles.btnTextSelected]}>Cash on
                            Delivery</Text>
                        <View style={styles.checkbox}>
                            <Icon name="check_dark_green" size={22}/>
                        </View>
                    </View>
                    
                    
                </Pressable>

                {/* <Pressable style={[styles.card, !selector.payment.cod ? styles.cardSelected : {}]}
                    onPress={() => {
                        dispatch(updatePayment(false))
                    }}>
                    <View style={styles.img}>

                    </View>
                    <Text style={[styles.btnText, !selector.payment.cod && styles.btnTextSelected]}>Khalti</Text>
                </Pressable> */}
            </View>

            <View style={{ marginTop: "auto" }}>
                <ButtonRipple
                    containerStyle={{ borderRadius: 6, backgroundColor: (theme == "light") ? colors.addToCartButtonColor: colors.accentColor, marginVertical: 24 }}
                    style={{ paddingVertical: 12, borderRadius: 6 ,  backgroundColor: (theme == "light") ?  colors.black: colors.accentColor}}
                    textStyle={{ ...fonts.bold, fontSize: 14,color: (theme == "light") ?  colors.accentColor: colors.black }}
                    // containerStyle={buttonStyle.containerStyle}
                    // style={buttonStyle.style}
                    // textStyle={buttonStyle.textStyle}
                    onPress={() => {
                        addOrder();
                    }}
                    title="PROCEED TO CHECKOUT" />
            </View>
        </View>
        {loadingStage && <ScreenSpinner />}
    </>
}

function getPaymentTabStyles(colors) {
    return StyleSheet.create({
        view: {
            flex: 1,
            paddingHorizontal: constraints.screenPaddingHorizontal,
        },
        text: {
            marginTop: constraints.screenPaddingHorizontal,
            color: colors.textColorPrimary,
            ...fonts.bold
        },
        btnWrapper: {
            marginTop: 15,
            marginBottom: 30
        },
        card: {
            padding: 10,
            borderRadius: 5,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
            borderWidth: 1,
            borderColor: colors.borderColor
        },
        cardSelected: {
            backgroundColor: colors.textColorPrimary,
        },
        img: {
            width: 40,
            height: 40,
            borderRadius: 5,
            marginRight: 10,
            borderColor: colors.borderColor,
            borderWidth: 1
        },
        btnText: {
            fontSize: constraints.textSizeHeading4,
            color: colors.textColorPrimary,
            ...fonts.regular
        },
        btnTextSelected: {
            color: colors.backgroundColor
        }
    });
}
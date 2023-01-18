import { Platform, Text, TouchableNativeFeedback, View } from "react-native";
import { colors } from "../../../configs/colors";
import { useSelector } from "react-redux";
import { utilStyles } from "../../../configs/utilStyles";
import React from "react";
import { themeState } from "../../../store/slices/themeSlice";
import { fonts } from "../../../configs/commonStyles";

export default function ButtonRipple({ title, style, textStyle, containerStyle, onPress, disabled = false, rippleColor, children, titleStyle }) {
    const colors = useSelector(themeState).colors;
    if (!rippleColor) rippleColor = colors.addToCartRippleColor;

    return <View style={{ borderRadius: 99, overflow: "hidden", ...containerStyle }}>
        <TouchableNativeFeedback onPress={onPress} background={TouchableNativeFeedback.Ripple(rippleColor, false)} disabled={disabled}>
            <View style={[{
                ...utilStyles.center,
                borderRadius: 99,
                backgroundColor: disabled ? colors.buttonDisabledColor : colors.textColorPrimary,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                height: Platform.OS == "ios" ? 38 : null,
                // flexGrow: 1,
                ...style
            }, disabled ? { backgroundColor: colors.buttonDisabledColor } : {}]}>
                <View style={{ marginRight: title ? 6 : 0, ...titleStyle }}>
                    {children}
                </View>
                {title &&
                    <Text style={{ fontSize: 20, textAlign: "center", color: "white", ...fonts.regular, ...textStyle }}>{title}</Text>
                }
            </View>
        </TouchableNativeFeedback>
    </View>;
}
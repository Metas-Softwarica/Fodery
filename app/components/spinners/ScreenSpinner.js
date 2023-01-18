import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useSelector } from "react-redux";
import { themeState } from "../../store/slices/themeSlice";


export default function ScreenSpinner() {
    const colors = useSelector(themeState).colors;
    return <View style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        backgroundColor: `${colors.backgroundColor}50`
    }}>
        <ActivityIndicator size="large" color={colors.accentColor} />
    </View>
}
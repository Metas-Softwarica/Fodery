import React from "react";
import { View } from "react-native";
import Actionbar from "../Actionbar";
import SharedOrderList from "../SharedOrderList";


export default function OrderTab() {
    return <View style={{ flex: 1 }}>
        <Actionbar title="Orders"/>
        <SharedOrderList />
    </View>
}
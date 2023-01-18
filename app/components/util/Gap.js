import {View} from "react-native";
import React from "react";

export function Gap({x = 0, y = 0, style ={}}) {
    return (
        <View style={{width: x, height: y, ...style}}/>
    );
}
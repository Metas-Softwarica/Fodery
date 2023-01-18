import {Text, TouchableOpacity, View} from "react-native";
import {colors} from "../../../configs/colors";
import React from "react";
import * as PropTypes from "prop-types";

export function ButtonOpacity({onPress, containerStyle, btnStyle, textStyle, title}) {
    return <View style={{...containerStyle}}>
        <TouchableOpacity onPress={onPress} style={{
            ...btnStyle
        }}>

            <Text style={{
                display: "flex",
                textAlign: "center",
                paddingVertical: 6,
                paddingHorizontal: 8,
                fontSize: 18,
                color: "white",
                ...textStyle
            }}>{title}</Text>
        </TouchableOpacity>
    </View>;
}

ButtonOpacity.propTypes = {onPress: PropTypes.func};
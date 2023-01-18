import { TouchableOpacity, Text, View } from "react-native";
import { Icon } from "react-native-eva-icons";
import React from "react";
import { fonts } from "../../../configs/commonStyles";
import {useSelector} from "react-redux";
import {themeState} from "../../../store/slices/themeSlice";


export default function SingleSelectItem({ name, onPress, children, style = {}, textStyle = {} }) {
    const colors = useSelector(themeState).colors;
    return <TouchableOpacity
        style={[
            {
                flexDirection: "row",
                paddingVertical: 8,
                paddingLeft: 15,
                paddingRight: 15,
                borderRadius: 5,
                marginBottom: 8,
                alignItems: "center",
                elevation: .2,
                backgroundColor: colors.cardColor
            },
            style
        ]}
        onPress={onPress}
    >
        {children}
        {name &&
            <Text style={{ ...fonts.regular, color: colors.textColorPrimary, fontSize: 11, marginHorizontal: 12, ...textStyle }}>{name}</Text>
        }
        <View style={{ marginLeft: "auto" }}>
            <Icon name="chevron-right-outline" fill={colors.iconColorSecondary} width={24} height={24} />
        </View>
    </TouchableOpacity>;
}
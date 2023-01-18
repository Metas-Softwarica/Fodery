import {useNavigation} from "@react-navigation/native";
import {Text, TouchableOpacity, View} from "react-native";
import {colors} from "../../configs/colors";
import {fonts} from "../../configs/commonStyles";
import React from "react";
import { themeState } from "../../store/slices/themeSlice";
import { useSelector, useDispatch } from 'react-redux';

export function QA({question, answer, enableBackground = true, onPress, expand}) {
    const navigation = useNavigation();
    const colors = useSelector(themeState).colors;
    return <TouchableOpacity onPress={onPress}
                             style={{
                                 backgroundColor: enableBackground ? colors.cardColor : "#ffffff00",
                                 padding: enableBackground ? 20 : 0,
                                 borderRadius: 8,
                                 marginHorizontal: 20,
                                 marginVertical: 4
                             }}
    >
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
            <View>
                <Text style={{...fonts.extraBold, fontSize: 14, color: colors.textColorPrimary}}>{question}</Text>
                <Text numberOfLines={!expand ? 3 : 0} style={{...fonts.regular, color: colors.textColorSecondary, fontSize: 12}}>{answer}</Text>

            </View>
        </View>
    </TouchableOpacity>;
}
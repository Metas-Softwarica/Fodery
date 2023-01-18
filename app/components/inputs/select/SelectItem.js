import {Pressable, Text, StyleSheet, TouchableHighlight, View} from "react-native";
import {fonts} from "../../../configs/commonStyles";
import {colors} from "../../../configs/colors";
import {Icon} from "react-native-eva-icons";
import React from "react";
import {useSelector} from "react-redux";
import {themeState} from "../../../store/slices/themeSlice";

export function SelectItem({name, onPress, isSelected, showRightArrow = true, showRightTick = false}) {

    const colors = useSelector(themeState).colors;
    const styles = getStyles(colors);

    return <TouchableHighlight
        onPress={onPress}
        underlayColor={colors.cardColorRipple}
        style={[styles.button, isSelected ? styles.selected : {}]}
    >

        <View style={styles.container}>
            <Text style={
                {
                    ...fonts.regular,
                    color: isSelected ? colors.backgroundColor : colors.textColorPrimary,
                }
            }>
                {name}
            </Text>
            {showRightArrow &&
            <Icon name="chevron-right-outline" fill={colors.textColorPrimary} width={26} height={26}/>
            }
            {showRightTick &&
            <Icon name="checkmark-circle-2" fill={colors.backgroundColor} width={26} height={26}/>
            }
        </View>
    </TouchableHighlight>;
}

function getStyles(colors) {
    return StyleSheet.create({
        button: {
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 15,
            paddingRight: 15,
            borderStyle: "solid",
            borderColor: colors.borderColorSecondary,
            borderWidth: 1,
            borderRadius: 5,
            marginBottom: 10,
        },
        container:{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        selected: {
            backgroundColor: colors.textColorPrimary,
            borderColor: colors.textColorPrimary
        }
    });
}
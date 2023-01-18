import ButtonRipple from "../inputs/buttons/ButtonRipple";
import {fonts} from "../../configs/commonStyles";
import {Icon} from "react-native-eva-icons";
import {colors} from "../../configs/colors";
import React from "react";
import {useNavigation} from "@react-navigation/native";
import {constraints} from "../../configs/constants";
import {useSelector} from "react-redux";
import {themeState} from "../../store/slices/themeSlice";

export function BackButton({disabled = false, onPress}) {
    const colors = useSelector(themeState).colors;

    const buttonStyle = {
        borderRadius: constraints.borderRadiusMin,
        paddingHorizontal: constraints.screenPaddingHorizontal,
        paddingVertical: constraints.buttonPaddingVertical,
        backgroundColor: colors.backgroundColor,
        borderWidth: 2,
        borderColor: colors.borderColorSecondary
    }

    const buttonContainerStyle = {flex: 1, borderRadius: 4, marginVertical: 16};
    const navigation = useNavigation();

    return (
        <ButtonRipple title="BACK"
                      containerStyle={buttonContainerStyle}
                      style={{...buttonStyle}}
                      textStyle={{
                          ...fonts.bold,
                          fontSize: constraints.textSizeHeading4,
                          color: colors.textColorPrimary
                      }}
                      disabled={disabled}
                      onPress={() => navigation.goBack()}
        />
    );
}
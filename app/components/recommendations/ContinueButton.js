import ButtonRipple from "../inputs/buttons/ButtonRipple";
import {fonts} from "../../configs/commonStyles";
import {Icon} from "react-native-eva-icons";
import React from "react";
import {constraints} from "../../configs/constants";
import {themeState} from "../../store/slices/themeSlice";
import {useSelector} from "react-redux";

export function ContinueButton({disabled=false, onPress}) {
    const colors = useSelector(themeState).colors;

    const buttonStyle = {borderRadius: constraints.borderRadiusMin, paddingVertical: constraints.buttonPaddingVertical}
    const buttonContainerStyle = {flex: 1, borderRadius: constraints.borderRadiusMin, marginVertical: constraints.screenPaddingHorizontal};

    return (
        <ButtonRipple title="CONTINUE"
                      containerStyle={buttonContainerStyle}
                      style={{...buttonStyle}}
                      textStyle={{...fonts.bold, fontSize: constraints.textSizeHeading4, color: colors.backgroundColor}}
                      disabled={disabled}
                      onPress={onPress}
        >
            <Icon name="checkmark-circle-2" height={21} width={21} fill={colors.backgroundColor}/>
        </ButtonRipple>
    );
}
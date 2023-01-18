import React from "react";
import { Text, View } from "react-native";
import { Icon } from "react-native-eva-icons";
import SingleSelectItem from "../../components/inputs/select/SingleSelectItem";
import { utilStyles } from "../../configs/utilStyles";
import { constraints } from '../../configs/constants';
import { fonts } from "../../configs/commonStyles";
import { useDispatch } from "react-redux";
import { setPasswordState } from "../../store/slices/userSlice";
import {useSelector} from "react-redux";
import {themeState} from "../../store/slices/themeSlice";

export default function PasswordChanged() {
    const dispatch = useDispatch();
    const colors = useSelector(themeState).colors;

    const handleEmailRedirect = () => {
        dispatch(setPasswordState(false));
    }

    return <View style={{ ...utilStyles.centerXY, flex: 1 }}>
        <Text style={{ marginBottom: 40, ...fonts.light, fontSize: 12, color: colors.textColorPrimary }}>Your password has been updated successfully.</Text>

        <View style={{ paddingHorizontal: constraints.screenPaddingHorizontal }}>
            <SingleSelectItem
                name="Continue with Email"
                onPress={handleEmailRedirect}
                style={{ elevation: 3, width: "100%" }}
            >
                <Icon name="email" fill={colors.iconColorSecondary} height={24} width={24} />
            </SingleSelectItem>
        </View>
    </View>
}
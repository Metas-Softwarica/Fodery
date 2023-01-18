import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import ItemOption from "./ItemOption";
import { constants, constraints } from "../../configs/constants";
import { themeState } from "../../store/slices/themeSlice";
import { useSelector } from "react-redux";
import { fonts } from "../../configs/commonStyles";


export default function ItemOptionList(
    {
        data = [],
        title,
        onItemPick,
        extraOption,
        variantOption,
        mode,
        listKey = null,
    }) {

    const colors = useSelector(themeState).colors;

    const styles = getStyles(colors);

    if (data.length > 0) {
        return (
            <View style={styles.container}>
                <Text style={[fonts.poppinsBold, { color: colors.textColorPrimary, letterSpacing: 1 }]}>{title}</Text>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    overScrollMode="never"
                    style={styles.scrollView}>
                    {data.map(item => {
                        let selected = false;
                        if (mode === "Extra") {
                            selected = !!extraOption.find((extraItem => extraItem.id === item.id));
                        } else {
                            selected = (variantOption[listKey] === item.id)
                        }

                        return <>
                            <ItemOption
                                key={item.id}
                                item={item}
                                setSelected={onItemPick}
                                selected={selected}
                                listKey={listKey}
                                mode={mode}
                                imgUrl={constants.baseURL + item.coverImage}
                            />
                        </>
                    })}
                </ScrollView>
            </View>
        );
    } else {
        return null; ß
    }

}

function getStyles(colors) {
    return StyleSheet.create({
        container: {
            paddingHorizontal: constraints.screenPaddingHorizontal,
            marginTop: constraints.sectionGap,
        },
        title: {
            color: colors.textColorPrimary,
            textTransform: "capitalize",
            ...fonts.regular,
            fontSize: constraints.textSizeHeading3
        },
        scrollView: {
            flexDirection: "row",
            marginVertical: constraints.sectionGap
        }
    });
}
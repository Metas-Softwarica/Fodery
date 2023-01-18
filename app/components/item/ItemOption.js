import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { fonts } from "../../configs/commonStyles";
import { useSelector } from "react-redux";
import { themeState } from "../../store/slices/themeSlice";
import { constants, constraints } from "../../configs/constants";
import Icon from "../Icon";

export default function ItemOption({ selected, setSelected, item, mode, listKey, }) {
    let res = mode !== "Extra" ?
        <VariantOption selected={selected} item={item} setSelected={setSelected} listKey={listKey} />
        : <ExtraOption selected={selected} item={item} setSelected={setSelected} />
    return res;
}

function VariantOption({ selected, setSelected, item, listKey }) {

    const colors = useSelector(themeState).colors;
    const theme = useSelector(themeState).theme;
    const styles = getVariantStyles(colors, theme);

    return <Pressable
        style={[styles.pressable, selected && styles.selected]}
        onPress={() => {
            setSelected(listKey, item.id)
        }}>
        <Text style={[styles.text, selected && styles.textSelected]}>{item.title.toUpperCase()}</Text>
    </Pressable>
}

function getVariantStyles(colors, theme) {
    return StyleSheet.create({
        pressable: {
            paddingHorizontal: constraints.buttonPaddingHorizontal,
            paddingVertical: constraints.buttonPaddingVerticalSmall,
            marginRight: constraints.sectionGap,
            borderRadius: constraints.borderRadiusSmall,
            backgroundColor: "#2E323B"
        },
        selected: {
            backgroundColor: colors.accentColor
        },
        text: {
            ...fonts.bold,
            color: "white",
            fontSize: constraints.textSizeLabel3
        },
        textSelected: {
            color: colors.buttonColor,
        }
    })
}


function ExtraOption({ selected, setSelected, item }) {

    const colors = useSelector(themeState).colors;
    const styles = getToppingStyle(colors);
    return <Pressable style={[styles.pressable]}
        onPress={() => {
            setSelected(item);
        }}>
        <Image style={[styles.image, selected && styles.imageSelected]}
            source={{ uri: constants.baseURL + item.coverImage }} />

        {selected &&
            <View style={styles.checkMark}>
                <Icon name="check_dark_green" size={18} />
            </View>
        }

        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text
            style={[styles.price,]}>{`Rs. ${item.price}`}</Text>
    </Pressable>
}

function getToppingStyle(colors) {
    const imageWidth = 100;
    return StyleSheet.create({
        pressable: {
            alignItems: "center",
            marginRight: constraints.sectionGap,
        },
        image: {
            height: imageWidth * 5 / 4,
            width: imageWidth,
            borderRadius: constraints.borderRadiusSmall,
            marginBottom: 3
        },
        imageSelected: {
            borderWidth: 1,
            borderColor: colors.accentColor
        },
        checkMark: {
            width: imageWidth,
            position: "absolute",
            justifyContent: "flex-end"
        },
        title: {
            ...fonts.regular,
            fontSize: constraints.textSizeLabel3,
            color: colors.textColorPrimary,
            maxWidth: imageWidth,
            lineHeight: constraints.lineHeightHeading3
        },
        price: {
            ...fonts.light,
            fontSize: constraints.textSizeLabel2,
            color: colors.accentColor
        }
    })
}





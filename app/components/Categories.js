import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useCallback } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts } from "../configs/commonStyles";
import { constants, constraints } from "../configs/constants";
import { useSelector } from "react-redux";
import { themeState } from "../store/slices/themeSlice";
import { SvgUri, SvgXml } from "react-native-svg";
import MoreIcon from "../../assets/icons/svgs/category_light_active.svg";
import MoreCategoryLightIcon from "../../assets/icons/svgs/more_category_light_icon.svg";
import { utilStyles } from "../configs/utilStyles";

export default function Categories({ categories }) {

    const [selected, setSelected] = useState(-1);
    const navigator = useNavigation();


    function openCategory(category) {
        navigator.navigate("ItemByCategory", { categoryId: category.id, subTitle: category.title });
    }



    return (
        <View style={{ height: 100 }}>
            <FlatList
                data={categories}
                renderItem={({ item, index }) => <CategoryItem item={item} selected={selected === item.id}
                    setSelected={openCategory}
                    isLast={categories.length - 1 === index} />}
                horizontal
                overScrollMode="never"
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                contentContainerStyle={{
                    paddingHorizontal: constraints.screenPaddingHorizontal,
                    alignItems: "flex-start",
                }}
                ListFooterComponent={CategoryItemMore}
            />
        </View>
    );
}

export function CategoryItem({ item, selected, setSelected, isFooter = false }) {

    function isValidSvgUri(url) {
        if (!url) return false;
        return (url.substr(-4) === ".svg");
    }
    const colors = useSelector(themeState).colors;
    const theme = useSelector(themeState).theme;
    const [hasSvgError, setSvgError] = useState(false);
    const handleSvgError = useCallback(() => {
        setSvgError(true);
    }, []);
    const navigator = useNavigation();
    function openAllCategory() {
        navigator.navigate("Category");
    }
    return (
        <Pressable style={[styles.container, isFooter ? { marginRight: 0 } : {}]} onPress={() => { (isFooter) ? openAllCategory() : setSelected(item) }}>
            <View style={{ ...styles.icon, backgroundColor: colors.cardColor }}>
                {!isFooter
                    ? item.coverImage && isValidSvgUri(item.coverImage) && (!hasSvgError) ? <SvgUri
                        width={"100%"}
                        height={"100%"}
                        onError={handleSvgError}
                        fill={colors.categoryIconColor}
                        uri={constants.baseURL + item.coverImage} /> : <></>

                    : ((theme == "dark") ? <MoreIcon width={"80%"} height={"80%"} /> : <MoreCategoryLightIcon width={"80%"} height={"80%"} />)
                }

            </View>
            <Text
                numberOfLines={2}
                style={{ ...styles.text, ...fonts.regular, color: colors.textColorSecondary }}>
                {item.title}
            </Text>
        </Pressable>
    );
}

function CategoryItemMore() {
    return <CategoryItem item={{ title: "More" }} isFooter />
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        // marginBottom: 12,
        alignItems: "center",
        justifyContent: "flex-start",
        // margin: 8,
        // marginLeft: 0,
        marginRight: 18,
        width: 50,
        height: 100,

    },
    icon: {
        borderRadius: 6,
        // // borderWidth: 1,
        // borderColor: colors.primary,
        width: 50,
        padding: 8,
        height: 50,
        ...utilStyles.centerXY
    },
    selected: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    text: {
        fontSize: 12,
        margin: 4, textAlign: "center"
    }
});
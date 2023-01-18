import React, { useState } from "react";
import {
    StyleSheet,
    Text, View
} from "react-native";
import StarRating from 'react-native-star-rating-widget';
import { useSelector } from "react-redux";
import { fonts } from "../../configs/commonStyles";
import { constraints } from "../../configs/constants";
import { themeState } from "../../store/slices/themeSlice";


export default function ItemDescription({ title, category, avgRating, reviewCount, }) {
    const colors = useSelector(themeState).colors;
    const styles = StyleSheet.create({
        container: {
            // marginVertical: constraints.screenPaddingHorizontal,
            paddingHorizontal: 10,
        },
        title: {
            color: colors.textColorPrimary,
            fontSize: constraints.textSizeHeading3,
            ...fonts.regular,
        },
        text_n_icon: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
        },
        rating_wrapper: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
        },
        ratingText: {
            marginLeft: 4,
            color: colors.textColorSecondary,
            ...fonts.poppinsRegular
        },
        category: {
            ...fonts.light,
            fontSize: constraints.textSizeLabel2,
            color: colors.textColorSecondary,
            textTransform: "uppercase",
            marginVertical: constraints.sectionGap / 2
        }
    })

    return <View style={styles.container}>
        <View style={styles.text_n_icon}>
            <View>
                <Text style={styles.title}>{title}</Text>
                <Text numberOfLines={1} style={styles.category}>{category}</Text>
            </View>
        </View>

        <View style={styles.rating_wrapper}>
            <StarRating
                onChange={() => {
                }}
                rating={avgRating}
                color={colors.accentColor2}
                starSize={18}
                enableHalfStar
                maxStars={5}
                starStyle={{ marginLeft: 0, marginRight: 0 }}
            />

            <Text style={styles.ratingText}>{`  ${reviewCount} reviews`}</Text>
        </View>
    </View>
}

export function ItemDescriptionText({ description, descStyle = {}, }) {
    const colors = useSelector(themeState).colors;
    const [showMore, setShowMore] = useState(false);

    const styles = StyleSheet.create({
        description: {
            paddingHorizontal: constraints.screenPaddingHorizontal,
            color: colors.textColorSecondary,
            ...fonts.poppinsLight,
            fontSize: 13.5,
            ...descStyle
        },
    })

    return <>
        <Text numberOfLines={!showMore ? 2 : 0} ellipsizeMode="clip" style={styles.description}>
            {description ?? ""}
        </Text>
        <Text
            style={[styles.description, { color: colors.textColorPrimary, marginTop: 0 }]}
            onPress={() => setShowMore((prev) => !prev)}
        >
            {(description.length > 0) ? (!showMore ? "...more" : "show less..."): ""}
        </Text>
    </>
}
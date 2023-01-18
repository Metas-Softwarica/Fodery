import React, {useState} from "react";
import {useSelector} from "react-redux";
import {themeState} from "../store/slices/themeSlice";
import {Image, Pressable, StyleSheet, Text, useWindowDimensions, View} from "react-native";
import {constants, constraints} from "../configs/constants";
import StarRating from "react-native-star-rating-widget";
import {fonts} from "../configs/commonStyles";

export function ReviewItem({description, avatar, rate, username, updated_at}) {
    const [collapsed, setCollapsed] = useState(true);
    const colors = useSelector(themeState).colors;

    const styles = getStyles(colors);
    const {width} = useWindowDimensions();

    return <View style={[styles.reviewWrapper, {width: width * .9}]}>
        <View style={styles.nameDateWrapper}>
            <View style={styles.imgNameWrapper}>
                {
                    (!avatar) ? <Image
                    source={require("../../assets/no_profile_image.png")}
                    style={styles.image}
                />:<Image
                style={styles.image}
                source={{uri: constants.baseURL + avatar}}/>
                }
                <View>
                    <Text style={styles.name}>{username}</Text>

                    <View style={{flexDirection: "row", alignItems: "center", marginTop: 3}}>
                        <StarRating
                            onChange={() => {
                            }}
                            rating={rate}
                            color={colors.accentColor2}
                            starSize={18}
                            enableHalfStar
                            maxStars={5}
                            starStyle={{marginLeft: 0, marginRight: 0}}
                        />

                    </View>

                </View>

            </View>
            <Text style={{...fonts.light, fontSize: constraints.textSizeLabel3, color: colors.textColorSecondary}}
                  numberOfLines={collapsed ? 2 : 0}
            >
                {updated_at}
            </Text>
        </View>
        <Pressable onPress={() => {
            setCollapsed(prev => !prev)
        }}>
            <Text
                style={{
                    ...fonts.light,
                    fontSize: constraints.textSizeLabel2,
                    color: colors.textColorSecondary,
                    lineHeight: constraints.textSizeLabel2 + 4
                }}
                numberOfLines={collapsed ? 3 : 0}
            >
                {description}
            </Text>
        </Pressable>
    </View>
}

function getStyles(colors) {
    return StyleSheet.create({
        reviewWrapper: {
            padding: constraints.cardPadding,

        },
        nameDateWrapper: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10
        },
        imgNameWrapper: {
            flexDirection: "row",
        },
        image: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10
        },
        name: {
            ...fonts.bold,
            color: colors.textColorPrimary,
            textTransform: "capitalize"
        }
    })
}


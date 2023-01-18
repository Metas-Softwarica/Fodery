import React, { useState } from "react";
import StarRating from 'react-native-star-rating-widget';
import { FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { utilStyles } from "../configs/utilStyles";
import { constants, constraints } from '../configs/constants';
import { fonts, homeCardStyle } from "../configs/commonStyles";
import { useSelector } from "react-redux";
import { themeState } from "../store/slices/themeSlice";
import Icon from "./Icon";
import { ReviewItem } from "./ReviewItem";
import { Gap } from "./util/Gap";
import { showMessage } from "react-native-flash-message";

export default function Reviews({ reviews = [], setModal, modalMode, setReviewText, setRating, myReview, deleteReview, navigation, nextReviewUrl }) {

    const colors = useSelector(themeState).colors;
    const styles = getReviewStyles(colors);
    const [showAllReview, setShowAllReviews] = useState(false);
    return <View>
        {myReview ? <View style={styles.selfWrapper}>
            <Gap y={constraints.sectionGap} />

            <ReviewItemSelf
                key={myReview.id}
                id={myReview.id}
                username={myReview.username}
                avatar={myReview.avatar}
                updated_at={myReview.updated_at}
                description={myReview.description}
                rate={myReview.rate}
                modalMode={modalMode}
                setRating={setRating}
                setReviewText={setReviewText}
                setModal={setModal}
                deleteReview={deleteReview}
            />
        </View> :
            <TouchableOpacity style={styles.addReview} onPress={() => {
                modalMode.current = "Add";
                setModal(true);
            }}>
                <Text style={[styles.cardTitle, { fontSize: 14 }]}>Rate this food</Text>
                <StarRating
                    onChange={() => { }}
                    rating={0}
                    color={colors.textColorSecondary}
                    starSize={18}
                    maxStars={5}
                    starStyle={{ marginLeft: 0, marginRight: 0 }}
                />
            </TouchableOpacity>
        }

        <View style={homeCardStyle(colors)}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Reviews</Text>
                <TouchableOpacity onPress={() => {
                    if (reviews.length > 0) {
                        navigation.navigate("AllReview", {reviews: reviews, next: nextReviewUrl});
                    } else {
                        showMessage({
                            message: "No Reviews found!!",
                            type: "info"
                        })
                    }
                }}>
                    <Text style={styles.cardSubtitle}>See all reviews</Text>
                </TouchableOpacity>
            </View>
            {reviews.slice(0, 3).map(item => {
                    return <ReviewItem
                        key={item.id}
                        username={item.username}
                        avatar={item.avatar}
                        updated_at={item.updated_at}
                        description={item.description}
                        rate={item.rate}
                    />
                })}

        </View>
    </View>
}

function getReviewStyles(colors) {
    return StyleSheet.create({
        addWrapper: {
            flexDirection: "row",
            justifyContent: "space-between"
        },
        selfWrapper: {
            paddingHorizontal: constraints.screenPaddingHorizontal,
        },
        cardHeader: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: constraints.cardPadding
        },
        cardTitle: {
            ...fonts.regular,
            color: colors.textColorPrimary,
            fontSize: constraints.textSizeHeading3,
        },
        cardSubtitle: {
            ...fonts.regular,
            color: colors.textColorSecondary,
            fontSize: constraints.textSizeLabel2
        },
        addReview: {
            flexDirection: "row",
            justifyContent: "space-between",
            padding: constraints.cardPadding,
            paddingHorizontal: constraints.screenPaddingHorizontal,
            backgroundColor: colors.cardColor,
            marginHorizontal: 20,
            borderRadius: constraints.borderRadiusMedium
        }
    })
}

function ReviewItemSelf(
    {
        description = "",
        avatar,
        rate,
        username,
        updated_at,
        modalMode,
        setRating,
        setReviewText,
        setModal,
        deleteReview,
        id
    }) {
    const [collapsed, setCollapsed] = useState(true);

    const colors = useSelector(themeState).colors;
    const theme = useSelector(themeState).theme;

    const styles = getReviewSelfStyles(colors);

    return <View style={styles.reviewWrapper}>
        <View style={styles.header}>
            <Text style={styles.yourReview}>Your review</Text>
            <StarRating
                onChange={() => {
                }}
                rating={rate}
                color={colors.accentColor2}
                starSize={18}
                enableHalfStar
                maxStars={5}
                starStyle={{ marginLeft: 0, marginRight: 0 }}
            />
        </View>
        <Pressable onPress={() => {
            setCollapsed(prev => !prev)
        }}>
            <Text style={styles.description}
                numberOfLines={collapsed ? 3 : 0}>
                {description}
            </Text>
        </Pressable>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            
            <Text style={styles.date}>{updated_at}</Text>
            <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={() => {
                    modalMode.current = "Edit";
                    setReviewText(description);
                    setRating(rate);
                    setModal(true);
                }} style={styles.actionButton}>
                    <Icon name="edit_dark" size={18} fill={(theme =="light") ? "black": "white"} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    deleteReview(id);
                }} style={[styles.actionButton, { backgroundColor: colors.accentColor2 }]}>
                    <Icon name="delete_dark" size={18} />
                </TouchableOpacity>
            </View>

        </View>

    </View>
}

function getReviewSelfStyles(colors) {
    return StyleSheet.create({
        reviewWrapper: {
            padding: constraints.cardPadding,
            backgroundColor: colors.cardColor,
            marginVertical: constraints.sectionGap,
            borderRadius: constraints.borderRadiusMedium
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
            marginVertical: constraints.sectionGap,
        },
        yourReview: {
            color: colors.textColorPrimary,
            ...fonts.regular,
            fontSize: constraints.textSizeHeading3,
            lineHeight: constraints.lineHeightHeading4
        },
        description: {
            fontSize: constraints.textSizeLabel2,
            ...fonts.regular,
            color: colors.textColorSecondary,
            marginBottom: constraints.cardPadding
        },
        image: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10
        },
        name: {
            fontWeight: "bold"
        },
        date: {
            fontSize: 12,
            color: "#999999",
            marginTop: 4
        },
        actionButton: {
            padding: 4,
            borderRadius: constraints.borderRadiusExtraSmall,
            ...utilStyles.centerXY,
            backgroundColor: colors.cardColorSecondary,
            marginRight: constraints.sectionGap
        },
    })
}
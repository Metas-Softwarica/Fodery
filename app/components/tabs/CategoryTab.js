import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { Animated, Image, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { constants, constraints } from "../../configs/constants";
import useHeaderSnap from '../../hooks/useHeaderSnap';
import useSearchCategory from '../../hooks/useSearchCategory';
import Actionbar from '../Actionbar';
import EmptyListNotif from '../ListEmptyComponent';
import SearchView from '../SearchView';
import { themeState } from "../../store/slices/themeSlice";
import { useSelector } from "react-redux";
import { SvgUri } from "react-native-svg";

export default function CategoryTab() {
    const ref = useRef(null);
    const headerHeight = 80;
    const { handleScroll, handleSnap, translateY } = useHeaderSnap(headerHeight, ref);
    const { text, textChangeHandler, filteredList, refreshHandler, refreshing } = useSearchCategory();
    const navigation = useNavigation();
    const colors = useSelector(themeState).colors;

    const styles = StyleSheet.create({
        flatList: {
            marginTop: 16,
            paddingHorizontal: constraints.screenPaddingHorizontal
        },
        header: {
            position: 'absolute',
            left: 0,
            right: 0,
            width: '100%',
            zIndex: 1,
            backgroundColor: colors.backgroundColor
        },
    })

    return <View>
        <View style={[styles.header]}>
            <Actionbar title="Categories" showButton showProfile />
            <SearchView
                placeholder="Search Categories"
                showFilter={false}
                text={text}
                textChangeHandler={textChangeHandler}
            />
        </View>

        <Animated.FlatList
            ListEmptyComponent={<EmptyListNotif message={"No categories found"} />}
            scrollEventThrottle={16}
            onScroll={handleScroll}
            refreshControl={<RefreshControl
                progressViewOffset={120}
                onRefresh={refreshHandler}
                refreshing={refreshing}
            />}
            // onMomentumScrollEnd={handleSnap}
            style={styles.flatList}
            contentContainerStyle={{ paddingTop: headerHeight + 64, paddingBottom: 20 }}
            data={filteredList}
            renderItem={({ item }) => <CategoryItem item={item} />}
            keyExtractor={item => item.id}
            ref={ref}
            overScrollMode="never"
        />
    </View>
}

function CategoryItem({ item }) {
    const navigation = useNavigation();
    const { title, coverImage } = item;
    const colors = useSelector(themeState).colors;

    const styles = getCategoryItemStyles(colors);
    function imageUrl() {
        if (!coverImage) return "https://image.freepik.com/free-vector/fast-food-advertising-composition_1284-17372.jpg";
        return constants.baseURL + coverImage;
    }

    return <Pressable style={styles.categoryItem}
        onPress={() => { navigation.navigate('ItemByCategory', { categoryId: item.id, subTitle: title }) }}
    >
        <SvgUri
            width={32}
            height={32}
            marginHorizontal={6}
            fill={colors.categoryIconColor}
            uri={constants.baseURL + coverImage} />

        <View style={styles.textWrapper}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.desc}>Items: {item.count}</Text>
        </View>

        <Icon style={styles.icon} name="chevron-right-outline" fill={colors.textColorSecondary} width={30} height={30} />
    </Pressable>
}

function getCategoryItemStyles(colors) {
    return StyleSheet.create({
        categoryItem: {
            borderColor: colors.borderColor,
            borderWidth: 1,
            borderRadius: constraints.borderRadiusMin,
            marginVertical: 5,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: 8,
        },
        image: {
            width: 50,
            height: 50,
            borderRadius: constraints.borderRadiusSmall,
            marginRight: 6
        },
        textWrapper: {
            marginHorizontal: constraints.sectionGap,
            flex: 1
        },
        title: {
            fontSize: constraints.textSizeHeading4,
            color: colors.textColorSecondary
        },
        desc: {
            fontSize: constraints.textSizeLabel2,
            color: colors.textColorSecondary,
            lineHeight: constraints.lineHeightHeading3
        },
        icon: {
            marginLeft: "auto"
        }
    })
}
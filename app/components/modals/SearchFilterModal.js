import MultiSlider from '@ptomasroos/react-native-multi-slider';
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import CheckBox from 'react-native-check-box';
import {Icon} from "react-native-eva-icons";
import StarRating from "react-native-star-rating-widget";
import {colors} from "../../configs/colors";
import {utilStyles} from '../../configs/utilStyles';
import {useAxiosObject} from '../../contexts/axios-context';
import {getCategories} from "../../services/categoryService";
import ButtonRipple from "../inputs/buttons/ButtonRipple";
import ModalBox from './ModalBox';
import {fonts} from "../../configs/commonStyles";
import {useSelector} from "react-redux";
import {themeState} from "../../store/slices/themeSlice";
import {constraints} from "../../configs/constants";

export default function SearchFilterModal(
    {
        modalVisible,
        setModalVisible,
        setFilters,
        filters,
        onSubmit,
        onReset,
        filterOptions = {}
    }) {

    const {showCategory = true, categoryId = null} = filterOptions;
    const axiosInstance = useAxiosObject();
    const [categories, setCategories] = useState([]);
    const [allChecked, setAllChecked] = useState(true);

    const colors = useSelector(themeState).colors;

    const asyncFunction = async ()=>{

        if (!showCategory && categoryId) {
            setFilters(filters => {
                filters.filters.categories[0] = categoryId;
                return {...filters};
            });
            return;
        }

        const _categories = await getCategories(axiosInstance);
        setCategories(_categories.results || []);

        fillAllCheckBoxes(_categories.results);
    }

    useEffect(() => {
        asyncFunction();

    }, []);

    function updatePrices(prices) {
        setFilters(filters => {
            return {...filters, filters: {...filters.filters, price_range: prices}}
        })
    }

    function updateRating(rating) {
        setFilters(filters => {
            return {...filters, filters: {...filters.filters, rating: rating}}
        })
    }

    function updateCheckBoxes(index, categoryId) {
        setFilters((filters) => {
            filters.filters.categories[index] = filters.filters.categories[index] ? false : categoryId;

            return {...filters};
        })

        setAllChecked(isAllChecked());

    }

    function fillAllCheckBoxes(categories=[]) {
        setFilters((filters) => {
            filters.filters.categories = categories.map((category) => category.id);
            return {...filters};
        })
        setAllChecked(true);
    }

    function unFillAllCheckBoxes(categories) {
        setFilters((filters) => {
            filters.filters.categories = (new Array(categories.length)).fill(0);
            return {...filters};
        })
        setAllChecked(false);
    }

    function isAllChecked() {
        return !!filters.filters.categories.reduce((prev, curr) => !!prev * !!curr);
    }

    return (
        <ModalBox modalVisible={modalVisible} setModalVisible={setModalVisible}
                  style={{backgroundColor: colors.backgroundColor}}>
            <TitleBar title="CUSTOM SEARCH"
                      leftOption={() => <Icon name="refresh-outline" fill={colors.categoryIconColor} width={20}
                                              height={20}/>}
                      showLeftOption={true}
                      onCloseButtonPress={() => setModalVisible(false)} onLeftOptionPress={onReset}/>

            <ScrollView
                overScrollMode="never"
                style={{flex: 1, backgroundColor: colors.backgroundColor}}
            >
                <FilterOption heading="Price Range">
                    <MultiSlider
                        containerStyle={{
                            flex: 1, ...utilStyles.centerX,
                            paddingVertical: constraints.screenPaddingHorizontal
                        }}
                        markerContainerStyle={{flex: 1, ...utilStyles.centerY}}
                        markerStyle={{
                            height: 24,
                            width: 24,
                            borderWidth: 3,
                            borderRadius: 100,
                            borderColor: colors.accentColor,
                            backgroundColor: colors.backgroundColor
                        }}
                        touchDimensions={{
                            height: 200,
                            width: 200,
                            borderRadius: 99
                        }}
                        trackStyle={{backgroundColor: colors.textColorSecondary, borderRadius: 99, height: 3, top: -1}}
                        enableLabel={true}
                        customLabel={CustomMarker}

                        selectedStyle={{backgroundColor: colors.accentColor}}
                        values={[filters.filters.price_range.from, filters.filters.price_range.to]}
                        onValuesChangeFinish={(prices) => updatePrices({from: prices[0], to: prices[1]})}
                        allowOverlap={false}
                        min={0}
                        max={2000}
                        minMarkerOverlapDistance={45}
                    />
                </FilterOption>

                <FilterOption heading="Ratings">
                    <StarRating
                        onChange={(rating) => updateRating(rating)}
                        rating={filters.filters.rating}
                        color={colors.accentColor}
                        emptyColor={colors.textColorSecondary}
                        starSize={33}
                        maxStars={5}
                        starStyle={{marginHorizontal: 0, paddingHorizontal: 0}}
                        enableSwiping
                        enableHalfStar={false}
                    />
                </FilterOption>

                {showCategory &&
                <FilterOption heading="Food Category">
                    <View style={{flex: 1, width: "100%"}}>
                        <CheckBox
                            style={{flexGrow: 1, paddingVertical: 3}}
                            leftText={"All"}
                            isChecked={allChecked}
                            onClick={() => allChecked ? unFillAllCheckBoxes(categories) : fillAllCheckBoxes(categories)}
                            checkBoxColor={colors.textColorSecondary}
                            uncheckedCheckBoxColor={colors.textColorSecondary}
                            leftTextStyle={{
                                ...fonts.light,
                                fontSize: constraints.textSizeLabel2,
                                color: colors.textColorPrimary
                            }}
                        />
                    </View>

                    {categories.map((category, index) => {
                        if (category.status === true)
                            return <View key={index} style={{flex: 1, width: "100%"}}>
                                <CheckBox
                                    style={{flexGrow: 1, paddingVertical: 3}}
                                    leftText={category.title}
                                    isChecked={!!filters.filters.categories[index]}
                                    onClick={() => updateCheckBoxes(index, category.id)}
                                    checkBoxColor={colors.textColorSecondary}
                                    uncheckedCheckBoxColor={colors.textColorSecondary}
                                    leftTextStyle={{
                                        ...fonts.light,
                                        fontSize: constraints.textSizeLabel2,
                                        color: colors.textColorPrimary
                                    }}

                                />
                            </View>
                    })}
                </FilterOption>
                }
            </ScrollView>
            <View style={{borderTopWidth: 1, borderTopColor: colors.gray, paddingVertical: 6, backgroundColor: colors.backgroundColor}}>
                <ButtonRipple
                    containerStyle={{marginHorizontal: 6, borderRadius: constraints.borderRadiusSmall}}
                    style={{borderRadius: 0, paddingVertical: 12, backgroundColor: colors.accentColor}}
                    textStyle={{fontSize: constraints.textSizeHeading4, color: colors.textColorPrimary}}
                    title="APPLY FILTER"
                    onPress={() => {
                        onSubmit();
                        setModalVisible(false)
                    }}
                />
            </View>
        </ModalBox>
    );
};

export function TitleBar(
    {
        title,
        leftOption,
        showLeftOption = false,
        onLeftOptionPress,
        onCloseButtonPress,
        customCloseIcon = false,
    }) {

    const colors = useSelector(themeState).colors;
    return <View style={{
        display: "flex",
        flexDirection: "row", ...utilStyles.centerXY,
        justifyContent: "space-between",
        paddingVertical: 9,
        paddingHorizontal: 12,
        borderBottomColor: colors.gray,
        borderBottomWidth: 1,
        backgroundColor: colors.backgroundColor
    }}>
        <TouchableOpacity style={{alignSelf: "center"}} onPress={onLeftOptionPress}>
            {showLeftOption
                ? leftOption
                : <></>}
            <Icon name="refresh-outline" fill={colors.categoryIconColor} width={21} height={21}/>
        </TouchableOpacity>
        <Text style={{
            ...fonts.regular,
            fontSize: constraints.textSizeHeading4,
            color: colors.textColorPrimary
        }}>{title}</Text>

        <TouchableOpacity onPress={onCloseButtonPress}>
            {customCloseIcon ? customCloseIcon :
                <Icon name="close-outline" width={21} height={21} fill={colors.categoryIconColor}/>}
        </TouchableOpacity>
    </View>;
}

export function FilterOption({heading, children}) {
    const colors = useSelector(themeState).colors;
    return (
        <View style={{
            paddingHorizontal: constraints.screenPaddingHorizontal,
            marginTop: constraints.screenPaddingHorizontal
        }}>
            <Text style={{
                ...fonts.regular,
                fontSize: constraints.textSizeHeading4,
                color: colors.textColorPrimary
            }}>{heading.toUpperCase()}</Text>
            <View style={{flex: 1, marginTop: 9, paddingHorizontal: 12, ...utilStyles.centerX}}>
                {children}
            </View>
        </View>
    );
}

export function CustomMarker({oneMarkerValue, twoMarkerValue, oneMarkerLeftPosition, twoMarkerLeftPosition}) {

    const [containerWidth, setContainerWidth] = useState();

    const markerPadding = 16;
    const colors = useSelector(themeState).colors;

    function calculatePositionOne(markerPos) {
        let offset = markerPos - 0;
        if (offset < markerPadding - 32) {
            markerPos = markerPadding - 32;
        }
        return markerPos;
    }

    function calculatePositionTwo(markerPos) {
        let offset = containerWidth - markerPos;

        if (offset < (markerPadding + 32)) {
            markerPos = containerWidth - (markerPadding + 32);
        }

        return markerPos;
    }

    const labelStyle = StyleSheet.create([{
        ...fonts.light,
        fontSize: constraints.textSizeLabel2,
        position: "absolute",
        color: colors.textColorPrimary
    }]);

    return (
        <View
            style={{flexDirection: "row", marginBottom: constraints.sectionGap}}
            onLayout={(event) => {
                setContainerWidth(event.nativeEvent.layout.width);
            }}
        >
            <Text style={[labelStyle, {left: calculatePositionOne(oneMarkerLeftPosition)}]}>
                Rs. {oneMarkerValue}
            </Text>
            <Text style={[labelStyle, {left: calculatePositionTwo(twoMarkerLeftPosition)}]}>
                Rs. {twoMarkerValue}
            </Text>
        </View>
    )
}
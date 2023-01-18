import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosObject } from '../contexts/axios-context';
import { useVariant } from '../hooks/useVariant';
import { addCartItem, getItemInfo, getFavoriteStatus, setFavoriteStatus, } from '../services/itemService';
import { updateCount } from '../store/slices/cartSlice';
import AddToCartButton from '../components/item/AddToCart';
import ItemDescription, { ItemDescriptionText } from './../components/item/ItemDescription';
import ItemOptionList from './../components/item/ItemOptionList'
import { themeState } from '../store/slices/themeSlice';
import { constants, constraints } from '../configs/constants';
import AddToCartSmallButton from './item/AddToCartSmall';
import { fonts } from '../configs/commonStyles';
import { customShowMessage } from '../customMessage';

export default function InsertToCart({ selectedItem, scrollActive }) {
    const axiosInstance = useAxiosObject();
    const dispatch = useDispatch();
    const [favorite, setFavorite] = useState(false);
    const colors = useSelector(themeState).colors;

    const asyncFunction = async()=>{
        if (!selectedItem) { return; }
        setItemInfo(selectedItem);
        createVariantPicker(selectedItem);
        if (selectedItem.variant) {
            let obj = selectedItem.variant.attribute
            for (const key in obj) {
                const element = obj[key];
                pickVariantItem(key, element);
            }
        }
    }

    useEffect(() => {
        asyncFunction();
    }, [])

    const getFavoriteStatusData = async()=>{
        let res = await getFavoriteStatus(axiosInstance, { product: selectedItem.id });
        if (res) {
            setFavorite(res.isFavourite);
        }
    }

    useEffect(() => {
        getFavoriteStatusData();
    }, [])

    const { itemInfo, setItemInfo, extraSum, priceLoading, variantInfo,
        createVariantPicker, pickExtraItem, pickVariantItem, extraOption,
        variantOption, checkVariantStatus, count, setCount } = useVariant();

    const insertStyles = StyleSheet.create({
        descWrapper: {
            flexDirection: "row",
            paddingHorizontal: constraints.screenPaddingHorizontal
        },
        image: {
            width: 120,
            height: 120,
            borderRadius: constraints.borderRadiusSmall,
            resizeMode: "cover",
            overflow: "hidden"
        }
    })

    const cartHandler = async () => {
        if (itemInfo.allAttributes && !checkVariantStatus()) {
            customShowMessage("Please pick all the food options!!","danger", colors);
            return;
        }
        let obj = {
            item: selectedItem.id,
            quantity: count,
            extra: extraOption.map(item => item.id),
        }
        if (itemInfo.allAttributes) {

            obj = { ...obj, variant: variantInfo.id }
        }
        let res = await addCartItem(axiosInstance, obj)
        if (res) {
            customShowMessage("Added to Cart!", "success", colors);
            // showMessage({
            //     message: "Added to Cart!",
            //     type: "success",
            //     style: {
            //         marginBottom: 20,
            //         marginHorizontal: 20,
            //         borderRadius: 8,
            //         padding: 0,
            //         minHeight: 0
            //     },
            //     backgroundColor: colors.accentColor,
                
            //     textStyle: {margin: 0, padding: 0},
            //     titleStyle: {margin: 0, padding: 0, color: colors.backgroundColor, fontFamily: fonts.regular.fontFamily}
            // })
            dispatch(updateCount(count));

        }
    }

    const favoriteHandler = async () => {
        let curr = favorite;
        setFavorite(prevState => !prevState);

        let res = await setFavoriteStatus(axiosInstance, { product: selectedItem.id });
        if (res) {
            setFavorite(res.isFavourite);
            return;
        }
        custo({
            message: "Error setting item as favorite!!",
            type: "danger"
        })
        setFavorite(curr);
    }

    return <>
        <ScrollView

            scrollEnabled={scrollActive}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 0, paddingTop: constraints.sectionGap, }}
        >
            <View style={insertStyles.descWrapper}>
                <Image style={insertStyles.image}
                    source={{ uri: constants.baseURL + itemInfo.coverImage }} />
                <View style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start" }}>
                    <ItemDescription
                        avgRating={itemInfo.avgRating}
                        category={itemInfo.category}
                        key={1}
                        title={itemInfo.title}
                        reviewCount={itemInfo.reviewCount}
                    />
                    <AddToCartSmallButton
                        cartHandler={cartHandler}
                        count={count}
                        priceLoading={false}
                        newPrice={!itemInfo.variant ? itemInfo.newPrice : 0}
                        setCount={setCount}
                        variantPrice={variantInfo ? variantInfo.price : itemInfo.variant && itemInfo.variant.startingPrice}
                        extraSum={extraSum}
                        favoriteHandler={favoriteHandler}
                        favorite={favorite}
                    />
                </View>
            </View>
            <View>
                {(itemInfo.description && itemInfo.description.length > 0)?<ItemDescriptionText
                        description={itemInfo.description}
                        descStyle={{ marginTop: 12 }}
                    />:<></>}

                {variantOption ? itemInfo.allAttributes.map(item => {
                    return <ItemOptionList
                        mode="Variant"
                        onItemPick={pickVariantItem}
                        title={item.title}
                        data={item.items}
                        listKey={item.id}
                        variantOption={variantOption}
                    />
                }) : null}

                {itemInfo.extra && <ItemOptionList
                    onItemPick={pickExtraItem}
                    title="Toppings"
                    extraOption={extraOption}
                    data={itemInfo.extra}
                    mode="Extra"
                />}
            </View>
        </ScrollView>
        {/* <AddToCartButton
            cartHandler={cartHandler}
            count={count}
            priceLoading={false}
            newPrice={!itemInfo.variant ? itemInfo.newPrice : 0}
            setCount={setCount}
            variantPrice={variantInfo ? variantInfo.price : itemInfo.variant && itemInfo.variant.startingPrice}
            extraSum={extraSum}
            favoriteHandler={favoriteHandler}
            favorite={favorite}
        /> */}
    </>
}
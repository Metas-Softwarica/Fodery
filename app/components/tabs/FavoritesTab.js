import React, { useEffect, useState } from "react";
import { BackHandler, FlatList, RefreshControl, Text, TouchableHighlight, View } from "react-native";
import { Icon } from "react-native-eva-icons";
import { showMessage } from "react-native-flash-message";
import Swipeout from 'react-native-swipeout';
import { fonts } from "../../configs/commonStyles";
import { useAxiosObject } from '../../contexts/axios-context';
import { getUserFavorites, setFavoriteStatus } from "../../services/itemService";
import Actionbar from './../Actionbar';
import ListEmptyComponent from '../ListEmptyComponent';
import ItemCardList from "../item/ItemCardList";
import { constants, constraints } from "../../configs/constants";
// import {BottomSheetBackdrop, BottomSheetModal} from "@gorhom/bottom-sheet";
import { useSelector } from "react-redux";
import { themeState } from "../../store/slices/themeSlice";
import InsertToCart from "../InsertToCart";
import { useRef } from "react";
import { useCallback } from "react";
import { SwipeablePanel } from "rn-swipeable-panel";
import { customShowMessage } from "../../customMessage";


export default function FavoritesTab({ navigation }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const axiosInstance = useAxiosObject();
    const [refreshing, setRefreshing] = useState(false);
    const bottomRef = useRef(null);
    const colors = useSelector(themeState).colors;

    const [panelProps, setPanelProps] = useState({
        fullWidth: true,
        openLarge: false,
        showCloseButton: false,
        smallPanelHeight: 500,
        onClose: () => closePanel(),
        onPressCloseButton: () => closePanel(),
        // ...or any prop you want
    });
    const [isPanelActive, setIsPanelActive] = useState(false);

    const openPanel = () => {
        setIsPanelActive(true);
    };

    const closePanel = () => {
        setIsPanelActive(false);
        setSelectedItem(null)
    };
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            await loadFavorites();
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);
    useEffect(() => {
        loadFavorites();
    }, [])

    useEffect(() => {
        if (selectedItem) {
            // bottomRef.current.present();
            openPanel();
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            if (selectedItem) {
                // bottomRef.current.dismiss();
                closePanel();
                return true;
            }
            return false;
        })
        return () => backHandler.remove();
    }, [selectedItem])

    async function loadFavorites() {
        let res = await getUserFavorites(axiosInstance);
        if (res) {
            setFavorites(res);
            return;
        }
        customShowMessage(
            "Error fetching favorites. Try again!!",
             "danger",colors
        )
    }

    const cartPressHandler = (item) => {
        setSelectedItem(item);
    }

    // const renderBackdrop = useCallback(
    //     props => (
    //         <BottomSheetBackdrop
    //             {...props}
    //             pressBehavior={'close'}
    //             appearsOnIndex={0}
    //             disappearsOnIndex={-1}
    //         />
    //     ),
    //     []
    // );

    async function deleteFromFavorites(id) {
        let favoriteItem = null;
        favorites.forEach(item => {
            if (item.product.id === id) {
                favoriteItem = item;
                return;
            }
        });
        if (!favoriteItem) {
            return;
        }
        let filteredList = favorites.filter(item => item.product.id !== favoriteItem.product.id)
        setFavorites(filteredList);
        let res = await setFavoriteStatus(axiosInstance, { product: favoriteItem.product.id });
        if (res) {
            return;
        }
        customShowMessage(
             "Error removing favorite item!!",
             "danger",colors
        )
        setFavorites([...filteredList, favoriteItem]);
    }

    const refreshHandler = async () => {
        setRefreshing(true);
        await loadFavorites();
        setRefreshing(false);
    }

    return (
        <View style={{ flex: 1 }}>
            <Actionbar showButton showSearchBtn title="My Favorites" />

            <View style={{ flex: 1 }}>
                <FlatList
                    data={favorites}
                    renderItem={({ item }) => <Food
                        item={item.product}
                        onDelete={(id) => deleteFromFavorites(id)}
                        cartPressHandler={cartPressHandler}
                    />
                    }
                    keyExtractor={(item, index) => item.id}
                    showsVerticalScrollIndicator={false}
                    overScrollMode="never"
                    refreshControl={<RefreshControl
                        onRefresh={refreshHandler}
                        refreshing={refreshing}
                    />}
                    contentContainerStyle={{ padding: 20 }}
                    ListEmptyComponent={<ListEmptyComponent message={"No favorites set"} />}
                />
            </View>

            {/* <BottomSheetModal
                index={0}
                snapPoints={[400]}
                ref={bottomRef}
                backdropComponent={renderBackdrop}
                onDismiss={() => {
                    setSelectedItem(null)
                }}
                backgroundStyle={{backgroundColor: colors.backgroundColor}}
                handleStyle={{color: colors.backgroundColor}}
                handleIndicatorStyle={{backgroundColor: colors.textColorPrimary}}
            >
                <InsertToCart selectedItem={selectedItem}/>
            </BottomSheetModal> */}

            <SwipeablePanel {...panelProps} isActive={isPanelActive} style={{ backgroundColor: colors.backgroundColor, }}>
                <InsertToCart selectedItem={selectedItem} />
            </SwipeablePanel>
        </View>
    );
}

function Food({ item, onDelete, cartPressHandler }) {

    const colors = useSelector(themeState).colors;

    function onSwipeDelete() {
        onDelete(item.id)
    }

    function SwipeBtnDelete() {
        return (
            <TouchableHighlight
                underlayColor="#ff8367"
                onPress={onSwipeDelete}
                style={{
                    flex: 1,
                    backgroundColor: colors.accentColor2,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                <Icon name="trash-2-outline" fill="white" width={24} height={24} />
            </TouchableHighlight>
        );
    }


    return <View>
        <Swipeout
            style={{ borderRadius: constraints.borderRadiusSmall, marginBottom: 8 }}
            backgroundColor={colors.accentColor2}
            left={[{ component: <SwipeBtnDelete /> }]}
            right={[{ component: <SwipeBtnDelete /> }]}
        >
            <ItemCardList
                item={item}
                variant={!!item.allAttributes}
                startingPrice={item.allAttributes ? item.variant.startingPrice : item.newPrice}
                cartPressHandler={cartPressHandler}
            />
        </Swipeout>
    </View>;
}
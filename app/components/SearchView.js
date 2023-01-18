import React, {useEffect, useRef} from "react";
import {StyleSheet, TextInput, View} from 'react-native';

import {Icon} from 'react-native-eva-icons';
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import {useSelector} from "react-redux";
import {themeState} from "../store/slices/themeSlice";
import {constraints} from "../configs/constants";

export default function SearchView({ placeholder = "Search", showFilter, text, textChangeHandler = () => 1, editable = true, onFilterPress = () => 1, immediateFocus=false }) {

    const searchBoxRef = useRef(null);
    const colors = useSelector(themeState).colors;
    const styles = getStyles(colors);

    useEffect(() => {
        if (immediateFocus) {
            searchBoxRef.current.focus();
        }
    }, []);


    return (
        <View style={{ paddingBottom: constraints.sectionGap }}>
            <View style={styles.container}>
                <View style={styles.searchBoxFilterWrapper}>
                    <View style={styles.searchBox}>
                        <TextInput
                            ref={searchBoxRef}
                            style={styles.searchField}
                            value={text}
                            onChangeText={(text) => { textChangeHandler(text) }}
                            selectionColor={colors.GreyRegular}
                            editable={editable}
                        />
                        <View style={styles.searchIcon}>
                            <Icon name='search-outline' width={24} height={24} fill='#999' />
                        </View>
                    </View>
                    {showFilter && <Pressable style={styles.filterIcon} onPress={onFilterPress}>
                        <Icon name='funnel-outline' width={28} height={28} fill={colors.white} />
                    </Pressable>}
                </View>
            </View>
        </View>
    );
}

function getStyles(colors) {
    return StyleSheet.create({
        container: {
            display: "flex",
            paddingHorizontal: 20,
        },
        searchBoxFilterWrapper: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 15,
        },
        searchBox: {
            flex: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
        },
        searchField: {
            flexGrow: 1,
            padding: 6,
            paddingBottom: 4,
            height: 40,
            fontSize: 16,
            backgroundColor: colors.borderColor,
            borderRadius: constraints.borderRadiusSmall,
            paddingHorizontal: 8,
            color: colors.textColorPrimary
        },
        searchIcon: {
            position: "absolute",
            right: 0,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            height: "100%",
            paddingLeft: 8,
            paddingRight: 8
        },
        filterIcon: {
            justifyContent: "center",
            backgroundColor: "tomato",
            padding: 6,
            marginLeft: 8,
            borderRadius: 6,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,
        }
    });
}

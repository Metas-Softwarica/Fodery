import React, {useRef, useState} from 'react';
import {FlatList, ScrollView, Text, useWindowDimensions, View} from "react-native";
import {styles} from "./ItemDescriptionBar";
import {themeState} from "../../store/slices/themeSlice";
import {useSelector} from "react-redux";
import {fonts, homeCardStyle} from "../../configs/commonStyles";
import {Gap} from "../util/Gap";
import ItemCard from "../item/ItemCard";
import {constraints} from "../../configs/constants";
import {utilStyles} from "../../configs/utilStyles";

function ListCardHorizontal({items, cartPressHandler}) {


    const colors = useSelector(themeState).colors;
    const {width} = useWindowDimensions();
    const cardWidth = (width * .66) + constraints.cardPadding;

    return (
        <View style={[homeCardStyle(colors), {paddingBottom: constraints.cardPadding}]}>

            <View style={{
                ...styles(colors).descriptionBlock,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <View style={{width: "60%"}}>
                    <Text style={styles(colors).category}>FROM</Text>
                    {/* <Gap y={4}/> */}
                    <Text style={{...styles(colors).heading, textTransform: "uppercase", ...fonts.black}}>My
                        Favorites</Text>
                </View>
            </View>

            {
                items.length === 1
                    ? <View style={utilStyles.centerXY}>
                        <Item
                            cartPressHandler={cartPressHandler} item={items[0]}
                            width={width - (constraints.screenPaddingHorizontal * 2) - (constraints.cardPadding * 2)}
                            height={200}
                        />
                    </View>

                    : <FlatList
                        data={items}
                        renderItem={({item}) => (
                            <Item cartPressHandler={cartPressHandler} item={item}/>
                        )}
                        contentContainerStyle={{paddingHorizontal: constraints.cardPadding}}
                        horizontal
                        overScrollMode="never"
                        snapToAlignment={"end"}
                        snapToOffsets={items.map((item, i) => i * cardWidth)}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={() => <Gap x={constraints.cardPadding}/>}
                    />
            }

        </View>
    );
}

function Item({item, cartPressHandler, width, height}) {
    const windowWidth = useWindowDimensions().width;
    return (
        <ItemCard
            width={width ? width : windowWidth * .66}
            imageHeight={height}
            cartPressHandler={cartPressHandler}
            item={item}
            variant={!!item.allAttributes}
            startingPrice={item.allAttributes ? item.variant.startingPrice : item.newPrice}
        />
    );
}

export default ListCardHorizontal;
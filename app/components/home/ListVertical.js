import React from 'react';
import { FlatList, Text, View } from "react-native";
import { fonts, homeCardStyle } from "../../configs/commonStyles";
import { constraints } from "../../configs/constants";
import { Gap } from "../util/Gap";
import { styles } from "./ItemDescriptionBar";
import ItemCardList from "../item/ItemCardList";
import { useSelector } from "react-redux";
import { themeState } from "../../store/slices/themeSlice";

function ListVertical({ items, cartPressHandler, eachCardStyle = {} }) {

    const colors = useSelector(themeState).colors;
    const listStyles = styles(colors);

    return (
        <View style={[homeCardStyle(colors), { paddingBottom: constraints.cardPadding }]}>

            <View style={{
                ...listStyles.descriptionBlock,
            }}>
                <View style={{ paddingTop: constraints.sectionGap }}>
                    <Text style={{ ...listStyles.heading, textTransform: "uppercase", ...fonts.black }}>You May Also Like</Text>
                </View>
            </View>

            <View style={{ paddingHorizontal: constraints.cardPadding }}>
                {
                    items && items.map(item => {
                        return <>
                            <Item item={item} cartPressHandler={cartPressHandler} cardStyle={eachCardStyle} />
                            <Gap y={constraints.cardPadding} />
                        </>
                    })
                }
            </View>
        </View>
    );
}

function Item({ item, cartPressHandler, cardStyle = {} }) {
    const colors = useSelector(themeState).colors;
    return (
        <View>
            <ItemCardList
                cartStyle= {cardStyle}
                item={item}
                variant={!!item.allAttributes}
                startingPrice={item.allAttributes ? item.variant.startingPrice : item.newPrice}
                cartPressHandler={cartPressHandler}
            />
        </View>
    );
}

export default ListVertical;
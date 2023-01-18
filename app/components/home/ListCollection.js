import React from 'react';
import { fonts, homeCardStyle } from "../../configs/commonStyles";
import { constraints } from "../../configs/constants";
import { FlatList, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { themeState } from "../../store/slices/themeSlice";
import { styles } from "./ItemDescriptionBar";
import { Gap } from "../util/Gap";
import ItemCardForCollection from "../item/ItemCardForCollection";

function ListCollection({ title = "Winter Offers", items, cartPressHandler }) {

    const colors = useSelector(themeState).colors;
    const listStyles = styles(colors);

    if (items.length > 0) {
        return (
            <View style={[homeCardStyle(colors), { paddingBottom: constraints.cardPadding }]}>

                <View style={listStyles.descriptionBlock}>
                    <View style={{ paddingTop: constraints.sectionGap }}>
                        <Text style={{ ...listStyles.heading, textTransform: "uppercase", ...fonts.black }}>{title}</Text>
                    </View>
                </View>


                <FlatList
                    data={items}
                    renderItem={({ item }) => <ItemCardForCollection
                        item={item}
                        startingPrice={item.allAttributes ? item.variant.startingPrice : item.newPrice}
                        cartPressHandler={cartPressHandler} />
                    }
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: constraints.cardPadding }}
                    horizontal
                    overScrollMode="never"
                    ItemSeparatorComponent={() => <Gap x={constraints.cardPadding} />}
                />

            </View>
        );
    } else {
        return null;
    }

}

export default ListCollection;
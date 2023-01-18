import { useNavigation } from "@react-navigation/native";
import { Video } from "expo-av";
import React from "react";
import { Image, Text, TouchableHighlight, View } from "react-native";
import { useSelector } from "react-redux";
import { fonts, homeCardStyle } from "../../configs/commonStyles";
import { constants } from "../../configs/constants";
import { themeState } from "../../store/slices/themeSlice";
import { ItemDescriptionBar } from "./ItemDescriptionBar";


function ItemCardLarge({ videoUrl, item, cartPressHandler, coverImage = {} }) {
    const colors = useSelector(themeState).colors;
    const navigation = useNavigation();

    return (
        <TouchableHighlight
            style={homeCardStyle(colors)}
            underlayColor={colors.cardColor}
            onPress={() => navigation.navigate("Item", { slug: item.id })}
        >
            <View>
                <View>
                    {videoUrl
                        ? <Video
                            source={{ uri: videoUrl }}
                            style={{
                                height: 300,
                                width: "100%",
                            }}
                            resizeMode="cover"
                            shouldPlay
                            isMuted
                            isLooping

                        />
                        : <Image
                            source={{ uri: constants.baseURL + coverImage.url }}
                            style={{
                                height: 300,
                                width: "100%"
                            }}
                        />

                    }
                    <View  style={{position:"absolute", bottom: 12, right: 8, flexDirection: "row"}}>
                        {item.offers ? item.offers.map(item => {
                            return (<View style={{marginHorizontal:5, borderRadius:99, borderColor: colors.accentColor, borderWidth:0.5,  backgroundColor: 'rgba(2,156,41,.6)'}}>
                                        <Text style={{...fonts.regular, fontSize:14, marginHorizontal: 12, marginVertical: 8, color: "white"}}>{(item.typeOfOffer == "percentage") ?  item.value+ "%": "Rs." + item.value} off</Text>
                                    </View>)
                        }) : null}
                    </View>
                    
                </View>

                <ItemDescriptionBar
                    variant={!!item.allAttributes}
                    item={item}
                    startingPrice={item.allAttributes ? item.variant.startingPrice : item.newPrice}
                    cartPressHandler={cartPressHandler}
                />
            </View>
        </TouchableHighlight>
    );
}

export default ItemCardLarge;
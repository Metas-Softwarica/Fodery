import React, {useState} from 'react';
import {Image, Pressable,useWindowDimensions, StyleSheet} from "react-native";
import {constraints, constants} from "../../configs/constants";
import { useNavigation } from "@react-navigation/native";


function ItemImage({item, image }) {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const [aspectRatio, setAspectRatio] = useState(1);

    Image.getSize(
        constants.baseURL + image.url,
        (width, height) => {
            setAspectRatio((width)/height);
        },
        (error) => console.error(error)
    );

    
    const styles = StyleSheet.create({
        image: {
            height: width/aspectRatio,
            resizeMode: "cover",
            borderRadius: constraints.borderRadiusMedium,
            marginHorizontal: constraints.screenPaddingHorizontal,
            marginVertical: constraints.sectionGap
        }
    });
    return (
        <Pressable
        style={{flex:1}}
            onPress={() => navigation.navigate("Item", { slug: item.id })}
        >
            {!!item && !!image && <Image
                style={styles.image}
                source={{
                    uri: constants.baseURL + image.url
                }}
            />}
        </Pressable>
    );

    
}


export default ItemImage;
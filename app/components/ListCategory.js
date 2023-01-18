import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { fonts } from "../configs/commonStyles";
import { useAxiosObject } from '../contexts/axios-context';
import { getItemsByFeatured } from "../services/categoryService";
import { cartState } from "../store/slices/cartSlice";
import ItemCard2 from "./item/ItemCard2";

export default function ListCategory({ slug, listTitle, }) {

    const [items, setItems] = useState([]);
    const axiosInstance = useAxiosObject();
    const products = useSelector(cartState).products;


    useEffect(() => {
        async function inner() {
            let res = await getItemsByFeatured(axiosInstance, slug);
            if (res.isAxiosError) { return }

            setItems(res.results[0].foods);
        }
        inner();
    }, [])

    const styles = StyleSheet.create({
        container: {
            marginTop: 12
        },
        title: {
            fontSize: 16,
            paddingLeft: 20,
        },
        list: {
            marginTop: 10,
        }
    })

    return <View style={styles.container}>
        {console.log("here")}
        <Text style={[styles.title, fonts.poppinsBold]}>{listTitle}</Text>
        <FlatList
            style={styles.list}
            data={items}
            renderItem={({ item }) => {
                return <ItemCard2
                    categoryTitle={item.category}
                    imgURL={item.coverImage}
                    price={item.newPrice}
                    slug={item.id}
                    title={item.title}
                    alreadyInCart={products}
                />
            }}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            overScrollMode="never"
        />
    </View>
}


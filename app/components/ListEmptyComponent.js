import React from "react"
import { StyleSheet, Text, View } from "react-native"

export default function ListEmptyComponent({ message, viewStyle, textStyle }) {
    return <View style={[styles.view, { ...viewStyle }, { ...textStyle }]}>
        <Text style={styles.text}>
            {message}
        </Text>
    </View>
}

const styles = StyleSheet.create({
    view: {
        marginTop: 20,
    }, text: {
        textAlign: "center"
    }
})
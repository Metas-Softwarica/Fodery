import React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../configs/colors";

export default function Progress({ total, current }) {

    const styles = StyleSheet.create({
        wrapper: {
            width: "100%",
            height: 2,
        },
        inner: {
            width: `${(current / total) * 100}%`,
            backgroundColor: colors.progressColor,
            height: "100%"
        }
    })

    return <View style={styles.wrapper}>
        <View style={styles.inner} />
    </View>
}


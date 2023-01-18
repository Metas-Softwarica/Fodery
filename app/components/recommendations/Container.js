import { ScrollView, Text, View, StyleSheet } from "react-native";
import { fonts } from "../../configs/commonStyles";
import { utilStyles } from "../../configs/utilStyles";
import { BackButton } from "./BackButton";
import { Gap } from "../util/Gap";
import { ContinueButton } from "./ContinueButton";
import React from "react";
import Progress from "../Progress";
import { useSelector } from "react-redux";
import { themeState } from "../../store/slices/themeSlice";
import { constraints } from "../../configs/constants";

export function Container({ continueButtonDisabled, onNext, title, children, progress, leftTitleChild }) {


    const colors = useSelector(themeState).colors;

    const styles = getStyles(colors);

    return <>
        <Progress total={5} current={progress} />

        <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {leftTitleChild}
        </View>
        <ScrollView style={{ flex: 1, flexGrow: 1 }}>


            <ScrollView
                scrollEnabled={true}

                contentContainerStyle={{ flex: 1, paddingHorizontal: 32 }}
            >
                {/* <View style={{ height: 50, backgroundColor: "grey" }} />
                <View style={{ height: 50, backgroundColor: "red" }} />
                <View style={{ height: 50, backgroundColor: "grey" }} />
                <View style={{ height: 50, backgroundColor: "red" }} />
                <View style={{ height: 50, backgroundColor: "grey" }} />
                <View style={{ height: 50, backgroundColor: "red" }} />
                <View style={{ height: 50, backgroundColor: "grey" }} />
                <View style={{ height: 50, backgroundColor: "red" }} />
                <View style={{ height: 50, backgroundColor: "grey" }} />
                <View style={{ height: 50, backgroundColor: "red" }} />
                <View style={{ height: 50, backgroundColor: "grey" }} />
                <View style={{ height: 50, backgroundColor: "red" }} />
                <View style={{ height: 50, backgroundColor: "grey" }} />
                <View style={{ height: 50, backgroundColor: "red" }} />
                <View style={{ height: 50, backgroundColor: "grey" }} />
                <View style={{ height: 50, backgroundColor: "red" }} />
                <View style={{ height: 50, backgroundColor: "grey" }} />
                <View style={{ height: 50, backgroundColor: "red" }} />
                <View style={{ height: 50, backgroundColor: "grey" }} />
                <View style={{ height: 50, backgroundColor: "grey" }} />
                <View style={{ height: 50, backgroundColor: "red" }} />
                <View style={{ height: 50, backgroundColor: "grey" }} />
                <View style={{ height: 50, backgroundColor: "red" }} />
                <View style={{ height: 50, backgroundColor: "grey" }} />
                <View style={{ height: 50, backgroundColor: "red" }} />
                <View style={{ height: 50, backgroundColor: "grey" }} />
                <View style={{ height: 50, backgroundColor: "red" }} />
                <View style={{ height: 50, backgroundColor: "grey" }} />
                <View style={{ height: 50, backgroundColor: "red" }} />
                <View style={{ height: 50, backgroundColor: "grey" }} />
                <View style={{ height: 50, backgroundColor: "red" }} />
                <View style={{ height: 50, backgroundColor: "grey" }} />
                <View style={{ height: 50, backgroundColor: "red" }} />
                <View style={{ height: 50, backgroundColor: "grey" }} />
                <View style={{ height: 50, backgroundColor: "red" }} />
                <View style={{ height: 50, backgroundColor: "grey" }} />
                <View style={{ height: 50, backgroundColor: "red" }} />
                <View style={{ height: 50, backgroundColor: "grey" }} /> */}

                {children}
                <View style={{ height: 200 }} />

            </ScrollView>


        </ScrollView>
        <View style={{
            flexDirection: "row",
            width: "100%",
            paddingHorizontal: 16,
            position: "absolute",
            bottom: 16,
            alignItems: "center"
        }}>
            <BackButton />
            <Gap x={16} />
            <ContinueButton disabled={continueButtonDisabled} onPress={onNext} />
        </View>
    </>;
}

function getStyles(colors) {
    return StyleSheet.create({
        titleContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            margin: constraints.screenPaddingHorizontal * 1.5,
        },
        title: {
            ...fonts.bold,
            fontSize: constraints.textSizeHeading3,
            color: colors.textColorPrimary
        }
    });
}
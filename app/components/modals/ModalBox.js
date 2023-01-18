import React from "react";
import { Modal, Pressable, useWindowDimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { colors } from "../../configs/colors";


export default function ModalBox({ modalVisible, setModalVisible, widthPercent = 1/12, heightPercent = 1/6,containerStyle,bodyStyle, ...props }) {

    const { width, height } = useWindowDimensions();

    return <Modal
        animationType="slide"
        statusBarTranslucent={true}
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            setModalVisible(!modalVisible);
        }}
        {...props}
    >
        <ScrollView contentContainerStyle={{ flex: 1 }}>
            <Pressable style={{ flex: 1, backgroundColor: colors.overlayBg,...containerStyle }}
                onPress={() => {
                    // setModalVisible(!modalVisible); 
                }}>
                <View style={{
                    flex: 1,
                    borderRadius: 6,
                    marginHorizontal: width * widthPercent,
                    marginVertical: height * heightPercent,
                    backgroundColor: "white",
                    ...bodyStyle
                }}>
                    {props.children}
                </View>
            </Pressable>
        </ScrollView>
    </Modal>
}
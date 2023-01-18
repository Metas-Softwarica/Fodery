import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";
import { showMessage } from "react-native-flash-message";
// import OTPInput from "react-native-otp-input-fields-suzan";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../configs/colors";
import { fonts } from "../../configs/commonStyles";
import { constants, constraints } from "../../configs/constants";
import { useAxiosObject } from "../../contexts/axios-context";
import { checkToken, requestOTP } from "../../services/authService";
import { setPhoneStatus, userState, setToken } from "../../store/slices/userSlice";
import ButtonRipple from "../inputs/buttons/ButtonRipple";
import Input from "../inputs/text/Input";
import { themeState } from "../../store/slices/themeSlice";
import { ScrollView } from "react-native-gesture-handler";
// import OTPInputView from '@twotalltotems/react-native-otp-input'
import { useKeyboard } from "../../hooks/useKeyboard";
import Constants from "expo-constants";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell
} from "react-native-confirmation-code-field";
import { Gap } from "../util/Gap";
import { customShowMessage } from "../../customMessage";
const CELL_COUNT = 6;

export function VerifyPhone() {
  const { height } = useWindowDimensions();
  const [phoneFormCardHeight, setPhoneFormCardHeight] = useState(0);
  const [OTP, setValue] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const axiosInstance = useAxiosObject();
  const dispatch = useDispatch();
  const selector = useSelector(userState);
  const cardBackgroundColor = "#f9f9f9";
  const themeColors = useSelector(themeState).colors;
  const keyboardHeight = useKeyboard();
  const STATUSBAR_HEIGHT = Constants.statusBarHeight;
  const [timerEnabled, setTimerEnabled] = useState(false);


  // useEffect(async () => {
  //   // let res = await checkToken();
  //   // if (res) {
  //   //   dispatch(setToken(res));
  //   // }
  //   //   // let result = await SecureStore.getItemAsync("phone");
  //   //   // if (result) {
  //   //   //   setPhoneNumber(result);
  //   //   // }
  // }, []);

  async function sendOTPRequest() {
    if (!phoneNumber.trim()) {
      return;
    }
    if (phoneNumber.length != 10) {
      customShowMessage(
        "Phone number should be exactly 10 digits.",
        "danger",
        themeColors
      );
      return false;
    }
    // let res = await requestOTP(axiosInstance, { phone: phoneNumber });

    axios
      .post(
        constants.baseURL + "user/verify_phone",
        { phone: phoneNumber },
        {
          headers: {
            token: selector.tokens.access_token
          }
        }
      )
      .then(res => {
        if (res.status === 200) {
          SecureStore.setItemAsync("phone", phoneNumber).then(() => {
            setTimerEnabled(true);
            customShowMessage(
              "Your OTP message will arrive shortly",
              "info", themeColors
            );
            return true;
          }).catch(err => {
            customShowMessage(
              err.response.data.message ?? "Something went wrong.",
              "danger", themeColors
            );
          });
        } else if (res.status === 902) {
          customShowMessage(
            res.data.message ?? "You have been blocked for spamming phone verification. Try again in an hour!!",
            "danger",
            themeColors
          );
          return false;
        } else if (res.status === 400) {
          customShowMessage(
            res.data.message ?? "Something went wrong.",
            "danger", themeColors
          );
          return false;
        }
      })
      .catch(err => {
        if (err.response.status === 902) {
          customShowMessage(
            err.response.data.message ?? "You have been blocked for spamming phone verification. Try again in an hour!!",
            "danger",
            themeColors
          );
        } else if (err.response.status === 400) {
          customShowMessage(
            err.response.data.message ?? "Something went wrong.",
            "danger", themeColors
          );
        } else {
          customShowMessage(
            err.response.data.message ?? "Something went wrong.",
            "danger", themeColors
          );
        }
        return false;
      });
    // if (res.response) {
    //   if (res.status === 902) {
    //     customShowMessage(
    //       res.data.message ?? "You have been blocked for spamming phone verification. Try again in an hour!!",
    //        "danger",
    //        themeColors
    //     );
    //   } else if (res.status === 400) {
    //     customShowMessage(
    //        res.data.message ?? "Something went wrong.",
    //        "danger",themeColors
    //     );
    //   }
    //   return false;
    // }

  }

  async function handleSubmit() {
    if (!OTP.trim()) {
      return;
    }
    axios
      .post(
        constants.baseURL + "user/verify_code",
        { phone: phoneNumber, code: OTP },
        {
          headers: {
            token: selector.tokens.access_token
          }
        }
      )
      .then(res => {
        if (res.status === 200) {
          customShowMessage(
            "OTP verified successfully",
            "success",
            themeColors
          );
          dispatch(setPhoneStatus(1));
        } else {
          customShowMessage(
            "OTP does not match. Try again!!",
            "danger",
            themeColors
          );
        }
      })
      .catch(err => {
        customShowMessage(
          "OTP does not match. Try again!!",
          "danger",
          themeColors
        );
      });
  }
  const ref = useBlurOnFulfill({ OTP, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    OTP,
    setValue
  });
  return (
    <View
      style={{ height: keyboardHeight == 0 ? height : height - keyboardHeight }}
    >
      <ScrollView
        style={{}}
        scrollEnabled={true}
        backgroundColor={themeColors.accentColor}

      >
        <View
          style={{
            paddingHorizontal: 32,
            paddingTop: 42,
            paddingBottom: 28,
            backgroundColor: themeColors.backgroundColor,
            borderBottomStartRadius: 24,
            borderBottomEndRadius: 24,
            elevation: 12
          }}
          onLayout={event => {
            setPhoneFormCardHeight(event.nativeEvent.layout.height);
          }}
        >
          <Text
            style={{
              ...fonts.black,
              fontSize: constraints.headingPrimaryFontSize,
              color: themeColors.textColorPrimary
            }}
          >
            Phone Verification
          </Text>
          <Text
            style={{
              ...fonts.regular,
              color: themeColors.textColorSecondary,
              fontSize: constraints.captionPrimaryFontSize,
              marginTop: 8
            }}
          >
            Enter your phone number. An OTP will be sent to this number.
          </Text>

          <Image
            source={require("../../../assets/phone-verify.png")}
            style={{
              height: 80,
              width: 80,
              alignSelf: "center",
              marginVertical: 18
            }}
          />

          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                paddingVertical: 8
              }}>
              <Text
                style={{
                  ...fonts.regular,
                  color: themeColors.textColorSecondary,
                  fontSize: constraints.captionPrimaryFontSize,
                  paddingHorizontal: constraints.inputFieldHorizontalPadding,
                  borderRadius: constraints.borderRadiusMin,
                  paddingVertical: constraints.buttonPaddingVertical,
                  borderWidth: 1,
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: themeColors.borderColorSecondary,
                  color: themeColors.textColorPrimary
                }}
              >
                +977
              </Text>
              <Gap x={12} />
              <Input
                placeholder="Enter your phone number"
                containerStyle={{
                  backgroundColor: colors.backgroundColor,
                  borderRadius: 4,
                  flex: 1,
                }}
                inputStyle={{
                  ...fonts.regular,
                  paddingHorizontal: constraints.inputFieldHorizontalPadding,
                  borderRadius: constraints.borderRadiusMin,
                  paddingVertical: constraints.inputFieldVerticalPadding,
                  borderWidth: 1,
                  borderColor: themeColors.borderColorSecondary,
                  color: themeColors.textColorPrimary
                }}
                setText={setPhoneNumber}
                keyboardType={'number-pad'}
                placeholderTextColor={themeColors.textColorSecondary}
                text={phoneNumber}
              />
            </View>

            <TimerButton onClick={sendOTPRequest} timerEnabled={timerEnabled} setTimerEnabled={setTimerEnabled} />
          </View>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >

          {(!timerEnabled) ? <View style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            elevation: 9,
            backgroundColor: themeColors.accentColor,
            opacity: 0.5,
          }}>

          </View>
            : <></>}
          <View style={{ padding: 32 }}>
            <Text
              style={{
                ...fonts.regular,
                fontSize: constraints.captionPrimaryFontSize
              }}
            >
              Enter your OTP code here.
            </Text>

            <View style={{ marginVertical: 18 }}>
              <CodeField
                ref={ref}
                {...props}
                value={OTP}
                onChangeText={setValue}
                editable={timerEnabled}
                cellCount={CELL_COUNT}
                rootStyle={buttonStyle.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) =>
                  <Text
                    key={index}
                    style={[
                      buttonStyle.cell,
                      isFocused && buttonStyle.focusCell
                    ]}
                    onLayout={getCellOnLayoutHandler(index)}
                  >
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>}
              />
            </View>

            <ButtonRipple
              title="VERIFY ME"
              containerStyle={{
                elevation: 6,
                borderRadius: constraints.borderRadiusMin
              }}
              style={{
                ...buttonStyle.style,
                backgroundColor: themeColors.black,
                borderRadius: constraints.borderRadiusMin
              }}
              textStyle={{
                ...buttonStyle.text,
                color: colors.white,
                fontSize: constraints.buttonTextPrimaryFontSize
              }}
              onPress={handleSubmit}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}

const buttonStyle = StyleSheet.create({
  style: {
    backgroundColor: "white",
    paddingVertical: constraints.buttonPaddingVertical
  },
  text: {
    ...fonts.black,
    color: "black",
    fontSize: constraints.buttonTextPrimaryFontSize
  },
  root: { flex: 1, padding: 20 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 20,
    borderWidth: 1,
    borderColor: "#000",
    textAlign: "center",
    borderRadius: 5
  },
  focusCell: {
    borderColor: "#000"
  }
});

function TimerButton({ onClick, timerEnabled, setTimerEnabled }) {
  const [countDown, setCountDown] = useState(60);
  // const [timerEnabled, setTimerEnabled] = useState(false);
  const countDownRef = useRef(60);
  const sentOnce = useRef(false);
  const themeColors = useSelector(themeState).colors;

  useEffect(
    () => {
      if (timerEnabled) {
        countDownRef.current = 60;
        let interval = setInterval(() => {
          if (countDownRef.current <= 1) {
            clearInterval(interval);
            setTimerEnabled(false);
            setCountDown(60);
            return;
          }
          --countDownRef.current;
          setCountDown(countDownRef.current);
          sentOnce.current = true;
        }, 1000);
      }
    },
    [timerEnabled]
  );

  return (
    <ButtonRipple
      title={
        timerEnabled
          ? `Resend after ${countDown} seconds`
          : sentOnce.current ? "RESEND" : "SEND OTP CODE"
      }
      containerStyle={{
        elevation: constraints.primaryElevation,
        borderRadius: constraints.borderRadiusMin
      }}
      style={{
        ...buttonStyle.style,
        backgroundColor: timerEnabled
          ? themeColors.cardColor
          : themeColors.accentColor,
        borderRadius: constraints.borderRadiusMin
      }}
      textStyle={{
        ...buttonStyle.text,
        color: themeColors.black
      }}
      disabled={timerEnabled}
      onPress={async () => {
        let res = await onClick();
        if (res) {
          setTimerEnabled(true);
        }
      }}
    />
  );
}

import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useFormik } from "formik";
import { useEffect } from 'react';
import React, { useState } from "react";
import { Text, TouchableOpacity, useWindowDimensions, View, Image, Modal, TouchableWithoutFeedback } from "react-native";
import { Icon } from "react-native-eva-icons";
import { showMessage } from "react-native-flash-message";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { fonts } from "../../configs/commonStyles";
import { useAxiosObject } from "../../contexts/axios-context";
import { login, secureStoreToken, forgetPassword, checkToken } from "../../services/authService";
import { setToken } from "../../store/slices/userSlice";
import ButtonRipple from "../inputs/buttons/ButtonRipple";
import SingleSelectItem from "../inputs/select/SingleSelectItem";
import Input from "../inputs/text/Input";
import { switchTheme, themeState } from "../../store/slices/themeSlice";
import { constraints } from '../../configs/constants';
import { Gap } from "../util/Gap";
import { getAboutDetails } from '../../services/appService';
import { useNavigation } from "@react-navigation/native";
import { customShowMessage } from '../../customMessage';

export function SignInForm({ signInCardHeight, onSignUp }) {
    const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
    const { height } = useWindowDimensions();
    const axiosInstance = useAxiosObject();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigator = useNavigation();
    const [appInfo, setAppInfo] = useState(null);
    const colors = useSelector(themeState).colors;
    

    const signInSchema = Yup.object().shape({
        email: Yup.string()
            .min(10, "Enter your email or phone.")
            .required('Required'),
        recoverEmail: Yup.string()
        .email("Enter your valid email."),
        password: Yup.string()
            .min(2, 'Too Short!')
            .required('Required')
    });

    const { handleChange, handleSubmit, handleBlur, setFieldValue, values, errors, touched } = useFormik({
        validationSchema: signInSchema,
        initialValues: { email: '', password: '', recoverEmail:'' },
        onSubmit: values => {
            attemptLogin(values.email, values.password);
        }
    });

    const attemptLogin = async (email, password) => {
        setLoading(true);
        let res = await login(axiosInstance, email, password);
        setLoading(false);
        if (res) {
            // if (checkToken()) {
            dispatch(setToken(res));
            // }

        } else {
            customShowMessage("User credentials don't match!! Try Again", "danger", colors);
        }
    }

    const attemptForgetPasswordForm = async (email) => {
        setLoading(true);
        let res = await forgetPassword(axiosInstance, email);
        setLoading(false);
        if (res.status) {
            customShowMessage(
                "Verification Email has been sent.",
                "success", colors
            );
            setFieldValue("recoverEmail", "");
            setForgotPasswordModal(false);
        } else {
            customShowMessage(
                res.message ?? "Can't verify your email.",
                "danger", colors
            );
        }
    }

    const getData = async()=> {
        let res = await getAboutDetails(axiosInstance);
        if (res) {
            setAppInfo(res);
        }
    }
    useEffect(() => {
        getData();
    }, []);
        

    return <View style={
        {
            flexGrow: 1,
            marginTop: 8,
            paddingTop: 32,
            paddingBottom: 16,
            paddingHorizontal: 32,
            backgroundColor: colors.backgroundColor,
            borderTopStartRadius: 32,
            borderTopEndRadius: 32,
            height: height - signInCardHeight,
            elevation: 12
        }
    }>
        <Input
            placeholder="Email or phone"
            containerStyle={{ borderRadius: constraints.borderRadiusMin, marginBottom: 8, }}
            inputStyle={{
                ...fonts.regular,
                fontSize: 13,
                paddingHorizontal: 22,
                borderColor: colors.borderColor,
                borderRadius: constraints.borderRadiusMin,
                borderWidth: 1,
                backgroundColor: colors.backgroundColor,
                paddingVertical: 8,
            }}
            setText={handleChange('email')}
            keyboardType="email-address"
            onBlur={handleBlur('email')}
            error={errors.email}
            touched={touched.email}
            errorStyle={{ paddingLeft: 20 }}
            placeholderTextColor={colors.textColorSecondary}
        />

        <Input
            placeholder="Password"
            onBlur={handleBlur('password')}
            error={errors.password}
            touched={touched.password}
            containerStyle={{
                borderRadius: 5,
                marginBottom: 8,
            }}
            errorStyle={{ paddingLeft: 20 }}
            inputStyle={{
                ...fonts.regular,
                fontSize: 13,
                paddingHorizontal: 22,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: colors.borderColor,
                backgroundColor: colors.GreyShadeLight,
                paddingVertical: 8,
            }}
            setText={handleChange('password')}
            password
            placeholderTextColor={colors.textColorSecondary}
        />

        <TouchableOpacity style={{ alignItems: "flex-end" }} onPress={() => {
            setForgotPasswordModal(true);
        }}>
            <Text style={{ ...fonts.regular, fontSize: 12, color: colors.textColorSecondary }}>Forgot Password?</Text>
        </TouchableOpacity>

        <ButtonRipple
            title={loading ? "Logging in..." : "LOGIN"}
            containerStyle={{ borderRadius: constraints.borderRadiusMin, marginVertical: constraints.buttonPaddingVertical }}
            style={{ backgroundColor: colors.accentColor, borderRadius: constraints.borderRadiusMin, paddingVertical: constraints.buttonPaddingVertical }}
            textStyle={{ ...fonts.black, fontSize: constraints.buttonTextPrimaryFontSize, color: colors.black, textTransform: "uppercase" }}
            onPress={handleSubmit}
            disabled={loading}
        />

        <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{
                ...fonts.regular,
                color: colors.textColorSecondary,
                fontSize: constraints.captionSecondaryFontSize
            }}>{"Don't have an account? "}</Text>
            <TouchableOpacity onPress={onSignUp}>
                <Text style={{ ...fonts.regular, color: colors.textColorPrimary, fontSize: constraints.captionSecondaryFontSize }}>{"Sign Up"}</Text>
            </TouchableOpacity>
        </View>

        <TouchableOpacity style={{ marginTop: "auto", alignItems: "center", paddingVertical: 6 }} onPress={() => {
            if (!appInfo) { return }
            navigator.navigate("Terms", {
                url: appInfo.terms,
                title: "Terms & Conditions"
            });
        }}>
            <Text style={{ ...fonts.regular, color: colors.textColorPrimary, fontSize: constraints.spanTextFontSize }}>By signing in, you will agree to our</Text>
            <Text style={{ ...fonts.regular, color: colors.textColorPrimary, fontSize: constraints.spanTextFontSize, textDecorationLine: "underline" }}>Terms and Conditions</Text>
        </TouchableOpacity>
        <Modal
            animationType="fade"
            transparent={true}
            visible={forgotPasswordModal}
        >

            <TouchableOpacity style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: 'rgba(0,0,0,0.5)'
            }}
                onPress={() => {
                    setFieldValue("email", "");
                    setForgotPasswordModal(false);
                }}>
                <TouchableWithoutFeedback >
                    <View style={{ backgroundColor: colors.cardColor, flexGrow: 1, borderRadius: constraints.borderRadiusMin, padding: 30, alignItems: "center", marginHorizontal: 20 }}>
                        <Text style={{
                            ...fonts.bold, fontSize: constraints.textSizeHeading3, color: colors.buttonTextColorPrimary,
                        }}>{"Forget Passsword?"}</Text>
                        <Gap y={12} />
                        <Text style={{
                            ...fonts.regular, fontSize: constraints.textSizeLabel2, color: colors.textColorSecondary,
                            textAlign: "center"
                        }}>{"Enter the email address associated with your account."}</Text>
                        <Gap y={20} />
                        <Input
                            placeholder="example@gmail.com"
                            containerStyle={{ borderRadius: constraints.borderRadiusMin, marginBottom: 8, }}
                            inputStyle={{
                                ...fonts.regular,
                                fontSize: constraints.captionSecondaryFontSize,
                                paddingHorizontal: 22,
                                minWidth: "100%",
                                borderColor: colors.cardColorSecondary,
                                borderRadius: constraints.borderRadiusMin,
                                borderWidth: 1,
                                backgroundColor: colors.cardColor,
                                paddingVertical: 8,
                            }}
                            setText={handleChange('recoverEmail')}
                            keyboardType="email-address"
                            onBlur={handleBlur('recoverEmail')}
                            error={errors.recoverEmail}
                            touched={touched.recoverEmail}
                            errorStyle={{ paddingLeft: 20 }}
                            placeholderTextColor={colors.textColorSecondary}
                        />
                        <TouchableOpacity style={{ justifyContent: "flex-end", alignItems: "flex-end", borderRadius: 5, marginTop: 20, paddingHorizontal: 18, paddingVertical: 8, backgroundColor: colors.buttonTextColorPrimary }} onPress={() => {

                            if (!loading) {
                                if (values.recoverEmail == "") {
                                    customShowMessage(
                                        "Enter your email.",
                                        "danger", colors
                                    );
                                } else if (errors.recoverEmail) {
                                    customShowMessage(
                                        "Enter your valid email.",
                                        "danger", colors
                                    );
                                } else {
                                    attemptForgetPasswordForm({ "email": values.recoverEmail });
                                }
                            }

                        }}>

                            <Text style={{
                                ...fonts.black, fontSize: constraints.buttonTextPrimaryFontSize, color: !loading ? colors.backgroundColor : "grey",
                            }}> {loading ? "Loading..." : "Send"}</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    </View>;
}
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { ScrollView } from 'react-native-gesture-handler';
import {
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import Actionbar from '../../components/Actionbar';
import Avatar from '../../components/Avatar';
import ButtonRipple from '../../components/inputs/buttons/ButtonRipple';
import Input from '../../components/inputs/text/Input';
import ScreenSpinner from '../../components/spinners/ScreenSpinner';
import { colors } from '../../configs/colors';
import { fonts } from '../../configs/commonStyles';
import { constants } from '../../configs/constants';
import { utilStyles } from '../../configs/utilStyles';
import { useAxiosObject } from '../../contexts/axios-context';
import { customShowMessage } from '../../customMessage';
import { getUserProfile, updateUserProfile } from '../../services/userService';
import { themeState } from '../../store/slices/themeSlice';

export default function EditProfileScreen() {
  const bottomSheetRef = useRef(null);
  const axiosInstance = useAxiosObject();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    coverImage: null,
    avatar: null,
    gender: 2,
    encodedCoverImage: null,
    encodedAvatarImage: null,
  });
  const colors = useSelector(themeState).colors;

  const asyncFunction = async () => {
    let res = await getUserProfile(axiosInstance);
    if (res) {
      const { fname, lname, bio, gender, avatar, coverImage } = res;
      setValues({ fname, lname, bio });
      setUserInfo({
        gender,
        avatar: constants.baseURL + avatar,
        coverImage: constants.baseURL + coverImage,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    asyncFunction();
  }, []);

  const askPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    }
  };

  const formStyles = StyleSheet.create({
    label: {
      ...fonts.regular,
      color: colors.textColorPrimary,
    },
    input: {
      ...fonts.regular,
      fontSize: 12,
      paddingHorizontal: 18,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.borderColorSecondary,
      paddingVertical: 5,
      marginTop: 8,
      textAlignVertical: 'center',
      color: colors.textColorSecondary,
    },
    inputFocus: {
      borderColor: colors.GreyRegular,
      borderBottomColor: colors.GreyRegular,
    },
    container: {
      borderRadius: 4,
      marginBottom: 12,
    },
    error: {},
  });

  const pickImage = async (imageType) => {
    let res = await askPermission();
    if (!res) {
      alert('Permission denied!!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    if (!result.cancelled) {
      if (imageType === 'coverImage') {
        setUserInfo({
          ...userInfo,
          encodedCoverImage: true,
          coverImage: result.uri,
        });
        return;
      }
      setUserInfo({
        ...userInfo,
        encodedAvatarImage: true,
        avatar: result.uri,
      });
    }
  };

  function createFormData(values) {
    const formData = new FormData();

    if (userInfo.encodedCoverImage) {
      const image = {
        uri: userInfo.coverImage,
        type: 'image/jpeg',
        name: 'coverImage.jpg',
      };
      formData.append('coverImage', image);
    }

    if (userInfo.encodedAvatarImage) {
      const image = {
        uri: userInfo.avatar,
        type: 'image/jpeg',
        name: 'coverImage.jpg',
      };
      formData.append('avatar', image);
    }

    formData.append('fname', values.fname);
    formData.append('lname', values.lname);
    formData.append('bio', values.bio);
    formData.append('gender', userInfo.gender);
    return formData;
  }

  const submitHandler = async (values) => {
    setLoading(true);
    let obj = createFormData(values);
    let res = await updateUserProfile(axiosInstance, obj);
    setLoading(false);
    if (res) {
      customShowMessage('Profile updated successfully', 'success', colors);
    } else {
      customShowMessage('Error updating user profile', 'danger', colors);
    }
  };

  const schema = Yup.object().shape({
    fname: Yup.string().min(2, 'Too Short!').required('Required'),
    lname: Yup.string().min(2, 'Too Short!').required('Required'),
    bio: Yup.string().nullable(),
  });

  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    touched,
    setValues,
  } = useFormik({
    validationSchema: schema,
    initialValues: userInfo,

    onSubmit: (values) => {
      submitHandler(values);
    },
  });

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior={'close'}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  const genderHandler = (value) => {
    setUserInfo({
      ...userInfo,
      gender: value,
    });
  };
  const theme = useSelector(themeState).theme;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Actionbar showBackBtn showChild title="Edit Profile" />

        <View style={styles.imageWrapper}>
          <Image
            style={styles.coverImage}
            source={{
              uri: userInfo.coverImage,
            }}
          />
          <Pressable
            onPress={() => {
              pickImage('coverImage');
            }}
            style={styles.cameraIcon}
          >
            <Icon
              name="camera-outline"
              fill={colors.textColorPrimary}
              width={30}
              height={30}
            />
          </Pressable>
        </View>

        <View style={styles.formWrapper}>
          <TouchableOpacity
            style={{ marginTop: -35 }}
            onPress={() => {
              pickImage('avatar');
            }}
          >
            <Avatar coverImage={userInfo.avatar} />
          </TouchableOpacity>

          <View style={styles.formikWrapper}>
            <Text style={formStyles.label}>First Name</Text>
            <Input
              text={values.fname}
              containerStyle={formStyles.container}
              inputStyle={[formStyles.input]}
              setText={handleChange('fname')}
              onBlur={handleBlur('fname')}
              error={errors['fname']}
              touched={touched['fname']}
              errorStyle={formStyles.error}
              placeholderTextColor="grey"
            />

            <Text style={formStyles.label}>Last Name</Text>
            <Input
              text={values.lname}
              containerStyle={formStyles.container}
              inputStyle={[formStyles.input]}
              setText={handleChange('lname')}
              onBlur={handleBlur('lname')}
              error={errors['lname']}
              touched={touched['lname']}
              errorStyle={formStyles.error}
              placeholderTextColor="grey"
            />

            {/* <View style={[styles.genderOption, { marginVertical: 10 }]}>
                        <Text style={formStyles.label}>Gender</Text>
                        <TouchableOpacity style={styles.genderOption} onPress={() => {
                            bottomSheetRef.current.expand();
                        }}>
                            <Text style={formStyles.label}>
                                {
                                    userInfo.gender === 1 && "Male" ||
                                    userInfo.gender === 2 && "Female" ||
                                    userInfo.gender === 3 && "Non Binary"
                                }
                            </Text>
                            <Icon name="chevron-right-outline" fill={colors.textColor} width={30} height={30} />
                        </TouchableOpacity>
                    </View> */}

            <Text style={formStyles.label}>Bio</Text>
            <Input
              text={values.bio}
              placeholder="Tell us about yourself..."
              containerStyle={formStyles.container}
              inputStyle={[formStyles.input, { textAlignVertical: 'top' }]}
              setText={handleChange('bio')}
              onBlur={handleBlur('bio')}
              error={errors['bio']}
              touched={touched['bio']}
              errorStyle={formStyles.error}
              placeholderTextColor="grey"
              numberOfLines={5}
            />
          </View>

          <ButtonRipple
            title={'SAVE PROFILE'}
            style={{
              borderRadius: 6,
              paddingVertical: 12,
              backgroundColor:
                theme == 'light' ? colors.black : colors.accentColor,
            }}
            containerStyle={{ borderRadius: 5 }}
            textStyle={{
              ...fonts.bold,
              fontSize: 13,
              letterSpacing: 0.9,
              color: colors.backgroundColor,
            }}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
      <BottomSheet
        index={-1}
        enablePanDownToClose
        snapPoints={[200]}
        ref={bottomSheetRef}
        backdropComponent={renderBackdrop}
      >
        <GenderRadioOptions
          onSelect={genderHandler}
          selected={userInfo.gender}
        />
      </BottomSheet>
      {loading && <ScreenSpinner />}
    </View>
  );
}

function GenderRadioOptions({ onSelect, selected }) {
  const radio_props = [
    { label: 'Male', value: 1 },
    { label: 'Female', value: 2 },
    { label: 'Non Binary', value: 3 },
  ];

  return (
    <>
      <View style={{ marginTop: 20 }}>
        {radio_props.map((obj) => {
          return (
            <Pressable
              style={styles.radioWrapper}
              key={obj.value}
              onPress={() => {
                onSelect(obj.value);
              }}
            >
              <RadioButtonLabel
                obj={obj}
                labelHorizontal={true}
                labelStyle={{
                  fontSize: 16,
                  color: colors.textColor,
                  ...fonts.poppinsRegular,
                }}
                labelWrapStyle={{}}
                onPress={() => {
                  onSelect(obj.value);
                }}
              />

              <RadioButtonInput
                obj={obj}
                borderWidth={1}
                buttonInnerColor={'black'}
                buttonSize={10}
                isSelected={selected === obj.value}
                buttonOuterSize={15}
                buttonOuterColor={'black'}
                onPress={() => {
                  onSelect(obj.value);
                }}
              />
            </Pressable>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    backgroundColor: colors.overlayBg,
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 80,
    left: '50%',
    zIndex: 1,
    transform: [{ translateX: -15 }],
  },
  formWrapper: {
    paddingHorizontal: 20,
  },
  avatarBorder: {
    width: 70,
    height: 70,
    borderRadius: 99,
    padding: 4,
    backgroundColor: 'black',
    ...utilStyles.centerXY,
    marginTop: -35,
  },
  formikWrapper: {
    marginTop: 20,
  },
  genderOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radioWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});

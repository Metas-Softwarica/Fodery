import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { TextInput } from 'react-native-gesture-handler';
import StarRating from 'react-native-star-rating-widget';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import { useSelector } from 'react-redux';
import { fonts } from '../../configs/commonStyles';
import { constraints } from '../../configs/constants';
import { utilStyles } from '../../configs/utilStyles';
import { themeState } from '../../store/slices/themeSlice';
import ButtonRipple from '../inputs/buttons/ButtonRipple';
import { Gap } from '../util/Gap';
import ModalBox from './ModalBox';

export default function ReviewModal({
  modalVisible,
  setModalVisible,
  onSubmit,
  rating,
  setRating,
  setText,
  modalMode,
  text,
}) {
  const colors = useSelector(themeState).colors;
  return (
    <ModalBox
      heightPercent={0}
      widthPercent={0}
      bodyStyle={{
        backgroundColor: 'transparent',
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
      }}
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{ flex: 1, justifyContent: 'center' }}
      >
        <View
          style={{
            minHeight: 0,
            backgroundColor: colors.cardColor,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <TitleBar
            title={modalMode === 'Edit' ? 'Edit your review' : 'Write a review'}
            onCloseButtonPress={() => setModalVisible(false)}
          />
          <View style={{ padding: 16 }}>
            <Text style={{ ...fonts.regular, color: colors.textColorPrimary }}>
              Set your rating
            </Text>
            <Gap y={14} />
            <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
              <StarRating
                onChange={(rating) => {
                  setRating(rating);
                }}
                color={colors.accentColor2}
                emptyColor={colors.accentColor2}
                starSize={32}
                maxStars={5}
                rating={rating}
                enableHalfStar={false}
                enableSwiping
                starStyle={{ marginLeft: 0, marginRight: 0, borderRadius: 5 }}
              />
            </View>
            <Gap y={12} />
            <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
              <Text
                style={{ ...fonts.regular, color: colors.textColorSecondary }}
              >
                *Rating is required.
              </Text>
            </View>
            <Gap y={14} />
            <Text
              style={{
                ...fonts.poppinsRegular,
                color: colors.textColorPrimary,
              }}
            >
              Review
            </Text>
            <Gap y={12} />
            <TextInput
              style={{
                width: '100%',
                padding: 12,
                paddingTop: 12,
                borderRadius: 5,
                backgroundColor: colors.cardColorSecondary,
                textAlignVertical: 'top',
                color: colors.textColorPrimary,
                height: 150,
              }}
              returnKeyType="done"
              value={text}
              onKeyPress={(e) => {
                if (e.nativeEvent.key == 'Enter') {
                  dismissKeyboard();
                }
              }}
              placeholderTextColor={colors.textColorSecondary}
              placeholder="Write your review here..."
              onChangeText={(text) => {
                setText(text);
              }}
              multiline={true}
              numberOfLines={6}
              maxLength={255}
            />
          </View>
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: colors.cardColorSecondary,
              backgroundColor: colors.cardColor,
              paddingVertical: 12,
              marginTop: 'auto',
            }}
          >
            <ButtonRipple
              containerStyle={{
                marginBottom: 2,
                marginHorizontal: 18,
                borderRadius: 6,
              }}
              style={{
                borderRadius: 0,
                paddingVertical: 12,
                backgroundColor:
                  rating && rating > 0
                    ? colors.accentColor
                    : colors.buttonDisabledColor,
              }}
              textStyle={{
                ...fonts.black,
                fontSize: constraints.buttonTextPrimaryFontSize,
                color: colors.black,
              }}
              title="Submit your review"
              rippleColor={colors.GreyRegular}
              onPress={() => {
                if (rating && rating > 0) {
                  onSubmit();
                  setModalVisible(false);
                }
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ModalBox>
  );
}

export function FilterOption({ heading, children }) {
  const colors = useSelector(themeState).colors;
  return (
    <View
      style={{
        padding: 15,
        backgroundColor: colors.cardColor,
      }}
    >
      <Text style={{ ...fonts.poppinsRegular, color: colors.textColorPrimary }}>
        {heading}
      </Text>
      <View style={{ flex: 1, marginTop: 9 }}>{children}</View>
    </View>
  );
}

export function TitleBar({
  title,
  leftOption,
  showLeftOption = false,
  onLeftOptionPress,
  onCloseButtonPress,
  customCloseIcon = false,
  containerStyle,
}) {
  const colors = useSelector(themeState).colors;
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        ...utilStyles.centerX,
        justifyContent: 'space-between',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderBottomColor: colors.cardColorSecondary,
        borderBottomWidth: 1,
        backgroundColor: colors.cardColor,
        borderTopEndRadius: 5,
        borderTopStartRadius: 5,
        ...containerStyle,
      }}
    >
      {showLeftOption ? (
        <TouchableOpacity onPress={onLeftOptionPress}>
          {showLeftOption ? (
            <Text style={{ color: colors.textColorPrimary }}>{leftOption}</Text>
          ) : (
            <></>
          )}
        </TouchableOpacity>
      ) : null}
      <Text
        style={{
          ...fonts.poppinsRegular,
          fontSize: 15,
          color: colors.textColorPrimary,
        }}
      >
        {title}
      </Text>

      <TouchableOpacity style={{ padding: 7 }} onPress={onCloseButtonPress}>
        {customCloseIcon ? (
          customCloseIcon
        ) : (
          <Icon
            name="close-outline"
            width={24}
            height={24}
            color={colors.textColorPrimary}
            fill={colors.textColorPrimary}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

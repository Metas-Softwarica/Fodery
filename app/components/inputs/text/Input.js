import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { useSelector } from 'react-redux';
import { constraints } from '../../../configs/constants';
import { utilStyles } from '../../../configs/utilStyles';
import { themeState } from '../../../store/slices/themeSlice';

export default function Input({
  labelStyle = {},
  inputStyle = {},
  containerStyle = {},
  text,
  setText,
  placeholder,
  label = false,
  password = false,
  error = null,
  touched = false,
  errorStyle = {},
  ...otherProps
}) {
  const [showPassword, setShowPassword] = useState(false);
  const colors = useSelector(themeState).colors;

  const styles = StyleSheet.create({
    wrapper: {
      marginBottom: 16,
    },
    label: {
      fontSize: 18,
    },
    input: {
      color: colors.textColorPrimary,
      height: Platform.OS === 'ios' ? 45 : null,
    },
  });

  return (
    <View style={{ ...styles.wrapper, ...containerStyle }}>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : <></>}
      <TextInput
        style={[styles.input, inputStyle]}
        value={text}
        onChangeText={(text) => setText(text)}
        placeholder={placeholder}
        secureTextEntry={password && !showPassword}
        {...otherProps}
        autoCapitalize="none"
      />
      <View
        style={{
          position: 'absolute',
          width: 25,
          height: 40,
          right: 8,
          top: 11,
        }}
      >
        {password && (
          <TouchableOpacity
            containerStyle={{ ...utilStyles.centerXY, elevation: 9 }}
            onPressIn={() => setShowPassword((v) => !v)}
          >
            <Icon
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              fill={colors.textColorSecondary}
              width={20}
              height={20}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && touched ? (
        <Text
          style={{
            color: colors.accentColor2,
            marginTop: 4,
            fontSize: constraints.spanTextFontSize,
            ...errorStyle,
          }}
        >
          {error}
        </Text>
      ) : (
        <></>
      )}
    </View>
  );
}

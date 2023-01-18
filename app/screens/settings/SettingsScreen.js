import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-eva-icons';
import { useSelector } from 'react-redux';
import Actionbar from '../../components/Actionbar';
import ScreenSpinner from '../../components/spinners/ScreenSpinner';
import { useAxiosObject } from '../../contexts/axios-context';
import { customShowMessage } from '../../customMessage';
import { checkPasswordEmpty } from '../../services/authService';
import { themeState } from '../../store/slices/themeSlice';
import { settingStyles } from '../user/ProfileScreen';

function SettingsScreen({ navigation }) {
  const axiosInstance = useAxiosObject();
  const [statusLoading, setStatusLoading] = useState(false);

  const colors = useSelector(themeState).colors;
  const styles = settingStyles(colors);

  async function checkPassword() {
    setStatusLoading(true);
    let res = await checkPasswordEmpty(axiosInstance);
    setStatusLoading(false);
    if (res) {
      if (!res.status) {
        navigateToRegularPassword();
        return;
      }
      navigateToGooglePassword();
      return;
    }
    customShowMessage(
      'Error fetching password status!! Try Again',
      'danger',
      colors
    );
  }

  function navigateToRegularPassword() {
    navigation.navigate('ChangePassword', {
      isSetPassword: true,
    });
  }

  function navigateToGooglePassword() {
    navigation.navigate('ChangePassword', {
      isSetPassword: false,
    });
  }

  return (
    <>
      <Actionbar title="Settings" showBackBtn />

      <ScrollView contentContainerStyle={{ marginHorizontal: 20 }}>
        <TouchableOpacity style={styles.container} onPress={checkPassword}>
          <Icon
            name="lock"
            fill={colors.textColorSecondary}
            width={24}
            height={24}
          />
          <Text style={styles.text}>Change Password</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.container} onPress={() => { }}>
                    <Icon name="book-open-outline" fill={colors.textColorSecondary} width={24} height={24} />
                    <Text style={styles.text}>Deactivate my account</Text>
                </TouchableOpacity> */}
      </ScrollView>

      {statusLoading && <ScreenSpinner />}
    </>
  );
}

export default SettingsScreen;

import React from 'react';
import Actionbar from '../../components/Actionbar';
import { utilStyles } from '../../configs/utilStyles';
import { InfoCard } from '../help/HelpCenterScreen';

import { View } from 'react-native';

function ContactScreen() {
  return (
    <>
      <Actionbar title="Contact Us" showBackBtn />

      <View style={{ flex: 1, ...utilStyles.centerXY }}>
        <InfoCard />
      </View>
    </>
  );
}

export default ContactScreen;

import React from 'react';
import { View } from 'react-native';
import Actionbar from '../../components/Actionbar';
import SharedOrderList from '../../components/SharedOrderList';

export default function OrdersListScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Actionbar showBackBtn title="Orders" />
      <SharedOrderList />
    </View>
  );
}

import React from 'react';
import WebView from 'react-native-webview';
import Actionbar from '../components/Actionbar';

function TermsScreen({ route }) {
  return (
    <>
      <Actionbar showBackBtn title={route.params.title} />
      <WebView style={{ flex: 1 }} source={{ uri: route.params.url }} />
    </>
  );
}

export default TermsScreen;

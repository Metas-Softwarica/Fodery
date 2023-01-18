import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { Icon } from 'react-native-eva-icons';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import { useSelector } from 'react-redux';
import Actionbar from '../../components/Actionbar';
import ButtonRipple from '../../components/inputs/buttons/ButtonRipple';
import { Gap } from '../../components/util/Gap';
import { fonts } from '../../configs/commonStyles';
import { constraints } from '../../configs/constants';
import { utilStyles } from '../../configs/utilStyles';
import { useAxiosObject } from '../../contexts/axios-context';
import { customShowMessage } from '../../customMessage';
import { getAboutDetails } from '../../services/appService';
import { getOrderDetail } from '../../services/orderService';
import { themeState } from '../../store/slices/themeSlice';

export default function OrderReceiptScreen({ navigation, route }) {
  const [expandQR, setExpandQR] = useState(false);
  const viewShotRef = useRef(null);

  const { width } = useWindowDimensions();
  const colors = useSelector(themeState).colors;
  const theme = useSelector(themeState).theme;
  const axiosInstance = useAxiosObject();
  const [appSettings, setAppSettings] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const receipt = {
    amount: 122313123,
    billNo: 3,
    couponAmount: 0,
    discountAmount: 0,
    extraAmount: 177,
    grandAmount: 139437362,
    createdAt: '2021-12-17T10:44:35.370975Z',
    id: 40,
    identifier:
      "b'$2b$12$J5k20eqhM0lmhB4m6vPfBu0dwZIuOwNIYKR5.1L/VlXVtK/jojyT2'",
    items: [
      {
        category: 'Sweets',
        coverImage_url: 'media/7_3.jpg',
        extras: [
          {
            coverImage: 'media/7_3.jpg',
            description: 'Perferendis quam ut',
            extraGroup: 1,
            id: 1,
            price: 54,
            title: 'Enim laboris nihil c',
          },
          {
            coverImage: 'media/7_3.jpg',
            description: 'dasfas',
            extraGroup: 1,
            id: 2,
            price: 123,
            title: 'dasf',
          },
        ],
        id: 34,
        name: 'Molestiae sint maxi',
        price: '67.0',
        quantity: 1,
        variant: {
          id: 1,
          price: 122313123,
          title: ['asdjhfhasjd'],
        },
      },
    ],
    receiptNo: 3,
    shipAmount: 123,
    taxAmount: 17123862,
  };
  let openShareDialogAsync = async (uri) => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }
    await Sharing.shareAsync(uri);
  };
  let downloadFile = async () => {
    viewShotRef.current.capture().then(async (uri) => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status != 'granted') {
        customShowMessage('Permission Denied!!', 'danger', colors);
        return;
      }
      try {
        const asset = await MediaLibrary.createAssetAsync(uri);
        const album = await MediaLibrary.getAlbumAsync('Download');
        if (album == null) {
          await MediaLibrary.createAlbumAsync('Download', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
        customShowMessage('Receipt saved to camera roll!!', 'info', colors);
      } catch (e) {}
    });
  };
  const asyncFunction = async () => {
    setAppSettings((await getAboutDetails(axiosInstance)) || false);
    const receipt = await getOrderDetail(axiosInstance, route.params.id);
    setReceiptData(receipt);
  };
  useEffect(() => {
    asyncFunction();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Actionbar showBackBtn navigation={navigation} title="Receipt" />

      <ScrollView
        contentContainerStyle={{ padding: constraints.screenPaddingHorizontal }}
        overScrollMode="never"
      >
        <ActionButtons
          onDownload={downloadFile}
          onShare={() => {
            viewShotRef.current.capture().then((uri) => {
              openShareDialogAsync(uri);
            });
          }}
        />
        <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 1 }}>
          {!!receiptData ? (
            <View
              style={{
                backgroundColor: colors.cardColor,
                padding: constraints.cardPadding,
                borderRadius: constraints.borderRadiusSmall,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View>
                  <Text
                    style={{
                      ...fonts.bold,
                      color: colors.accentColor,
                      fontSize: 16,
                    }}
                  >
                    {appSettings.company_name}
                  </Text>
                  <Text
                    style={{
                      ...fonts.regular,
                      color: colors.textColorPrimary,
                      fontSize: constraints.textSizeLabel3,
                    }}
                  >
                    {appSettings.support_address}
                  </Text>
                  <Text
                    style={{
                      ...fonts.regular,
                      color: colors.textColorPrimary,
                      fontSize: constraints.textSizeLabel3,
                    }}
                  >
                    {appSettings.support_phone}
                  </Text>
                </View>

                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    backgroundColor: 'white',
                    padding: 6,
                  }}
                  onPress={() => setExpandQR((expandQR) => !expandQR)}
                >
                  <QRCode value={receiptData.order_number} size={55} />
                  <Text
                    style={{
                      ...fonts.bold,
                      fontSize: 7,
                      marginTop: 4,
                      color: 'black',
                    }}
                  >
                    SHOW QRCODE
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ marginTop: 16 }}>
                <InfoRow keyText="Bill No." value={receiptData.billNo} />
                <InfoRow keyText="Receipt No." value={receiptData.receiptNo} />
                <InfoRow
                  keyText="Date"
                  value={new Date(receiptData.createdAt).toDateString()}
                />
              </View>

              <View style={{ marginTop: 16 }}>
                <InfoRow
                  keyText="Products:"
                  value="Price"
                  valueStyle={{ color: colors.GreyRegular }}
                />

                {receiptData.items.map((item) => {
                  return (
                    <InfoRow
                      keyText={
                        item.name +
                        (item.variant_name ? '\n' + item.variant_name : '') +
                        (item.extra_label ? '\n' + item.extra_label : '')
                      }
                      value={`${item.quantity} X Rs. ${item.item_price} + Extras: Rs ${item.extras_price} = Rs. ${item.total_price}`}
                      keyStyle={{ color: colors.textColorPrimary }}
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                      }}
                      valueStyle={{ textAlign: 'left' }}
                    />
                  );
                })}
              </View>
              <Gap y={8} />
              <View
                style={{
                  borderTopColor: colors.borderColor,
                  borderTopWidth: 2,
                }}
              >
                <Gap y={8} />
                <InfoRow
                  keyText="Sub-total"
                  value={`Rs. ${receiptData.amount}`}
                  keyStyle={{ color: colors.textColorPrimary }}
                />
                <InfoRow
                  keyText="Discount"
                  value={`Rs. ${receiptData.discountAmount}`}
                  keyStyle={{ color: colors.textColorPrimary }}
                />
                {/* <InfoRow
                            keyText="Taxable Amount"
                            value={`Rs. ${receiptData.taxAmount}`}
                            keyStyle={{ color: colors.textColorPrimary }}
                        /> */}
              </View>
              {/* 
                    <View
                        style={{
                            marginTop: 16,
                            borderTopColor: colors.borderColor,
                            borderTopWidth: 2,
                        }}
                    >
                        <InfoRow
                            keyText="Tax"
                            value={`Rs. ${receiptData.taxAmount - (receiptData.amount + receiptData.discountAmount)}`}
                            keyStyle={{ color: colors.textColorPrimary }}
                        />
                        <InfoRow
                            keyText="Shipping"
                            value={`Rs. ${receiptData.shipAmount}`}
                            keyStyle={{ color: colors.textColorPrimary }}
                        />
                    </View> */}
              <Gap y={8} />

              <View
                style={{
                  borderTopColor: colors.borderColor,
                  borderTopWidth: 2,
                }}
              >
                <Gap y={8} />
                <InfoRow
                  keyText="Grand Total"
                  value={`Rs. ${receiptData.grandAmount}`}
                  keyStyle={{ color: colors.textColorPrimary, ...fonts.bold }}
                  valueStyle={{ ...fonts.bold }}
                />
              </View>
            </View>
          ) : (
            <></>
          )}
        </ViewShot>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        visible={expandQR}
        onRequestClose={() => {
          setExpandQR(!expandQR);
        }}
      >
        {!!receiptData && (
          <Pressable
            style={{
              height: '100%',
              width: '100%',
              ...utilStyles.centerXY,
              backgroundColor: '#ffffff75',
            }}
            onPress={() => setExpandQR(false)}
          >
            <QRCode value={receiptData.order_number} size={width * 0.8} />
          </Pressable>
        )}
      </Modal>
    </View>
  );
}

function ActionButtons({ onDownload, onShare }) {
  const colors = useSelector(themeState).colors;
  const buttonStyle = {
    borderRadius: constraints.borderRadiusMin,
    backgroundColor: colors.textColorPrimary,
    paddingHorizontal: constraints.screenPaddingHorizontal,
    paddingVertical: constraints.buttonPaddingVerticalSmall,
  };

  const buttonContainerStyle = {
    flex: 1,
    borderRadius: constraints.borderRadiusSmall,
    marginHorizontal: constraints.sectionGap,
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: constraints.screenPaddingHorizontal,
      }}
    >
      {Platform.OS === 'ios' ? null : (
        <ButtonRipple
          onPress={onDownload}
          title="DOWNLOAD"
          containerStyle={buttonContainerStyle}
          style={buttonStyle}
          textStyle={{
            ...fonts.bold,
            fontSize: constraints.textSizeHeading4,
            marginTop: 3,
            color: colors.backgroundColor,
          }}
        >
          <Icon
            name="download"
            height={21}
            width={21}
            fill={colors.backgroundColor}
          />
        </ButtonRipple>
      )}

      <ButtonRipple
        onPress={onShare}
        title="SHARE"
        containerStyle={buttonContainerStyle}
        style={{
          ...buttonStyle,
          backgroundColor: colors.backgroundColor,
          borderWidth: 2,
          borderColor: colors.textColorPrimary,
          paddingVertical: constraints.buttonPaddingVerticalSmall - 2,
        }}
        textStyle={{
          ...fonts.bold,
          color: colors.textColorPrimary,
          fontSize: 15,
          marginTop: 3,
        }}
      >
        <Icon
          name="share"
          height={21}
          width={21}
          fill={colors.textColorPrimary}
        />
      </ButtonRipple>
    </View>
  );
}

function InfoRow({ keyText, value, style = {}, keyStyle, valueStyle }) {
  const colors = useSelector(themeState).colors;
  const styles = StyleSheet.create({
    view: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    key: {
      color: colors.textColorSecondary,
      ...fonts.regular,
      fontSize: constraints.textSizeHeading4,
    },
    value: {
      ...fonts.regular,
      fontSize: constraints.textSizeHeading4,
      color: colors.textColorPrimary,
    },
  });
  return (
    <View style={[styles.view, style]}>
      <Text style={[styles.key, keyStyle]}>{keyText}</Text>
      <Text style={[styles.value, valueStyle]}>{value}</Text>
    </View>
  );
}

import { showMessage } from 'react-native-flash-message';
import { fonts } from './configs/commonStyles';

export function customShowMessage(message, type, colors) {
  showMessage({
    message: message,
    type: type,
    floating: true,
    style: {
      minWidth: 0,
    },
    backgroundColor:
      type == 'danger' ? colors.accentColor2 : colors.accentColor,
    textStyle: { margin: 0, padding: 0, minHeight: 0 },
    titleStyle: {
      margin: 0,
      padding: 0,
      minHeight: 0,
      color: type == 'danger' ? 'white' : colors.backgroundColor,
      fontFamily: fonts.regular.fontFamily,
    },
  });
}

/**
 * Custom Button.
 * @author Laveena Chaturvedi
 * @returns {*}
 */
import React from 'react';
import {Text, TouchableOpacity, Platform, Image} from 'react-native';
import COLORS from '../Utilities/Colors';
import Fonts, {sizes} from '../Styles/fonts';

const CButton = (props) => {
  const {
    onPress,
    children,
    type,
    textStyle,
    buttonStyle,
    disabled,
    image,
  } = props;

  return (
    <TouchableOpacity
      style={
        disabled
          ? [styles.disableStyle(type)]
          : [styles.viewStyle(type), buttonStyle]
      }
      onPress={onPress}
      disabled={disabled}>
      <Text style={[styles.textStyle, textStyle]}>{children}</Text>
      {image && <Image source={image} />}
    </TouchableOpacity>
  );
};

const styles = {
  viewStyle: (type) => ({
    justifyContent: 'center',
    backgroundColor: type === 'solid' ?COLORS.BLUE_THEME: COLORS.SECONDARY_COLOR,
    borderWidth: 1,
    borderColor: type === 'outline' ? COLORS.BLUE_THEME : COLORS.BLUE_THEME,
    width: '100%',
    height: 50,
    borderRadius: 4,
    ...Platform.select({
      ios: {
        shadowRadius: 7,
        shadowOffset: {height: 2, width: 0},
      },
      android: {
        elevation: 3.5,
      },
    }),
  }),
  disableStyle: (type) => ({
    justifyContent: 'center',
    backgroundColor: type === 'solid' ? COLORS.BLUE_THEME + 90 : COLORS.SECONDARY_COLOR,
    width: '100%',
    height: 50,
    borderRadius: 4,
    ...Platform.select({
      ios: {
        shadowRadius: 7,
        shadowOffset: {height: 2, width: 0},
      },
      android: {
        // elevation: 0.5,
      },
    }),
  }),
  textStyle: {
    textAlign: 'center',
    ...Fonts.medium,
    fontSize: sizes.h4,
    fontWeight: 'bold',
  },
};

export {CButton};

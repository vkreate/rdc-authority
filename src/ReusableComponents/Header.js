import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Colors from "../Utilities/Colors";
import Fonts, { sizes } from '../Styles/fonts';
import CText from '../ReusableComponents/CText';
import COLORS from "../Utilities/Colors";

const Header = ({headerTitle}) => {
  return (
    <View style={{backgroundColor:COLORS.BLUE_THEME,paddingVertical:15}}>
      <CText style={{color:Colors.SECONDARY_COLOR,textAlign:'center',
        ...Fonts.medium,
        fontSize: sizes.h3,
        fontWeight: 'bold'}}>{headerTitle}</CText>

    </View>
  );
};

export default Header;

import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import imagePath from '../Utilities/ImagePath';
import CText from './CText';
import COLORS from '../Utilities/Colors';

const SplashFooter = ({color}) => {
  return (
    <View style={styles.copyRight}>
      <View style={styles.Text}>
        <CText
          style={{
            fontSize: 18,
            color: color === 'white' ? 'white' : COLORS.SECONDARY_COLOR,
            textAlign: 'center',
          }}>
          An initiative by
        </CText>
        <CText
          style={{
            fontSize: 18,
            color: color === 'white' ? 'white' : COLORS.SECONDARY_COLOR,
            textAlign: 'center',
          }}>
          The Ministry of Industry
        </CText>
        <CText
          style={{
            fontSize: 18,
            color: color === 'white' ? 'white' : COLORS.SECONDARY_COLOR,
            textAlign: 'center',
          }}>
          DRC
        </CText>
      </View>
    </View>
  );
};

export default SplashFooter;

const styles = StyleSheet.create({
  copyRight: {
    marginTop: 25,
    width: '100%',
    zIndex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Text: {
    flex: 1,
  },
});

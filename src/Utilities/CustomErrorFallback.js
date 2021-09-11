import React from 'react';
import {StyleSheet, View} from 'react-native';
import CText from '../ReusableComponents/CText';

const CustomErrorFallback = () => {
  return (
    <View style={styles.container}>
      <CText h1>Something happened!</CText>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default CustomErrorFallback;

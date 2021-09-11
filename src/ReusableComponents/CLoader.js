import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import COLORS from '../Utilities/Colors';
const CLoader = (props) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} color={'red'} />
    </View>
  );
};
export default CLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.TRANSPARENT,
  },
});

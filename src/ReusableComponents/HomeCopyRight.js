import React from 'react';
import {View, StyleSheet, Image, Dimensions} from 'react-native';
import imagePath from '../Utilities/ImagePath';
import CText from './CText';
import COLORS from '../Utilities/Colors';
const win = Dimensions.get('window');

const CopyRight = ({color}) => {
  return (
    <View style={styles.copyRight}>
      <View style={{height:50,width:"100%"}}>
      <Image style={{flex:1,height:undefined,width:undefined,resizeMode:"stretch"}} source={imagePath.FOOTER}  />


      </View>
        <CText
        style={{
          marginTop: 10,
         // marginBottom: 5,
          fontSize: 20,
          color: 'black',
        }}>
        Powered by
      </CText>
      <CText
        style={{
          fontSize: 24,
         // marginBottom: 20,
          color: 'black',
          fontWeight: 'bold'
        }}>
        LEGIT
      </CText>
    </View>
  );
};

export default CopyRight;

const styles = StyleSheet.create({
  copyRight: {
    flexDirection: 'column',
    width: '100%',
   
    zIndex: -1,
    justifyContent: 'center',
    alignItems: 'center',
   // position: 'absolute',
    
  },
  image: {
        flex: 1,
        alignSelf: 'stretch',
        width: win.width,
        height: win.height,
    }
});

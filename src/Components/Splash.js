import React, {Component} from 'react';
import {View, StyleSheet, ImageBackground, Image} from 'react-native';
import imagePath from '../Utilities/ImagePath';

import SplashScreen from 'react-native-splash-screen';
import {ReadItem} from '../Utilities/helpers/AsyncStorage';
import {CommonActions} from '@react-navigation/native';
import CONSTANTS from '../Utilities/Constants';
import BackgroundImage1 from '../Assets/logo_bg.jpg';
import CText from '../ReusableComponents/CText';
import COLORS from '../Utilities/Colors';
import CopyRight from '../ReusableComponents/CopyRight';
import SplashFooter from '../ReusableComponents/SplashFooter';
import AppRouter from '../Routes/AppRouter';

class Login extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    let token = await ReadItem('token');
    const data = await ReadItem('role');
    global.role = data;
    if (token === null) {
      setTimeout(() => {
        SplashScreen.hide();
        this.props.navigation.navigate('Login');
      }, 2000);
    } else {
      <AppRouter />;
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={imagePath.SPLASH_IMG}
          style={styles.backgroundImage}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={imagePath.APP_LOGO}
              style={{width: 200, height: 200}}
            />
            <CText
              style={{
                color: 'white',
                textTransform: 'uppercase',
                textAlign: 'center',
                fontFamily: 'Quicksand-Regular',
                fontSize: 32,
                fontWeight: 'bold',
              }}>
              RDC Estampillage
            </CText>
            <SplashFooter color="white" />
          </View>
          <Image source={imagePath.FOOTER} style={{width: 430, height: 60, marginBottom: 10}} />
        </ImageBackground>
      </View>
    );
  }
}
export default Login;
const styles = StyleSheet.create({
  backgroundImage: {flex: 1, width: null, height: null, resizeMode: 'cover'},
  container: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY_COLOR,
  },
  appLogo: {
    width: 190,
    height: 190,
    resizeMode: 'contain',
  },
});

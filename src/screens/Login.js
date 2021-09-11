/**
 * @author Laveena Chaturvedi
 * @description Login Screen
 * @flow
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  ImageBackground,
  BackHandler,
  TouchableOpacity,
  PermissionsAndroid,
  Text,
} from 'react-native';
import COLORS from '../Utilities/Colors';
import {observer, inject} from 'mobx-react';
import SplashScreen from 'react-native-splash-screen';
import CLoader from '../ReusableComponents/CLoader';
import BackgroundImage1 from '../../src/Assets/logo_bg.jpg';
// Import vector icons
import Icon from 'react-native-vector-icons/FontAwesome';
import CONSTANTS from '../Utilities/Constants';
import {mobileNumber} from '../Utilities/APi/validation';
import CText from '../ReusableComponents/CText';
import HeaderTitle from '../ReusableComponents/HeaderTitle';
import CopyRight from '../ReusableComponents/CopyRight';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';

@inject('LoginStore', 'OtpStore')
@observer
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      modelVisible: false,
    };
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPressLogin',
      this.backButtonHandler,
    );
  }
  backButtonHandler = () => {
    BackHandler.exitApp();
    return true;
  };
  setPrefix = value => {
    const newVal = value.replace(/(?:(?:\+|0{0,2})91)/g, '');
    this.setPhoneNumberPrefix(newVal);
  };
  async componentDidMount() {
    SplashScreen.hide();
    this.props.LoginStore.resetAllData();
    const {setLatitude = {}, setLongitude = {}} = this.props.OtpStore;

    await Geolocation.getCurrentPosition(
      info => {
        setLatitude(info.coords.latitude);
        setLongitude(info.coords.longitude);

        if (
          info.coords.latitude !== undefined &&
          info.coords.longitude !== undefined
        ) {
          Geocoder.init('AIzaSyDkYcFk5rZMvW2Sf0JnCZm9YGvG-Zwgb2U', {
            language: 'en',
          });
          Geocoder.from(info.coords.latitude, info.coords.longitude)
            .then(json => {
              let addressComponent = json.results[0].formatted_address;
              this.setState({address: addressComponent});
            })
            .catch(error => {
              // console.warn(error,'error::::::::::')
            });
        }
      },
      async error => {
        if (error.PERMISSION_DENIED === 1) {
          console.log('inside permission');
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Request',
              message: 'App needs access to your location to proceed further',
            },
          );
        }
      },
      {forceRequestLocation: true},
    );
    // }
  }
  login = async () => {
    const {phoneNumber, phoneNumberPrefix} = this.props.LoginStore;
    const {login = {}, setLoader = {}} = this.props.LoginStore;
    let isValid = mobileNumber(phoneNumber);
    if (phoneNumber !== '' && isValid) {
      let response = await login(phoneNumber);
      console.log(response, 'response::::::::::::::::: in screen');
      if (response.success === true) {
        setLoader(false);
        this.props.navigation.navigate(CONSTANTS.SCREENS.OTP, {
          phoneNumber: phoneNumber,
          otp: response.otp,
        });
      } else {
        setLoader(false);
        this.setState({
          error: 'Please Enter Valid Mobile Number',
          modelVisible: true,
        });
      }
    } else {
      setLoader(false);
      this.setState({
        error: 'Please Enter Valid Mobile Number',
        modelVisible: true,
      });
    }
  };

  render() {
    const {
      phoneNumber,
      setPhoneNumber,
      phoneNumberPrefix,
      setPhoneNumberPrefix = {},
    } = this.props.LoginStore;

    return (
      <View
        style={{
          flex: 1,
          flexGrow: 1,
          justifyContent: 'center',
          backgroundColor: 'white',
        }}>
        <HeaderTitle headerTitle="RDC Estampillage" />
        <View>
          <CText style={styles.signInText}>Sign in</CText>
          <View style={{alignItems: 'center'}}>
            <View style={styles.section}>
              <TextInput
                placeholder="+ 243"
                placeholderTextColor="black"
                style={styles.PhoneNumberPrefix}
                keyboardType="numeric"
                editable={false}
                maxLength={3}
                onChangeText={value => this.setPrefix(value)}
                value={phoneNumberPrefix}
              />
              <TextInput
                placeholder=" Enter Mobile No. "
                placeholderTextColor="black"
                style={styles.textInput}
                keyboardType="numeric"
                maxLength={10}
                onChangeText={value => {
                  const newVal = value.replace(/[^0-9]/g, '');
                  setPhoneNumber(newVal);
                }}
                value={phoneNumber}
              />
            </View>
            <TouchableOpacity style={styles.ButtonStyle} onPress={this.login}>
              <View style={{alignItems: 'center'}}>
                <Icon name="angle-double-right" size={40} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {this.state.modelVisible === true && (
          <TouchableOpacity
            onPress={() => this.setState({modelVisible: false})}
            style={{
              position: 'absolute',
              bottom: 0,
              zIndex: 2,
              backgroundColor: COLORS.SECONDARY_COLOR,
              padding: 20,
              width: '100%',
            }}>
            <View>
              <Text style={{color: 'white'}}>{this.state.error}</Text>
            </View>
          </TouchableOpacity>
        )}
        {this.props.LoginStore.loader && <CLoader />}
        <CopyRight />
      </View>
    );
  }
}

export default Login;

const styles = StyleSheet.create({
  signInText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.SECONDARY_COLOR,
    textAlign: 'center',
  },
  textInput: {
    color: 'black',
    fontSize: 18,
    flex: 1,
    borderBottomColor: COLORS.SECONDARY_COLOR,
    borderBottomWidth: 3,
  },
  PhoneNumberPrefix: {
    fontSize: 18,
    borderBottomColor: COLORS.SECONDARY_COLOR,
    borderBottomWidth: 3,
    marginRight: 15,
  },
  section: {
    flexDirection: 'row',
    height: 50,
    marginVertical: 30,
    width: '85%',
  },
  textStyle: {
    color: COLORS.SECONDARY_COLOR,
  },
  ButtonStyle: {
    backgroundColor: COLORS.SECONDARY_COLOR,
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
  },
  Button: {
    color: COLORS.SECONDARY_COLOR,
    fontSize: 18,
    textAlign: 'center',
  },
});

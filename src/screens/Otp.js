/**
 * @author Laveena Chaturvedi
 * @description OTP Screen
 * @flow
 */
import React, {Component} from 'react';
import {StyleSheet, View, BackHandler, Text} from 'react-native';
import COLORS from '../Utilities/Colors';
import {observer, inject} from 'mobx-react';
import CodeInput from 'react-native-confirmation-code-input';
import CText from '../ReusableComponents/CText';
import CLoader from '../ReusableComponents/CLoader';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {mobileNumber} from '../Utilities/APi/validation';
import CONSTANTS from '../Utilities/Constants';
import CopyRight from '../ReusableComponents/CopyRight';
import HeaderTitle from '../ReusableComponents/HeaderTitle';

@inject('OtpStore', 'LoginStore')
@observer
class Otp extends Component {
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
    this.props.navigation.navigate(CONSTANTS.SCREENS.LOGIN);
    return true;
  };
  resendOtp = async () => {
    let phoneNumber = this.props.route.params.phoneNumber;
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
        this.setState({
          error: 'Otp Send Successfully',
          modelVisible: true,
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

  _onFinishCheckingCode2 = async (data, code) => {
    this.props.OtpStore.setOtp(data);
    // const {otpInput = {}, otp, setErrorText = {}} = this.props.OtpStore;

    // if (otp !== '') {
    //   let phoneNumber = this.props.route.params.phoneNumber;
    //   let response = await otpInput(phoneNumber, otp);
    //   console.log(response, 'response:::: in otp screem');
    //   if (response.success === true) {
    //     this.props.navigation.navigate('Barcode');
    //   } else {
    //     setErrorText(response.message);
    //   }
    // }
  };
  submit = async () => {
    const {otpInput = {}, otp, setErrorText = {}} = this.props.OtpStore;

    if (otp !== '') {
      let phoneNumber = this.props.route.params.phoneNumber;
      let response = await otpInput(phoneNumber, otp);
      console.log(response, 'response:::: in otp screem');
      if (response.success === true) {
        this.props.LoginStore.setToken(response.token, phoneNumber);
      } else {
        console.log('inside else');
        this.setState({
          error: 'Please Enter Valid Otp',
          modelVisible: true,
        });
      }
    } else {
      this.setState({
        error: 'Please Enter Valid Otp',
        modelVisible: true,
      });
      console.log('state', this.state);
    }
  };
  componentDidMount() {
    const {reset = {}} = this.props.OtpStore;
    reset();
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexGrow: 1,
          justifyContent: 'center',
          backgroundColor: 'white',
        }}>
        <HeaderTitle headerTitle="RDC Estampillage" />
        <View style={{flex: 1, justifyContent: 'center'}}>
          <CText
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: COLORS.SECONDARY_COLOR,
              textAlign: 'center',
            }}>
            OTP
          </CText>
          <View style={{alignItems: 'center'}}>
            <CodeInput
              ref="codeInputRef2"
              secureTextEntry
              activeColor={COLORS.SECONDARY_COLOR}
              inactiveColor={COLORS.SECONDARY_COLOR}
              cellBorderWidth={0}
              autoFocus={false}
              ignoreCase={true}
              codeLength={4}
              ClassNames="border-b"
              inputPosition="left"
              size={70}
              onFulfill={(isValid, code) => {
                this._onFinishCheckingCode2(isValid, code);
              }}
              containerStyle={{
                marginHorizontal: 30,
                marginBottom: 20,
                justifyContent: 'space-between',
                flex: 0.05,
              }}
              codeInputStyle={{
                borderBottomColor: COLORS.SECONDARY_COLOR,
                color: COLORS.SECONDARY_COLOR,
                borderBottomWidth: 3,
                height: 50,
              }}
            />
            <View style={styles.ButtonContainer}>
              <TouchableOpacity
                style={styles.ButtonStyle}
                onPress={this.submit}>
                <View style={{alignItems: 'center'}}>
                  <Icon name="angle-double-right" size={40} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CText
              style={{
                color: COLORS.SECONDARY_COLOR,
                marginTop: 15,
                fontSize: 16,
                textAlign: 'center',
              }}>
              Didn't Receive OTP?
            </CText>
            <TouchableOpacity onPress={this.resendOtp}>
              <CText
                style={{
                  color: COLORS.SECONDARY_COLOR,
                  marginTop: 15,
                  fontSize: 16,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  marginLeft: 3,
                }}>
                Resend OTP
              </CText>
            </TouchableOpacity>
          </View>
        </View>
        {this.state.modelVisible && (
          <TouchableOpacity
            onPress={() => this.setState({modelVisible: false})}
            style={{
              bottom: 0,
              backgroundColor: COLORS.SECONDARY_COLOR,
              padding: 20,
              width: '100%',
            }}>
            <View>
              <Text style={{color: 'white'}}>{this.state.error}</Text>
            </View>
          </TouchableOpacity>
        )}
        {this.props.OtpStore.loader && <CLoader />}
        <CopyRight />
      </View>
    );
  }
}

export default Otp;

const styles = StyleSheet.create({
  ButtonStyle: {
    backgroundColor: COLORS.SECONDARY_COLOR,
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
  },
  ButtonContainer: {
    marginTop: 60,
  },
  Button: {
    color: COLORS.SECONDARY_COLOR,
    fontSize: 18,
    textAlign: 'center',
  },
});

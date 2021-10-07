import React, {Component} from 'react';
import COLORS from '../Utilities/Colors';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import {
  PermissionsAndroid,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  BackHandler,
  ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {inject, observer} from 'mobx-react';
import CLoader from '../ReusableComponents/CLoader';

@inject('OtpStore', 'ProductStore')
@observer
class Barcode extends Component {
  constructor(props) {
    super(props);
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPressLogin',
      this.backButtonHandler,
    );
    this.state = {
      isFlash: false,
      flashValue: RNCamera.Constants.FlashMode.off,
    };
  }
  backButtonHandler = () => {
    BackHandler.exitApp();
    return true;
  };
  async componentDidMount() {
    this.props.ProductStore.resetReportData();
    const {setLatitude = {}, setLongitude = {}} = this.props.OtpStore;

    await Geolocation.getCurrentPosition(
      info => {
        console.log(info, 'info:::::::::::::::::::');
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
        console.log(error, 'error:::::::::::');
        if (error.PERMISSION_DENIED === 1) {
          console.log('inside permission');
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Request',
              message: 'App needs access to your location to proceed further',
            },
          );
          // this.backButtonHandler()
        }
      },
      {forceRequestLocation: true},
    );
    // }

    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.props.ProductStore.resetReportData();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
  onSuccess = async e => {
    console.log(e, 'e::::::::::::::', e.data); 
    console.warn("res",e);
    let latitude = this.props.OtpStore.latitude;
    let longitude = this.props.OtpStore.longitude;

    if(e.data.includes("rdc-estampillage.com/api")){
    let response = await this.props.ProductStore.getProductDetail(
      e.data,
      latitude,
      longitude,
    );
    if (response) {
      
      console.log("api_res",response);
      console.warn("api_res",response)
      this.props.navigation.navigate('ProductDetail');
    }
   
  }
  else{
    ToastAndroid.show("Invalid QR Code, Try another one", ToastAndroid.SHORT)
  }
  };

  flashHandler = () => {
    if (this.state.isFlash) {
      this.setState({
        isFlash: false,
        flashValue: RNCamera.Constants.FlashMode.off,
      });
    } else {
      this.setState({
        isFlash: true,
        flashValue: RNCamera.Constants.FlashMode.torch,
      });
    }
  };
  render() {
    let flash;
    if (this.state.isFlash) {
      flash = (
        <Icon
          name="lightbulb"
          solid
          size={40}
          color={COLORS.SECONDARY_COLOR}
          onPress={this.flashHandler}
        />
      );
    } else {
      flash = (
        <Icon
          name="lightbulb"
          size={40}
          color={COLORS.SECONDARY_COLOR}
          onPress={this.flashHandler}
        />
      );
    }
    return (
      <View style={styles.QrCodeContainer}>
        <QRCodeScanner
          onRead={e => this.onSuccess(e)}
          showMarker={true}
          fadeIn={false}
          flashMode={this.state.flashValue}
          reactivate={true}
          reactivateTimeout={2000}
          checkAndroid6Permissions={true}
          // permissionDialogTitle=" App needs access to your camera to proceed further"
          // permissionDialogMessage="Need camera permission"
          ref={node => {
            this.scanner = node;
          }}
          containerStyle={{width: 100}}
          cameraStyle={{height: '85%'}}
          bottomContent={
            <TouchableOpacity style={styles.buttonTouchable}>
              {flash}
            </TouchableOpacity>
          }
        />
        {this.props.ProductStore.loader && <CLoader />}
      </View>
    );
  }
}

export default Barcode;

const styles = StyleSheet.create({
  QrCodeContainer: {
    flex: 1,
    height: '85%',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: 'red',
  },
  buttonText: {
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    bottom: 40,
  },
});

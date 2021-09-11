/**
 * Otp Screen Mobx Store Component
 * @author Laveena Chaturvedi
 * @description Global store of the applicaion
 * @flow
 */

import {observable, action, decorate} from 'mobx';
import axios from 'axios';
import {
  SaveItem,
  ReadItem,
} from '../Utilities/helpers/AsyncStorage';
import CONSTANTS from '../Utilities/Constants';

class OtpStore {
  loader = false;
  otp = '';
  errorText = '';
  latitude = '';
  longitude = '';
  profileDetail = {};
  role = ReadItem('role') ? ReadItem('role') : null;
  setOtp = value => {
    this.otp = value;
  };
  setErrorText = value => {
    this.errorText = value;
  };
  reset = () => {
    this.otp = '';
    this.errorText = '';
  };
  setLoader = value => {
    this.loader = value;
  };
  setLatitude = value => {
    this.latitude = value;
  };
  setLongitude = value => {
    this.longitude = value;
  };

   roleCheck = async () => {
    this.role = (await ReadItem('role')) ? await ReadItem('role') : null;
  };

  //API
  otpInput = async (phoneNumber, otp) => {
    try {
      this.setLoader(true);
      const data = {
        country_code: '91',
        phone: phoneNumber,
        otp: otp,
      };

      let response = await axios.post(
        'https://rdc-estampillage.com/api/verify-otp',
        data,
      );
      this.setLoader(false);
      this.profileDetail = response.data.profile;
      await SaveItem('role', response.data.profile.role.toString());
      this.role = response.data.profile.role;
      return response.data;
    } catch (e) {
      // console.log(JSON.parse(JSON.stringify(e)))
      // console.log(JSON.parse(JSON.stringify(e.message)),'message')
      let response = JSON.parse(JSON.stringify(e.response));
      console.log(JSON.parse(JSON.stringify(e.response)), 'response');
      this.setLoader(false);
      return response.data;
    }
    // console.log('response:::::::::::::::', response);
    // SaveItem('token', response.data.token.toString());

    // this.setLoader(false);
  };
}

decorate(OtpStore, {
  loader: observable,
  otp: observable,
  errorText: observable,
  longitude: observable,
  latitude: observable,
  profileDetail: observable,
  setLoader: action,
  setOtp: action,
  setErrorText: action,
  reset: action,
  setLatitude: action,
  setLongitude: action,
});
export default new OtpStore();

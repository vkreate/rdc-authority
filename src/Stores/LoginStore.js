/**
 *  Login Screen Mobx Store Component
 * @author Laveena Chaturvedi
 * @description Global store of the applicaion
 * @flow
 */
import {observable, action, decorate} from 'mobx';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {
  DeleteItem,
  SaveItem,
  ReadItem,
} from '../Utilities/helpers/AsyncStorage';
class LoginStore {
  // 8561919680
  phoneNumber = '';
  phoneNumberPrefix = '';
  loader = false;
  token = null;

  setLoader = value => {
    this.loader = value;
  };

  setPhoneNumber = value => {
    this.phoneNumber = value;
  };

  setToken = async (token, phoneNumber) => {
    this.token = token;
    console.warn("kk",token)
    await SaveItem('token', token);
    await SaveItem('phoneNumber', phoneNumber);
   
  };

  signOut = async () => {
    if (await ReadItem('token')) {
      this.token = await ReadItem('token');
      await DeleteItem('token');
      await DeleteItem('phoneNumber');
      await DeleteItem('role');
    }
    this.token = null;
    this.phoneNumber = null;
  };

  tokenCheck = async () => {
    this.token = (await ReadItem('token')) ? await ReadItem('token') : null;
    this.phoneNumber = (await ReadItem('phoneNumber'))
      ? await ReadItem('phoneNumber')
      : null;
  };

  setPhoneNumberPrefix = value => {
    this.phoneNumberPrefix = value;
  };

  //reset data
  resetAllData = () => {
    this.phoneNumber = '';
  };
  //API
  login = async mobileNumber => {
    this.setLoader(true);
    const data = {
      country_code: '243',
      phone: mobileNumber,
    };
    let response = await axios
      .post('https://rdc-estampillage.com/api/get-otp', data)
      .catch(err => {
        this.setLoader(false);
        alert(err);
      });
    return response.data;
  };
}
// another way to decorate variables with observable
decorate(LoginStore, {
  phoneNumber: observable,
  loader: observable,
  token: observable,
  setPhoneNumber: action,
  setToken: action,
  tokenCheck: action,
  setLoader: action,
  resetAllData: action,
  signOut: action,
});
export default new LoginStore();

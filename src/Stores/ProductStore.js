/**
 *  Login Screen Mobx Store Component
 * @author Laveena Chaturvedi
 * @description Global store of the applicaion
 * @flow
 */
import {observable, action, decorate} from 'mobx';
import axios from 'axios';
import {SaveItem, ReadItem} from '../Utilities/helpers/AsyncStorage';
class ProductStore {
  productDetailURL = '';
  product = {};
  scanList = [];
  cases = [];
  loader = false;
  selectedAssignCaseId = null;
  caseDetail = {};

  setLoader = value => {
    this.loader = value;
  };

  setProductDetailURL = value => {
    this.productDetailURL = value;
  };

  setToken = async (token, phoneNumber) => {
    this.token = token;
    await SaveItem('token', token);
    await SaveItem('phoneNumber', phoneNumber);
  };

  //reset data
  resetAllData = () => {
    this.productDetailURL = '';
  };

  resetReportData = () => {
    this.product = {};
  };
  //API
  getScanedList = async () => {
    this.setLoader(true);
    this.scanList = [];
    const data = {
      token: (await ReadItem('token')) ? await ReadItem('token') : this.token,
    };
    let response = await axios
      .post('https://rdc-estampillage.com/api/scan-history', data)
      .catch(err => {
        this.setLoader(false);
        alert(err);
      });
    this.setLoader(false);
    this.scanList = response.data.scans;
    return response.data.success;
  };

  //API
  getProductDetail = async (productDetailURL, latitude, longitude) => {
    this.product = {};
    this.productDetailURL = productDetailURL;
    this.setLoader(true);
    let location = {
      lat: latitude,
      long: longitude,
    };
    const data = {
      token: (await ReadItem('token')) ? await ReadItem('token') : this.token,
      location,
    };
    let response = await axios.post(productDetailURL, data).catch(err => {
      this.setLoader(false);
      // alert(err);
    });
    this.setLoader(false);
    if (response && response.data && response.data.product) {
      this.product = response.data.product;
      return response.data.success;
    } else {
      return true;
    }
  };

  setAssignedCaseId = async assignedCaseId => {
    this.selectedAssignCaseId = assignedCaseId;
  };

  setAssignedCase = async ({status, comments}) => {
    console.log({status, comments});
    this.caseDetail.status = status ? status : this.caseDetail.status;
    this.caseDetail.comments = comments ? comments : this.caseDetail.comments;
  };

  resetError = async () => {
    console.log('test');
  };

  getAssignedCasesDetail = async () => {
    this.caseDetail = {};
    const data = {
      token: (await ReadItem('token')) ? await ReadItem('token') : this.token,
    };
    this.setLoader(true);
    let config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      let response = await axios.post(
        `https://rdc-estampillage.com/api/case-details/${this.selectedAssignCaseId}`,
        data,
        config,
      );
      if (response && response.data.success) {
        this.setLoader(false);
        this.caseDetail = response.data.details;
        return response.data;
      }
    } catch (error) {
      this.setLoader(false);
      alert('err', error);
    }
  };

  getAssignedCases = async status => {
    this.cases = [];
    const data = {
      token: (await ReadItem('token')) ? await ReadItem('token') : this.token,
      status,
    };
    this.setLoader(true);
    let config = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    };

    let response = await axios
      .post('https://rdc-estampillage.com/api/assigned-cases', data, config)
      .catch(err => {
        this.setLoader(false);
        alert(err);
      });
    if (response && response.data.success) {
      this.setLoader(false);
      this.cases = response.data.cases;
      return response.data;
    }
  };

  updateAssignedCase = async data => {
    this.setLoader(true);
    let config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      let response = await axios.post(
        `https://rdc-estampillage.com/api/update-case/${this.selectedAssignCaseId}`,
        data,
        config,
      );
      if (response && response.data.success) {
        this.setLoader(false);
        return response.data;
      }
    } catch (error) {
      if (error.response.status === 400) {
        this.setLoader(false);
        return error.response.data;
      }
    }
  };

  deactivateProduct = async data => {
    this.setLoader(true);
    let config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      let response = await axios.post(
        'https://rdc-estampillage.com/api/deactivate-product',
        data,
        config,
      );
      if (response && response.data.success) {
        this.setLoader(false);
        return response.data;
      }
    } catch (error) {
      this.setLoader(false);
      if (error.response.status === 400) {
        this.setLoader(false);
        return error.response.data;
      }
    }
  };

  uploadProductReport = async data => {
    this.setLoader(true);
    let config = {
      headers: {
        'Content-Type': 'multipart/form-data; ',
      },
    };
    let response = await axios
      .post('https://rdc-estampillage.com/api/report', data, config)
      .catch(err => {
        this.setLoader(false);
        alert(err);
      });
    // this.product = response.data;
    if (response && response.data.success) {
      this.setLoader(false);
      return response.data;
    }
  };
}
// another way to decorate variables with observable
decorate(ProductStore, {
  productDetailURL: observable,
  product: observable,
  scanList: observable,
  selectedAssignCaseId: observable,
  cases: observable,
  caseDetail: observable,
  loader: observable,
  resetReportData: action,
  setProductDetailURL: action,
  roleCheck: action,
  setLoader: action,
  resetAllData: action,
  signOut: action,
  setAssignedCaseId: action,
  setAssignedCase: action,
  getAssignedCasesDetail: action,
  updateAssignedCase: action,
  resetError: action,
});
export default new ProductStore();

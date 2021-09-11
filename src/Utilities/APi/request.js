import axios from 'axios';
import {ReadItem} from '../helpers/AsyncStorage';

export const getFormDataFromObject = (data) => {
  const formData = new FormData();
  for (var key in data) {
    if (typeof data[key] === 'object') {
      var dataValue = data[key];
      if (key === 'image') {
        dataValue.forEach((element, i) => {
          formData.append('image', element);
        });
      } else {
        if (
          dataValue !== null &&
          dataValue.uri !== undefined &&
          dataValue.uri !== null
        ) {
        } else {
          if (dataValue != null) {
            dataValue = JSON.stringify(dataValue);
            dataValue = dataValue.replace(/\\/g);
          }
        }
        if (dataValue !== undefined && dataValue != null) {
          formData.append(key, dataValue);
        }
      }
    } else {
      if (data[key] !== undefined && data[key] != null) {
        formData.append(key, data[key]);
      }
    }
  }
  return formData;
};
export const apiCalling = async (method, url, data) => {
  let baseUrl = 'https://tplsmartworld.com/api';
  let token = await ReadItem('token');


  let object = data;
  let params = false ? getFormDataFromObject(object) : object;
  try {
    const request = {
      url: baseUrl + url,
      data: params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    let response
    if(method==='post'){
      response = await axios
        .post(request.url, request.data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .catch((err) => {
          console.log('======= err has been =====>>>>', err);
        });
    }else{
      response = await axios
        .put(request.url, request.data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .catch((err) => {
          console.log('======= err has been =====>>>>', err);
        });
      console.log(response, 'response::::::::::::::');
    }


    return response.data;
  } catch (error) {
    return error;
  }
};

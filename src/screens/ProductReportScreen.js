/* eslint-disable react-native/no-inline-styles */
/**
 * @author K K
 * @description ProductReportScreen
 * @flow
 */
import React, {Component} from 'react';
import {
  BackHandler,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Text,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {inject, observer} from 'mobx-react';
import CText from '../ReusableComponents/CText';
import CLoader from '../ReusableComponents/CLoader';
import COLORS from '../Utilities/Colors';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import {ReadItem} from '../Utilities/helpers/AsyncStorage';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'react-native-fetch-blob';

@inject('ProductStore')
@observer
class ProductReportScreen extends Component {
  constructor(props) {
    super(props);
    this.inputRefs = {
      firstTextInput: null,
      issueType: null,
    };
    this.state = {
      issueType: null,
      selectUploadImageType: null,
      description: null,
      imageObj: {},
      imageURI: null,
      image: null,
      error: '',
      modelVisible: false,
      placeholder: {
        label: 'Product Issue Type',
        value: null,
        key: '0',
        color: COLORS.SECONDARY_COLOR,
      },
      imageUploadPlaceholder: {
        label: 'Upload image',
        value: null,
        key: '0',
        color: COLORS.SECONDARY_COLOR,
      },
      imageUploadOptions: [
        {
          label: 'Take Image',
          value: 'capture',
          key: 'Take Image',
          color: COLORS.SECONDARY_COLOR,
          inputLabel: 'Take Image',
        },
        {
          label: 'Select Image',
          value: 'library',
          key: 'Select Image',
          color: COLORS.SECONDARY_COLOR,
          inputLabel: 'Select Image',
        },
      ],
      pickerProps: {
        itemStyle: {
          backgroundColor: 'blue',
          fontSize: 22,
        },
      },
      items: [
        {
          label: 'Damaged Product',
          value: 'Damaged Product',
          key: 'Damaged Product',
          color: COLORS.SECONDARY_COLOR,
          inputLabel: 'Damaged Product',
        },
        {
          label: 'Suspicious Product',
          value: 'Suspicious Product',
          key: 'Suspicious Product',
          color: COLORS.SECONDARY_COLOR,
          inputLabel: 'Suspicious Product',
        },
        {
          label: 'Change in taste',
          value: 'Change in taste',
          key: 'Change in taste',
          color: COLORS.SECONDARY_COLOR,
          inputLabel: 'Change in taste',
        },
        {
          label: 'Wrong product',
          value: 'Wrong product',
          key: 'Wrong product',
          color: COLORS.SECONDARY_COLOR,
          inputLabel: 'Wrong product',
        },
        {
          label: 'Retailer issue',
          value: 'Retailer issue',
          key: 'Retailer issue',
          color: COLORS.SECONDARY_COLOR,
          inputLabel: 'Retailer issue',
        },
        {
          label: 'Product details mismatch',
          value: 'Product details mismatch',
          key: 'Product details mismatch',
          color: COLORS.SECONDARY_COLOR,
          inputLabel: 'Product details mismatch',
        },
        {
          label: 'Label altered',
          value: 'Label altered',
          key: 'Label altered',
          color: COLORS.SECONDARY_COLOR,
          inputLabel: 'Label altered!',
        },
        {
          label: 'Other issue',
          value: 'Other issue',
          key: 'Other issue',
          color: COLORS.SECONDARY_COLOR,
          inputLabel: 'Other issue!',
        },
      ],
    };
    this.modalRef = React.createRef();
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPressLogin',
      this.backButtonHandler,
    );
  }
  backButtonHandler = () => {
    this.props.navigation.navigate('Home1');
    return true;
  };

  createFormData = (body = {}) => {
    const data = new FormData();
    data.append('image', this.state.image);

    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });
    return data;
  };

  componentDidMount() {
    this.setState({
      image: null,
      imageURI: null,
      issueType: null,
      description: null,
      selectUploadImageType: null,
    });
  }

  launchCameraHandler = async options => {
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({selectUploadImageType: null});
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({selectUploadImageType: null});
      } else {
        if (response.assets[0].fileSize > 35000) {
          alert('File Size exceeds ( Max size 10MB)');
          this.setState({selectUploadImageType: null});
          return;
        }
        this.setState({
          image: `data:image/jpeg;base64, ${response.assets[0].base64}`,
          imageURI:
            Platform.OS === 'ios'
              ? response.assets[0].replace('file://', '')
              : response.assets[0].uri,
        });
        this.resize();
      }
    });
  };

  launchImageLibraryHandler = options => {
    launchImageLibrary(options, response => {
      console.log({response});
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({selectUploadImageType: null});
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({selectUploadImageType: null});
      } else {
        if (response.assets[0].fileSize > 35000) {
          alert('File Size exceeds ( Max size 10MB)');
          this.setState({selectUploadImageType: null});
          return;
        }
        this.setState({
          image: response.assets[0].base64,
          imageURI:
            Platform.OS === 'ios'
              ? response.assets[0].replace('file://', '')
              : response.assets[0].uri,
        });
        this.resize();
      }
    });
  };

  handleChoosePhoto = async value => {
    console.log({value});
    if (!value) {
      this.setState({selectUploadImageType: null});
      return;
    }
    const actionsObj = {
      capture: {
        saveToPhotos: true,
        maxHeight: 600,
        maxWidth: 400,
        cameraType: 'back',
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: true,
      },
      library: {
        maxHeight: 600,
        maxWidth: 400,
        quality: 0.7,
        mediaType: 'photo',
        includeBase64: true,
      },
    };

    let options = actionsObj[value];
    if (value === 'capture') {
      this.launchCameraHandler(options);
    } else {
      this.launchImageLibraryHandler(options);
    }
  };

  resize = () => {
    let mode = 'cover';
    let onlyScaleDown = true;

    this.setState({image: null});
    ImageResizer.createResizedImage(
      this.state.imageURI,
      600,
      400,
      'JPEG',
      90,
      0,
      undefined,
      false,
      {mode, onlyScaleDown},
    )
      .then(response => {
        RNFetchBlob.fs
          .readFile(response.path, 'base64')
          .then(data => {
            this.setState({image: `data:image/jpeg;base64, ${data}`});
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log('err', err);
        return;
      });
  };

  handleUploadPhoto = async () => {
    let {id, batch} = this.props.ProductStore.product;
    let token = (await ReadItem('token')) ? await ReadItem('token') : null;
    let data = {
      token: token,
      product_id: id,
      batch: batch,
      issue_type: this.state.issueType,
      description: this.state.description,
    };

    if (!data.issue_type) {
      this.setState({
        error: 'Please choose product type of issue. ',
        modelVisible: true,
      });
      return;
    }

    if (!data.description || !data.description?.trim()) {
      this.setState({
        error: 'Please Enter Message. ',
        modelVisible: true,
      });
      return;
    }
    let body = await this.createFormData(data);
    let uploadReportData = await this.props.ProductStore.uploadProductReport(
      body,
    );
    if (uploadReportData && uploadReportData.success) {
      this.setState({
        error: uploadReportData.message,
        modelVisible: true,
        image: null,
        imageURI: null,
        issueType: null,
        description: null,
        selectUploadImageType: null,
      });
      
    }
  };

  render() {
    return (
      <View style={styles.ProductReportContainer}>
        <View style={styles.Heading}>
          <CText style={styles.HeadingText}>Report Issue</CText>
        </View>
        <View style={styles.SelectPicker}>
          <RNPickerSelect
            onValueChange={value => this.setState({issueType: value})}
            items={this.state.items}
            value={this.state.issueType}
            placeholder={this.state.placeholder}
            onUpArrow={() => {
              this.inputRefs.firstTextInput.focus();
            }}
            onDownArrow={() => {
              this.inputRefs.issueType.togglePicker();
            }}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 10,
                right: 12,
              },
              placeholder: {
                color: 'gray',
                fontSize: 16,
              },
            }}
            ref={el => {
              this.inputRefs.issueType = el;
            }}
            Icon={() => {
              return (
                <Icon
                  name="angle-down"
                  size={30}
                  color={COLORS.SECONDARY_COLOR}
                />
              );
            }}
          />
        </View>
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            selectionColor={COLORS.SECONDARY_COLOR}
            underlineColorAndroid="transparent"
            placeholder="Message"
            placeholderTextColor="grey"
            numberOfLines={10}
            multiline={true}
            onChangeText={value => this.setState({description: value})}
            value={this.state.description}
          />
        </View>
        <View style={styles.ButtonStyle}>
          <View style={styles.ButtonContainer}>
            <RNPickerSelect
              onValueChange={value => this.handleChoosePhoto(value)}
              items={this.state.imageUploadOptions}
              value={this.state.selectUploadImageType}
              placeholder={this.state.imageUploadPlaceholder}
              style={{
                ...pickerSelectImageButtonStyles,
                placeholder: {
                  color: 'white',
                  fontSize: 10,
                },
              }}
            />
          </View>
        </View>
        {this.state.imageURI && (
          <>
            <View style={styles.uploadImageContainer}>
              <Image
                source={{
                  uri: this.state.imageURI,
                }}
                style={{width: '100%', height: 250}}
              />
            </View>
            <View style={styles.ButtonStyle}>
              <TouchableOpacity onPress={this.handleUploadPhoto}>
                <View style={styles.ButtonContainer}>
                  <CText style={styles.ButtonText}>Submit</CText>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
        {this.state.modelVisible && (
          <TouchableOpacity
            onPress={() => this.setState({modelVisible: false})}
            style={{
              bottom: 0,
              position: 'absolute',
              backgroundColor: COLORS.SECONDARY_COLOR,
              padding: 10,
              width: 500,
            }}>
            <View>
              <Text style={{color: 'white'}}>{this.state.error}</Text>
            </View>
          </TouchableOpacity>
        )}
        {this.props.ProductStore.loader && <CLoader />}
      </View>
    );
  }
}

export default ProductReportScreen;

const styles = StyleSheet.create({
  ItemContainer: {
    marginBottom: 20,
  },
  pickerStyle: {
    fontSize: 24,
    backgroundColor: COLORS.SECONDARY_COLOR,
  },
  SelectPicker: {
    width: '100%',
    marginBottom: 20,
    padding: 5,
    borderWidth: 2,
    borderColor: COLORS.SECONDARY_COLOR,
    borderRadius: 30,
  },
  placeholder: {
    fontSize: 20,
    color: 'black',
    backgroundColor: COLORS.SECONDARY_COLOR,
  },
  inputAndroid: {
    fontSize: 20,
    color: 'black',
    backgroundColor: COLORS.SECONDARY_COLOR,
  },
  Heading: {
    marginTop: 10,
    marginBottom: 10,
  },
  HeadingText: {
    fontSize: 25,
    color: COLORS.SECONDARY_COLOR,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  ProductReportContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'flex-start',
    flexGrow: 1,
  },
  ButtonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonContainer: {
    marginTop: 20,
    marginBottom: 20,
    width: 200,
    height: 50,
    backgroundColor: COLORS.SECONDARY_COLOR,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
    justifyContent: 'center',
    textAlignVertical: 'center',
  },
  textAreaContainer: {
    borderColor: COLORS.SECONDARY_COLOR,
    borderRadius: 15,
    borderWidth: 2,
    padding: 5,
  },
  textArea: {
    color: 'black',
    fontSize: 16,
    height: 150,
    textAlignVertical: 'top',
  },
});

const pickerSelectStyles = StyleSheet.create({
  // inputIOS: {
  //   fontSize: 20,
  //   paddingVertical: 12,
  //   paddingHorizontal: 10,
  //   color: 'black',
  //   paddingRight: 30, // to ensure the text is never behind the icon
  // },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const pickerSelectImageButtonStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 20,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'white',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

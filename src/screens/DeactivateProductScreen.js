/* eslint-disable react-native/no-inline-styles */
/**
 * @author K K
 * @description Deactivate Product
 * @flow
 */
import React, {Component} from 'react';
import {
  BackHandler,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {inject, observer} from 'mobx-react';
import CText from '../ReusableComponents/CText';
import CLoader from '../ReusableComponents/CLoader';
import COLORS from '../Utilities/Colors';
import RNPickerSelect from 'react-native-picker-select';
import {ReadItem} from '../Utilities/helpers/AsyncStorage';

@inject('ProductStore')
@observer
class DeactivateProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: null,
      code: null,
      error: '',
      modelVisible: false,
      placeholder: {
        label: 'Select Product/Batch',
        value: null,
        key: 0,
        color: COLORS.SECONDARY_COLOR,
      },
      pickerProps: {
        itemStyle: {
          backgroundColor: 'blue',
          fontSize: 22,
        },
      },
      items: [
        {
          label: 'Product',
          value: 0,
          key: 'Product',
          color: COLORS.SECONDARY_COLOR,
          inputLabel: 'Product',
        },
        {
          label: 'Batch',
          value: 1,
          key: 'Batch',
          color: COLORS.SECONDARY_COLOR,
          inputLabel: 'Batch',
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

  resetState = async () => {
    this.setState({
      type: null,
      code: null,
      error: '',
      modelVisible: false,
    });
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      if (Object.keys(this.props.ProductStore.product).length) {
        const {code_data} = this.props.ProductStore.product;
        const type = code_data ? 0 : 1;
        const code = code_data;
        this.setState({
          type,
          code,
          error: '',
          modelVisible: false,
        });
      } else {
        this.resetState();
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  deactivateHandler = async () => {
    let token = (await ReadItem('token')) ? await ReadItem('token') : null;
    let data = {
      token: token,
      type: this.state.type,
      code: this.state.code,
    };
    if (this.state.type === null) {
      this.setState({
        error: 'Please choose Product/Batch. ',
        modelVisible: true,
      });
      return;
    }

    if (!this.state.code || !this.state.code?.trim()) {
      this.setState({
        error: 'Please Enter Code. ',
        modelVisible: true,
      });
      return;
    }
    let deactivateProductData = await this.props.ProductStore.deactivateProduct(
      data,
    );

    if (deactivateProductData && !deactivateProductData.success) {
      this.setState({
        error: deactivateProductData.message,
        modelVisible: true,
      });
    }
    if (deactivateProductData && deactivateProductData.success) {
      this.setState({
        error: deactivateProductData.message,
        modelVisible: true,
        type: null,
        code: null,
      });
      this.props.navigation.navigate("Home1")
      Alert.alert("Deactivated successsfully")

    }
  };

  render() {
    return (
      <View style={styles.ProductReportContainer}>
        <View style={styles.Heading}>
          <CText style={styles.HeadingText}>Deactivate Product</CText>
        </View>
        <View style={styles.DeactivateContainer}>
          <View style={styles.SelectPicker}>
            <RNPickerSelect
              onValueChange={value => this.setState({type: value})}
              items={this.state.items}
              value={this.state.type}
              placeholder={this.state.placeholder}
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
          <View>
            <TextInput
              placeholder="Code"
              placeholderTextColor="black"
              style={styles.CodeInput}
              maxLength={10}
              onChangeText={value => this.setState({code: value})}
              value={this.state.code}
            />
          </View>
        </View>
        <View style={styles.ButtonStyle}>
          <TouchableOpacity onPress={this.deactivateHandler}>
            <View style={styles.ButtonContainer}>
              <CText style={styles.ButtonText}>Submit</CText>
            </View>
          </TouchableOpacity>
        </View>
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

export default DeactivateProduct;

const styles = StyleSheet.create({
  DeactivateContainer: {
    flex: 1,
    flexGrow: 1,
    marginTop: 10,
  },
  SelectPicker: {
    width: '100%',
    marginBottom: 20,
    padding: 3,
    borderWidth: 2,
    borderColor: COLORS.SECONDARY_COLOR,
    borderRadius: 30,
  },
  CodeInput: {
    width: '100%',
    marginBottom: 20,
    padding: 15,
    paddingLeft: 22,
    fontSize: 16,
    borderWidth: 2,
    color: '#000',
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
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

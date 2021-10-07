/* eslint-disable react-native/no-inline-styles */
/**
 * @author K K
 * @description Assigned Case Detail
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
  ScrollView,
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
class AssignedCasesDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClosed: true,
      comments: null,
      status: null,
      enabled: false,
      error: '',
      modelVisible: false,
      pickerProps: {
        itemStyle: {
          backgroundColor: 'blue',
          fontSize: 22,
        },
      },
      items: [
        {
          label: 'Close',
          value: 'Close',
          key: 'Close',
          color: COLORS.SECONDARY_COLOR,
          inputLabel: 'Close',
        },
        {
          label: 'Open',
          value: 'Open',
          key: 'Open',
          color: COLORS.SECONDARY_COLOR,
          inputLabel: 'Open',
        },
      ],
    };
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPressLogin',
      this.backButtonHandler,
    );
  }
  backButtonHandler = () => {
    this.props.navigation.navigate('AssignedCases');
    return true;
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      const caseDetail = this.props.ProductStore.caseDetail;
      console.log('caseDetail', caseDetail);
      if (caseDetail.status === 'Closed') {
        this.setState({isClosed: false});
      }
      this.setState({
        status: caseDetail.status,
        comments: caseDetail.comments,
        error: null,
        modelVisible: false,
      });
      console.log('isclosed', this.state.isClosed);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  updateAssinedCase = async ({comments, status}) => {
    console.log({comments, status});
    let token = (await ReadItem('token')) ? await ReadItem('token') : null;
    let data = {
      token: token,
      status: status === 'Close' ? '1' : '0',
      comments,
    };
    if (!data.comments || !data.comments?.trim()) {
      this.setState({
        error: 'Please Enter Message. ',
        modelVisible: true,
      });
      return;
    }
    console.log('data, data', data);
    let updateCaseData = await this.props.ProductStore.updateAssignedCase(data);
    if (updateCaseData && !updateCaseData.success) {
      this.setState({
        error: updateCaseData.message,
        modelVisible: true,
      });
    }
    if (updateCaseData && updateCaseData.success) {
      Alert.alert(updateCaseData.message);
      this.setState({
         error: updateCaseData.message,
        modelVisible: true,
      });
    }
  };

  detailshandler = async ({status, comments}) => {
    this.props.ProductStore.setAssignedCase({status, comments});
  };

  render() {
    const caseDetail = this.props.ProductStore.caseDetail;
    console.log('case', JSON.stringify(caseDetail));
    return (
      <View style={styles.ProductReportContainer}>
        <View style={styles.Heading}>
          <CText style={styles.HeadingText}>Assigned Cases Detail</CText>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          persistentScrollbar={false}>
          <View style={styles.AssignedItemContainer}>
            <View style={styles.CaseContainer}>
              <View style={styles.CaseLeftContainer}>
                <View style={styles.CaseItemContainer}>
                  <CText style={styles.CaseText}>Case ID : </CText>
                  <CText style={styles.CaseText}>{caseDetail.id}</CText>
                </View>
                <View style={styles.CaseItemContainer}>
                  <CText style={[styles.CaseText,{fontSize:18}]}>
                    {caseDetail.description}
                  </CText>
                </View>
                <View style={styles.CaseItemContainer}>
                  <CText style={styles.CaseItemText}>Reported by: </CText>
                  <CText style={styles.CaseItemTextWrap}>
                    {caseDetail.reported_by}
                  </CText>
                </View>
                <View style={styles.CaseItemContainer}>
                  <CText style={styles.CaseItemText}>Date : </CText>
                  <CText style={styles.CaseItemTextWrap}>
                    {caseDetail.date}
                  </CText>
                </View>
                <View style={styles.CaseItemContainer}>
                  <CText style={styles.CaseItemText}>Manufacturer : </CText>
                  <CText style={styles.CaseItemTextWrap}>
                    {caseDetail?.manufacturer?.name} ,
                    {caseDetail?.manufacturer?.phone}
                  </CText>
                </View>
                <View style={styles.CaseItemContainer}>
                  <CText style={styles.CaseItemText}>Address : </CText>
                  <CText style={styles.CaseItemTextWrap}>
                    {caseDetail?.manufacturer?.address}
                  </CText>
                </View>
                <View style={styles.CaseItemContainer}>
                  <CText style={styles.CaseItemText}>Provinces : </CText>
                  <CText style={styles.CaseItemTextWrap}>
                    {caseDetail?.manufacturer?.provinces.join(' , ')}
                  </CText>
                </View>
                <View style={styles.CaseItemContainer}>
                  <CText style={styles.CaseItemText}>Status : </CText>
                  <CText style={[styles.CaseItemTextWrap,{fontWeight:"bold"}]}>
                  {caseDetail.status}
                  </CText>
                </View>
              </View>
            </View>
          </View>
          {caseDetail.status != 'Closed'?
          <View style={styles.SelectPicker}>
            
            <RNPickerSelect
              onValueChange={value => this.detailshandler({status: value})}
              enabled={false}
              items={this.state.items}
              value={caseDetail.status}
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
          :null
  }
          {caseDetail.status != 'Closed'?
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              selectionColor={COLORS.SECONDARY_COLOR}
              underlineColorAndroid="transparent"
              placeholder="Message"
              placeholderTextColor="grey"
              numberOfLines={10}
              multiline={true}
              onChangeText={value => this.detailshandler({comments: value})}
              value={caseDetail.comments}
            />
          </View>
          :
          null
            }
          {caseDetail.image && (
            <>
              <View style={styles.uploadImageContainer}>
                <Image
                  source={{
                    uri: caseDetail.image,
                  }}
                  style={{width: '100%', height: 250}}
                />
              </View>
            </>
          )}
         
          {caseDetail.status != 'Closed' && (
            <View style={styles.ButtonStyle}>
              <TouchableOpacity
                onPress={() =>
                  this.updateAssinedCase({
                    comments: caseDetail.comments,
                    status: caseDetail.status,
                  })
                }>
                <View style={styles.ButtonContainer}>
                  <CText style={styles.ButtonText}>Submit</CText>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
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

export default AssignedCasesDetail;

const styles = StyleSheet.create({
  AssignedItemContainer: {
    flex: 1,
    marginTop: 10,
  },
  CaseContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: 30,
  },
  CaseLeftContainer: {
    width: '100%',
    paddingLeft: 10,
  },
  CaseRightContainer: {
    marginVertical: 30,
  },
  CaseItemTextWrap: {
    fontSize: 16,
    flexShrink: 1,
  },
  CaseItemContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  CaseText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 15,
  },

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
    marginTop: 20,
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

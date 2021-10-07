/* eslint-disable react-native/no-inline-styles */
/**
 * @author K K
 * @description Assigned Cases
 * @flow
 */
import React, {Component} from 'react';
import {
  BackHandler,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {inject, observer} from 'mobx-react';
import CText from '../ReusableComponents/CText';
import CLoader from '../ReusableComponents/CLoader';
import COLORS from '../Utilities/Colors';
import RNPickerSelect from 'react-native-picker-select';
import AssignedCasesList from '../Components/AssignedCasesList';

@inject('ProductStore')
@observer
class AssignedCasesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assignedCaseType: '0',
      error: '',
      modelVisible: false,
      placeholder: {
        label: 'Opened',
        value: '0',
        key: '0',
        color: COLORS.SECONDARY_COLOR,
        inputLabel: 'Opened',
      },
      items: [
        {
          label: 'Closed',
          value: '1',
          key: '1',
          color: COLORS.SECONDARY_COLOR,
          inputLabel: 'Closed',
        },
      ],
    };
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPressLogin',
      this.backButtonHandler,
    );
  }
  backButtonHandler = () => {
    this.props.navigation.navigate('Home1');
    return true;
  };

  async componentDidMount() {
    this.props.ProductStore.getAssignedCases(this.state.assignedCaseType);
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.props.ProductStore.resetReportData();
      this.props.ProductStore.getAssignedCases(this.state.assignedCaseType);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  assignedCaseFilter = value => {
    this.props.ProductStore.getAssignedCases(value);
    this.setState({assignedCaseType: value});
  };

  render() {
    return (
      <View style={styles.ProductReportContainer}>
        <View style={styles.Heading}>
          <CText style={styles.HeadingText}>Assigned Cases</CText>
        </View>
        <View style={styles.SelectPicker}>
          <RNPickerSelect
            onValueChange={value => this.assignedCaseFilter(value)}
            items={this.state.items}
            value={this.state.assignedCaseType}
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
        <AssignedCasesList {...this.props} />
        {this.props.ProductStore.loader && <CLoader />}
      </View>
    );
  }
}

export default AssignedCasesScreen;

const styles = StyleSheet.create({
  CasesListContainer: {
    flex: 1,
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
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

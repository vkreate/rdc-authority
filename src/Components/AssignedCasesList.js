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
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {inject, observer} from 'mobx-react';
import CText from '../ReusableComponents/CText';
import CLoader from '../ReusableComponents/CLoader';
import COLORS from '../Utilities/Colors';
import {ReadItem} from '../Utilities/helpers/AsyncStorage';

@inject('ProductStore')
@observer
class AssignedCasesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assignedCaseType: null,
      error: '',
      modelVisible: false,
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

  assignedCaseDetail = async assignCaseId => {
    await this.props.ProductStore.setAssignedCaseId(assignCaseId);
    this.props.ProductStore.getAssignedCasesDetail();
    this.props.navigation.navigate('AssignedCasesDetail');
  };

  render() {
    const cases = this.props.ProductStore.cases;
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        persistentScrollbar={false}>
        {cases.length > 0
          ? cases.map((caseObj, index) => (
              <TouchableOpacity
                key={index}
                style={styles.CasesListContainer}
                onPress={() => this.assignedCaseDetail(caseObj.id)}>
                <View style={styles.AssignedItemContainer}>
                  <View style={styles.CaseContainer}>
                    <View style={styles.CaseLeftContainer}>
                      <View style={styles.CaseItemContainer}>
                        <CText style={styles.CaseText}>Case ID : </CText>
                        <CText style={styles.CaseText}>{caseObj.id}</CText>
                      </View>
                      <View style={styles.CaseItemContainer}>
                        <CText style={[styles.CaseText,{fontSize:16}]}>
                          {caseObj.description}
                        </CText>
                      </View>
                      <View style={styles.CaseItemContainer}>
                        <CText style={styles.CaseText1}>Reported by: </CText>
                        <CText style={styles.CaseText1}>
                          {caseObj.reported_by}
                        </CText>
                      </View>
                      <View style={styles.CaseItemContainer}>
                        <CText style={styles.CaseText1}>Date : </CText>
                        <CText style={styles.CaseText1}>{caseObj.date}</CText>
                      </View>
                    </View>
                    <View style={styles.CaseRightContainer}>
                      <Icon
                        name="angle-right"
                        size={26}
                        color={COLORS.SECONDARY_COLOR}
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          : !this.props.ProductStore.loader && (
              <View style={{alignItems: 'center', marginTop: 50}}>
                <CText style={{fontSize: 16}}>No Assigned Cases</CText>
              </View>
            )}
        {this.props.ProductStore.loader && <CLoader />}
      </ScrollView>
    );
  }
}

export default AssignedCasesList;

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
  CaseItemContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  CaseText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 15,
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

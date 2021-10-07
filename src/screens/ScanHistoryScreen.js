/**
 * @author KK
 * @description ScanHistory Screen
 * @flow
 */
import React, {Component} from 'react';
import {TouchableOpacity, View, ScrollView, StyleSheet} from 'react-native';
import CText from '../ReusableComponents/CText';
import COLORS from '../Utilities/Colors';
import {inject, observer} from 'mobx-react';
import CLoader from '../ReusableComponents/CLoader';

@inject('OtpStore', 'ProductStore')
@observer
class ScanHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      modelVisible: false,
    };
  }

  componentDidMount() {
    this.props.ProductStore.getScanedList();
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      console.log('focus');
      this.props.ProductStore.resetReportData();
      this.props.ProductStore.getScanedList();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  productDetails = async (url,scan_id) => {
    let latitude = this.props.OtpStore.latitude;
    let longitude = this.props.OtpStore.longitude;
    let response = await this.props.ProductStore.getProductDetail(
      url,
      latitude,
      longitude,
      scan_id
    );
    if (response) {
      this.props.navigation.navigate('ProductDetail');
    }
  };

  render() {
    let scans = this.props.ProductStore.scanList;
    return (
      <View
        style={{
          flex: 1,
          flexGrow: 1,
          justifyContent: 'center',
          backgroundColor: '#f2f2f2',
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          persistentScrollbar={false}>
          {scans.length > 0
            ? scans.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.container}
                  onPress={() => this.productDetails(item.url,item.scan_id)}>
                  <View style={styles.ListItem}>
                    <View style={styles.ListRow}>
                      <CText style={styles.HeadingText}>Product Name :</CText>
                      <CText style={styles.text}>{item.product}</CText>
                    </View>
                    <View style={styles.ListRow}>
                      <CText style={styles.HeadingText}>Scanned On :</CText>
                      <CText style={styles.text}>{item.date}</CText>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            : !this.props.ProductStore.loader && (
                <View style={{alignItems: 'center', marginTop: 50}}>
                  <CText style={{fontSize: 16}}>No Scan History</CText>
                </View>
              )}
        </ScrollView>
        {this.props.ProductStore.loader && <CLoader />}
      </View>
    );
  }
}

export default ScanHistory;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginTop: 3,
    backgroundColor: '#fff',
  },
  ListItem: {
    justifyContent: 'space-around',
  },
  ListRow: {
    flexDirection: 'row',
    textAlign: 'left',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  HeadingText: {
    fontSize: 18,
    color: '#000',
  },
  text: {
    fontSize: 16,
    color: COLORS.SECONDARY_COLOR,
  },
});

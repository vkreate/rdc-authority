/**
 * @author K K
 * @description ProductDetailScreen
 * @flow
 */
import React, {Component} from 'react';
import {
  BackHandler,
  View,
  StyleSheet,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {inject, observer} from 'mobx-react';
import CText from '../ReusableComponents/CText';
import COLORS from '../Utilities/Colors';
import {productDetailStyle} from '../Styles/productDetail';
import ProductDetailModal from '../Components/ProductDetailModal';

@inject('ProductStore', 'OtpStore')
@observer
class ProductDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowMore: false,
    };
    this.modalRef = React.createRef();
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPressLogin',
      this.backButtonHandler,
    );
  }
  backButtonHandler = () => {
    this.props.navigation.navigate('Home');
    return true;
  };

  ReportHandler = () => {
    this.setState({
      isShowMore: false,
    });
    if (this.props.OtpStore.role === 'dgda-inspector') {
      this.props.navigation.navigate('DeactivateProduct');
      return true;
    }

    if (this.props.OtpStore.role !== 'dgda-inspector') {
      this.props.navigation.navigate('ProductReport');
      return true;
    }

    return true;
  };

  modalHandler = () => {
    if (this.state.isShowMore) {
      this.setState({
        isShowMore: false,
      });
    } else {
      this.setState({
        isShowMore: true,
      });
    }
  };

  render() {
    const {
      id,
      name,
      brand,
      description,
      price,
      code_data,
      scan_count,
      last_scanned,
      batch_code,
      manufactured_on,
      expiry_on,
      image,
    } = this.props.ProductStore.product;

    const {role} = this.props.OtpStore;
    return (
      <View>
        {Object.keys(this.props.ProductStore.product).length > 0 ? (
          <View>
            {/* Modal */}
            <Modal visible={this.state.isShowMore} animationType="slide">
              <View style={productDetailStyle.ModalProductDetailContainer}>
                <TouchableOpacity onPress={this.modalHandler}>
                  <View style={productDetailStyle.CloseModalButton}>
                    <Icon
                      name="arrow-left"
                      size={30}
                      color={COLORS.SECONDARY_COLOR}
                    />
                    <CText
                      style={{
                        fontSize: 18,
                        marginLeft: 20,
                        color: COLORS.SECONDARY_COLOR,
                        textTransform: 'uppercase',
                      }}>
                      Back
                    </CText>
                  </View>
                </TouchableOpacity>
                <View style={productDetailStyle.ItemContainer}>
                  <CText style={productDetailStyle.HeadingText}>Product</CText>
                  <CText style={productDetailStyle.ScannedText}>{name}</CText>
                </View>
                <View style={productDetailStyle.ItemContainer}>
                  <CText style={productDetailStyle.HeadingText}>
                    Description
                  </CText>
                  <CText style={productDetailStyle.ScannedText}>
                    {description}
                  </CText>
                </View>
                <View style={productDetailStyle.ItemContainer}>
                  <CText style={productDetailStyle.HeadingText}>
                    Batch Code
                  </CText>
                  <CText style={productDetailStyle.ScannedText}>
                    {batch_code}
                  </CText>
                </View>
                <View style={productDetailStyle.ItemContainer}>
                  <CText style={productDetailStyle.HeadingText}>
                    Product Serial No
                  </CText>
                  <CText style={productDetailStyle.ScannedText}>
                    {code_data}
                  </CText>
                </View>
                <View style={productDetailStyle.ItemContainer}>
                  <CText style={productDetailStyle.HeadingText}>
                    Manufactured On
                  </CText>
                  <CText style={productDetailStyle.ScannedText}>
                    {manufactured_on}
                  </CText>
                </View>
                <View style={productDetailStyle.ItemContainer}>
                  <CText style={productDetailStyle.HeadingText}>
                    Expiry On
                  </CText>
                  <CText style={productDetailStyle.ScannedText}>
                    {expiry_on}
                  </CText>
                </View>
                <View style={productDetailStyle.ItemContainer}>
                  <CText style={productDetailStyle.HeadingText}>
                    Date/Time of last scan
                  </CText>
                  <CText style={productDetailStyle.ScannedText}>
                    {last_scanned}
                  </CText>
                </View>
                <View style={productDetailStyle.ButtonStyle}>
                  {role === 'dgda-inspector' && (
                    <CText style={productDetailStyle.issueText}>
                      Found Issue ?
                    </CText>
                  )}
                  <TouchableOpacity onPress={this.ReportHandler}>
                    <View style={productDetailStyle.ButtonContainer}>
                      <CText style={productDetailStyle.ButtonText}>
                        {role === 'dgda-inspector'
                          ? 'Deactivate Product'
                          : 'Report'}
                      </CText>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            {/* <ProductDetailModal ref={this.modalRef} data={this.props.ProductStore.product}></ProductDetailModal> */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              persistentScrollbar={false}>
              <View style={productDetailStyle.ProductDetailContainer}>
                <View style={productDetailStyle.Heading}>
                  <CText style={productDetailStyle.HeadingText}>Hey,</CText>
                  <CText style={productDetailStyle.HeadingText}>
                    You will love to see that this product is,
                  </CText>
                  <CText style={productDetailStyle.ProductNameText}>
                    GENUINE
                  </CText>
                </View>
                <View style={productDetailStyle.ItemContainer}>
                  <CText style={productDetailStyle.HeadingText}>
                    No. of time Scanned,
                  </CText>
                  <CText style={productDetailStyle.ScannedText}>
                    {scan_count}
                  </CText>
                </View>
                <View style={productDetailStyle.ItemContainer}>
                  <CText style={productDetailStyle.HeadingText}>
                    Date / Time of last Scan
                  </CText>
                  <CText style={productDetailStyle.ScannedText}>
                    {last_scanned}
                  </CText>
                </View>
                <View style={productDetailStyle.ItemContainer}>
                  <Image
                    source={{uri: image}}
                    style={{width: '100%', height: 400}}
                  />
                </View>
                <TouchableOpacity onPress={this.modalHandler}>
                  <CText style={productDetailStyle.LoadMoreText}>
                    Load More
                  </CText>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        ) : (
          !Object.keys(this.props.ProductStore.product).length && (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 280,
                textAlignVertical: 'center',
              }}>
              <CText style={{fontSize: 30, color: 'red', textAlign: 'center'}}>
                FAKE PRODUCT
              </CText>
              <CText style={{fontSize: 20, padding: 20, textAlign: 'center'}}>
                This is not a genuine product. Please report this to authority
                using report issue
              </CText>
            </View>
          )
        )}
      </View>
    );
  }
}

export default ProductDetailScreen;

import React , {useState}from 'react'
import { View, TouchableOpacity, Modal} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CText from '../ReusableComponents/CText';
import COLORS from '../Utilities/Colors';
import {productDetailStyle} from "../Styles/productDetail";

const ProductDetailModal = ({data}) => {
    console.log("data000-", data);
    const [isShowMore, setIsShowMore] = useState(false);
    const modalHandler = () => {
        console.log("modalutuyfuyfyu----------------");
        isShowMore ? setIsShowMore(false) : setIsShowMore(true);
    }
    return (
        <>
        <Modal visible={isShowMore} animationType="slide">
        <View style={productDetailStyle.ModalProductDetailContainer}>
          <TouchableOpacity  onPress={modalHandler}>
              <View style={productDetailStyle.CloseModalButton}>
                <Icon name="times-circle" size={40} color={COLORS.SECONDARY_COLOR} />
              </View>
          </TouchableOpacity>
      <View style={productDetailStyle.ItemContainer}>
          <CText style={productDetailStyle.HeadingText}>Product</CText>
          <CText style={productDetailStyle.ScannedText}>{data.brand}</CText>
      </View>
      <View style={productDetailStyle.ItemContainer}>
        <CText style={productDetailStyle.HeadingText}>Description</CText>
        <CText style={productDetailStyle.ScannedText}>{data.description}</CText>
      </View>
      <View style={productDetailStyle.ItemContainer}>
        <CText style={productDetailStyle.HeadingText}>Batch Code</CText>
        <CText style={productDetailStyle.ScannedText}>{data.batch}</CText>
      </View>
      <View style={productDetailStyle.ItemContainer}>
        <CText style={productDetailStyle.HeadingText}>Manufactured On</CText>
        <CText style={productDetailStyle.ScannedText}>{data.manufactured_on}</CText>
      </View>
      <View style={productDetailStyle.ItemContainer}>
        <CText style={productDetailStyle.HeadingText}>Expiry On</CText>
        <CText style={productDetailStyle.ScannedText}>{data.expiry_on}</CText>
      </View>
      <View style={productDetailStyle.ItemContainer}>
        <CText style={productDetailStyle.HeadingText}>Date/Time of last scan</CText>
        <CText style={productDetailStyle.ScannedText}>{data.last_scanned}</CText>
      </View>
      </View>
    </Modal>
    </>
    )
}

export default ProductDetailModal

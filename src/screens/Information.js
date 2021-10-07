import React from 'react';
import {
  AppState,
  Image,
  View,
  StyleSheet,
  ScrollView,
  BackHandler,
} from 'react-native';
import imagePath from '../Utilities/ImagePath';
import CText from '../ReusableComponents/CText';
import HeaderTitle from '../ReusableComponents/HeaderTitle';

class Information extends React.Component {
  constructor(props) {
    super(props);
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPressLogin',
      this.backButtonHandler,
    );
    this.state = {
      appState: AppState.currentState,
    };
  }

  backButtonHandler = () => {
    this.props.navigation.navigate('Home1');
    return true;
  };

  render() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        persistentScrollbar={false}>
        <View style={styles.homeContainer}>
          <HeaderTitle headerTitle="Information" />
          <View style={styles.contentContainer}>
            <View style={styles.topTextContainer}>
              <CText style={styles.textStyle}>
              Zala Mayele, Tala Na Bopeke! Is part of the Digital Tax Stamp Program, implemented by the Ministry of Industry. The aim of the program is to protect consumers against counterfeit products and to promote ‘Made in DRC’. You can now take matters in your own hands and use this application to verify that the product you are buying is genuine, simply by scanning the QR code on the tax stamp. 
              </CText>
            </View>
            <View style={[styles.topTextContainer,{marginTop:26}]}>
              <CText style={styles.headingTextStyle}>
              Product Categories 
              </CText>
              <CText style={styles.textStyle}>
              The Ministry of Industry is implementing Digital Tax Stamps on all excise goods, starting with all alcoholic and non-alcoholic beverages and tobacco products that are locally manufacturer or imported in the DRC. 

              </CText>
            </View>
            <View style={[styles.topTextContainer,{marginTop:26}]}>
              <CText style={styles.headingTextStyle}>
                Tax Stamps
              </CText>
              <CText style={styles.textStyle}>
              There are three types of stamps you will find on the market. 

{/* 1. Rectangle bottle neck stamp for wines and spirits 
Image
2. Rectangle stamp for tobacco products 
Image 
3. Round bottle top stamp for beers, sodas, juices and water.
Image */}
              </CText>
              <CText style={[styles.textStyle1,{marginTop:10}]}>
              1. Rectangle bottle neck stamp for wines and spirits 


              </CText>
              <Image style={{height:280,borderRadius:8,marginTop:20,width:280,alignSelf:"center"}} source={require("../Assets/Alcohol.png")}>

              </Image>
              <CText style={[styles.textStyle1,{marginTop:20}]}>
              2. Rectangle stamp for tobacco products 


              </CText>
              <Image style={{height:280,borderRadius:8,marginTop:20,width:280,alignSelf:"center"}} source={require("../Assets/Cigarss.png")}>

              </Image>
              <CText style={[styles.textStyle1,{marginTop:20}]}>
              3. Round bottle top stamp for beers, sodas, juices and water.



              </CText>
              <Image style={{height:280,borderRadius:8,marginTop:20,width:280,alignSelf:"center"}} source={require("../Assets/Water.png")}>

              </Image>
            </View>
           {/*  <View style={[styles.topTextContainer,{marginTop:26}]}>
              <CText style={styles.headingTextStyle}>
                What do they look like?
              </CText>
              <CText style={styles.textStyle}>
                There are two types of stamps: a long stamp that will be placed
                over the neck of some alcoholic beverages and a round bottle top
                stamp.
              </CText>
            </View> */}
           
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default Information;

const styles = StyleSheet.create({
  homeContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  contentContainer: {
    marginTop: 40,
    padding: 15,
  },
  headingTextStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
  },
  informationImage: {
    marginTop: 15,
    width: '100%',
    height: 150,
  },
  informationImageRound: {
    marginTop: 15,
    width: '100%',
    height: 400,
  },
  topTextContainer: {
    marginTop: 10,
  },
  textStyle: {
    textAlign: 'center',
    fontSize: 18,
  },
  textStyle1: {
    textAlign: "left",
    fontSize: 18,
  },
});

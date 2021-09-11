import {StyleSheet} from 'react-native';
import COLORS from '../Utilities/Colors';

export const productDetailStyle = StyleSheet.create({
  ProductDetailContainer: {
    padding: 25,
  },
  ModalProductDetailContainer: {
    flex: 1,
    marginLeft: 40,
  },
  Heading: {
    fontSize: 18,
  },
  CloseModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  LoadMoreText: {
    fontSize: 22,
    marginTop: 10,
    color: COLORS.SECONDARY_COLOR,
    textAlign: 'center',
  },
  HeadingText: {
    fontSize: 18,
  },
  ItemContainer: {
    marginTop: 15,
    marginBottom: 15,
  },
  ProductNameText: {
    fontSize: 22,
    marginTop: 5,
    color: '#00FF00',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  ScannedText: {
    fontSize: 22,
    color: COLORS.SECONDARY_COLOR,
  },
  ReportViewContainer: {
    alignItems: 'center',
    textAlign: 'center',
  },
  ReportText: {
    color: COLORS.SECONDARY_COLOR,
    textTransform: 'uppercase',
    fontSize: 22,
    marginRight: 15,
  },
  ReportButton: {
    marginTop: 50,
    backgroundColor: COLORS.SECONDARY_COLOR,
    justifyContent: 'center',
    width: 100,
    height: 100,
    marginLeft: 10,
  },

  ButtonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonContainer: {
    marginTop: 20,
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
  issueText: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
    color: COLORS.SECONDARY_COLOR,
    justifyContent: 'center'
  },
});

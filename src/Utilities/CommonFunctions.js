import {Dimensions} from 'react-native';
/**
 * @author Laveena Chaturvedi
 * @description get Device Dimensions
 */
export const getDeviceDimensions = () => {
  const {height} = Dimensions.get('screen');
  const {width} = Dimensions.get('screen');
  return {
    height: height,
    width: width,
  };
};

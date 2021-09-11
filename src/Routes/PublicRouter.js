import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/Login';
import Otp from '../screens/Otp';
import CONSTANTS from '../Utilities/Constants';
import Splash from '../Components/Splash';

const Stack = createStackNavigator();
function PublicRouter() {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        title: '',
        headerBackTitleVisible: false,
        gestureEnabled: false,
        headerShown: true,
      })}
      initialRouteName={CONSTANTS.SCREENS.SPLASH}>
      <Stack.Screen
        name={CONSTANTS.SCREENS.SPLASH}
        component={Splash}
        options={(navProps) => ({
          headerShown: false,
        })}
      />
      <Stack.Screen
        name={CONSTANTS.SCREENS.LOGIN}
        component={Login}
        options={(navProps) => ({
          headerShown: false,
        })}
      />
      <Stack.Screen
        name={CONSTANTS.SCREENS.OTP}
        component={Otp}
        options={(navProps) => ({
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
}
export default PublicRouter;

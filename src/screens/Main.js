/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {View} from 'react-native';
import AppRouter from '../Routes/AppRouter';
import PublicRouter from '../Routes/PublicRouter';
import COLORS from '../Utilities/Colors';
import {inject, observer} from 'mobx-react';
import {ReadItem} from '../Utilities/helpers/AsyncStorage';
import {StatusBar, AppState} from 'react-native';
import CustomErrorFallback from '../Utilities/CustomErrorFallback';
import 'react-native-gesture-handler';
import ErrorBoundary from 'react-native-error-boundary';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

@inject('OtpStore', 'LoginStore')
@observer
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    this.props.LoginStore.tokenCheck();
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  _handleAppStateChange = nextAppState => {
    this.setState({appState: nextAppState});

    if (nextAppState === 'background') {
      // Do something here on app background.
      console.log('App is in Background Mode.');
     //this.props.LoginStore.signOut();
    }

    if (nextAppState === 'active') {
      // Do something here on app active foreground mode.
      console.log('App is in Active Foreground Mode.');
    }

    if (nextAppState === 'inactive') {
      // Do something here on app inactive mode.
      console.log('App is in inactive Mode.');
    }
  };
  render() {
    const {token} = this.props.LoginStore;
     
    console.warn("toktok",token)
    return (
      <NavigationContainer>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.SECONDARY_COLOR}
        />
        <ErrorBoundary FallbackComponent={CustomErrorFallback}>
          {token ? (
            <>
              <AppRouter />
            </>
          ) : (
            <PublicRouter />
          )}
        </ErrorBoundary>
      </NavigationContainer>
    );
  }
}

export default Main;

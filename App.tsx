import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider, createTheme} from '@rneui/themed';
import Navigator from './src/navigators/Navigator';
import {UserProvider} from './src/contexts/UserContext';
import {UpdateProvider} from './src/contexts/UpdateContext';

const theme = createTheme({
  lightColors: {
    primary: '#2563EB',
    secondary: '#0EA5E9',
    background: '#0F172A',
    white: '#FFFFFF',
    black: '#020617',
  },
  mode: 'light',
  components: {
    Button: {
      radius: 999,
    },
    Card: {
      containerStyle: {
        borderRadius: 16,
        elevation: 4,
      },
    },
  },
});

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <UserProvider>
          <UpdateProvider>
            <Navigator />
          </UpdateProvider>
          <StatusBar style="light" />
        </UserProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;

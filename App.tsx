import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Navigator from './src/navigators/Navigator';
import {UserProvider} from './src/contexts/UserContext';
import {UpdateProvider} from './src/contexts/UpdateContext';

const App = () => {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <UpdateProvider>
          <Navigator />
        </UpdateProvider>
        <StatusBar style="auto" />
      </UserProvider>
    </SafeAreaProvider>
  );
};

export default App;

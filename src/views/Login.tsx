import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from '@rneui/themed';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {useUserContext} from '../hooks/ContextHooks';

const Login = () => {
  const {handleAutoLogin, loading} = useUserContext();
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    handleAutoLogin();
  }, [handleAutoLogin]);

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: '#0F172A'}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => Keyboard.dismiss()}
          style={{
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: 24,
          }}
          activeOpacity={1}
        >
          <View style={{alignItems: 'center', marginBottom: 24}}>
            <Text h2 style={{color: '#F9FAFB', fontWeight: '700'}}>
              MediaHub
            </Text>
            <Text style={{color: '#CBD5F5', marginTop: 4}}>
              Share your moments with the world
            </Text>
          </View>

          {showRegister ? <RegisterForm /> : <LoginForm />}
          <Text
            style={{
              textAlign: 'center',
              marginTop: 16,
              color: '#E5E7EB',
            }}
            onPress={() => setShowRegister((prev) => !prev)}
          >
            {showRegister
              ? 'Already have an account?'
              : 'No account yet? Register'}
          </Text>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
};

export default Login;

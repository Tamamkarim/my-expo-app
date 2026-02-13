import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Button, Card, Input, Text} from '@rneui/themed';
import type {Credentials} from '../contexts/UserContext';
import {useUserContext} from '../hooks/ContextHooks';

const LoginForm = () => {
  const {handleLogin, loading, error} = useUserContext();
  const initValues: Credentials = {username: '', password: ''};
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<Credentials>({
    defaultValues: initValues,
  });

  const doLogin = async (inputs: Credentials) => {
    await handleLogin(inputs);
  };

  return (
    <Card>
      <Card.Title>Login</Card.Title>
      <Card.Divider />
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'is required'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            errorMessage={errors.username?.message}
          />
        )}
        name="username"
      />

      <Controller
        control={control}
        rules={{
          maxLength: 100,
          required: {value: true, message: 'is required'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Password"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.password?.message}
          />
        )}
        name="password"
      />
      <Button
        title="Login"
        onPress={handleSubmit(doLogin)}
        loading={loading}
        disabled={loading}
      />
      {error ? (
        <Text style={{color: 'red', marginTop: 8}}>{error}</Text>
      ) : null}
    </Card>
  );
};

export default LoginForm;

import React from 'react';
import {View} from 'react-native';
import {Avatar, Card, Text, Button} from '@rneui/themed';
import {useUserContext} from '../hooks/ContextHooks';
import type {AuthUser} from '../types/DBTypes';

const Profile = () => {
  const {user, handleLogout} = useUserContext();
  const authUser = user as AuthUser | null;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0F172A',
        paddingHorizontal: 16,
        paddingTop: 16,
      }}
    >
      <Card>
        <Card.Title>Profile</Card.Title>
        <Card.Divider />
        {authUser ? (
          <>
            <View
              style={{
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <Avatar
                rounded
                size="large"
                title={authUser.username.charAt(0).toUpperCase()}
                containerStyle={{backgroundColor: '#2563EB'}}
              />
            </View>
            <Text style={{marginBottom: 4}}>Username: {authUser.username}</Text>
            {authUser.email ? (
              <Text style={{marginBottom: 4}}>Email: {authUser.email}</Text>
            ) : null}
            <Text>Id: {authUser.user_id}</Text>
          </>
        ) : (
          <Text>No user data available.</Text>
        )}
        <Button
          title="Logout"
          onPress={handleLogout}
          containerStyle={{marginTop: 16}}
        />
      </Card>
    </View>
  );
};

export default Profile;

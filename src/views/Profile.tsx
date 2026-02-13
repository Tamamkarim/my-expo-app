import React from 'react';
import {Card, Text, Button} from '@rneui/themed';
import {useUserContext} from '../hooks/ContextHooks';

const Profile = () => {
  const {handleLogout} = useUserContext();

  return (
    <Card>
      <Card.Title>Profile</Card.Title>
      <Card.Divider />
      <Text>Profile view</Text>
      <Button
        title="Logout"
        onPress={handleLogout}
        containerStyle={{marginTop: 16}}
      />
    </Card>
  );
};

export default Profile;

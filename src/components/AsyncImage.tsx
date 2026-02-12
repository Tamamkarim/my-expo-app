import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageProps,
  StyleSheet,
  View,
} from 'react-native';

const AsyncImage = (props: ImageProps) => {
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      )}
      <Image
        {...props}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
  },
});

export default AsyncImage;

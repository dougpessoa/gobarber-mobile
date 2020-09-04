import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

import { useAuth } from '../hooks/auth';

const Routes: React.FC = () => {
  const { user, loading } = useAuth();

  if(loading) {
    return (
      <View style={styles.container} >
        <ActivityIndicator
          size="large"
          color="#fff"
        />
      </View>
    );
  }

  return (
    user ? <AppRoutes /> : <AuthRoutes />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
})

export default Routes;
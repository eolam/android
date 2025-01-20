import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const NeedPay = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>No se realizó el pago</Text>
      <Text style={styles.message}>
        Una vez realizado el pago, se le reactivará el servicio.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
  },
});

export default NeedPay;

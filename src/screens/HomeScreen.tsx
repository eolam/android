import React, {useContext, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
// import {InUser} from '../interfaces/user.interfaces';
// import {URL_NGROK} from '@env';
// import {UserContext} from '../context/UserContext';

import {useAppNavigation} from '../hooks/useAppNavigation';
import {ROUTES} from '../navigation/routes';
import {RootStackParamList} from '../navigation/types';

const HomeScreen = ({}) => {
  //   const {userInfo} = useContext(UserContext);

  const navigation = useAppNavigation();

  const handleNavigate = (route: keyof RootStackParamList) => {
    navigation.navigate(route);
  };

  //   const [user, setUser] = useState<InUser | null>(null);

  //   useEffect(() => {
  //     const fetchUser = async () => {
  //       const res = await fetch(`${URL_NGROK}/api/user/email/${userInfo.email}`);
  //       const userResponse: InUser | null = await res.json();

  //       setUser(userResponse);
  //     };
  //     fetchUser();
  //   }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mensaje del día para Mauro</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>My profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleNavigate(ROUTES.TRAINING_HISTORY)}>
        <Text style={styles.buttonText}>Historial de entrenamientos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleNavigate(ROUTES.NEW_TRAININGS)}>
        <Text style={styles.buttonText}>Nuevos entrenamientos</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Recuerda abonar antes del FECHA</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12152C', // Color de fondo oscuro
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#D60D63', // Color rosa oscuro
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    color: 'white',
    marginTop: 30,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default HomeScreen;

import React, {useContext, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
// import {InUser} from '../interfaces/user.interfaces';
// import {URL_NGROK} from '@env';
// import {UserContext} from '../context/UserContext';

import {useAppNavigation} from '../hooks/useAppNavigation';
import {ROUTES} from '../navigation/routes';
import {RootStackParamList} from '../navigation/types';
import isActive from '../services/isActive';
import {URL_NGROK} from '@env';
import {InUser} from '../interfaces/user.interfaces';
import {UserContext} from '../context/UserContext';

const HomeScreen = ({}) => {
  const {userInfo} = useContext(UserContext);

  const navigation = useAppNavigation();

  const handleNavigate = (route: keyof RootStackParamList) => {
    navigation.navigate(route);
  };

  const [, setUser] = useState<InUser | null>(null);
  const [isActiveRes, setIsActiveRes] = useState<boolean>();
  const [msgOfDay, setMsgOfDay] = useState<string>('');

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${URL_NGROK}/api/user/email/${userInfo.email}`);
      const userResponse: InUser | null = await res.json();
      if (userResponse && userResponse._id) {
        setUser(userResponse);
        setIsActiveRes(await isActive(userResponse._id));
      }
    };
    const messageOfDay = async () => {
      const res = await fetch(`${URL_NGROK}/api/dailyMessage`);
      const result = await res.json();

      setMsgOfDay(result.message as string);
    };

    fetchUser();
    messageOfDay();
  }, [userInfo.email]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{msgOfDay}</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>My profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, !isActiveRes ? styles.buttonDisabled : null]}
        disabled={!isActiveRes}
        onPress={() => handleNavigate(ROUTES.TRAINING_HISTORY)}>
        <Text style={styles.buttonText}>Historial de entrenamientos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, !isActiveRes ? styles.buttonDisabled : null]}
        disabled={!isActiveRes}
        onPress={() => handleNavigate(ROUTES.NEW_TRAININGS)}>
        <Text style={styles.buttonText}>Nuevos entrenamientos</Text>
      </TouchableOpacity>

      {!isActiveRes && (
        <Text style={styles.footer}>
          Contactate con tu profe para regularizar tu situacion! Saludos
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Color de fondo oscuro
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
  buttonDisabled: {
    backgroundColor: '#A9A9A9',
  },
});

export default HomeScreen;

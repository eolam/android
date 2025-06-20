import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {InUser} from '../interfaces/user.interfaces';
import {useAppNavigation} from '../hooks/useAppNavigation';
import {ROUTES} from '../navigation/routes';
import isActive from '../services/isActive';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({}) => {
  const navigation = useAppNavigation();

  const [, setUser] = useState<InUser | null>(null);
  const [isActiveRes, setIsActiveRes] = useState<boolean>();
  const [msgOfDay, setMsgOfDay] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const messageOfDay = async () => {
      const res = await fetch('https://eolam.vercel.app/api/dailyMessage');
      const result = await res.json();

      setMsgOfDay(result.message as string);
    };
    // Cerrar sesión
    const Logout = async () => {
      await AsyncStorage.setItem(
        'userInfo',
        JSON.stringify({
          email: null,
          displayName: null,
          photoURL: null,
          id: null,
        }),
      );
      navigation.navigate('Login');
    };
    const fetchUser = async () => {
      try {
        const userString = await AsyncStorage.getItem('userInfo');
        if (!userString) {
          Alert.alert('Error', 'No hay usuario guardado', [
            {text: 'Ok', onPress: () => Logout()},
          ]);
          return;
        }
        const {email} = JSON.parse(userString);
        if (!email) {
          Alert.alert('Error', 'No hay email guardado', [
            {text: 'Ok', onPress: () => Logout()},
          ]);
          return;
        }
        const res = await fetch(
          `https://eolam.vercel.app/api/user/email/${email}`,
          {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
          },
        );
        if (res.ok) {
          const userResponse: InUser = await res.json();
          if (userResponse && userResponse._id) {
            setUser(userResponse);
            console.log(userResponse, 'userResponse');

            setIsActiveRes(await isActive(userResponse._id));
            await messageOfDay();
          }
        }
      } catch (error) {
        Alert.alert('Error', 'Se produjo un error de login', [
          {text: 'Ok', onPress: () => Logout()},
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [navigation]);

  console.log(isActiveRes, 'isActive');

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          style={styles.container}
          color="#D81B60"
          size={'large'}
        />
      ) : (
        <>
          <Text style={styles.header}>{msgOfDay}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(ROUTES.PROFILE)}>
            <Text style={styles.buttonText}>Mi perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, !isActiveRes ? styles.buttonDisabled : null]}
            disabled={!isActiveRes}
            onPress={() => navigation.navigate(ROUTES.TRAINING_HISTORY)}>
            <Text style={styles.buttonText}>Historial de entrenamientos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, !isActiveRes ? styles.buttonDisabled : null]}
            disabled={!isActiveRes}
            onPress={() => navigation.navigate(ROUTES.NEW_TRAININGS)}>
            <Text style={styles.buttonText}>Nuevos entrenamientos</Text>
          </TouchableOpacity>

          {!isActiveRes && (
            <Text style={styles.footer}>
              Tu cuenta está inactiva, regulariza la situación con tu
              entrenador.
            </Text>
          )}
        </>
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
    backgroundColor: '#831540', // Para color rosa oscuro: #D60D63
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

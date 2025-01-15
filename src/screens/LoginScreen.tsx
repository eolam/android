import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {UserContext} from '../context/UserContext';
import {URL_NGROK} from '@env';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const {userInfo, setUserInfo} = useContext(UserContext);

  // Configurar Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      // Obtén este ID desde Google Cloud Console
      webClientId:
        '127777850629-f0vb31dn2qteb56apu3i0mfjno3ddql1.apps.googleusercontent.com',
    });
  }, []);

  useEffect(() => {
    console.log('Contexto actualizado:', userInfo);
  }, [userInfo]);

  const checkEmailInBackend = async (email: string) => {
    try {
      const response = await fetch(`${URL_NGROK}/api/user/email/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Primero verificamos si la respuesta es exitosa
      if (!response.ok) {
        console.error(
          'Error en la respuesta:',
          response.status,
          response.statusText,
        );
        return false;
      }

      // Intentamos obtener el texto de la respuesta primero
      const textResponse = await response.text();
      console.log('Respuesta del servidor:', textResponse);

      try {
        const user = JSON.parse(textResponse);
        if (user._id) {
          setUserInfo(prevState => ({
            ...prevState,
            id: user._id,
          }));
          return true;
        }
      } catch (parseError) {
        console.error('Error parseando JSON:', parseError);
        console.error('Contenido recibido:', textResponse);
      }

      return false;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();

      //   await GoogleSignin.signOut();
      //   await auth().signOut();

      const googleUser = await GoogleSignin.signIn();

      if (googleUser.data?.idToken) {
        const googleCredential = auth.GoogleAuthProvider.credential(
          googleUser.data?.idToken,
        );
        const userCredential = await auth().signInWithCredential(
          googleCredential,
        );

        // Aquí puedes manejar la respuesta exitosa
        await new Promise<void>(resolve => {
          setUserInfo({
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL,
            id: null,
          });
          resolve();
        });

        if (userCredential.user.email) {
          const emailExists = await checkEmailInBackend(
            userCredential.user.email,
          );

          if (emailExists) {
            navigation.navigate('Home' as never);
          } else {
            // Aquí puedes manejar el caso cuando el email no existe
            // Por ejemplo, mostrar un mensaje o navegar a una pantalla de registro
            console.log('El email no está registrado en el sistema');
            // navigation.navigate('Register' as never); // Si tienes una pantalla de registro
          }
        }
      }
    } catch (error: any) {
      if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Usuario canceló el login');
      } else if (error?.code === statusCodes.IN_PROGRESS) {
        console.log('Operación en progreso');
      } else if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services no disponible');
      } else {
        console.log('Error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
      </View>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={signInWithGoogle}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Image
              source={require('../assets/google-icon.png')}
              style={styles.googleIcon}
            />
            <Text style={styles.buttonText}>Continuar con Google</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
export default LoginScreen;

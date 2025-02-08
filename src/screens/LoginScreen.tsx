import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
// import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {UserContext} from '../context/UserContext';
import {URL_NGROK} from '@env';
// import {ROUTES} from '../navigation/routes';
// import {RootStackParamList} from '../navigation/types';
import {useAppNavigation} from '../hooks/useAppNavigation';
import LinearGradient from 'react-native-linear-gradient';

const LoginScreen = () => {
  const navigation = useAppNavigation();

  //   const handleNavigate = (route: keyof RootStackParamList) => {
  //     navigation.navigate(route);
  //   };
  const [loading, setLoading] = useState(false);
  //   const [email, setEmail] = useState('');
  //   const [password, setPassword] = useState('');
  //   const {userInfo, setUserInfo} = useContext(UserContext);

  // Configurar Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '127777850629-f0vb31dn2qteb56apu3i0mfjno3ddql1.apps.googleusercontent.com',
    });
  }, []);

  const checkEmailInBackend = async (user_email: string | null | undefined) => {
    try {
      if (!user_email) {
        return {
          error: true,
          message: 'Email no detectado',
          email: null,
          id: null,
        };
      }
      console.log('le estoy pegando!', URL_NGROK);
      const response = await fetch(
        `${URL_NGROK}/api/user/email/${user_email}`,
        {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        },
      );

      if (!response.ok) {
        if (response.status === 404) {
          Alert.alert(
            'Registro',
            'El usuario aun no se ha registrado, por favor complete los siguientes campos',
            [{text: 'Ok'}],
          );
          return {
            error: true,
            message:
              'El usuario aun no se ha registrado, por favor complete los siguientes campos',
            email: user_email,
            id: null,
          };
        }
        Alert.alert(
          'Error de conexión',
          'Error en la comunicación con el servidor',
          [{text: 'OK'}],
        );
        return {
          error: true,
          message: 'Error en la comunicación con el servidor',
          email: null,
          id: null,
        };
      }
      const user = await response.json();
      if (user._id) {
        return {
          error: false,
          message: 'Usuario logeado exitosamente!',
          email: user.email,
          id: user._id,
        };
      }

      return {
        error: true,
        message: 'Unkown Error',
        email: null,
        id: null,
      };
    } catch (error) {
      Alert.alert('Error', 'No se pudo verificar el correo.', [{text: 'OK'}]);
      return {
        error: true,
        message: 'No se pudo verificar el correo.',
        email: null,
        id: null,
      };
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);

      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();

      const googleUser = await GoogleSignin.signIn();
      if (googleUser.data?.idToken) {
        const googleCredential = auth.GoogleAuthProvider.credential(
          googleUser.data.idToken,
        );
        const userCredential = await auth().signInWithCredential(
          googleCredential,
        );

        const user = userCredential.user;

        const emailExists = await checkEmailInBackend(user.email);
        if (!emailExists.error) {
          await AsyncStorage.setItem(
            'userInfo',
            JSON.stringify({
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              id: emailExists.id,
            }),
          );
          navigation.navigate('Home');
          // handleNavigate(ROUTES.HOME);
        } else {
          await AsyncStorage.setItem(
            'userInfo',
            JSON.stringify({
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              id: null,
            }),
          );
          navigation.navigate('Register');
          // handleNavigate(ROUTES.REGISTER);
        }
      }
    } catch (error: any) {
      if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Login cancelado', 'Has cancelado el inicio de sesión.');
      } else {
        Alert.alert('Error', 'Hubo un problema al iniciar sesión con Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Imagen de fondo */}
      <ImageBackground
        source={require('../assets/background.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover">
        {/* Vista con gradiente */}
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Entrenamiento</Text>
            <Text style={styles.title}>Online</Text>
          </View>
        </View>
        <LinearGradient
          colors={['transparent', '#0c0e20']}
          style={styles.gradientView}>
          {/* Botón de Google */}
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
                <Text style={styles.googleButtonText}>
                  Continuar con Google
                </Text>
              </>
            )}
          </TouchableOpacity>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1, // Ocupa toda la pantalla
    justifyContent: 'flex-end', // Asegura que el gradiente y el botón estén al final
  },
  gradientView: {
    height: '60%', // Desde el 40% hacia abajo
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute', // Hace que el contenedor sea absoluto respecto al padre
    top: '5%', // 10% desde la parte superior,
    width: '100%', // Asegura que ocupe todo el ancho
    alignItems: 'center', // Centra el contenido horizontalmente
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  googleButton: {
    position: 'absolute',
    bottom: '20%',
    backgroundColor: '#831540', // Azul de Google #4285F4 o sino un rosa rojizo #b11f44
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
    minWidth: 250,
  },
  googleIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;

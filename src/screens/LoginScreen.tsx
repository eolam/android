import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserContext} from '../context/UserContext';
import {URL_NGROK} from '@env';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {userInfo, setUserInfo} = useContext(UserContext);

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
        return false;
      }
      const response = await fetch(
        `${URL_NGROK}/api/user/email/${user_email}`,
        {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        },
      );

      if (!response.ok) {
        Alert.alert(
          'Error de conexión',
          'Error en la comunicación con el servidor',
          [{text: 'OK'}],
        );
      }

      const user = await response.json();
      if (user._id) {
        setUserInfo(prevState => ({
          ...prevState,
          id: user._id,
        }));
        return true;
      }
      return false;
    } catch (error) {
      Alert.alert('Error', 'No se pudo verificar el correo.', [{text: 'OK'}]);
      return false;
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
        setUserInfo({
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          id: null,
        });

        const emailExists = await checkEmailInBackend(user.email);
        if (emailExists) {
          await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo)); // Persistencia
          navigation.navigate('Home' as never);
        } else {
          navigation.navigate('Register' as never);
        }
      }
    } catch (error: any) {
      if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Login cancelado', 'Has cancelado el inicio de sesión.');
      } else {
        Alert.alert('Error', 'Hubo un problema al iniciar sesión con Google.');
        // console.error('Error en Google Sign-In:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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

      {/* Inputs */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#999"
          secureTextEntry
        />
      </View>

      {/* Botón de login */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => Alert.alert('Funcionalidad no implementada')}>
        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

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
            <Text style={styles.googleButtonText}>Iniciar con Google</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Links */}
      <View style={styles.footerLinks}>
        <Text style={styles.link}>Olvidé mi contraseña</Text>
        <Text style={styles.link}>Registrarme</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0e20',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
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
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#000',
    marginBottom: 15,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#b11f44',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  googleIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  footerLinks: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
//     <View style={styles.container}>
//       <View style={styles.logoContainer}>
//         <Image
//           source={require('../assets/logo.png')}
//           style={styles.logo}
//           resizeMode="contain"
//         />
//         <Text style={styles.title}>Bienvenido</Text>
//         <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
//       </View>

//       <TouchableOpacity
//         style={styles.googleButton}
//     onPress={signInWithGoogle}
//     disabled={loading}>
//     {loading ? (
//       <ActivityIndicator color="#fff" />
//     ) : (
//       <>
//         <Image
//           source={require('../assets/google-icon.png')}
//           style={styles.googleIcon}
//         />
//         <Text style={styles.buttonText}>Continuar con Google</Text>
//       </>
//     )}
//   </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//     justifyContent: 'center',
//   },
//   logoContainer: {
//     alignItems: 'center',
//     marginBottom: 50,
//   },
//   logo: {
//     width: 120,
//     height: 120,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//   },
//   googleButton: {
//     backgroundColor: '#4285F4',
//     padding: 16,
//     borderRadius: 8,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   googleIcon: {
//     width: 24,
//     height: 24,
//     marginRight: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });
// export default LoginScreen;

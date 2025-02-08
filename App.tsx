import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import TrainingHistory from './src/screens/TrainingHistory';
import {UserContextProvider} from './src/context/UserContext';
import {RootStackParamList} from './src/navigation/types';
import NewTrainings from './src/screens/NewTrainings';
import NewExercise from './src/screens/NewExercise';
import RegisterScreen from './src/screens/RegisterScreen';
import ExerciseList from './src/screens/ExerciseList';
import NeedPay from './src/screens/NeedPay';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  const [initialRoute, setInitialRoute] = useState<'Login' | 'Home' | null>(
    null,
  );
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userString = await AsyncStorage.getItem('userInfo');
        if (userString) {
          const userInfo = JSON.parse(userString);
          if (userInfo?.id) {
            setInitialRoute('Home');
          } else {
            setInitialRoute('Login');
          }
        } else {
          setInitialRoute('Login');
        }
      } catch (error) {
        console.error('Error verificando sesión:', error);
        setInitialRoute('Login');
      } finally {
        setLoading(false); // Se completa la carga
      }
    };

    checkUserSession();
  }, []);

  // ⏳ Mientras carga, muestra un indicador
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <UserContextProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute ?? 'Login'}
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="TrainingHistory" component={TrainingHistory} />
          <Stack.Screen name="NewTrainings" component={NewTrainings} />
          <Stack.Screen name="NewExercise" component={NewExercise} />
          <Stack.Screen name="ExerciseList" component={ExerciseList} />
          <Stack.Screen name="NeedPay" component={NeedPay} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContextProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  loading: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
// import React, {useEffect, useState} from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import LoginScreen from './src/screens/LoginScreen';
// import HomeScreen from './src/screens/HomeScreen';
// import ProfileScreen from './src/screens/ProfileScreen';
// import TrainingHistory from './src/screens/TrainingHistory';
// import {UserContextProvider} from './src/context/UserContext';
// import {RootStackParamList} from './src/navigation/types';
// import NewTrainings from './src/screens/NewTrainings';
// import NewExercise from './src/screens/NewExercise';
// import RegisterScreen from './src/screens/RegisterScreen';
// import ExerciseList from './src/screens/ExerciseList';
// import NeedPay from './src/screens/NeedPay';

// const Stack = createNativeStackNavigator<RootStackParamList>();

// function App(): JSX.Element {
//   const [initialRoute, setInitialRoute] = useState<'Login' | 'Home'>('Login');

//   useEffect(() => {
//     const checkUserSession = async () => {
//       try {
//         const userString = await AsyncStorage.getItem('userInfo');

//         if (userString) {
//           const userInfo = JSON.parse(userString);
//           if (userInfo) {
//             if (userInfo.id) {
//               setInitialRoute('Home'); // Si hay sesión, redirigir a Home
//               console.log('derivado a home: ', initialRoute);
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error verificando sesión:', error);
//       }
//     };

//     checkUserSession();
//   }, [initialRoute]);

//   return (
//     <UserContextProvider>
//       <NavigationContainer>
//         <Stack.Navigator
//           initialRouteName={initialRoute}
//           screenOptions={{headerShown: false}}>
//           <Stack.Screen name="Login" component={LoginScreen} />
//           <Stack.Screen name="Home" component={HomeScreen} />
//           <Stack.Screen name="Register" component={RegisterScreen} />
//           <Stack.Screen name="TrainingHistory" component={TrainingHistory} />
//           <Stack.Screen name="NewTrainings" component={NewTrainings} />
//           <Stack.Screen name="NewExercise" component={NewExercise} />
//           <Stack.Screen name="ExerciseList" component={ExerciseList} />
//           <Stack.Screen name="NeedPay" component={NeedPay} />
//           <Stack.Screen name="Profile" component={ProfileScreen} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </UserContextProvider>
//   );
// }

// export default App;

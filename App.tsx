import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import TrainingHistory from './src/screens/TrainingHistory';
import {UserContextProvider} from './src/context/UserContext';
import {RootStackParamList} from './src/navigation/types';
import NewTrainings from './src/screens/NewTrainings';
import NewExercise from './src/screens/NewExercise';
import ExerciseList from './src/screens/ExerciseList';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  return (
    <UserContextProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="TrainingHistory" component={TrainingHistory} />
          <Stack.Screen name="NewTrainings" component={NewTrainings} />
          <Stack.Screen name="NewExercise" component={NewExercise} />
          <Stack.Screen name="ExerciseList" component={ExerciseList} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContextProvider>
  );
}

export default App;

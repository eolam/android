import React, {useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import {ROUTES} from '../navigation/routes';
import {useAppNavigation} from '../hooks/useAppNavigation';
import {RootStackParamList} from '../navigation/types';
import {SelectList} from 'react-native-dropdown-select-list';
import {URL_BASE} from '@env';
import {UserContext} from '../context/UserContext';
import {useRoute, RouteProp} from '@react-navigation/native';

const TrainingFinished = () => {
  const navigation = useAppNavigation();
  const [selected, setSelected] = React.useState<string>('');
  const {userInfo} = useContext(UserContext);
  const route = useRoute<RouteProp<RootStackParamList, 'TrainingFinished'>>();
  const {week_number} = route.params;

  const data = [
    {key: '1', value: '1'},
    {key: '2', value: '2'},
    {key: '3', value: '3'},
    {key: '4', value: '4'},
    {key: '5', value: '5'},
    {key: '6', value: '6'},
    {key: '7', value: '7'},
    {key: '8', value: '8'},
    {key: '9', value: '9'},
    {key: '10', value: '10'},
  ];

  const handleRpe = async (rpe: string) => {
    if (!rpe) {
      Alert.alert('Error', 'Por favor selecciona un RPE');
      return;
    }

    try {
      const response = await fetch(`${URL_BASE}/api/user/training/reportWeek`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userInfo.id,
          week_number,
          rpe,
        }),
      });

      if (response.ok) {
        navigation.navigate(ROUTES.HOME);
      } else {
        Alert.alert('Error', 'No se pudo enviar el RPE. Intenta nuevamente.');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al enviar el RPE');
      console.error('Error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.subtitle}>
            ¡Felicidades terminaste con tu entranmiento el día de hoy!
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.message}>
            Ingresa el Rpe de la sesión para finalizar
          </Text>
          <SelectList
            setSelected={(val: string) => setSelected(val)}
            data={data}
            save="value"
            search={false}
            boxStyles={styles.selectBox}
            dropdownStyles={styles.dropdown}
            inputStyles={styles.selectInput}
            dropdownTextStyles={styles.dropdownText}
            placeholder="Seleccionar"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleRpe(selected)}>
          <Text style={styles.buttonText}>Finalizar y enviar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 20,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#E5E5E5',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#b22658',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectBox: {
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    width: '50%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  dropdown: {
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    marginTop: 5,
    width: '40%',
    alignSelf: 'center',
  },
  selectInput: {
    color: '#000000',
    fontSize: 16,
    textAlign: 'center',
    width: '100%',
  },
  dropdownText: {
    color: '#000000',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default TrainingFinished;

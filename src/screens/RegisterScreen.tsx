import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useAppNavigation} from '../hooks/useAppNavigation';
import {URL_NGROK} from '@env';

const RegisterScreen = () => {
  const navigation = useAppNavigation();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    birthday: '',
    password: '',
    repeatPassword: '',
    gym_name: '',
    training_place: '',
    goals: '',
  });
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [displayDate, setDisplayDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getEmail = async () => {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        if (userInfo.email) {
          setFormData(prevFormData => ({
            ...prevFormData,
            email: userInfo.email,
          }));
        }
      }
    };

    getEmail();
  }, []);

  useEffect(() => {
    const passwordsAreValid =
      formData.password.trim() !== '' &&
      formData.repeatPassword.trim() !== '' &&
      formData.password === formData.repeatPassword;
    setPasswordsMatch(passwordsAreValid);
  }, [formData.password, formData.repeatPassword]);

  const handleInputChange = (key: string, value: string) => {
    setFormData({...formData, [key]: value});
  };

  const validateStepOneInputs = () => {
    const requiredFields = [
      'email',
      'first_name',
      'last_name',
      'birthday',
      'password',
      'repeatPassword',
    ];
    for (const key of requiredFields) {
      if (
        formData[key as keyof typeof formData].trim() === '' ||
        !passwordsMatch
      ) {
        Alert.alert(
          'Advertencia',
          'Todos los campos del primer paso son obligatorios y no deben contener solo espacios.',
          [{text: 'Cerrar'}],
        );
        return false;
      }
    }
    return true;
  };

  const validateStepTwoInputs = () => {
    const requiredFields = ['gym_name', 'training_place', 'goals'];
    for (const key of requiredFields) {
      if (formData[key as keyof typeof formData].trim() === '') {
        Alert.alert(
          'Advertencia',
          'Todos los campos son obligatorios y no deben contener espacios vacíos.',
          [{text: 'Cerrar'}],
        );
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStepOneInputs()) {
      setCurrentStep(2);
    }
  };

  const completeSignIn = async () => {
    if (validateStepTwoInputs()) {
      setIsLoading(true);
      try {
		console.log(URL_NGROK);
        const response = await fetch(`${URL_NGROK}/api/mobile/user/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          if (response.status === 400) {
            const data = await response.json();
            setIsLoading(false);
            Alert.alert('Error', `${data.message}`, [{text: 'Cerrar'}]);
            return false;
          }
          setIsLoading(false);
          Alert.alert(
            'Error',
            'No se pudo completar el registro intentelo nuevamente.',
            [{text: 'Cerrar'}],
          );
        }

        const data = await response.json();
        if (data?.message && response.status === 201) {
          setIsLoading(false);
          Alert.alert('Registro completado', `${data.message}`, [
            {text: 'Continuar'},
          ]);
          navigation.navigate('Home' as never);
        }
      } catch (error) {
        setIsLoading(false);
        Alert.alert(
          'Error',
          'Hubo un problema al completar el registro, por favor intentalo de nuevo.',
          [{text: 'Cerrar'}],
        );
        console.error('Error en el registro:', error);
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDateISO = selectedDate.toISOString();
      console.log('fecha en API: ', formattedDateISO);
      const formattedDateDisplay = selectedDate.toISOString().split('T')[0];
      handleInputChange('birthday', formattedDateISO);
      setDisplayDate(formattedDateDisplay);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Entrenamiento Online</Text>
          <Text style={styles.subtitle}>FORMULARIO DE REGISTRO</Text>
        </View>

        {currentStep === 1 && (
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese su correo electrónico"
              placeholderTextColor="#999"
              value={formData.email}
              editable={false}
            />

            <Text style={styles.sectionTitle}>Datos personales *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor="#999"
              value={formData.first_name}
              onChangeText={text => handleInputChange('first_name', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              placeholderTextColor="#999"
              value={formData.last_name}
              onChangeText={text => handleInputChange('last_name', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Fecha de nacimiento (aaaa-mm-dd)"
              placeholderTextColor="#999"
              value={displayDate}
              onFocus={() => setShowDatePicker(true)}
              showSoftInputOnFocus={false}
            />

            <View style={styles.passContainer}>
              <Text style={styles.sectionTitle}>Contraseña *</Text>
              {passwordsMatch && (
                <Image
                  source={require('../assets/ok.png')}
                  style={styles.checkmarkIcon}
                />
              )}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu clave"
              placeholderTextColor="#999"
              secureTextEntry
              value={formData.password}
              onChangeText={text => handleInputChange('password', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Repite la clave"
              placeholderTextColor="#999"
              secureTextEntry
              value={formData.repeatPassword}
              onChangeText={text => handleInputChange('repeatPassword', text)}
            />

            <TouchableOpacity
              style={passwordsMatch ? styles.button : styles.buttonDisabled}
              onPress={nextStep}
              disabled={!passwordsMatch}>
              <Text style={styles.buttonText}>Siguiente</Text>
            </TouchableOpacity>

            {/* {!passwordsMatch ? ( */}
            <Text style={styles.infoText}>
              Debe completar los campos obligatorios (*) para continuar.
            </Text>
            {/* ) : null} */}
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Datos de entrenamiento *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del gimnasio"
              placeholderTextColor="#999"
              value={formData.gym_name}
              onChangeText={text => handleInputChange('gym_name', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Lugar de entrenamiento. (Casa, Gym, Plaza)"
              placeholderTextColor="#999"
              value={formData.training_place}
              onChangeText={text => handleInputChange('training_place', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Objetivos al entrenar"
              placeholderTextColor="#999"
              value={formData.goals}
              onChangeText={text => handleInputChange('goals', text)}
            />

            <TouchableOpacity style={styles.button} onPress={prevStep}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Volver</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonFinal}
              onPress={completeSignIn}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Finalizar registro</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.infoText}>
              Debe completar los campos obligatorios (*) para continuar.
            </Text>
          </View>
        )}

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0e20',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#fff',
    marginTop: 15,
  },
  form: {
    width: '100%',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    justifyContent: 'center',
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
  button: {
    backgroundColor: '#831540',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#BFBFBF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonFinal: {
    backgroundColor: '#831540',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonFinalDisabled: {
    backgroundColor: '#de548a',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkmark: {
    color: '#00ff00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  passContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  checkmarkIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
    alignSelf: 'baseline',
  },
});

export default RegisterScreen;

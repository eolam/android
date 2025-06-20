import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useAppNavigation} from '../hooks/useAppNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditPersonalInfoScreen from './EditProfile';
import {
  InPaymentInfoProfileData,
  InProfileData,
} from '../interfaces/user.interfaces';

const ProfileScreen = () => {
  const navigation = useAppNavigation();
  const [userData, setUserData] = useState<InProfileData>({
    email: '',
    first_name: '',
    last_name: '',
    birthday: '',
    gym_name: '',
    training_place: '',
    goals: '',
    day_of_payment: '',
    number_trainning_week: '',
    last_training_day: '',
  });
  const [cbuData, setCbuData] = useState<InPaymentInfoProfileData>({
    cbu: '',
    alias: '',
  });
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  // Obtener los datos del usuario
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const userString = await AsyncStorage.getItem('userInfo');
      if (!userString) {
        Alert.alert('Error', 'No hay usuario guardado', [{text: 'Ok'}]);
        return;
      }
      const {id} = JSON.parse(userString);
      if (!id) {
        Alert.alert('Error', 'No hay ID guardado', [{text: 'Ok'}]);
        return;
      }

      const response = await fetch(
        `https://eolam.vercel.app/api/mobile/user/${id}`,
        {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        },
      );
      const responseCbu = await fetch(`https://eolam.vercel.app/api/payment`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
      });
      const data = await response.json();
      const dataCbu = await responseCbu.json();
      //   const cleanDate = data.birthday ? new Date(data.birthday).toLocaleDateString('es-ES').replace(/\//g, '-') : '';

      setUserData({
        email: data.email || '',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        birthday: data.birthday || '',
        gym_name: data.gym_name || '',
        training_place: data.training_place || '',
        day_of_payment: data.day_of_payment || '',
        number_trainning_week: data.number_trainning_week || '',
        goals: data.goals || '',
        last_training_day: data.last_training_day || '',
      });

      setCbuData({
        cbu: dataCbu.cbu || 'No se pudo cargar el CBU',
        alias: dataCbu.alias || 'No se pudo cargar el Alias',
      });
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un problema inesperado.', [
        {text: 'Cerrar'},
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Función para actualizar los datos en el servidor
  const updateUserData = async (updatedData: InProfileData) => {
    try {
      const userString = await AsyncStorage.getItem('userInfo');
      if (!userString) {
        Alert.alert('Error', 'No hay usuario guardado', [{text: 'Ok'}]);
        return;
      }
      const {id} = JSON.parse(userString);
      if (!id) {
        throw new Error('El usuario no tiene ID');
      }
      const response = await fetch(
        `https://eolam.vercel.app/api/mobile/user/${id}`,
        {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(updatedData),
        },
      );

      if (!response.ok) {
        if (response.status === 400 || response.status === 404) {
          const data = await response.json();
          Alert.alert('Error', `${data.message}`, [{text: 'Cerrar'}]);
        }
        Alert.alert(
          'Error',
          'No se pudo completar el registro intentelo nuevamente.',
          [{text: 'Cerrar'}],
        );
      }

      setUserData(updatedData);
      setShowEdit(false);
      Alert.alert('Éxito', 'Tus datos han sido actualizados correctamente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la información.', [
        {text: 'Ok'},
      ]);
    }
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

  if (showEdit) {
    return (
      <EditPersonalInfoScreen
        userData={userData}
        setShowEdit={setShowEdit}
        updateUserData={updateUserData}
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información personal</Text>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : (
          <>
            <Text style={styles.cardText}>
              Email: {userData?.email || 'Sin email'}
            </Text>
            <Text style={styles.cardText}>
              Nombre:{' '}
              {`${userData?.first_name || ''} ${userData?.last_name || ''}`}
            </Text>
            <Text style={styles.cardText}>
              Cumpleaños:{' '}
              {userData?.birthday
                ? new Date(userData.birthday).toLocaleDateString('es-ES', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit'
				  }).replace(/\//g, '-')
                : 'AAAA/MM/DD'}
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setShowEdit(true)}>
              <Image
                source={require('../assets/mdi_pencil.png')}
                style={styles.pencilIcon}
              />
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información de entreno</Text>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : (
          <>
            <Text style={styles.cardText}>
              Nombre del gimnasio: {userData?.gym_name || '-'}
            </Text>
            <Text style={styles.cardText}>
              Lugar en el que entrena:{' '}
              {userData?.training_place || 'No especificado'}
            </Text>
            <Text style={styles.cardText}>
              Objetivos: {userData?.goals || 'No especificado'}
            </Text>
            <Text style={styles.cardText}>
              Entrenamientos por semana:{' '}
              {userData?.number_trainning_week || 'No especificado'}
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setShowEdit(true)}>
              <Image
                source={require('../assets/mdi_pencil.png')}
                style={styles.pencilIcon}
              />
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información de pago</Text>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : (
          <>
            <Text style={styles.cardText}>
              CBU: {cbuData?.cbu || 'No especificado'}
            </Text>
            <Text style={styles.cardText}>
              Alias: {cbuData?.alias || 'No especificado'}
            </Text>
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={Logout}>
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0F172A'},
  scrollContent: {padding: 20},
  loaderContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    position: 'relative',
    minHeight: 130,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardText: {color: '#fff', fontSize: 14, marginBottom: 5},
  editButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 5,
  },
  pencilIcon: {width: 24, height: 24, margin: 2},
  editButtonText: {color: '#fff', fontSize: 16},
  buttonContainer: {marginBottom: 30},
  button: {
    backgroundColor: '#831540',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {color: 'white', fontSize: 16, fontWeight: 'bold'},
});

export default ProfileScreen;

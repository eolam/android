import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {InProfileData} from '../interfaces/user.interfaces';

const EditPersonalInfoScreen = ({
  userData,
  setShowEdit,
  updateUserData,
}: {
  userData: InProfileData;
  setShowEdit: (value: boolean) => void;
  updateUserData: (updatedData: InProfileData) => Promise<void>;
}) => {
  const [formData, setFormData] = useState({...userData});
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    setFormData({...userData});
  }, [userData]);

  // Maneja los cambios en los inputs
  const handleInputChange = (field: string, value: string) => {
    // const trimmedValue = value.trim();
    const newFormData = {...formData, [field]: value};

    setFormData(newFormData);

    // Verifica si hay algún cambio real
    const hasChanges = (
      Object.keys(userData) as Array<keyof InProfileData>
    ).some(
      key =>
        userData[key] !== newFormData[key] && newFormData[key]?.trim() !== '',
    );

    setIsModified(hasChanges);
  };

  // Confirmación antes de guardar cambios
  const handleSave = () => {
    Alert.alert('Aviso', '¿Está seguro que desea realizar estos cambios?', [
      {text: 'No', style: 'cancel'},
      {
        text: 'Si',
        onPress: async () => {
          await updateUserData(formData);
          setShowEdit(false);
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cardContainer}>
        <Text style={styles.title}>Información Personal</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={formData.first_name}
          onChangeText={text => handleInputChange('first_name', text)}
        />

        <Text style={styles.label}>Apellido</Text>
        <TextInput
          style={styles.input}
          value={formData.last_name}
          onChangeText={text => handleInputChange('last_name', text)}
        />

        <Text style={styles.label}>Fecha de Nacimiento</Text>
        <TextInput
          style={styles.input}
          value={formData.birthday}
          onChangeText={text => handleInputChange('birthday', text)}
        />

        <Text style={styles.title}>Información de Entrenamiento</Text>

        <Text style={styles.label}>Nombre del Gimnasio</Text>
        <TextInput
          style={styles.input}
          value={formData.gym_name}
          onChangeText={text => handleInputChange('gym_name', text)}
        />

        <Text style={styles.label}>Lugar de Entreno</Text>
        <TextInput
          style={styles.input}
          value={formData.training_place}
          onChangeText={text => handleInputChange('training_place', text)}
        />

        <Text style={styles.label}>Objetivos</Text>
        <TextInput
          style={styles.input}
          value={formData.goals}
          onChangeText={text => handleInputChange('goals', text)}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, !isModified && styles.disabledButton]}
            onPress={handleSave}
            disabled={!isModified}>
            <Text style={styles.buttonText}>Guardar Cambios</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowEdit(false)}>
            <Text style={styles.buttonText}>Volver Atrás</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.infoText}>
        La cantidad de veces que entrenas solo lo puede modificar tu entrenador,
        ponte en contacto con él por esa modificación.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 20, backgroundColor: '#0F172A'},
  cardContainer: {backgroundColor: '#1E293B', padding: 20, borderRadius: 10},
  title: {fontSize: 18, marginBottom: 2, marginTop: 20, color: '#fff', fontWeight: 'thin'},
  label: {fontSize: 14, marginTop: 10, fontWeight: 'light', color: '#fff'},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {marginTop: 20},
  button: {
    backgroundColor: '#831540',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#831540',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {color: '#FFF', fontSize: 16, fontWeight: 'bold'},
  disabledButton: {backgroundColor: '#ccc'},
  infoText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#fff',
    marginTop: 15,
  },
});

export default EditPersonalInfoScreen;

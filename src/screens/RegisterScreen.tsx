import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const RegisterScreen = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    clave: '',
    repetirClave: '',
    gimnasio: '',
    lugarEntrenamiento: '',
    objetivos: '',
  });

  const handleInputChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const siguientePaso = () => {
    setCurrentStep(2);
  };

  const pasoAnterior = () => {
    setCurrentStep(1);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Entrenamiento Online</Text>
        <Text style={styles.subtitle}>FORMULARIO DE REGISTRO</Text>
      </View>

      {currentStep === 1 && (
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Usuario</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese su correo electrónico"
            placeholderTextColor="#999"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
          />

          <Text style={styles.sectionTitle}>Datos personales</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#999"
            value={formData.nombre}
            onChangeText={(text) => handleInputChange('nombre', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            placeholderTextColor="#999"
            value={formData.apellido}
            onChangeText={(text) => handleInputChange('apellido', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Fecha de cumpleaños"
            placeholderTextColor="#999"
            value={formData.fechaNacimiento}
            onChangeText={(text) => handleInputChange('fechaNacimiento', text)}
          />

          <Text style={styles.sectionTitle}>Clave</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu clave"
            placeholderTextColor="#999"
            secureTextEntry
            value={formData.clave}
            onChangeText={(text) => handleInputChange('clave', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Repite la clave"
            placeholderTextColor="#999"
            secureTextEntry
            value={formData.repetirClave}
            onChangeText={(text) => handleInputChange('repetirClave', text)}
          />

          <TouchableOpacity style={styles.button} onPress={siguientePaso}>
            <Text style={styles.buttonText}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentStep === 2 && (
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Datos de entrenamiento</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del gimnasio"
            placeholderTextColor="#999"
            value={formData.gimnasio}
            onChangeText={(text) => handleInputChange('gimnasio', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Lugar de entrenamiento"
            placeholderTextColor="#999"
            value={formData.lugarEntrenamiento}
            onChangeText={(text) => handleInputChange('lugarEntrenamiento', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Objetivos"
            placeholderTextColor="#999"
            value={formData.objetivos}
            onChangeText={(text) => handleInputChange('objetivos', text)}
          />

          <TouchableOpacity style={styles.button} onPress={pasoAnterior}>
            <Text style={styles.buttonText}>Volver</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonFinal}>
            <Text style={styles.buttonText}>Finalizar registro</Text>
          </TouchableOpacity>
        </View>
      )}
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
  form: {
    width: '100%',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
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
    backgroundColor: '#b11f44',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonFinal: {
    backgroundColor: '#b11f44',
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
});

export default RegisterScreen;

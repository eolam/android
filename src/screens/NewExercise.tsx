import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
} from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import {InExercise, InUser} from '../interfaces/user.interfaces';
import {URL_NGROK} from '@env';
import {UserContext} from '../context/UserContext';
import {useRoute, RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/types';
import {ROUTES} from '../navigation/routes';
import {useAppNavigation} from '../hooks/useAppNavigation';

type NewExerciseRouteProp = RouteProp<RootStackParamList, 'NewExercise'>;

const NewExercise = () => {
  const {userInfo} = useContext(UserContext);
  const routeP = useRoute<NewExerciseRouteProp>();
  const {exerciseId} = routeP.params;

  const userId = userInfo.id;
  const [, setUser] = useState<InUser | null>();
  const [exercise, setExercise] = useState<InExercise | null>();
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useAppNavigation();

  const handleNavigate = (route: keyof RootStackParamList, params?: any) => {
    navigation.navigate(route, params);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch user data
        const userResponse = await fetch(`${URL_NGROK}/api/user/${userId}`);
        if (!userResponse.ok) {
          console.error(
            'Error en respuesta de usuario:',
            userResponse.status,
            userResponse.statusText,
          );
          return;
        }

        const userText = await userResponse.text();

        try {
          const userData: InUser = JSON.parse(userText);
          setUser(userData);
        } catch (parseError) {
          console.error('Error parseando datos de usuario:', parseError);
          console.error('Contenido recibido:', userText);
        }

        // Fetch exercise data
        const exerciseResponse = await fetch(
          `${URL_NGROK}/api/user/training/${userId}/exercise/${exerciseId}`,
        );
        if (!exerciseResponse.ok) {
          console.error(
            'Error en respuesta de ejercicio:',
            exerciseResponse.status,
            exerciseResponse.statusText,
          );
          return;
        }

        const exerciseText = await exerciseResponse.text();

        try {
          const exerciseData: InExercise = JSON.parse(exerciseText);
          setExercise(exerciseData);
        } catch (parseError) {
          console.error('Error parseando datos de ejercicio:', parseError);
          console.error('Contenido recibido:', exerciseText);
        }
      } catch (error) {
        console.error('Error en la petición:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [exerciseId, userId]);

  const [weight, setWeight] = useState('');
  const [report, setReport] = useState({
    series: 0,
    interval: 0,
    weight: 0,
    repetitions: '0',
    left_weight: 0,
    right_weight: 0,
    comment_user: '',
    rpe: 0,
    day: new Date(),
  });

  const handleSubmitAndNextExercise = async () => {
    await handleSubmitExercise();
    await handleNextExercise();
  };

  const handleSubmitExercise = async () => {
    setIsLoading(true);
    try {
      console.log(
        'userId: ',
        userId,
        'exerciseId:',
        exerciseId,
        'report: ',
        report,
      );
      const updatedReport = {
        ...report,
        day: new Date(), // Actualiza el campo 'day' con la fecha y hora actual
      };

      const response = await fetch(`${URL_NGROK}/api/user/training/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          exerciseId: exerciseId,
          report: updatedReport,
        }),
      });
      if (!response.ok) {
        console.error(
          'Error en respuesta de envío de ejercicio:',
          response.status,
          response.statusText,
        );
        return;
      }
      console.log('Ejercicio enviado correctamente');
    } catch (error) {
      console.error('Error enviando datos del ejercicio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextExercise = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${URL_NGROK}/api/user/training/next-exercise`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            exerceseId: exerciseId,
          }),
        },
      );
      if (!response.ok) {
        console.error(
          'Error en respuesta de ejercicio:',
          response.status,
          response.statusText,
        );
        return;
      }
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const resExercise: InExercise = await response.json();
        // Handle resExercise here
        if (resExercise?._id) {
          console.log('navego');

          handleNavigate(ROUTES.NEW_EXERCISE, {
            exerciseId: resExercise._id,
          });
        }
      } else {
        console.error('Respuesta no es JSON');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.tituloh1}>{exercise?.stage}</Text>
      <Text style={styles.tituloh2}>{exercise?.name_exercise}</Text>
      <View style={styles.video}>
        <YoutubeIframe
          height={300}
          play={false}
          videoId={exercise?.link} // El ID del video de YouTube
        />
      </View>
      <View style={styles.container2}>
        <View style={styles.column}>
          <Text style={styles.header}>
            Tabla con info para realizar el entrenamiento
          </Text>
          {exercise?.single_weight ? (
            <View style={styles.row}>
              <Text style={styles.label}>Peso simple</Text>
              <Text style={styles.value}>{exercise?.single_weight}</Text>
            </View>
          ) : (
            <View>
              <View style={styles.row}>
                <Text style={styles.label}>Peso lateral izquierdo</Text>
                <Text style={styles.value}>{exercise?.left_weight}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Peso lateral derecho</Text>
                <Text style={styles.value}>{exercise?.right_weight}</Text>
              </View>
            </View>
          )}

          <View style={styles.row}>
            <Text style={styles.label}>Repeticiones</Text>
            <Text style={styles.value}>{exercise?.repetition}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tipo de Repeticiones</Text>
            <Text style={styles.value}>{exercise?.repetition_type}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Intervalo</Text>
            <Text style={styles.value}>{exercise?.interval}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Comentario del Entrenador</Text>
            <Text style={styles.value}>{exercise?.comment_admin}</Text>
          </View>
        </View>
        <View style={styles.column}>
          <Text style={styles.header}>Inputs para que el usuario complete</Text>
          <TextInput
            style={styles.input}
            placeholder="10kg"
            value={weight}
            onChangeText={setWeight}
          />
          <TextInput
            style={styles.input}
            placeholder="Repeticiones..."
            value={report.repetitions}
            onChangeText={text => setReport({...report, repetitions: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="intervalo..."
            value={report.interval.toString()}
            onChangeText={text => setReport({...report, interval: +text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Comentario para el entrenador..."
            value={report.comment_user}
            onChangeText={text => setReport({...report, comment_user: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="RPE..."
            value={report.rpe.toString()}
            onChangeText={text => setReport({...report, rpe: +text})}
          />
        </View>
      </View>

      <TouchableOpacity
        // eslint-disable-next-line react-native/no-inline-styles
        style={[styles.reportButton, isLoading && {backgroundColor: '#ccc'}]}
        onPress={handleSubmitAndNextExercise}
        disabled={isLoading}>
        <Text style={styles.reportText}>Siguiente ejercicio</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    justifyContent: 'center',
  },
  reportButton: {
    paddingVertical: 15,
    marginVertical: 10,
    marginHorizontal: 80,
    backgroundColor: '#b22658',
    borderRadius: 5,
    alignItems: 'center',
  },
  reportText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  video: {
    marginHorizontal: 20,
  },
  tituloh1: {
    color: '#fff',
    fontSize: 24,
    paddingLeft: 15,
    paddingBottom: 12,
  },
  tituloh2: {
    color: '#fff',
    fontSize: 16,
    paddingLeft: 15,
    paddingBottom: 6,
  },
  container2: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginHorizontal: 10,
  },
  header: {
    alignItems: 'center',
    color: '#fff',
    fontSize: 14,
    fontWeight: 'normal',
    height: 60,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#000',
    padding: 8,
    borderRadius: 5,
    textAlign: 'center',
    minWidth: 60,
  },
  input: {
    fontSize: 16,
    padding: 5,
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
  },
  scrollContainer: {
    justifyContent: 'center',
    backgroundColor: '#13172a',
  },
});

export default NewExercise;

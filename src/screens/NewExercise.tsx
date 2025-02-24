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
import {InExercise, InReport, InUser} from '../interfaces/user.interfaces';
import {URL_BASE} from '@env';
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch user data

        const userResponse = await fetch(`${URL_BASE}/api/user/${userId}`);

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
          `${URL_BASE}/api/user/training/${userId}/exercise/${exerciseId}`,
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

  const [report, setReport] = useState<InReport>({
    _id: exercise?.report?._id || null,
    series: null,
    interval: null,
    single_weight: null,
    repetitions: null,
    left_weight: null,
    right_weight: null,
    comment_user: '',
    rpe: null,
    day: new Date(),
  });

  useEffect(() => {
    if (exercise?.report) {
      setReport({
        _id: exercise.report._id,
        series: exercise.report.series,
        interval: exercise.report.interval,
        single_weight: exercise.report.single_weight,
        repetitions: exercise.report.repetitions,
        left_weight: exercise.report.left_weight,
        right_weight: exercise.report.right_weight,
        comment_user: exercise.report.comment_user || '',
        rpe: exercise.report.rpe,
        day: new Date(),
      });
    }
  }, [exercise]);

  const [rpeError, setRpeError] = useState<string>('');

  const handleRpeChange = (text: string) => {
    const number = parseInt(text);
    if (text === '') {
      setReport({...report, rpe: null});
      setRpeError('');
    } else if (isNaN(number) || number < 1 || number > 10) {
      setRpeError('Por favor del 1 al 10');
    } else {
      setReport({...report, rpe: number});
      setRpeError('');
    }
  };

  const handleSubmitAndNextExercise = async () => {
    await handleSubmitExercise();
    await handleNextExercise();
  };

  const handleSubmitExercise = async () => {
    setIsLoading(true);
    try {
      const updatedReport = {
        ...report,
        day: new Date(),
      };

      const response = await fetch(`${URL_BASE}/api/user/training/report`, {
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
        `${URL_BASE}/api/user/training/next-exercise`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            exerciseId: exerciseId,
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

      const resExercise = await response.json();

      if ('_id' in resExercise) {
        // Es un ejercicio
        setReport({
          _id: null,
          series: null,
          interval: null,
          single_weight: null,
          repetitions: null,
          left_weight: null,
          right_weight: null,
          comment_user: '',
          rpe: null,
          day: new Date(),
        });

        navigation.navigate(ROUTES.NEW_EXERCISE, {
          exerciseId: resExercise._id,
          week_number: routeP.params.week_number,
        });
      } else if ('finishTraining' in resExercise) {
        // Es un mensaje de finalización
        navigation.navigate(ROUTES.TRAINING_FINISHED, {
          week_number: routeP.params.week_number,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.video}>
        <YoutubeIframe
          height={300}
          play={false}
          videoId={exercise?.link} // El ID del video de YouTube
        />
      </View>
      <Text style={styles.tituloh1}>{exercise?.stage}</Text>
      <Text style={styles.tituloh2}>{exercise?.name_exercise}</Text>
      <View style={styles.container2}>
        <View style={styles.column}>
          <Text style={styles.header}>
            Tabla con info para realizar el entrenamiento
          </Text>
          <View style={styles.row}>
            <Text style={styles.label}>Series</Text>
            <Text style={styles.value}>{exercise?.series}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Repeticiones</Text>
            <Text style={styles.value}>{exercise?.repetition}</Text>
          </View>
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
            <Text style={styles.label}>Descanso</Text>
            <Text style={styles.value}>{exercise?.interval}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Rpe: </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tipo de Repeticiones</Text>
            <Text style={styles.value}>{exercise?.repetition_type}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Comentario del Entrenador</Text>
            <Text style={styles.value}>{exercise?.comment_admin}</Text>
          </View>
        </View>
        <View style={styles.column}>
          <Text style={styles.header}>Inputs para que el usuario complete</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Series"
              value={report.series?.toString() || ''}
              onChangeText={text =>
                setReport({...report, series: text ? +text : null})
              }
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Repeticiones"
              value={report.repetitions?.toString() || ''}
              onChangeText={text =>
                setReport({...report, repetitions: text ? +text : null})
              }
              keyboardType="numeric"
            />
          </View>
          {exercise?.single_weight ? (
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Peso (kg)"
                value={report.single_weight?.toString() || ''}
                onChangeText={text =>
                  setReport({...report, single_weight: text ? +text : null})
                }
                keyboardType="numeric"
              />
            </View>
          ) : (
            <>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Peso izquierdo (kg)"
                  value={report.left_weight?.toString() || ''}
                  onChangeText={text =>
                    setReport({...report, left_weight: text ? +text : null})
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Peso derecho (kg)"
                  value={report.right_weight?.toString() || ''}
                  onChangeText={text =>
                    setReport({...report, right_weight: text ? +text : null})
                  }
                  keyboardType="numeric"
                />
              </View>
            </>
          )}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Descanso (seg)"
              value={report.interval?.toString() || ''}
              onChangeText={text =>
                setReport({...report, interval: text ? +text : null})
              }
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, rpeError ? styles.inputError : null]}
              placeholder="Rpe 1 al 10"
              value={report.rpe?.toString() || ''}
              onChangeText={handleRpeChange}
              keyboardType="numeric"
              maxLength={2}
            />
            {rpeError ? <Text style={styles.errorText}>{rpeError}</Text> : null}
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Comentario..."
              value={report.comment_user}
              onChangeText={text => setReport({...report, comment_user: text})}
            />
          </View>
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
    width: '90%',
    alignSelf: 'center',
    marginVertical: '5%',
  },
  tituloh1: {
    color: '#fff',
    fontSize: 24,
    paddingHorizontal: '5%',
    paddingBottom: '3%',
  },
  tituloh2: {
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: '5%',
    paddingBottom: '2%',
  },
  container2: {
    flexDirection: 'row',
    padding: '5%',
    justifyContent: 'space-between',
    width: '100%',
  },
  column: {
    flex: 1,
    marginHorizontal: '2%',
    width: '48%',
  },
  header: {
    alignItems: 'center',
    color: '#fff',
    fontSize: 14,
    fontWeight: 'normal',
    marginBottom: '5%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '3%',
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: '3%',
    width: '100%',
    height: 45,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    width: '65%',
    paddingRight: '2%',
  },
  value: {
    fontSize: 16,
    color: '#fff',
    width: '35%',
    textAlign: 'right',
  },
  inputRow: {
    marginBottom: '3%',
    height: 45,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    padding: '3%',
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    width: '100%',
    height: '100%',
    color: '#000',
  },
  scrollContainer: {
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    minHeight: '100%',
  },
  rpeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  rpeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  rpeButtonSelected: {
    backgroundColor: '#831540',
  },
  rpeText: {
    fontSize: 16,
    color: '#000',
  },
  rpeTextSelected: {
    color: '#fff',
  },
  inputError: {
    borderColor: '#FF0000',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: 5,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
});

export default NewExercise;

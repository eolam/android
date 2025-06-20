import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {InWeek, InUser} from '../interfaces/user.interfaces';
// import {UserContext} from '../context/UserContext';
import {RootStackParamList} from '../navigation/types';
import {useAppNavigation} from '../hooks/useAppNavigation';
import {ROUTES} from '../navigation/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TrainingHistory = () => {
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);
  const [weeks, setWeeks] = useState<InWeek[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigation = useAppNavigation();

  const handleNavigate = (route: keyof RootStackParamList, params?: any) => {
    navigation.navigate(route, params);
  };

  useEffect(() => {
    const fetchData = async () => {
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
      const data = await fetch(`https://eolam.vercel.app/api/user/${id}`);
      const res: InUser = await data.json();

      setWeeks(res.weeks);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const toggleExpand = (weekId: string) => {
    setExpandedWeek(expandedWeek === weekId ? null : weekId);
  };

  const renderWeekItem = ({item}: {item: InWeek}) => (
    <ScrollView>
      <TouchableOpacity
        style={styles.weekButton}
        onPress={() => toggleExpand(item.week_number.toString())}>
        <Text style={styles.weekButtonText}>
          {expandedWeek === item.week_number.toString() ? 'v' : '>'}
        </Text>
        <Text style={styles.weekButtonText}> Semana {item.week_number}</Text>
      </TouchableOpacity>
      {expandedWeek === item.week_number.toString() && item.days.length > 0 && (
        <View style={styles.reportsContainer}>
          {item.days.map((day, index) => (
            <TouchableOpacity
              style={styles.reportItem}
              key={index}
              onPress={() =>
                handleNavigate(ROUTES.EXERCISE_LIST, {
                  dayId: day._id,
                  weekNumber: item.week_number,
                  dayNumber: index + 1,
                })
              }>
              <View style={styles.reportItem}>
                <Text style={styles.reportText}>Dia {index + 1} / </Text>
                <Text style={styles.reportText}>
                  ejericios {day.exercises.length}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Historial de entrenamiento</Text>
      {isLoading ? (
        <ActivityIndicator
          style={styles.container}
          color="#D81B60"
          size={'large'}
        />
      ) : (
        <FlatList
          data={weeks?.reverse() || []}
          renderItem={renderWeekItem}
          keyExtractor={item => item.week_number.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  weekButton: {
    backgroundColor: '#831540',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  weekButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  reportsContainer: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 5,
  },
  reportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: '#fff',
  },
  reportText: {
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    marginTop: 50,
  },
  button: {
    backgroundColor: '#831540',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {color: 'white', fontSize: 16, fontWeight: 'bold'},
});

export default TrainingHistory;

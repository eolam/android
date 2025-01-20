import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import {InDay, InExercise, InUser, InWeek} from '../interfaces/user.interfaces';
import {URL_NGROK} from '@env';
import {UserContext} from '../context/UserContext';
import {useAppNavigation} from '../hooks/useAppNavigation';
import {RootStackParamList} from '../navigation/types';
import {ROUTES} from '../navigation/routes';

// type Report = {
//   title: string;
//   description?: string;
//   id: number;
//   isUnlocked: boolean;
// };

const NewTrainings = () => {
  const {userInfo} = useContext(UserContext);

  const navigation = useAppNavigation();

  const handleNavigate = (route: keyof RootStackParamList, params?: any) => {
    navigation.navigate(route, params);
  };

  const {id} = userInfo;
  const [week, setWeeks] = useState<InWeek[]>();
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  useEffect(() => {
    console.log('entro');

    const fetchData = async () => {
      const data = await fetch(`${URL_NGROK}/api/user/${id}`);
      const res: InUser = await data.json();

      const transform: InWeek[] = res.weeks;

      setWeeks(transform);
    };
    fetchData();
  }, [id]);

  const days: InDay[] | undefined = week?.slice(-1)[0]?.days;

  const lastWeek = week && week.length;

  const toggleExpand = (itemId: string) => {
    setExpandedDay(expandedDay === itemId ? null : itemId);
  };

  const renderWeekItem = ({item, index}: {item: InDay; index: number}) => (
    <View>
      <TouchableOpacity
        style={styles.weekButton}
        onPress={() => toggleExpand(item._id)}>
        <Text style={styles.weekButtonText}>
          {expandedDay === item._id ? 'v' : '>'}
        </Text>
        <Text style={styles.weekButtonText}> Dia {index + 1}</Text>
      </TouchableOpacity>
      {expandedDay === item._id && item.exercises.length > 0 && (
        <View style={styles.reportsContainer}>
          {item.exercises.map((exercise: InExercise, indexE: number) => (
            <TouchableOpacity
              key={indexE}
              style={styles.reportItem}
              onPress={() =>
                handleNavigate(ROUTES.NEW_EXERCISE, {
                  exerciseId: exercise._id,
                })
              }>
              <Text style={styles.reportText}>Ejercicio {indexE + 1}</Text>
              <Text style={styles.reportText}>{exercise.name_exercise}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Semana {lastWeek}</Text>
      <View style={styles.reportContainer}>
        <FlatList
          data={days}
          renderItem={({item, index}: ListRenderItemInfo<InDay>) =>
            renderWeekItem({item, index: index})
          }
          keyExtractor={item => item._id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  reportContainer: {
    width: '80%',
  },
  reportButton: {
    justifyContent: 'center',
    height: 40,
    width: 200,
    marginVertical: 6,
    backgroundColor: '#b22658',
    borderRadius: 5,
    alignItems: 'center',
  },
  lockedButton: {
    opacity: 0.5, // Menor opacidad para los botones bloqueados
  },
  reportText: {
    color: '#000',
    fontWeight: 'bold',
  },
  descriptionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  weekButton: {
    backgroundColor: '#b22658',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
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
});

export default NewTrainings;

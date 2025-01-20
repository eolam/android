import React, {useState, useEffect, useContext} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {URL_NGROK} from '@env';
import {InWeek, InUser} from '../interfaces/user.interfaces';
import {UserContext} from '../context/UserContext';
import {RootStackParamList} from '../navigation/types';
import {useAppNavigation} from '../hooks/useAppNavigation';
import {ROUTES} from '../navigation/routes';

const TrainingHistory = () => {
  const {userInfo} = useContext(UserContext);
  const {id} = userInfo;
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);
  const [weeks, setWeeks] = useState<InWeek[]>();

  const navigation = useAppNavigation();

  const handleNavigate = (route: keyof RootStackParamList, params?: any) => {
    navigation.navigate(route, params);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`${URL_NGROK}/api/user/${id}`);
      const res: InUser = await data.json();

      setWeeks(res.weeks);
    };
    fetchData();
  }, [id]);

  const toggleExpand = (weekId: string) => {
    setExpandedWeek(expandedWeek === weekId ? null : weekId);
  };

  const renderWeekItem = ({item}: {item: InWeek}) => (
    <View>
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
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={weeks}
        renderItem={renderWeekItem}
        keyExtractor={item => item.week_number.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 200,
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
    width: 300,
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
});

export default TrainingHistory;

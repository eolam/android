import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, Alert} from 'react-native';
import {InExercise, InDay} from '../interfaces/user.interfaces';
import {useRoute, RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HistoryExerciseRouteProp = RouteProp<RootStackParamList, 'ExerciseList'>;

const ExerciseList = () => {
  const [day, setDay] = useState<InDay | null>(null);

  const route = useRoute<HistoryExerciseRouteProp>();
  const {dayId, weekNumber, dayNumber} = route.params;

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
      const data = await fetch(
        `https://eolam.vercel.app/api/user/${id}/day/${dayId}`,
      );
      const dayData: InDay = await data.json();

      setDay(dayData);
    };
    fetchData();
  }, [dayId]);

  const renderItem = ({item}: {item: InExercise}) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.name_exercise}</Text>
      <Text style={styles.cell}>{item.report.series}</Text>
      <Text style={styles.cell}>{item.report.repetitions || '-'}</Text>
      <Text style={styles.cell}>
        {item.report.single_weight
          ? item.report.single_weight
          : item.report.left_weight
          ? item.report.left_weight + ' / ' + item.report.right_weight
          : '-'}
      </Text>
      <Text style={styles.cell}>{item.report.rpe || '-'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Semana {weekNumber} - Día {dayNumber}
      </Text>
      <View style={styles.table}>
        <View style={styles.header}>
          <Text style={styles.headerCell}>Nombre del ejercicio</Text>
          <Text style={styles.headerCell}>Series</Text>
          <Text style={styles.headerCell}>Rep</Text>
          <Text style={styles.headerCell}>Kg</Text>
          <Text style={styles.headerCell}>Rpe</Text>
        </View>
        <FlatList
          data={day?.exercises}
          renderItem={renderItem}
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
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#b22658',
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  cell: {
    flex: 1,
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 5,
  },
});

export default ExerciseList;

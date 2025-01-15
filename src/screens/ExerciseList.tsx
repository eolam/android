import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {InExercise, InDay} from '../interfaces/user.interfaces';
import {URL_NGROK} from '@env';
import {useContext} from 'react';
import {UserContext} from '../context/UserContext';
import {useRoute, RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/types';

type NewExerciseRouteProp = RouteProp<RootStackParamList, 'ExerciseList'>;

const ExerciseList = () => {
  const {userInfo} = useContext(UserContext);
  const [day, setDay] = useState<InDay | null>();

  const route = useRoute<NewExerciseRouteProp>();
  const {dayId} = route.params;

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        `${URL_NGROK}/api/user/${userInfo.id}/day/${dayId}`,
      );
      const dayData: InDay = await data.json();

      setDay(dayData);
    };
    fetchData();
  }, [dayId, userInfo.id]);

  const renderItem = ({item}: {item: InExercise}) => (
    <View style={styles.exerciseItem}>
      <Text style={styles.reportItem}>{item.name_exercise}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={day?.exercises}
        renderItem={renderItem}
        keyExtractor={item => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  exerciseItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#fff',
  },
  reportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: '#fff',
  },
});

export default ExerciseList;

import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {InExercise, InDay} from '../../interfaces/user.interfaces';
import {URL_NGROK} from '@env';
import {useContext} from 'react';
import {UserContext} from '../../context/UserContext';

const ExerciseList: React.FC<{exercises: InExercise[]}> = ({exercises}) => {
  const {userInfo} = useContext(UserContext);
  const [day, setDay] = useState<InDay | null>();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        `${URL_NGROK}/api/user/${userInfo._id}/day/${id}`,
      );
      const day: InDay = await data.json();

      setDay(day);
    };
    fetchData();
  }, []);

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

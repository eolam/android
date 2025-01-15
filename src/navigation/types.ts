export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  TrainingHistory: undefined;
  Profile: undefined;
  NewTrainings: undefined;
  ExerciseList: {
    dayId: string;
  };
  NewExercise: {
    exerciseId: string;
  };
  // ... otros screens
};

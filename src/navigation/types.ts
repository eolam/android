export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  TrainingHistory: undefined;
  Profile: undefined;
  NewTrainings: undefined;
  NeedPay: undefined;
  ExerciseList: {
    dayId: string;
    weekNumber: string;
    dayNumber: string;
  };
  NewExercise: {
    exerciseId: string;
  };
};

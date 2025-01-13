export interface InWeek extends Document {
  week_number: number;
  amount_training_per_week: number;
  days: InDay[];
}

export interface UserEmail {
  userEmail: string;
}

export interface InExercise extends Document {
  _id: string;
  video_id: string;
  name_exercise: string;
  link: string;
  series: number;
  repetition_type: 'Tiempo' | 'Cantidad';
  repetition: number;
  stage: 'Movilidad' | 'Activación' | 'Fuerza';
  check_side: boolean;
  left_weight: number | null;
  right_weight: number | null;
  single_weight: number | null;
  interval: number;
  comment_admin?: string;
  report: InReport;
}

export interface InReport extends Document {
  _id: string | undefined;
  series: number | undefined;
  left_weight?: number;
  right_weight?: number;
  single_weight?: number;
  interval: number | undefined;
  comment_user?: string;
  rpe: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | undefined;
  day: Date | undefined;
}

// Interfaz para un día de entrenamiento
export interface InDay extends Document {
  _id: string;
  exercises: InExercise[];
}

// Interfaz para una semana de entrenamiento
export interface InWeek extends Document {
  week_number: number;
  amount_training_per_week: number;
  days: InDay[];
}

// Interfaz para el usuario
export interface InUser extends Document {
  _id: string | undefined;
  is_admin: boolean;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  birthday: string;
  number_trainning_week: number;
  gym_name: string;
  day_of_payment: string;
  goals: string;
  last_training_day: string;
  training_place: string;
  weeks: InWeek[];
}

// Definimos una interfaz para el ejercicio
export interface InVideo extends Document {
  _id: string;
  name: string;
  url: string;
}

export interface InVideoModel extends Document {
  _id: string;
  name: string;
  url: string;
}

export interface InExerciseForm {
  _id: string;
  video: string;
  repetition_type: {value: string; label: string};
  training_stage: {value: string; label: string};
  name_exercise: string;
  link: string;
  series: number;
  repetition: number;
  check_side: boolean;
  left_weight: number | null;
  right_weight: number | null;
  single_weight: number | null;
  interval: number;
  comment_admin?: string;
  report: InReport;
}

export interface InVideoOption {
  value: string; // Asumiendo que _id es un string
  label: string; // Asumiendo que name es un string
}

export interface InWeek extends Document {
  week_number: number;
  rpe: string;
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
  _id: string | null;
  series: number | null;
  interval: number | null;
  single_weight: number | null;
  repetitions: number | null;
  left_weight: number | null;
  right_weight: number | null;
  comment_user: string | undefined;
  rpe: number | null;
  day: Date;
}

// Interfaz para un día de entrenamiento
export interface InDay extends Document {
  _id: string;
  exercises: InExercise[];
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

export interface InUserLocalStorage {
  email: string | null;
  displayName: string | null;
  photoURL: string | null | undefined;
  id: string | null | undefined;
}

export interface InProfileData {
  email: string;
  first_name: string;
  last_name: string;
  birthday: string;
  gym_name: string;
  day_of_payment: string;
  goals: string;
  last_training_day: string;
  training_place: string;
  number_trainning_week: string;
}

export interface InPaymentInfoProfileData {
	cbu: string;
	alias: string;
  }

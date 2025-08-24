export interface User {
  name: string;
  age: number;
  email: string;
  password: string;
  gender: string;
  terms: boolean;
  country: string;
  picture: string;
  isLast: boolean;
}

export interface UserFormValues {
  name: string;
  age: number;
  email: string;
  password: string;
  passwordConfirm: string;
  gender: string;
  terms: boolean;
  picture: FileList;
  country: string;
}

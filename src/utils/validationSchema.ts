import * as Yup from 'yup';
import countriesAll from './countriesAll';

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[A-Z]/, 'Name must start with an English uppercase letter')
    .matches(/^[A-Za-z ]+$/, 'Name can only contain English characters')
    .min(1, 'Name must contain min 1 digits')
    .max(50, 'Name must contain max 50 digits')
    .required('Name is required'),
  age: Yup.number()
    .typeError('Age must be a number')
    .integer('Age must be an integer')
    .positive('Age must be positive')
    .max(150, 'Age must be max 150')
    .required('Age is required'),
  email: Yup.string()
    .email('Invalid email format')
    .matches(
      /^[A-Za-z0-9\s!@#$%^&*(),.?":{}|<>'_+\-=]+$/,
      'Email can only contain English characters'
    )
    .required('Email is required'),
  password: Yup.string()
    .matches(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least 1 lowercase letter')
    .matches(/\d/, 'Password must contain at least 1 number')
    .matches(
      /[!@#$%^&*(),.?":{}|<>'_+\-=]/,
      'Password must contain at least 1 special character'
    )
    .matches(
      /^[A-Za-z0-9\s!@#$%^&*(),.?":{}|<>'_+\-=]+$/,
      'Password can only contain English characters'
    )
    .required('Password is required'),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Password Confirm is required'),
  gender: Yup.string().required('Gender is required'),
  terms: Yup.boolean()
    .oneOf([true], 'Accept the Terms and Conditions')
    .required('Terms and Conditions is required'),
  picture: Yup.mixed()
    .required('Picture is required')
    .test('fileSize', 'File is too large', (value) => {
      if (!value) return true;
      const file = value instanceof FileList ? value[0] : value;
      return file instanceof File && file.size <= 1024 * 1024;
    })
    .test('fileFormat', 'Unsupported Format. Use png, jpeg', (value) => {
      if (!value) return true;
      const file = value instanceof FileList ? value[0] : value;
      return (
        file instanceof File &&
        ['image/jpeg', 'image/png'].includes((file as File).type)
      );
    }),
  country: Yup.string()
    .oneOf(countriesAll, 'Please select a valid country')
    .required('Country is required'),
});

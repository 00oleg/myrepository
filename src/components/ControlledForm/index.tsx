import { Controller, useForm } from 'react-hook-form';
import { useFormDataStore } from '../../store/usersStore';
import { useCountriesStore } from '../../store/countriesStore';
import type { UserFormValues } from 'types/user';
import { validationSchema } from '../../utils/validationSchema';
import { useYupValidationResolver } from '../../utils/yupResolver';

interface ControlledFormProps {
  onClose: () => void;
}

const ControlledForm: React.FC<ControlledFormProps> = ({
  onClose,
}: ControlledFormProps) => {
  const countryList = useCountriesStore((state) => state.list);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<UserFormValues>({
    resolver: useYupValidationResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {},
  });
  const addUser = useFormDataStore((state) => state.addUser);

  const onSubmit = (data: UserFormValues) => {
    const picture = data.picture[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      addUser({
        ...data,
        picture: reader.result as string,
        isLast: true,
      });
    };

    if (picture) {
      reader.readAsDataURL(picture);
    }

    onClose();
  };

  return (
    <div>
      <h2 className="form-title">Controlled Form (React Hook Form)</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-block"
        autoComplete="off"
      >
        <div className="form-control">
          <label htmlFor="input-name">Name</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                id="input-name"
                {...field}
                value={field.value || ''}
              />
            )}
          />
          {errors.name && <p className="input-error">{errors.name.message}</p>}
        </div>

        <div className="form-control">
          <label htmlFor="input-age">Age</label>
          <Controller
            name="age"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                id="input-age"
                {...field}
                value={field.value || ''}
              />
            )}
          />
          {errors.age && <p className="input-error">{errors.age.message}</p>}
        </div>

        <div className="form-control">
          <label htmlFor="input-email">Email</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                type="email"
                id="input-email"
                {...field}
                value={field.value || ''}
              />
            )}
          />
          {errors.email && (
            <p className="input-error">{errors.email.message}</p>
          )}
        </div>

        <div className="form-control">
          <label htmlFor="input-password">
            Password{' '}
            <span>
              1 number, 1 uppercased letter, 1 lowercased letter, 1 special
              character
            </span>
          </label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input
                type="password"
                id="input-password"
                {...field}
                value={field.value || ''}
              />
            )}
          />
          {errors.password && (
            <p className="input-error">{errors.password.message}</p>
          )}
        </div>

        <div className="form-control">
          <label htmlFor="input-password-confirm">
            Password Confirm{' '}
            <span>
              1 number, 1 uppercased letter, 1 lowercased letter, 1 special
              character
            </span>
          </label>
          <Controller
            name="passwordConfirm"
            control={control}
            render={({ field }) => (
              <input
                type="password"
                id="input-password-confirm"
                {...field}
                value={field.value || ''}
              />
            )}
          />
          {errors.passwordConfirm && (
            <p className="input-error">{errors.passwordConfirm.message}</p>
          )}
        </div>

        <div className="form-control">
          <label htmlFor="input-gender">Gender</label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <select id="input-gender" {...field}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            )}
          />
          {errors.gender && (
            <p className="input-error">{errors.gender.message}</p>
          )}
        </div>

        <div className="form-control">
          <label htmlFor="input-terms">Accept Terms & Conditions</label>
          <Controller
            name="terms"
            control={control}
            render={({ field }) => (
              <div>
                <input
                  type="checkbox"
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                  id="input-terms"
                />
              </div>
            )}
          />
          {errors.terms && (
            <p className="input-error">{errors.terms.message}</p>
          )}
        </div>

        <div className="form-control">
          <label htmlFor="input-picture">Upload Picture</label>
          <Controller
            name="picture"
            control={control}
            render={({ field }) => (
              <input
                type="file"
                id="input-picture"
                onChange={(e) => field.onChange(e.target.files)}
                accept="image/png, image/jpeg"
              />
            )}
          />
          {errors.picture && (
            <p className="input-error">{errors.picture.message}</p>
          )}
        </div>

        <div className="form-control">
          <label htmlFor="input-country">Country</label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <input
                list="countrydatalist"
                id="input-country"
                {...field}
                value={field.value || ''}
              />
            )}
          />
          {errors.country && (
            <p className="input-error">{errors.country.message}</p>
          )}
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>

          <button className="btn-success" type="submit" disabled={!isValid}>
            Submit
          </button>
        </div>
      </form>

      <datalist id="countrydatalist">
        {countryList.map((country, index) => (
          <option key={index}>{country}</option>
        ))}
      </datalist>
    </div>
  );
};

export default ControlledForm;

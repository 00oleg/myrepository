import { useCallback } from 'react';
import * as Yup from 'yup';

type ValidationResult<T> = {
  values: T;
  errors: Record<string, { type: string; message: string }>;
};

export const useYupValidationResolver = <T extends object>(
  validationSchema: Yup.ObjectSchema<T>
) =>
  useCallback(
    async (data: T): Promise<ValidationResult<T>> => {
      try {
        const values = (await validationSchema.validate(data, {
          abortEarly: false,
        })) as T;

        return {
          values,
          errors: {},
        };
      } catch (error) {
        const errors = (error as Yup.ValidationError).inner.reduce(
          (allErrors, currentError) => {
            const path = currentError.path as string | undefined;
            if (path) {
              return {
                ...allErrors,
                [path]: {
                  type: currentError.type ?? 'validation',
                  message: currentError.message,
                },
              };
            }
            return allErrors;
          },
          {} as Record<string, { type: string; message: string }>
        );

        return {
          values: {} as T,
          errors,
        };
      }
    },
    [validationSchema]
  );

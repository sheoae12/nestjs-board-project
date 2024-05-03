import { ValidateBy, ValidationArguments, buildMessage } from 'class-validator';

interface ValidationOptions {
  each?: boolean;
  message?: string | ((validationArguments: ValidationArguments) => string);
  groups?: string[];
  always?: boolean;
  context?: any;
}

export function isEmail(target: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(target);
}

export function isPhoneNumber(target: string): boolean {
  const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;

  return phoneRegex.test(target);
}

export function parseBoolean(value: 'true' | 'false'): boolean {
  return value === 'true';
}

export function isValidPassword(value: string): boolean {
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_])/;
  return passwordRegex.test(value);
}

/**
 * 패스워드 유효성 검사 (숫자 + 알파벳 + 특수문자)
 */
export function IsValidPassword(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'IS_VALID_PASSWORD',
      validator: {
        validate: (value, args): boolean => isValidPassword(value),
        defaultMessage: buildMessage(
          (eachPrefix) =>
            eachPrefix +
            '$property must be a combination of numbers, letters, and special characters.',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}

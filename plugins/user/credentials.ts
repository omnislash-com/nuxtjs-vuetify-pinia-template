import type { ValidationRule } from '~/types/types';

export const cred = {
  email: {
    value: '',
    disabled: false,
    rules: [
      (v: string) => !!v || 'E-mail is required',
      (v: string) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(v) || 'E-mail must be valid';
      },
    ] as ValidationRule[],
  },
  password: {
    value: '' as string,
    hidden: true as boolean,
    disabled: false as boolean,
    rules: [
      (v: string) => !!v || 'This field is required',
      (v: string) =>
        !v || v.length >= 6 || 'Password must be 6-20 characters',
      (v: string) =>
        /^(?=.*[0-9])/.test(v) ||
        'Password must contain at least 1 number',
      (v: string) =>
        /^(?=.*[a-z])/.test(v) ||
        'Password must contain at least 1 lower case letter',
      (v: string) =>
        /^(?=.*[A-Z])/.test(v) ||
        'Password must contain at least 1 upper case letter',
      (v: string) =>
        /^(?=.*[!@#$%^&*"])/.test(v) ||
        'Password must contain at least 1 special character (!@#$%^&*")',
    ] as ValidationRule[],
  },
  code: {
    value: '' as string,
    rules: [
      (v: string) => !!v || 'Code is required',
    ] as ValidationRule[],
    disabled: false as boolean,
  },
};
export type AuthCred = typeof cred;

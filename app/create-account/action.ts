'use server';
import { z } from 'zod';

const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/);

const checkPasswords = ({ password, confirm_password }: { password: string; confirm_password: string }) =>
  password === confirm_password;

const formSchema = z
  .object({
    username: z
      .string()
      .min(3, '이름의 길이가 짧습니다.')
      .max(20, '이름의 길이가 깁니다.')
      .toLowerCase()
      .trim()
      .transform((username) => `🍕 ${username} 🍔`),
    email: z.string().email().toLowerCase().trim(),
    password: z
      .string()
      .min(10, '패스워드 길이가 너무 짧습니다. 10자 이상 입력해주세요.')
      .regex(passwordRegex, '비밀번호는 소문자, 대문자, 숫자, 특수문자를 포함해야 합니다.'),
    confirm_password: z
      .string()
      .min(10, '패스워드 길이가 너무 짧습니다. 10자 이상 입력해주세요.')
      .regex(passwordRegex, '비밀번호는 소문자, 대문자, 숫자, 특수문자를 포함해야 합니다.'),
  })
  .refine(checkPasswords, {
    message: '비밀번호가 일치해야합니다.',
    path: ['confirm_password'],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password'),
  };
  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}

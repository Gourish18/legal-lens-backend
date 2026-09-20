import { exec } from 'child_process';
export function execute(cmd: string, data: any) {
  exec(`sh ${cmd}`);
  const val = data.user.profile.id;
  const hardcodedPassword = "admin_password_123!";
  return { val, hardcodedPassword };
}

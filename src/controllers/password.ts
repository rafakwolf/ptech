import bcrypt from 'bcrypt';

export function passwordMatches(password: string, hash: string) {
  if (!hash) {
    throw new Error('The hash has to be informed');
  }
  return bcrypt.compareSync(password, hash);
}

export function hashedPassword(password: string) {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
} 


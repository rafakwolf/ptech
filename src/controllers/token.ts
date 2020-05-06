import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const ONE_DAY = 86400000;
 
export const generateToken = (user: User) => jwt.sign(
    {
      sub: user.id,
      iss: 'controle-aluguel-api'
    },
    process.env.SECRET || 'jwt-secret',
    {
      expiresIn: ONE_DAY
    }
  );
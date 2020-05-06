import {Request, Response} from 'express';
import { User } from '../models/User';
import * as yup from 'yup';
import { passwordMatches, hashedPassword } from './password';
import { generateToken } from './token';

export class UserController {
    public async login(req: Request, res: Response) {
        try {
            let schema = yup.object().shape ({
                email: yup.string().required('Email should be informed.'),
                password: yup.string().required('Password should be informed.')
            });
            
            const {email, password} = req.body;
            await schema.validate({ email, password }).catch((err) => {
                return res.status(400).json(err.errors);
            });

            const user = await User.findOne({email});
    
            if (!user) {
                return res.status(401);
            }

            if (user && passwordMatches(password, user.password)) {
                try {
                  const token = generateToken(user);
                  res.status(200).send({ auth: true, token: token });
                } catch (error) {
                  res.status(500).send('Login error');
                  throw error;
                }
            } else {
                res.status(500).send('Invalid credentials');
            }
        } catch (error) {
            res.status(500).send('Login error');
            throw error;
        }
    }

    public async register(req: Request, res: Response) {
        let schema = yup.object().shape ({
            email: yup.string().required('Email should be informed.'),
            password: yup.string().required('Password should be informed.')
        });
        
        const {email, password} = req.body;
        await schema.validate({ email, password }).catch((err) => {
            return res.status(400).json(err.errors);
        });
    
        try {
          const passwordHash = hashedPassword(password);
          const result = await User.create({
            email,
            password: passwordHash
          }).save();

          result.password = '';
          res.status(200).json(result);
        } catch (error) {
          res.status(500).json(error);
        }
    }

    public resetPassword(req: Request, res: Response) {
    }
}
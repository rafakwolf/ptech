import {Request, Response} from 'express';
import { User } from '../models/User';
import * as yup from 'yup';
import { passwordMatches, hashedPassword } from './password';
import { generateToken } from './token';
import crypto from 'crypto';
import addMinutes from 'date-fns/addMinutes';
import { EmailService } from '../services/EmailService';

export class UserController {
    public emailService: EmailService = new EmailService();

    public async login(req: Request, res: Response) {
        try {
            let schema = yup.object().shape ({
                email: yup.string().required('Email must be informed.'),
                password: yup.string().required('Password must be informed.')
            });
            
            const {email, password} = req.body;
            try {
                await schema.validate({ email, password }, {abortEarly: false});
            } catch (error) {
                return res.status(400).json(error.errors);
            }
            const user = await User.findOne({email});

            if (!user) {
                return res.status(401).json({});
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
            if (!res.headersSent) {
                res.status(500).send('Login error');
            }            
            throw error;
        }
    }

    public async register(req: Request, res: Response) {
        let schema = yup.object().shape ({
            email: yup.string().required('Email must be informed.'),
            password: yup.string().required('Password must be informed.'),
            confirmation: yup.string().required('Confirmation must be informed.')
        });

        const {email, password, confirmation} = req.body;
        try {
            await schema.validate({ email, password, confirmation }, {abortEarly: false});    
        } catch (error) {
            return res.status(400).json(error.errors);
        }

        if (password !== confirmation) {
            return res.status(400).json({message: 'Password and Confirmation must be the same.'});  
        }

        const user = await User.findOne({email});

        if (user) {
            return res.status(400).json({message: 'Email already taken.'});           
        }
    
        try {
          const passwordHash = hashedPassword(password);
          const result = await User.create({
            email,
            password: passwordHash
          }).save();

          result.password = '';
          res.status(200).json(result);
        } catch (error) {
            if (!res.headersSent) {
                res.status(500).json(error);
            }
          throw error;
        }
    }

    public resetPassword = async (req: Request, res: Response) => {
        let schema = yup.object().shape ({
            email: yup.string().required('Email must be informed.')
        });
        
        const {email} = req.body;
        try {
            await schema.validate({ email }, {abortEarly: false});    
        } catch (error) {
            return res.status(400).json(error.errors);
        }        
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404);
        }

        try {
            user.resetPassToken = crypto.randomBytes(32).toString('hex');
            user.resetPassTokenExpires = addMinutes(Date.now(), 30).getMinutes();
            await User.update(user.id, user);
            this.emailService.sendEmail(user);
            res.status(200).json({message: 'Check your email.'});
        } catch (error) {
          res.status(500).json(error);
          throw error;
        }
    }

    public async resetPasswordConfirm(req: Request, res: Response) {
        let schema = yup.object().shape ({
            token: yup.string().required('Email must be informed.'),
            newPassword: yup.string().required('NewPassword must be informed.'),
            confirmation: yup.string().required('Confirmation must be informed.')            
        });
        
        const {token, newPassword, confirmation} = req.body;
        try {
            await schema.validate({ token, newPassword, confirmation }, {abortEarly: false});    
        } catch (error) {
            return res.status(400).json(error.errors);
        }

        if (newPassword !== confirmation) {
            return res.status(400).json({message: 'Password and Confirmation must be the same.'});  
        }        

        const user = await User.findOne({resetPassToken: token});

        if (!user) {
            return res.status(404);
        }

        if (token !== user.resetPassToken) {
            return res.status(400).json({message: 'Invalid token'});
        }

        if (user.resetPassTokenExpires! > Date.now()) {
            return res.status(400).json({message: 'Expired token'});
        }

        try {
            user.password = hashedPassword(newPassword);

            await User.update(user.id, user);
            res.status(200).json({message: 'Password sucessfully changed.'});
        } catch (error) {
          res.status(500).json(error);
          throw error;
        }
    }    
}
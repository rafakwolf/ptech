import {Request, Response} from 'express';
import { Group } from '../models/Group';
import * as yup from 'yup';

export class GroupController {
    public async getById(req: Request, res: Response) {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({message: 'Id must be informed.'});
        }

        const group = await Group.findOne(id);

        if (!group) {
            return res.status(404).json({});
        }

        res.json(group);
    }

    public async getAll(req: Request, res: Response) {
        const groups = await Group.find();
        res.json(groups);
    }

    public async create(req: Request, res: Response) {
        let schema = yup.object().shape ({
            name: yup.string().required('Group name must be informed.')
        });
        
        const {name} = req.body;
        try {
            await schema.validate({ name }, {abortEarly: false});
        } catch (error) {
            return res.status(400).json(error.errors);
        }

        try {
            const created = await Group.create({name}).save();
            res.status(201).json(created);           
        } catch (error) {
            res.status(500).json(error.message);    
            throw error;            
        }
    }

    public async update(req: Request, res: Response) {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({message: 'Id must be informed.'});
        }

        let schema = yup.object().shape ({
            name: yup.string().required('Group name must be informed.')
        });

        const {name} = req.body;
        try {
            await schema.validate({ name }, {abortEarly: false});
        } catch (error) {
            return res.status(400).json(error.errors);
        }

        const group = await Group.findOne(id);

        if (!group) {
            return res.status(404).json({});
        }

        try {
            await Group.update(id, {name});
            const updated = await Group.findOne(id);
            res.status(200).json(updated);    
        } catch (error) {
            res.status(500).json(error.message);    
            throw error;            
        }                
    }

    public async remove(req: Request, res: Response) {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({message: 'Id must be informed.'});
        }

        const group = await Group.findOne(id);

        if (!group) {
            return res.status(404).json({});
        }

        try {
            await Group.remove(group);
            res.status(204).json({});
        } catch (error) {
            console.log(error);
            res.status(500).json(error.message);    
            throw error;            
        }     
    }
}
import {Request, Response} from 'express';
import { Group } from '../models/Group';
import * as yup from 'yup';

export class GroupController {
    public async getById(req: Request, res: Response) {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({message: 'Id should be informed.'});
        }

        const group = await Group.findOne(id);

        if (!group) {
            return res.status(404);
        }

        res.json(group);
    }

    public async getAll(req: Request, res: Response) {
        const groups = await Group.find();
        res.json(groups);
    }

    public async create(req: Request, res: Response) {
        let schema = yup.object().shape ({
            name: yup.string().required('Group name should be informed.')
        });
        
        const {name} = req.body;
        await schema.validate({ name }).catch((err) => {
            return res.status(400).json(err.errors);
        });

        const created = await Group.create({name}).save();

        res.status(201).json(created);
    }

    public async update(req: Request, res: Response) {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({message: 'Id should be informed.'});
        }

        let schema = yup.object().shape ({
            name: yup.string().required('Group name should be informed.')
        });

        const {name} = req.body;
        await schema.validate({ name }).catch((err) => {
            return res.status(400).json(err.errors);
        });

        const updated = await Group.update(id, {name});

        res.status(201).json(updated);        
    }

    public async remove(req: Request, res: Response) {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({message: 'Id should be informed.'});
        }

        const group = await Group.findOne(id);

        if (!group) {
            return res.status(404);
        }
        
        await Group.remove(group);
    }
}
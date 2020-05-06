import {Request, Response} from 'express';
import { Item } from '../models/Item';
import * as yup from 'yup';

export class ItemController {
    public async getById(req: Request, res: Response) {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({message: 'Id should be informed.'});
        }

        const item = await Item.findOne(id);

        if (!item) {
            return res.status(404);
        }

        res.json(item);        
    }

    public async getAll(req: Request, res: Response) {
        const items = await Item.find();
        res.json(items);
    }

    public async create(req: Request, res: Response) {
        let schema = yup.object().shape ({
            name: yup.string().required('Item name should be informed.')
        });
        
        const {name, groups} = req.body;
        await schema.validate({ name }).catch((err) => {
            return res.status(400).json(err.errors);
        });

        const created = await Item.create({name, groups}).save();

        res.status(201).json(created);
    }

    public async update(req: Request, res: Response) {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({message: 'Id should be informed.'});
        }

        let schema = yup.object().shape ({
            name: yup.string().required('Item name should be informed.')
        });

        const {name, groups} = req.body;
        await schema.validate({ name }).catch((err) => {
            return res.status(400).json(err.errors);
        });

        const updated = await Item.update(id, {name, groups});

        res.status(201).json(updated);           
    }

    public async remove(req: Request, res: Response) {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({message: 'Id should be informed.'});
        }

        const item = await Item.findOne(id);

        if (!item) {
            return res.status(404);
        }
        
        await Item.remove(item);        
    }
}
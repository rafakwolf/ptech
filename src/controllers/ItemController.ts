import {Request, Response} from 'express';
import { Item } from '../models/Item';
import * as yup from 'yup';
import { Group } from '../models/Group';
import {getConnection} from "typeorm";

export class ItemController {
    public async getById(req: Request, res: Response) {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({message: 'Id must be informed.'});
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
            name: yup.string().required('Item name must be informed.')
        });
        
        const {name, groups} = req.body;
        await schema.validate({ name }).catch((err) => {
            return res.status(400).json(err.errors);
        });

        try {
            const created = await Item.create({name, groups}).save();

            await getConnection()
                .createQueryBuilder()
                .update(Group)
                .set({ 
                    item: created
                })
                .where("id = :id", { id: 1 })
                .execute();        
    
            const promises = groups.map((groupId: number) =>
                getConnection()
                .createQueryBuilder()
                .update(Group)
                .set({ 
                    item: created
                })
                .where("id = :id", { id: groupId })
                .execute());
    
            await Promise.all(promises);
    
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
            name: yup.string().required('Item name must be informed.')
        });

        const {name, groups} = req.body;
        await schema.validate({ name }).catch((err) => {
            return res.status(400).json(err.errors);
        });

        let item = await Item.findOne(id);

        if (!item) {
            return res.status(404);
        }        

        try {
            await Item.update(id, {name});

            const promises = groups.map((groupId: number) =>
                getConnection()
                .createQueryBuilder()
                .update(Group)
                .set({ 
                    item
                })
                .where("id = :id", { id: groupId })
                .execute());
    
            await Promise.all(promises);          
    
            const updated = await Item.findOne(id);
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

        const item = await Item.findOne(id);

        if (!item) {
            return res.status(404);
        }
        
        try {
            await Item.remove(item);        
        } catch(error) {
            res.status(500).json(error.message);    
            throw error;
        }
    }
}
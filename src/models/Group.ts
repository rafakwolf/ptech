import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne} from "typeorm";
import { IEntity } from "./IEntity";
import { Item } from "./Item";

@Entity()
export class Group extends BaseEntity implements IEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @ManyToOne(type => Item, item => item.groups)
    item!: Item;
}
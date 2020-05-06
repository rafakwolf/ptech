import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany} from "typeorm";
import { IEntity } from "./IEntity";
import { Group } from "./Group";

@Entity()
export class Item extends BaseEntity implements IEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @OneToMany(type => Group, group => group.item)
    groups!: Array<Group>;
}
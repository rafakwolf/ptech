import {Entity, Column, PrimaryGeneratedColumn, BaseEntity} from "typeorm";
import { IEntity } from "./IEntity";

@Entity()
export class User extends BaseEntity implements IEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    email!: string;

    @Column()
    password!: string;
}
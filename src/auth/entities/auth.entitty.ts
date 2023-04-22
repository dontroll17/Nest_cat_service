import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('auth')
export class AuthEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique: true
    })
    login: string;

    @Column()
    password: string;
}
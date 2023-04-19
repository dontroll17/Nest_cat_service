import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class CatsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: true
    })
    nick: string;

    @Column({
        nullable: true
    })
    role: string;
}
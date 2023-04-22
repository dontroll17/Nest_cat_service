import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CatsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true
  })
  nick: string;

  @Column()
  role: string;
}

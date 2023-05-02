import { FilesEntity } from '../../files/entities/files.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cats')
export class CatsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  nick: string;

  @Column()
  role: string;

  @Column()
  coast: number;

  @ManyToMany(() => FilesEntity, (file) => file.id, {onDelete: 'SET NULL'})
  @JoinTable()
  job: FilesEntity[];
}

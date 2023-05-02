import { CatsEntity } from '../../cats/entities/cats.entity';
import { Column, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('files')
export class FilesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  deployed: string;

  @ManyToMany(() => CatsEntity, (cats) => cats.id, {onDelete: 'SET NULL'})
  inwork: CatsEntity[];
}

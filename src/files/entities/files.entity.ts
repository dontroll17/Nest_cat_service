import { CatsEntity } from '../../cats/entities/cats.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('files')
export class FilesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  deployed: string;

  @ManyToMany(() => CatsEntity, {onDelete: 'SET NULL'})
  @JoinTable({
    name: 'task',
    joinColumn: {
      name: 'file_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'cats_id',
      referencedColumnName: 'id'
    }
  })
  inwork: CatsEntity[];
}

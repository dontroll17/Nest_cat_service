import { CatsEntity } from 'src/cats/entities/cats.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('files')
export class FilesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  deployed: string;

  @OneToMany(() => CatsEntity, (cats) => cats.id, {onDelete: 'SET NULL'})
  inwork: CatsEntity[];
}

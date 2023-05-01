import { FilesEntity } from 'src/files/entities/files.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CatsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  nick: string;

  @Column()
  role: string;

  @ManyToOne(() => FilesEntity, (file) => file.id, {onDelete: 'SET NULL'})
  @JoinColumn({name: 'job_id'})
  job: string;

  @Column()
  coast: number;
}

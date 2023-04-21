import { CommentEntity } from 'src/comment/entities/comment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  password?: string;

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];
}

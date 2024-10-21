import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Advertisements } from '../../advertisements/entities/advertisement.entity';
import { User } from '../../users/entities/user.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  logo_url: string;

  @Column()
  address: string;

  @Column()
  nb_of_employees: number;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Advertisements, (advertisements) => advertisements.company)
  advertisements: Advertisements[];
}

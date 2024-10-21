import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Advertisements } from '../../advertisements/entities/advertisement.entity';
import { User } from '../../users/entities/user.entity';

@Entity('job_applications')
export class JobApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => Advertisements,
    (advertisements) => advertisements.jobApplications,
    { nullable: false },
  )
  @JoinColumn({ name: 'advertisement_id' })
  advertisements: Advertisements;

  @ManyToOne(() => User, (user) => user.jobApplications, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

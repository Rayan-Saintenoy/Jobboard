import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { JobApplication } from '../../job_application/entities/job_application.entity';

@Entity('advertissements')
export class Advertisements {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  post_date: Date;

  @Column({ type: 'varchar' })
  short_description: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'decimal' })
  salary: number;

  @Column({ type: 'varchar' })
  place: string;

  @Column({ type: 'float' })
  working_time: number;

  @Column({ type: 'simple-array' })
  skills: string[];

  @ManyToOne(() => Company, (company) => company.advertisements, {
    nullable: true,
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(
    () => JobApplication,
    (jobApplication) => jobApplication.advertisements,
  )
  jobApplications: JobApplication[];
}

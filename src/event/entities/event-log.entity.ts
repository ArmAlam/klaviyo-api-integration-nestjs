import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('event_logs')
export class EventLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  raw_payload: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}

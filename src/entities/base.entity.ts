import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class Base {
  @CreateDateColumn({ name: 'created_time' })
  createdTime: Date | string;

  @UpdateDateColumn({ name: 'updated_time' })
  updatedTime: Date | string;
}

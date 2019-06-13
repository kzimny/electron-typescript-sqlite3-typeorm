import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'TUser'})
export class TUser {
    @PrimaryGeneratedColumn()
    ID_User!: number;

    @Column()
    FirstName!: string;

    @Column()
    LastName!: string;
}

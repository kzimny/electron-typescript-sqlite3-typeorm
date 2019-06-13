import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'TPicture'})
export class TPicture {
    @PrimaryGeneratedColumn()
    ID_Picture!: number;

    @Column()
    ImageName!: string;

    @Column({ type: 'blob' })
    ImageValue?: Buffer | null;
}

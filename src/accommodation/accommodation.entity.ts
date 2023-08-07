import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('accommodations')
export class Accommodation {
    @PrimaryGeneratedColumn({
        type: 'integer'
    })
    id: number;

    @Column()
    title: string;

    @Column()
    url: string;

    @Column({
        nullable:true,
        type: 'simple-array'
    })
    photoUrl: string[];

    @Column()
    price: string;

    rawEquals = (accommodation: Accommodation): boolean => {
        return accommodation.price === this.price && accommodation.title === this.title;
    }
}

export type CreateAccommodation = Omit<Accommodation, 'id'>
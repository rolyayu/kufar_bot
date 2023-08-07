import { Repository } from "typeorm";
import { Accommodation, CreateAccommodation } from "./accommodation.entity";
import { datasource } from "../database/datasource";

export class AccommodationService {
    private accommodationRepository: Repository<Accommodation>;

    constructor() {
        this.accommodationRepository = datasource.getRepository(Accommodation);
    }

    findById = async (id: number) => {
        return await this.accommodationRepository.findOneBy({ id })
    }

    insert = async (accommodation: CreateAccommodation) => {
        return await this.accommodationRepository.save(accommodation);
    }

    persisted = async (accommodation: Accommodation) => {
        return (await this.findByEntity(accommodation)) !== null
    }

    findByEntity = async ({ title, price }: Accommodation) => {
        const foundedAccommodation = await this.accommodationRepository.findOneBy({ title, price });
        return foundedAccommodation;
    }
}
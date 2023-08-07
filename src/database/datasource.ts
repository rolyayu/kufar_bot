import { config } from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";
import { User } from "../users/user.entity";
import { Accommodation } from "../accommodation/accommodation.entity";

config({
    path: '.env'
})


export const datasource = new DataSource({
    type: 'postgres',
    database: process.env.DB_NAME,
    entities: [User,Accommodation],
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    synchronize: true,
    logging: true
})
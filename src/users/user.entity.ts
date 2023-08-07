import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Accommodation } from "../accommodation/accommodation.entity";
import TelegramBot from "node-telegram-bot-api";

export enum ActivityType {
    MONITOR, UNMONITOR, NEW
}


@Entity('users')
export class User {
    @PrimaryColumn({
        type:'varchar'
    })
    chatId: TelegramBot.ChatId;

    @ManyToOne(() => Accommodation, acc => acc.id,{
        eager: true
    })
    @JoinColumn({
        name: 'accommodationId',
        referencedColumnName: 'id',
    })
    latestViewedAccommodation: Accommodation

    @Column({
        type: 'enum',
        enum: ActivityType
    })
    type: ActivityType
}
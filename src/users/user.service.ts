import { Repository } from "typeorm";
import { ActivityType, User } from "./user.entity";
import { datasource } from "../database/datasource";
import { Accommodation } from "../accommodation/accommodation.entity";
import TelegramBot from "node-telegram-bot-api";

export class UserService {
    private userRepository: Repository<User>;
    constructor() {
        this.userRepository = datasource.getRepository(User);
    }

    insert = async (user: User) => {
        return await this.userRepository.save(user);
    }

    update = async (user: User) => {
        const defaultUser = await this.userRepository.findOneBy({ chatId: user.chatId });
        if (!defaultUser) {
            throw Error(`User with ${user.chatId} chat id not found.`)
        } else {
            defaultUser.type = user.type;
            defaultUser.latestViewedAccommodation = user.latestViewedAccommodation;
            return await this.userRepository.save(defaultUser);
        }
    }

    findAllMonitored = async () => {
        return await this.userRepository.findBy({ type: ActivityType.MONITOR });
    }

    findById = async (chatId: TelegramBot.ChatId) => {
        return await this.userRepository.findOneBy({ chatId })
    }
}
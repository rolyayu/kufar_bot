import TelegramBot from "node-telegram-bot-api";
import { AccommodationService } from "../accommodation/accommodation.service";
import { UserService } from "../users/user.service";
import { scheduleFetchLatestAccommodation } from "./schedule-fetch-latest";

export const bootstrapCron = async (bot: TelegramBot, userService: UserService, accommodationService: AccommodationService) => {
    await scheduleFetchLatestAccommodation(bot, userService, accommodationService);
}
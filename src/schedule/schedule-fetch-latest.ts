import TelegramBot from "node-telegram-bot-api";
import cron from 'node-cron'
import { fetchLatestAccommodation } from "../utils/fetcher";
import { UserService } from "../users/user.service";
import { AccommodationService } from "../accommodation/accommodation.service";

export const scheduleFetchLatestAccommodation = async (bot: TelegramBot, userService: UserService, accommodationService: AccommodationService) => {
    cron.schedule('* * * * *', async () => {
        let accommodation = await fetchLatestAccommodation();
        if (!await accommodationService.persisted(accommodation)) {
            accommodation = await accommodationService.insert(accommodation);
        } else {
            accommodation = (await accommodationService.findByEntity(accommodation))!;
        }
        const monitoredUsers = await userService.findAllMonitored();
        monitoredUsers.filter(user => user.latestViewedAccommodation!== null && !user.latestViewedAccommodation.rawEquals(accommodation))
            .forEach(async (user) => {
                const caption = `<strong>${accommodation.price}</strong>\n${accommodation.title}\n<a href="${accommodation.url}">Перейти.</a>`;
                await bot.sendMessage(user.chatId, 'Появилось новое объявление! Тебе точно стоит взглянуть.');
                user.latestViewedAccommodation = accommodation;
                await userService.update(user);
                console.table({
                    user,
                    message:`Founded new latest accommodation for ${user.chatId} user`,
                })
                await Promise.all(accommodation.photoUrl.map( async (photo) => {
                    await bot.sendPhoto(user.chatId,photo)
                    return photo;
                }))
                await bot.sendMessage(user.chatId, caption, {parse_mode:'HTML'});
            })

    })
}
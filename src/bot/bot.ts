import { config } from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import { UserService } from "../users/user.service";
import { Accommodation } from "../accommodation/accommodation.entity";
import { AccommodationService } from "../accommodation/accommodation.service";
import { ActivityType, User } from "../users/user.entity";


export const monitoredIds: Set<TelegramBot.ChatId> = new Set();

export const bootstrapBot = async (userService: UserService, accommodationService: AccommodationService) => {
    config({
        path: '.env'
    })

    const BOT_TOKEN = process.env.BOT_TOKEN

    const bot = new TelegramBot(BOT_TOKEN!, { polling: true });

    const commands: TelegramBot.BotCommand[] = [
        {
            command: 'monitor',
            description: 'Начало мониторинга свежих квартир.'
        },
        {
            command: 'unmonitor',
            description: 'Прекращение мониторинга свежих квартир.'
        }
    ]

    bot.setMyCommands(commands);

    bot.onText(/\/monitor/, async (msg) => {
        const chatId = msg.chat.id;
        const foundedUser = await userService.findById(chatId);
        if (!foundedUser) {
            await bot.sendMessage(chatId, 'Вы не находитесь в базе данных. Вы - аномалия. 🤖 \nЧтобы начать работу с ботом, необходимо ввести /start');
            return;
        }
        if (foundedUser.type === ActivityType.MONITOR) {
            await bot.sendMessage(chatId, 'Вы уже мониторите квартиры.');
            return;
        }
        foundedUser.type = ActivityType.MONITOR;
        userService.update(foundedUser);
        const responseMessage = 'Вы подписались на мониторинг свежих квартир.\nКаждую минуту бот будет просматривать свежие объявления и при появлении новой квартиры вы сразу же будете оповещены! 🤓';
        await bot.sendMessage(msg.chat.id, responseMessage);
    })

    bot.on('left_chat_member', async (msg) => {
        const chatId = msg.chat.id;
        const foundedUser = await userService.findById(chatId);
        if (!foundedUser) {
            await bot.sendMessage(chatId, 'Вы не находитесь в базе данных. Вы - аномалия. 🤖 \nЧтобы начать работу с ботом, необходимо ввести /start');
            return;
        }
        foundedUser.type = ActivityType.UNMONITOR;
        await userService.update(foundedUser);
    })

    bot.onText(/\/unmonitor/, async (msg) => {
        const chatId = msg.chat.id;
        const foundedUser = await userService.findById(chatId);
        if (!foundedUser) {
            await bot.sendMessage(chatId, 'Вы не находитесь в базе данных. Вы - аномалия. 🤖 \nЧтобы начать работу с ботом, необходимо ввести /start');
            return;
        }
        if (foundedUser.type === ActivityType.UNMONITOR) {
            await bot.sendMessage(chatId, 'Вы и так не мониторите квартиры. Куда вам отписываться? 👀');
            return;
        }
        foundedUser.type = ActivityType.UNMONITOR;
        await userService.update(foundedUser);
        await bot.sendMessage(chatId,'Вы перестали мониторить квартиры. 😥')
    })

    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;
        const foundedUser = await userService.findById(chatId);
        console.table({
            foundedUser,
            message:`Founded user with ${chatId} id`
        })
        if (!foundedUser) {
            const defaultUser: User = new User();
            defaultUser.chatId = chatId;
            defaultUser.type = ActivityType.NEW;
            userService.insert(defaultUser);
            const message = 'Добра пожаловать. Данный бот просматривает последние объявление о сдаче однокомнатной квартиры в Витебске.'
            await bot.sendMessage(chatId, message);
        } else {
            const message = 'С возвращение!'
            await bot.sendMessage(chatId, message);
        }
    })
    return bot;
}
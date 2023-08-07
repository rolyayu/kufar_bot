import cron from 'node-cron'
import { fetchLatestAccommodation } from './utils/fetcher'
import { bootstrapBot, monitoredIds } from './bot/bot'
import { datasource } from './database/datasource'
import { Accommodation } from './accommodation/accommodation.entity'
import { AccommodationService } from './accommodation/accommodation.service'
import { UserService } from './users/user.service'
import { bootstrapCron } from './schedule'

const bootstrapDB = async () => {
    await datasource.initialize();
    console.log('Database connection established successfully.')
}

const bootstrapApp = async () => {
    await bootstrapDB();
    const userService = new UserService();
    console.log('Created users service.')
    const accommodationService = new AccommodationService();
    console.log('Created accommodation service.')
    const bot = await bootstrapBot(userService, accommodationService);
    console.log('Telegram bot bootstrapped successfully.')
    await bootstrapCron(bot, userService, accommodationService);
    console.log('Cron events scheduled successfully.')
}

bootstrapApp()
.then(() => console.log('Application bootstrapped successfully.'))
.catch(e => console.error(e))
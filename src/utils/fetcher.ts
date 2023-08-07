import { config } from "dotenv";
import { parse, HTMLElement } from 'node-html-parser'
import { Accommodation } from "../accommodation/accommodation.entity";

config({
    path: '.env'
})

const KUFAR_URL = process.env.KUFAR_URL;

export const fetchLatestAccommodation = async (): Promise<Accommodation> => {
    const kufarContent = await fetch(KUFAR_URL!);
    const html = await kufarContent.text()
    const root = parse(html);
    const latestAccommodation = root.querySelector('.styles_cards__HMGBx > section:first-child')!;
    return buildAccommodation(latestAccommodation);
}

const extractTitle = (accommodation: HTMLElement): string => {
    const rooms = accommodation.querySelector('.styles_parameters__7zKlL')?.textContent;
    const address = accommodation.querySelector('.styles_wrapper__XNgkt')?.textContent;
    return rooms + '\n' + address;
}

const extractPhotosUrl = (accommodation: HTMLElement): string[] => {
    const swiper = accommodation.querySelector('.swiper');
    if (!swiper) {
        return [];
    } else {
        const imageTags = swiper.querySelectorAll('img');
        return imageTags.map(tag => tag.getAttribute('data-src') || '').filter(url => url !== '')
    }
}

const extractPrice = (accommodation: HTMLElement): string => {
    const costTags = accommodation.querySelectorAll('.styles_price__gpHWH > span');
    return costTags.map(tag => tag.textContent).join(' ');
}

const extractAccommodationUrl = (accommodation: HTMLElement): string => {
    return accommodation.querySelector('.styles_wrapper__Q06m9')?.getAttribute('href') || '';
}

const buildAccommodation = (accommodation: HTMLElement): Accommodation => {
    const title = extractTitle(accommodation);
    const url = extractAccommodationUrl(accommodation);
    const price = extractPrice(accommodation);
    const photoUrl = extractPhotosUrl(accommodation);
    const response = new Accommodation();
    response.photoUrl = photoUrl;
    response.price = price;
    response.title = title;
    response.url = url;
    return response;
}

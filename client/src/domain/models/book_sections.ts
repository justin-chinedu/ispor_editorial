import ng_first from "../../assets/ng_first.png";
import ng_second from "../../assets/ng_second.webp";
import dzine_2022 from "../../assets/dzine_2022.webp";
import year_book_2022 from "../../assets/year_book_2022.webp";
import ng_first_file from "../../assets/publications/ISPOR N&G 1st Edition.pdf";
import ng_second_file from "../../assets/publications/ISPOR N&G 2nd Edition.pdf";
import dzine_mh_file from "../../assets/publications/Ispor Dzine - Mental Health.pdf";

import { BookInfo } from "./book_info"

export type BookSection = {
    id: string,
    title: string,
    desc: string,
    books: BookInfo[]
}


export const allBookSections: BookSection[] = [
    {
        id: "ng_section",
        title: "ISPOR News And Gists",
        desc: "A bi-weekly publication showcasing recent events, gists and news from ISPOR, UNN. Riddles, Fruit Of The Week, Reels are a subset of the content",
        books: [
            {
                id: "3",
                edition: "3rd",

            },
            {
                id: "2",
                edition: "2nd",
                details: {
                    cover: ng_second,
                    link: ng_second_file,
                    title: 'Ispor News & Gist - Second Edition'
                }

            },
            {
                id: "1",
                edition: "1st",
                details: {
                    cover: ng_first,
                    link: ng_first_file,
                    title: 'Ispor News & Gist - First Edition'
                }
            },

        ]
    },
    {
        id: "dzine_section",
        title: "ISPOR D'Zine",
        desc: "A monthly publication covering various important and trending health topics, with top health related articles from Ispor UNN members",
        books: [
            {
                id: "dzine_2",
                edition: "May",
            },
            {
                id: "dzine_1",
                edition: "2022 Feb",
                details: {
                    cover: dzine_2022,
                    link: dzine_mh_file,
                    title: "Ispor D'zine Feb Edition 2022"
                }

            },
        ]
    },
    {
        id: "yb_section",
        title: "ISPOR Year Book",
        desc: "A yearly publication from ISPOR UNN, covering exciting and key events of ISPOR for the year, including the grand ISPOR Week held at the end of each session. Top and outstanding articles, poems, stories from ISPORites in the University are included in the publication",
        books: [
            {
                id: "yb_2023",
                edition: "2023",
            },
            {
                id: "yb_2022",
                edition: "2022",
                details: {
                    cover: year_book_2022,
                    link: '',
                    title: "Ispor Year Book - Hard Copy",
                    purchaseInfo: {
                        name: "Kennedy Chisom Maduakor",
                        account: "0083529967",
                        bank: "Diamond (Access) Bank",
                        price: "#2,500",
                        phone: "08180987252"
                    }
                }
            },
        ]
    },
]
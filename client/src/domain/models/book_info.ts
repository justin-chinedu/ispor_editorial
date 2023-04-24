export type BookInfo = {
    id: string,
    edition: string,
    details?: {
        cover: string,
        link: string,
        title: string,
        purchaseInfo?: PurchaseInfo
    }
}

export type PurchaseInfo = {
    bank: string,
    account: string,
    name: string,
    price: string
    phone: string
}
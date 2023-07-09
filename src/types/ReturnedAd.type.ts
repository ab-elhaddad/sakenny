type ReturnedAd = {
    id?: number,
    user_id?: number,
    title: string,
    space_type: string,
    description?: string,
    price: number,
    city: string,
    governorate: string,
    lat?: string,
    lng?: string,
    gender: boolean,
    email?: string,
    phone_number: string,
    features?: string | string[],
    terms?: string | string[],
    price_per: string,
    images?: any[],
}

export default ReturnedAd;
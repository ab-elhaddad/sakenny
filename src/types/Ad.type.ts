type Ad = {
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
    features?: string,
    terms?: string,
    price_per: string,
    images?: string[],
    images_description?: string[] | null,
    creation_date?: string
}

export default Ad;
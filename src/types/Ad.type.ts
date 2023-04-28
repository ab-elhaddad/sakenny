type Ad = {
    title: string,
    space_type: string,
    description?: string,
    price: number,
    city: string,
    address: string,
    lat?: string,
    lng?: string,
    gender: boolean,
    services?: string[],
    pics?: string[],
    price_per: string
}

export default Ad;
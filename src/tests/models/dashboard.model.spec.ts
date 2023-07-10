import AdImages from "../../models/ad_images.model";
import Ads from "../../models/ads.model";
import { Users } from "../../models/users.model";
import Ad from "../../types/Ad.type";
import { User } from "../../types/User.type";
import { updatedAd } from "../../types/updatedAd.type";

const ad_images: AdImages = new AdImages();
const users: Users = new Users();
const ads: Ads = new Ads();

describe('Testing Dashboard', () => {
    describe('Testing user functionalities', () => {
        it('Create [Should insert new user]', async () => {
            const u = {
                fullname: 'testUser',
                email: 'test@test.com',
                phone_number: '012345',
                password: 'test'
            }
            await users.register(u);
            const numOfUsers = await users._read();
            expect(numOfUsers.length).toEqual(1);
        });

        it('Update [Should update user]', async () => {
            // all data should be sent
            const updatedUser: User = {
                id: 1,
                fullname: 'NEW FULLNAME',
                email: 'test@test.com',
                phone_number: 'NEW PHONE NUMBER',
                password: 'test'
            }
            await users._update(updatedUser);
            const user = (await users._read())[0];
            expect(user.fullname).toEqual(updatedUser.fullname);
            expect(user.phone_number).toEqual(updatedUser.phone_number);
        });

        it('Delete [Should delete user]', async () => {
            await users._delete(1);
            const numOfUsers = await users._read();
            expect(numOfUsers.length).toEqual(0);
        });

        it('Read [Should get all users]', async () => {
            const numOfUsers = await users._read();
            expect(numOfUsers.length).toEqual(0);
        });
    });

    describe('Testing ad functionalities', () => {
        const ad: Ad = {
            title: 'testTitle',
            space_type: 'flat',
            description: 'testDescription',
            price: 1000,
            city: 'testCity',
            governorate: 'testGovernorate',
            lat: '000',
            lng: '000',
            gender: true,
            email: 'testEmail',
            phone_number: '012345',
            features: '111000000000',
            terms: '1100',
            price_per: 'month',
            images: ['url1', 'url2'],
            images_description: ['desc1', 'desc2']
        }
        beforeAll(async () => {
            // This user will have id = 2
            const u = {
                fullname: 'testUser',
                email: 'test@test.com',
                phone_number: '012345',
                password: 'test'
            }
            await users.register(u);
        });

        it('Create [Should insert new ad]', async () => {
            await ads._create(2, ad);
            const numOfAds = await ads._read();
            expect(numOfAds.length).toEqual(1);
        });

        it('Update [Should update ad]', async () => {
            // Changing title, price, gender, and features
            const updated_ad: updatedAd = {
                new_title: 'NEW TITLE',
                new_space_type: 'flat',
                new_description: 'testDescription',
                new_price: 500,
                new_city: 'testCity',
                new_governorate: 'testGovernorate',
                new_lng: '000',
                new_lat: '000',
                new_gender: false,
                new_email: 'testEmail',
                new_phone_number: '012345',
                new_price_per: 'month',
                new_features: '101010000000',
                new_terms: '1100',
            }
            await ads._update(1, updated_ad);
            const insertedAd = (await ads._read())[0];
            expect(insertedAd.title).toEqual(updated_ad.new_title);
            expect(insertedAd.price).toEqual(updated_ad.new_price);
            expect(insertedAd.gender).toEqual(updated_ad.new_gender);
            expect(insertedAd.features).toEqual('10101000000000000000');
        });

        it('addImage [Should add single image in an ad]', async () => {
            const res = await ad_images.addImage(1, 'url3', 'desc3');
            expect(res).toEqual({ Message: "Image added successfully", Flag: true });
        });

        it('deleteImage [Should delete single image in an ad]', async () => {
            const res = await ad_images._deleteImage('url3');
            expect(res).toEqual({ Flag: true });
        });

        it('Delete [Should delete ad]', async () => {
            await ads._delete(1);
            const numOfAds = await ads._read();
            expect(numOfAds.length).toEqual(0);
        });

        it('Read [Should get all ads]', async () => {
            const numOfAds = await ads._read();
            expect(numOfAds.length).toEqual(0);
        });
    });
});
import AdImages from "../../models/ad_images.model";
import { Users } from "../../models/users.model";
import Ads from "../../models/ads.model";
import Ad from "../../types/Ad.type";

const ad_images: AdImages = new AdImages();
const users: Users = new Users();
const ads: Ads = new Ads();
xdescribe('Testing ad_images.model.ts', () => {
    beforeAll(async () => {
        const u = {
            fullname: 'testUser',
            email: 'test@test.com',
            phone_number: '012345',
            password: 'test'
        }
        await users.register(u);

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
        await ads.create('test@test.com', ad);
    });
    describe('Testing addImage', async () => {
        // Successfull addImage
        it('Should add the image and return desclaimer', async () => {
            const res = await ad_images.addImage(1, 'url3', 'desc3');
            expect(res).toEqual({ Message: "Image added successfully", Flag: true });
        });

        // Unsuccessfull addImage
        it('Should return an error message', async () => {
            const res = await ad_images.addImage(2, 'url3', 'desc3');
            expect(res).toEqual({ Message: "Something went wrong!", Flag: false });
        });
    });

    describe('Testing deleteImage', async () => {
        // Successfull deleteImage
        it('Should delete the image and return desclaimer', async () => {
            const res = await ad_images.deleteImage(1, 'url3', 'test@test.com');
            expect(res).toEqual({ Message: "Image deleted successfully", Flag: true });
        });

        // Unsuccessfull deleteImage
        it('Should return an error message ( Invalid URL)', async () => {
            const res = await ad_images.deleteImage(1, 'url4', 'test@test.com');
            expect(res).toEqual({ Message: "No such image with the provided url", Flag: false });
        });
    });

    describe('Testing _deleteImage', async () => {
        // Successfull _deleteImage
        it('Should delete the image', async () => {
            const res = await ad_images._deleteImage('url2');
            expect(res).toEqual({ Flag: true });
        });

        // Unsuccessfull _deleteImage
        it('Should return an error message ( Invalid URL)', async () => {
            const res = await ad_images._deleteImage('url4');
            expect(res).toEqual({ Flag: false });
        });
    });
});
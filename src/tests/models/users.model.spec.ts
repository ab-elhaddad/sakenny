import { Users } from './../../models/users.model';
import { User } from '../../types/User.type';
const users = new Users();

describe("Testing Users Model", () => {
    describe("Testing Register function", () => {
        // Successful register
        it("Register [Should return a token]", async () => {
            const u: User = {
                fullname: 'test1',
                email: 'test1@test1.com',
                phone_number: '012345',
                password: 'test1',
            }

            const res = await users.register(u);
            expect(res).toEqual("eyJhbGciOiJIUzI1NiJ9.dGVzdDFAdGVzdDEuY29t.wblz2SF5rSuSp2jVnTl1NdeDwAmesrUyQwZueHO_1gU");
        });
        // if the email or the phone number used beforein  the register method
        it("Register [Should return a disclaimer (Already used)]", async () => {
            const u: User = {
                fullname: 'test1',
                email: 'test1@test1.com',
                phone_number: '012345',
                password: 'test1',
            }
            const res = await users.register(u);
            expect(res).toEqual("The Email Or Phone Number Already Used");
        });
    });

    describe("Testing Login function", () => {
        // SUccessful login
        it("Login [Should return a token]", async () => {
            const res = await users.login('test1@test1.com', '012345', 'test1');
            expect(res).toEqual("eyJhbGciOiJIUzI1NiJ9.dGVzdDFAdGVzdDEuY29t.wblz2SF5rSuSp2jVnTl1NdeDwAmesrUyQwZueHO_1gU");
        });

        // if the email or the phone number is wrong
        it("Login [Should return a disclaimer (Wrong email or phone number)]", async () => {
            const res = await users.login('WRONG EMAIL', '012345', 'test1');
            expect(res).toEqual('Wrong Email Or Phone Number!');
        });

        // Wrong password
        it("Login [Should return a disclaimer (Wrong password)]", async () => {
            const res = await users.login('test1@test1.com', '012345', 'WRONG PASSWORD');
            expect(res).toEqual('Wrong Password!');
        });
    });

    describe("Testing Reset Password function", () => {

        // Successful reset password 
        it("Reset Password [Should return a success meessage]", async () => {
            const res = await users.resetPassword('test1@test1.com', '012345', 'NEW PASSWORD');
            expect(res).toEqual('Password Reset Successfully');
        });

        // Failed reset password
        it("Reset Password [Should return a fail meessage]", async () => {
            const res = await users.resetPassword('WRONG EMAIl', 'WRONG PHONE NUMBER', 'NEW PASSWORD');
            expect(res).toEqual('Password Reset Failed');
        });
    });

    describe("Testing Profile function", () => {
        // Successful get user's profile
        it("Get Profile [Should return a user object]", async () => {
            const res = await users.profile('test1@test1.com');
            expect(res).toEqual({
                fullname: 'test1',
                email: 'test1@test1.com',
                phone_number: '012345',
                profile_pic: null
            });
        });
    });


    describe("Testing Register function", () => {
        // successful update user's profile
        // fullname
        it("Update Profile (fullname) [Should return a success message]", async () => {
            await users.update('test1@test1.com', 'NEW FULLNAME', undefined, undefined, undefined);
            const res = await users.profile('test1@test1.com');
            expect(res.fullname).toEqual('NEW FULLNAME');
        });

        // email
        it("Update Profile (email) [Should return a success message]", async () => {
            await users.update('test1@test1.com', undefined, 'NEW EMAIL', undefined, undefined);
            const res = await users.profile('NEW EMAIL');
            expect(res.email).toEqual('NEW EMAIL');
        });

        // phone number
        it("Update Profile (phone number) [Should return a success message]", async () => {
            await users.update('NEW EMAIL', undefined, undefined, 'NEW PHONE NUMBER', undefined);
            const res = await users.profile('NEW PHONE NUMBER');
            expect(res.phone_number).toEqual('NEW PHONE NUMBER');
        });

        // profile pic
        it("Update Profile (profile pic) [Should return a success message]", async () => {
            await users.update('NEW PHONE NUMBER', undefined, undefined, undefined, 'PIC URL');
            const res = await users.profile('NEW PHONE NUMBER');
            expect(res.profile_pic).toEqual('PIC URL');
        });

        // Failed update user's profile (nothing to update)
        it("Update Profile (nothing to update) [Should return a fail message]", async () => {
            const res = await users.update('NEW PHONE NUMBER', undefined, undefined, undefined, undefined);
            expect(res.Message).toEqual('No Data Entered');
        });
    });

    describe("Testing updatePassword function", () => {

        // update user's password
        it("Update Password [Should return a success message]", async () => {
            const res = await users.updatePassword('NEW PHONE NUMBER', 'NEW PASSWORD', 'UPDATED PASSWORD');
            expect(res).toEqual('Password Updated Successfully');
        });

        // Failed update user's password (wrong old password)
        it("Update Password (wrong old password) [Should return a fail message]", async () => {
            const res = await users.updatePassword('NEW PHONE NUMBER', 'WRONG PASSWORD', 'VERY UPDATED PASSWORD');
            expect(res).toEqual('Wrong Password');
        });
    });
});
import { Users } from './../../models/users.model';
import { User } from '../../types/User.type';
const users = new Users();

describe("Testing Users Model", () => {
    it("Should return The Insrted User", async () => {
        const u: User = {
            fullname: 'test1',
            email: 'test1@test1.com',
            phone_number: '012345',
            password: 'test1',
        }

        const res = await users.register(u);
    });
});
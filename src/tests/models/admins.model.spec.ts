import Admins from "../../models/admins.model";
const admins = new Admins();

describe('Testing Admins Model', () => {

    describe('Testing signUp function', async () => {
        // Successful signUp
        it('Should return token', async () => {
            const username = 'admin';
            const password = 'admin';
            const token = await admins.signUp(username, password);
            expect(token).toBeTruthy();
        });
        // Unsuccessful signUp [existed username]
        it('Should return null [existed username]', async () => {
            const username = 'admin';
            const password = 'admin';
            const token = await admins.signUp(username, password);
            expect(token).toBeNull();
        });
    });
    describe('Testing signIn function', async () => {
        // Successful signIn
        it('Should return token', async () => {
            const username = 'admin';
            const password = 'admin';
            const token = await admins.signIn(username, password);
            expect(token).toBeTruthy();
        });

        // Unsuccessful signIn [wrong password]
        it('Should return null [wrong password]', async () => {
            const username = 'admin';
            const password = 'WRONG PASSWORD';
            const token = await admins.signIn(username, password);
            expect(token).toBeNull();
        });
    });
});
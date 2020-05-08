import { User } from "src/models/User";

export class EmailService {
    sendEmail(user: User) {
        console.log('Simulating email service', user.email);
    }
}
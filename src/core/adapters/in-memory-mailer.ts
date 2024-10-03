import { Email, Imailer } from "../ports/mailer.interface";

export class InMemoryMailer implements Imailer {
    public readonly sentEmails: Email[] = [];

    async send(email: Email): Promise<void> {
        this.sentEmails.push(email);
    }
}

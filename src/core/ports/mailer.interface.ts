export type Email = {
    from: string;
    to: string;
    subject: string;
    body: string;
};

export interface Imailer {
    send(email: Email): Promise<void>;
}

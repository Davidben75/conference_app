export class ConferenceUpdateForbiddenException extends Error {
    constructor() {
        super("You're not allowed to update this conference");
    }
}

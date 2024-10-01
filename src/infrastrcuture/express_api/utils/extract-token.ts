export function extractToken(header: string): string | null {
    // Basic <token>
    const [prefix, token] = header.split(" ");
    if (prefix !== "Basic") {
        return null;
    }
    return token;
}

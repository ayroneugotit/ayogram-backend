export class AppError extends Error {
    public readonly source?: string;

    public constructor(options: { message: string; source?: string }) {
        super(options.message);

        this.name = new.target.name;
        this.source = options.source;
    }
}

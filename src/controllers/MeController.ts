import { eq } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { HttpResponse, ProtectedHttpRequest } from "../types/Http";
import { ok } from "../utils/http";

export class MeController {
    static async handler({ userId }: ProtectedHttpRequest): Promise<HttpResponse> {
        const user = await db.query.usersTable.findFirst({
            columns: {
                id: true,
                email: true,
                name: true,
                calories: true,
                proteins: true,
                carbohydrates: true,
                fats: true,
            },
        });
        return ok({ user });
    }
}
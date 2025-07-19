import { z } from "zod";
import { HttpRequest, HttpResponse } from "../types/Http";
import { badRequest, created, ok, unauthorized } from "../utils/http";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { signAccessTokenFor } from "../lib/jwt";


const schema = z.object({
    email: z.email(),
    password: z.string().min(8),
});

export class SignInControllers {
    static async handler({body}: HttpRequest): Promise<HttpResponse> {
        const { success, error, data } = schema.safeParse(body);

        if (!success) {
            return badRequest({error: error.issues});
        }

        const user = await db.query.usersTable.findFirst({
            columns: {
                id: true,
                email: true,
                password: true,
            },
            where: eq(usersTable.email, data.email),
        });

        if (!user) {
            return unauthorized({
                error: "Email ou senha incorretos",
            });
        }

        const isPasswordValid = await compare(data.password, user.password);

        if (!isPasswordValid) {
            return unauthorized({
                error: "Email ou senha incorretos",
            });
        }

        const accessToken = signAccessTokenFor(user.id);

        return ok({accessToken});
    }
}
import { z } from "zod";
import { hash } from "bcryptjs";
import { HttpRequest, HttpResponse } from "../types/Http";
import { created, badRequest, conflict } from "../utils/http";
import { eq } from "drizzle-orm";
import { usersTable } from "../db/schema";
import { db } from "../db";

const schema = z.object({
    goal: z.enum(["lose", "maintain", "gain"]),
    gender: z.enum(["male", "female"]),
    birthDate: z.string(),
    height: z.number(),
    weight: z.number(),
    activityLevel: z.number().min(1).max(5),
    account: z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(8),
    }),
});

export class SignUpController {
    static async handler({body}: HttpRequest): Promise<HttpResponse> {
        const { success, error, data } = schema.safeParse(body);

        if (!success) {
            return badRequest({error: error.issues});
        }

        const userAlreadyExists = await db.query.usersTable.findFirst({
            columns: {
                email: true,
            },
            where: eq(usersTable.email, data.account.email),
        });

        if (userAlreadyExists) {
            return conflict({
                error: "Esse usuario ja existe",
            });
        }

        const { account, ...rest } = data;

        const hashedPassword = await hash(account.password, 8);

        const user = await db
         .insert(usersTable)
         .values({
            ...rest,
            ...account,
            password: hashedPassword,
            calories: 0,
            proteins: 0,
            carbohydrates: 0,
            fats: 0,
        })
        .returning({
            id: usersTable.id,
        });

        return created({
            userId: user[0].id,
        });
    }
}
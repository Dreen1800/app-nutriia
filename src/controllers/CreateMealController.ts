import { eq } from "drizzle-orm";
import { db } from "../db";
import { mealsTable, usersTable } from "../db/schema";
import { HttpResponse, ProtectedHttpRequest } from "../types/Http";
import { badRequest, created, ok } from "../utils/http";
import { z } from "zod";

const schema = z.object({
    fileType: z.enum(['audio/m4a', 'image/jpeg']),
});
 
export class CreateMealController {
    static async handler({ userId, body }: ProtectedHttpRequest): Promise<HttpResponse> {
        const result = schema.safeParse(body);

        if (!result.success) {
            return badRequest({ error: result.error.issues });
        }

        const { data } = result;

        const [meal] = await db
        .insert(mealsTable)
        .values({
            userId,
            inputFileKey: 'input_file_key',
            inputType: data.fileType === 'audio/m4a' ? 'audio' : 'picture',
            icon: '',
            stats: 'uploading',
            name: '',
            foods: [],
        })
        .returning({ id: mealsTable.id });

        return created({ id: meal.id });
    }
}
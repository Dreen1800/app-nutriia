import { eq } from 'drizzle-orm';
import { db } from '../db';
import { mealsTable } from '../db/schema';
import { HttpResponse, ProtectedHttpRequest } from '../types/Http';
import { ok } from '../utils/http';

export class ListMealsController {
  static async handler({ userId }: ProtectedHttpRequest): Promise<HttpResponse> {
    const meals = await db.query.mealsTable.findMany({
      columns: {
        id: true,
        foods: true,
        createdAt: true,
        icon: true,
        name: true,
        stats: true,
      },
      where: eq(mealsTable.userId, userId),
      orderBy: (meals, { desc }) => [desc(meals.createdAt)],
    });

    return ok({ meals });
  }
}
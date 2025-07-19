import { APIGatewayProxyEventV2 } from "aws-lambda";
import { parseProtectedEvent } from "../utils/parseProtectedEvent";
import { parseResponse } from "../utils/parse.Response";
import { unauthorized } from "../utils/http";
import { ListMealsController } from "../controllers/ListMealsController";

export async function handler(event: APIGatewayProxyEventV2) {
    try {
        const request = parseProtectedEvent(event);
        const response = await ListMealsController.handler(request);
        return parseResponse(response);
    } catch (error) {
        console.error('Error in listMeals handler:', error);
        return parseResponse(
            unauthorized({error: "Invalid Access Token"})
        );
    }
}
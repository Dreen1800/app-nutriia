import { APIGatewayProxyEventV2 } from "aws-lambda";
import { parseProtectedEvent } from "../utils/parseProtectedEvent";
import { parseResponse } from "../utils/parse.Response";
import { unauthorized } from "../utils/http";
import { CreateMealController } from "../controllers/CreateMealController";

export async function handler(event: APIGatewayProxyEventV2) {
    try {
        const request = parseProtectedEvent(event);
        const response = await CreateMealController.handler(request);
        return parseResponse(response);
    } catch {
        return parseResponse(
            unauthorized({error: "Invlaid Access Token"})
        );
    }
}
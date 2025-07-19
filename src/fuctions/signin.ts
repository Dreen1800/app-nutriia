import { APIGatewayProxyEventV2 } from "aws-lambda";
import { SignInControllers } from "../controllers/SignInControllers";
import { parseEvent } from "../utils/parseEvent";
import { parseResponse } from "../utils/parse.Response";

export async function handler(event: APIGatewayProxyEventV2) {
  const request = parseEvent(event);
  const response = await SignInControllers.handler(request);
  return parseResponse(response);
}
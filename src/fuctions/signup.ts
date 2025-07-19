import { APIGatewayProxyEventV2 } from "aws-lambda";
import { SignUpController } from "../controllers/SignUpController";
import { parseEvent } from "../utils/parseEvent";
import { parseResponse } from "../utils/parse.Response";

export async function handler(event: APIGatewayProxyEventV2) {
  const request = parseEvent(event);
  const response = await SignUpController.handler(request);
  return parseResponse(response);
}
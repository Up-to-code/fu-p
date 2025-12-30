import { auth } from "@/lib/auth/config";
import { toNextJsHandler } from "better-auth/next-js";
import { initDB } from "@/lib/auth/config";

const handler = toNextJsHandler(auth);

async function handleRequest(
  req: Request,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
) {
  // Ensure database is connected before handling request
  await initDB();
  
  // Handle the request based on method
  if (method === "GET") {
    return handler.GET(req);
  } else if (method === "POST") {
    return handler.POST(req);
  } else if (method === "PUT") {
    return handler.PUT?.(req) || new Response("Method not allowed", { status: 405 });
  } else if (method === "DELETE") {
    return handler.DELETE?.(req) || new Response("Method not allowed", { status: 405 });
  } else if (method === "PATCH") {
    return handler.PATCH?.(req) || new Response("Method not allowed", { status: 405 });
  }
  
  return new Response("Method not allowed", { status: 405 });
}

export async function GET(req: Request) {
  return handleRequest(req, "GET");
}

export async function POST(req: Request) {
  return handleRequest(req, "POST");
}

export async function PUT(req: Request) {
  return handleRequest(req, "PUT");
}

export async function DELETE(req: Request) {
  return handleRequest(req, "DELETE");
}

export async function PATCH(req: Request) {
  return handleRequest(req, "PATCH");
}



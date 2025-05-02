import { createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import type { NextRequest } from "next/server";

type Content = {
  fullPath: string;
  contentType: "markdown" | "html";
  content: string;
};

export async function POST(req: NextRequest) {
  const ctx = await createTRPCContext({ headers: req.headers });
  const caller = createCaller(ctx);

  try {
    const body = (await req.json()) as Content[];
    await caller.content.create(body);
    return Response.json({});
  } catch (error) {
    console.error(error);
    if (error instanceof TRPCError) {
      return new Response(JSON.stringify(error), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}

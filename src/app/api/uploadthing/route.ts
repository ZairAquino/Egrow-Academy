import { createRouteHandler } from "uploadthing/next";
import { uploadRouter } from "@/lib/uploadthing-server";

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
}); 
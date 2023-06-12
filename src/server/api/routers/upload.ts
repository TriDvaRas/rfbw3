import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { S3 } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { env } from "../../../env.mjs";
import { TRPCError } from "@trpc/server";
import { uuid } from "uuidv4";

const s3 = new S3({
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  }
});

export const uploadRouter = createTRPCRouter({
  createPresignedPost: protectedProcedure.input(z.object({
    fileName: z.string(),
    mimeType: z.string(),
  })).mutation(async ({ ctx, input }) => {
    const _uuid = uuid();
    const Key = `rfbw/${ctx.session.user.name}/${_uuid}-${input.fileName}`;
    try {
      const { fields, url } = await createPresignedPost(s3, {
        Bucket: env.S3_BUCKET,
        Key,
        Conditions: [
          ['content-length-range', 0, 16 * 1024 * 1024], // max size 16MB, adjust as needed
          ['eq', '$Content-Type', input.mimeType],
          ['starts-with', '$key', 'rfbw/'],
          { acl: 'public-read' },
          // { bucket: env.S3_BUCKET }
        ],
        Expires: 60, // link expiration time in seconds
      });
      
      return { url, fields, Key }
    } catch (err) {
      console.log(err);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Error creating pre-signed URL' });
    }
  }),

});

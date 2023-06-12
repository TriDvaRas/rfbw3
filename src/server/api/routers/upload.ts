import { S3 } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { TRPCError } from "@trpc/server";
import { uuid } from "uuidv4";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure
} from "~/server/api/trpc";
import { env } from "../../../env.mjs";
import { prisma } from "../../db";

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
      prisma.image.create({
        data: {
          addedById: ctx.session.user.id,
          url: `https://${env.S3_BUCKET}.s3.${env.S3_REGION}.amazonaws.com/${Key}`,
        }
      });
      return { url, fields, Key }
    } catch (err) {
      console.log(err);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Error creating pre-signed URL' });
    }
  }),
  setUploadStatus: protectedProcedure.input(z.object({
    url: z.string().url(),
    status: z.enum(['UPLOADED', 'FAILED']),
  })).mutation(async ({ ctx, input }) => {
    return await prisma.image.updateMany({
      where: {
        url: input.url,
        addedById: ctx.session.user.id,
      },
      data: {
        uploadStatus: input.status,
      }
    });
  }),

});

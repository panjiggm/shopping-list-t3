import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { client } from "@/pages/api/s3-upload";

export const deletImageS3 = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });

  try {
    await client.send(command);
  } catch (err) {
    console.error(err);
  }
};

export const imageRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.image.findMany({
        where: {
          productId: input.productId,
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        images: z.array(
          z.object({
            productId: z.string(),
            imgUrl: z.string(),
            fileName: z.string(),
            s3Key: z.string(),
          })
        ),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.image.createMany({
        data: input.images,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string(), key: z.string() }))
    .mutation(({ ctx, input }) => {
      deletImageS3(input.key);

      return ctx.prisma.image.delete({
        where: {
          id: input.id,
        },
      });
    }),
});

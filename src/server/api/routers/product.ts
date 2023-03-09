import { client } from "@/pages/api/s3-upload";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const deleteObjectsS3 = async (keys: any) => {
  const command = new DeleteObjectsCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Delete: {
      Objects: keys,
    },
  });
  try {
    await client.send(command);
  } catch (err) {
    console.error("Err delete objects", err);
  }
};

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.product.findMany();
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number(),
        checked: z.boolean(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.product.create({
        data: {
          name: input.name,
          price: input.price,
          checked: false,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string(), keys: z.array(z.any()) }))
    .mutation(({ ctx, input }) => {
      deleteObjectsS3(input.keys);

      return ctx.prisma.product.delete({
        where: {
          id: input.id,
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.product.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          price: input.price,
        },
      });
    }),

  toggleCheck: publicProcedure
    .input(
      z.object({
        id: z.string(),
        checked: z.boolean(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.product.update({
        where: {
          id: input.id,
        },
        data: {
          checked: input.checked,
        },
      });
    }),

  createPresignedUrls: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx }) => {
      return ctx.prisma.product.create;
    }),
});

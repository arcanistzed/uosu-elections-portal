import { z } from "zod";
import { env } from "~/env";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const accessKeyRouter = createTRPCRouter({
	getByEmail: publicProcedure
		.input(
			z.object({
				email: z.string().email(),
			}),
		)
		.query(({ input, ctx }) => {
			const { email } = input;
			return ctx.db.accessKey.findFirst({
				where: {
					email,
				},
			});
		}),

	uploadList: publicProcedure
		.input(
			z.object({
				password: z.string(),
				list: z.array(
					z.object({
						key: z
							.string()
							.regex(
								/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/,
							),
						email: z.string().email(),
					}),
				),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (input.password !== env.ADMIN_PASSWORD) {
				throw new Error("Mot de passe invalide. Invalid password.");
			}
			await ctx.db.accessKey.deleteMany({});
			return ctx.db.accessKey.createMany({
				data: input.list,
			});
		}),

	verifyPassword: publicProcedure
		.input(
			z.object({
				password: z.string(),
			}),
		)
		.query(({ input }) => {
			const { password } = input;
			return password === env.ADMIN_PASSWORD;
		}),
});

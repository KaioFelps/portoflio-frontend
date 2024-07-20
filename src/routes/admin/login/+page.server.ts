import type { Actions } from "./$types";
import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import { z } from "zod";

const LoginSchema = z.object({
	email: z.string().email({ message: "E-mail inválido." }),
	password: z.string().min(1, { message: "Senha é um campo obrigatório." }),
});

export type LoginResponse = {
	success: { accessToken: string } | null;
	errors: string[] | z.inferFormattedError<typeof LoginSchema> | null;
};

export const actions: Actions = {
	login: async ({ request, fetch, cookies, locals }) => {
		const parsedData = LoginSchema.safeParse(Object.fromEntries(await request.formData()));

		if (!parsedData.success) {
			return fail(400, { success: null, errors: parsedData.error.flatten().fieldErrors });
		}

		const data = JSON.stringify(parsedData.data);

		const response = await fetch(`${env.BACKEND_URL}/auth/login`, {
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			method: "post",
			body: data,
			credentials: "include",
		});

		if (response.ok) {
			const data = await response.json();

			cookies.set("refresh_token", response.headers.getSetCookie()[0].split("=")[1], {
				path: "/",
			});

			locals.accessToken = data.accessToken;
			locals.user = data.user;

			return { success: data, errors: null } satisfies LoginResponse;
		}

		if (response.status === 400) {
			const data = await response.json();
			return fail(400, { success: null, errors: data.message });
		}

		if (response.status === 401) {
			return fail(401, { success: null, errors: ["Credenciais inválidas."] });
		}

		return fail(500, { success: null, errors: ["Alguma coisa deu errada..."] });
	},
};
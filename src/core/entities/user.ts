import type { UserRoleEnum } from "./userRoleEnum";

export type User = {
	id: string;
	name: string;
	email: string;
	role: UserRoleEnum;
	createdAt: Date;
};

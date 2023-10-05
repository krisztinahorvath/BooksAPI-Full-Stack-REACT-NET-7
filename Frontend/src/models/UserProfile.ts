import { User } from "./User";

export interface UserProfile{
    id?: number;
    bio?: string;
    location?: string;
    birthday: Date;
    gender?: string;
    maritalStatus?: string;
}
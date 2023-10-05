import { Author } from "./Author";
import { Book } from "./Book";
import { Genre } from "./Genre";
import { UserProfile } from "./UserProfile";

export enum Role {
    Unconfirmed = 0,
    Regular = 1,
    Moderator = 2,
    Admin = 3,
  }
  
  export interface User {
    id?: number;
    name?: string;
    password?: string;
    bookList?: Book[];
    genreList?: Genre[];
    authorList?: Author[];
    userProfile?: UserProfile;
    role?: Role;
  }
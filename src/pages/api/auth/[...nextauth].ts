// src/pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import { authOptions } from "../../../modules/auth/auth-options";

export default NextAuth(authOptions);

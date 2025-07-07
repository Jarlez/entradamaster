import { z, type TypeOf } from "zod";

export const createUserSchema = z
  .object({
    name: z
      .string({ required_error: "Name is required" })
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters"),

    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),

    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be at most 32 characters")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d).+$/,
        "Password must contain both letters and numbers"
      ),

    cPassword: z
      .string({ required_error: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.cPassword, {
    path: ["cPassword"],
    message: "Passwords do not match",
  });

export type CreateUserInput = TypeOf<typeof createUserSchema>;

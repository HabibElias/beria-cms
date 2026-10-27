import z from "zod";

const MemberSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(3, { message: "Name must contain at least 3 character(s)" }),
  phone: z
    .string({ message: "Phone is required" })
    .min(10, { message: "Phone must contain at least 10 character(s)" }),
  email: z.string({ message: "Email is required" }).email(),
  role: z.enum(["admin", "librarian", "user"]).optional(),
});

export type MemberFormData = z.infer<typeof MemberSchema>;

export const CreateMemberSchema = MemberSchema.extend({
  password: z
    .string()
    .min(12, "Use at least 12 characters.")
    .max(72, "Use at most 72 characters.")
    .refine(
      (value) => new TextEncoder().encode(value).length <= 72,
      "Password is too long. Please use a shorter password.",
    ),
  password_confirmation: z.string(),
}).refine((values) => values.password === values.password_confirmation, {
  message: "Passwords don’t match.",
  path: ["password_confirmation"],
});

export type CreateMemberFormData = z.infer<typeof CreateMemberSchema>;

export default MemberSchema;

import { z } from "zod";

export const usernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscore and hyphen"
    ), // This is username schema. min 3 characters and max 20. regex means it should only contain letters, numbers and _
});
export const eventSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be 500 characters or less"),
  duration: z.number().int().positive("Duration must be a positive number"),

  isPrivate: z.boolean(),
});

export const daySchema = z.object({
  isAvailable: z.boolean(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
}).refine((data) => {
  if (data.isAvailable) {
    return data.startTime < data.endTime;
  }
  return true;
}, // The end time should be higher than the start time for availability. So, we are doing this check
    {
      message: "End time must be more than start time",
      path: ["endTime"],
})

export const availabilitySchema = z.object({
  monday: daySchema,// We need to add the above day schema to all the day
  tuesday: daySchema,
  wednesday: daySchema,
  thursday: daySchema,
  friday: daySchema,
  saturday: daySchema,
  sunday: daySchema,
  timeGap: z.number().min(0, "Time gap must be 0 or more minutes").int(),
});

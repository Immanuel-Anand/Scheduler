"use server"
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getUserAvailability() {
     const { userId } = await auth()
    if (!userId) {
        throw new Error("Unauthorized")
    }
    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include: {
            availability: {
                include: {days: true},
            }
        }
    })
    if (!user || !user.availability) {
        return null
    }
    const availabilityData = {
        timeGap: user.availability.timeGap
    };

    [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ].forEach((day) => {
    const dayAvailability =  user.availability.days.find((d) => d.day === day.upperCase())
      availabilityData[day] = {
          isAvailable: !!dayAvailability, // If I put !! in front, it will be converted into true or false
          startTime: dayAvailability?dayAvailability.startTime.toISOString().slice(11,16): "09:00",
          //   new Date().toISOString() = result is '2025-02-06T00:53:45.095Z'. We want only the time. We are slicing it from 11 to 16. 
         endTime: dayAvailability?dayAvailability.endTime.toISOString().slice(11,16): "09:00",
      }
  })
    return availabilityData
}
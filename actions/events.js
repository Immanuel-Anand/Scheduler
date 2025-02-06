"use server"
import { db } from "@/lib/prisma";
import { eventSchema } from "@/lib/validators";
import { auth } from "@clerk/nextjs/server";

export async function createEvent(data) {
    const { userId } = await auth()
    if (!userId) {
        throw new Error("Unauthorized")
    }
    // This is to validate our data against the eventSchema
    const validatedData = eventSchema.parse(data)
    const user = await db.user.findUnique({
        where: {clerkUserId: userId}
    })
    if (!user) {
    throw new Error("User is not found")
    }
    const event = await db.event.create({
        data: {
            ...validatedData,
            userId: user.id, // This is not the clerkid, this is the unique id stored inside our neon db
        }
    })
    return event
}

export async function getUserEvents() {
    const { userId } = await auth()
    if (!userId) {
        throw new Error("Unauthorized")
    }
    const user = await db.user.findUnique({
        where: {clerkUserId: userId}
    })
    if (!user) {
        throw new Error("User not found")
    }
    const events = await db.event.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
            _count: { // This will give the count of the bookings
                select: {bookings: true}, 
            }
        }
        
    })
    return {events, username: user.username} // We have the copy feature, when we copy it shoudl give us the username for the url
}

export async function deleteEvent(eventId) {
    const { userId } = await auth()
    if (!userId) {
        throw new Error("Unauthorized")
    }
    const user = await db.user.findUnique({
        where: {clerkUserId: userId}
    })
    if (!user) {
        throw new Error("User not found")
    }
    const event = await db.event.findUnique({
        where: { id: eventId },
    })
    // If the event not exist or the event doesn't belong to the loggedIn userId
    if (!event || event.userId !== user.id) {
        throw new Error("Event not found or unauthorized")
    }
    await db.event.delete({
        where: {id: eventId}
    })
    return {success: true} // We have the copy feature, when we copy it shoudl give us the username for the url
}
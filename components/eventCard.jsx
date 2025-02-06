'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "./ui/button"
import { Link, Trash2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import useFetch from "@/hooks/use-fetch"
import { deleteEvent } from "@/actions/events"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// isPublic is true, we will show it on our profile, else we won't
const EventCard = ({ event, username, isPublic = false }) => {
    const [isCopied, setIsCopied] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
     const { toast } = useToast()

    const handleCopy = async() => {
try {
    await navigator.clipboard.writeText(`${window.location.origin}/${username}/${event.id}`)
    setIsCopied(true)
 toast({
          title: "Copied!",
     description: "Event is copied successfully!.",
     className: "text-left",
          position: "top-right" 
        })
    setTimeout(() => setIsCopied(false), 2000) // After 2 secs, it will set it to false
} catch (error) {
    console.log("Failed to copy: ", error)
}
    }

    const handleDelete = async () => {
        try {
            setLoading(true)
            const delEvent = await deleteEvent(event.id)
            if (delEvent.success) {                
                toast({
              title: "Deleted",
         description: "Event is deleted successfully!.",
         className: "text-left",
              position: "top-right" 
            })
            }
            setLoading(false)
            router.refresh()

        } catch (error) {
            console.log(error)
               setLoading(false)
        }   setLoading(false)
    }



    return (
      
<Dialog>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Event</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this event?
          </DialogDescription>
        </DialogHeader>
        
                <DialogFooter className="sm:justify-start flex">
                      <Button onClick={handleDelete}>
              Yes
            </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
  



    <Card className="flex flex-col justify-between cursor-pointer">
  <CardHeader>
    <CardTitle className="text-2xl">{event.title}</CardTitle>
              <CardDescription className="flex justify-between">
                  <span>
                      
                  {event.duration} mins | {event.isPrivate ? "Private" : "Public"}
                  </span>
                  <span>{event._count.bookings} Bookings</span>
                  </CardDescription>
  </CardHeader>
          <CardContent>
               {/* This will show the description until the first . */}
              <p>{event.description.substring(0, event.description.indexOf("."))}</p>
  </CardContent>
  <CardFooter className="flex gap-2">
              <Button variant="outline" className="flex items-center" onClick={handleCopy}><Link className="mr-2 h-4 w-4" /> {isCopied ? "Copied!" : "Copy Link"}</Button>
                 
                  <DialogTrigger asChild>                    
    <Button variant="destructive" disabled= {loading}><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
                  </DialogTrigger>
                
  </CardFooter>
</Card>
  </Dialog>
  )
}

export default EventCard
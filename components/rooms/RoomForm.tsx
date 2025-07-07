"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useRooms } from "@/hooks/useRooms"
import { Loader2 } from "lucide-react"
import type { Room } from "@/lib/models/Room"

const roomSchema = z.object({
  number: z.string().min(1, "Room number is required"),
  floor: z.number().min(1, "Floor must be at least 1"),
  type: z.enum(["standard", "deluxe", "suite"]),
  price: z.number().min(0, "Price must be positive"),
  amenities: z.array(z.string()).min(1, "At least one amenity is required"),
})

type RoomFormData = z.infer<typeof roomSchema>

const availableAmenities = [
  "WiFi",
  "TV",
  "AC",
  "Minibar",
  "Balcony",
  "Jacuzzi",
  "Room Service",
  "Safe",
  "Hair Dryer",
  "Coffee Maker",
]

interface RoomFormProps {
  room?: Room
  onSuccess: () => void
  isEditing?: boolean
}

export function RoomForm({ room, onSuccess, isEditing = false }: RoomFormProps) {
  const { createRoom, updateRoom } = useRooms()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      number: room?.number || "",
      floor: room?.floor || 1,
      type: room?.type || "standard",
      price: room?.price || 0,
      amenities: room?.amenities || [],
    },
  })

  const onSubmit = async (data: RoomFormData) => {
    try {
      setIsSubmitting(true)

      if (isEditing && room?._id) {
        await updateRoom(room._id.toString(), data)
      } else {
        await createRoom(data)
      }

      onSuccess()
    } catch (error) {
      console.error("Error saving room:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Number</FormLabel>
                <FormControl>
                  <Input placeholder="101" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="floor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Floor</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1"
                    {...field}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per Night ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="99.99"
                    {...field}
                    onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="amenities"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Amenities</FormLabel>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableAmenities.map((amenity) => (
                  <FormField
                    key={amenity}
                    control={form.control}
                    name="amenities"
                    render={({ field }) => {
                      return (
                        <FormItem key={amenity} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(amenity)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, amenity])
                                  : field.onChange(field.value?.filter((value) => value !== amenity))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">{amenity}</FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isSubmitting} className="bg-[#1B2A41] hover:bg-[#1B2A41]/90">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Room" : "Create Room"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

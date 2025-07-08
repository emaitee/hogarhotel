import mongoose, { Schema, type Document } from "mongoose"

export interface IRoom extends Document {
  name: string
  description: string
  images: string[]
  price: number
  amenities: string[]
  lastCleaned: Date | null
}

const RoomSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: true },
  price: { type: Number, required: true },
  amenities: { type: [String], required: true },
  lastCleaned: {
    type: Date,
    default: null,
  },
})

export default mongoose.model<IRoom>("Room", RoomSchema)

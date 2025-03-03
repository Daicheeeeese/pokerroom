import { type Room as PrismaRoom, type Review } from "@prisma/client"
import RoomCard from "./RoomCard"

type RoomWithReviews = PrismaRoom & {
  reviews: Review[]
}

type Props = {
  rooms: RoomWithReviews[]
}

export default function RoomList({ rooms }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  )
} 
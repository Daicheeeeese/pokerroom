import { ReservationStatus } from '@prisma/client'
import { User } from './user'
import { Room } from './room'

export interface Reservation {
  id: string
  userId: string
  roomId: string
  date: Date
  startTime: string
  endTime: string
  totalPrice: number
  status: ReservationStatus
  request?: string
  createdAt: Date
  updatedAt: Date
  user?: User
  room?: Room
} 
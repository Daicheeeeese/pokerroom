import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { PrismaClient } from "@prisma/client"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay(); // 0: 日曜日, 1: 月曜日, ..., 6: 土曜日
  return day === 0 || day === 6; // 日曜日または土曜日の場合true
};

export const getHourlyPrice = async (roomId: string, date: Date, prisma: PrismaClient) => {
  const isHoliday = isWeekend(date);
  
  if (isHoliday) {
    // 土日の料金を取得
    return prisma.hourlyPriceHoliday.findMany({
      where: {
        roomId: roomId,
      },
    });
  } else {
    // 平日の場合はroomsテーブルのpricePerHourを取得
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
      select: {
        pricePerHour: true,
      },
    });
    
    if (!room) {
      throw new Error('Room not found');
    }

    // 平日の料金を返す（開始時間と終了時間は24時間表記で返す）
    return [{
      startTime: '00:00',
      endTime: '24:00',
      pricePerHour: room.pricePerHour,
    }];
  }
}; 
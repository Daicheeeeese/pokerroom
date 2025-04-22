import { useState } from 'react';
import type { Prisma } from '@prisma/client';

type RoomWithDetails = {
  id: string;
  options: {
    id: string;
    option: {
      name: string;
      description: string | null;
      price: number | null;
      unit: 'per_hour' | 'per_halfHour' | 'per_hour_person';
    };
  }[];
};

interface Props {
  room: RoomWithDetails;
}

export function ReservationRequestForm({ room }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // 予約リクエストの処理を実装
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ... existing form fields ... */}

        {room.options.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">オプション</h3>
            <div className="space-y-4">
              {room.options.map((roomOption) => {
                console.log('roomOption:', roomOption);
                console.log('roomOption.option:', roomOption.option);
                console.log('roomOption.option.price:', roomOption.option?.price);

                return (
                  <div key={roomOption.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{roomOption.option.name}</h4>
                        {roomOption.option.description && (
                          <p className="mt-1 text-sm text-gray-500">{roomOption.option.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600">
                          {roomOption.option && typeof roomOption.option.price === 'number'
                            ? roomOption.option.price.toLocaleString()
                            : '金額未定'}円
                          {roomOption.option?.unit === 'per_hour' && '/時間'}
                          {roomOption.option?.unit === 'per_halfHour' && '/30分'}
                          {roomOption.option?.unit === 'per_hour_person' && '/時間/人'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? '送信中...' : '予約リクエストを送信'}
        </button>
      </form>
    </div>
  );
} 
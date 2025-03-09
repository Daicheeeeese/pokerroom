import { format } from "date-fns"
import { ja } from "date-fns/locale"
import Image from "next/image"

type Review = {
  id: number
  userName: string
  userImage: string
  rating: number
  comment: string
  date: string
  location: string
}

type ReviewSectionProps = {
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

export function ReviewSection({ reviews, averageRating, totalReviews }: ReviewSectionProps) {
  return (
    <section className="py-12">
      <div className="flex items-center gap-2 mb-8">
        <span className="text-xl">★</span>
        <h2 className="text-2xl font-semibold">
          {averageRating.toFixed(1)} · {totalReviews}件の口コミ
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviews.map((review) => (
          <div key={review.id} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12">
                <Image
                  src={review.userImage}
                  alt={review.userName}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold">{review.userName}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <p>{review.location}</p>
                  <span>·</span>
                  <p>{format(new Date(review.date), "yyyy年M月", { locale: ja })}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span>{review.rating.toFixed(1)}</span>
            </div>
            <p className="text-gray-600 whitespace-pre-line">{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  )
} 
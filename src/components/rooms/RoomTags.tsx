import { Tag } from '@prisma/client'

interface RoomTagsProps {
  tags: Tag[]
}

export const RoomTags = ({ tags = [] }: RoomTagsProps) => {
  if (!tags || tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          {tag.name}
        </span>
      ))}
    </div>
  )
} 
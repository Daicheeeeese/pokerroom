type AvailabilityType = '○' | '△' | '×'

type AvailabilityStatusProps = {
  status: AvailabilityType
  time: string
}

const statusColors = {
  '○': 'text-green-600',
  '△': 'text-yellow-600',
  '×': 'text-red-600',
}

export default function AvailabilityStatus({ status, time }: AvailabilityStatusProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">{time}</span>
      <span className={`text-lg font-bold ${statusColors[status]}`}>{status}</span>
    </div>
  )
}

export type { AvailabilityType } 
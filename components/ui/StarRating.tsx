import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
    rating: number // 0 to 5
    maxRating?: number
    size?: number
    interactive?: boolean
    onRatingChange?: (rating: number) => void
    className?: string
}

export function StarRating({
    rating,
    maxRating = 5,
    size = 20,
    interactive = false,
    onRatingChange,
    className
}: StarRatingProps) {
    return (
        <div className={cn("flex items-center space-x-0.5", className)}>
            {[...Array(maxRating)].map((_, i) => {
                const starValue = i + 1
                const isFilled = starValue <= rating

                return (
                    <button
                        key={i}
                        type={interactive ? "button" : "button"} // Always button for accessibility, but disabled if not interactive
                        disabled={!interactive}
                        onClick={() => interactive && onRatingChange?.(starValue)}
                        className={cn(
                            "focus:outline-none transition-colors",
                            interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
                        )}
                    >
                        <Star
                            size={size}
                            className={cn(
                                "transition-all",
                                isFilled
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-gray-100 text-gray-300"
                            )}
                        />
                    </button>
                )
            })}
        </div>
    )
}

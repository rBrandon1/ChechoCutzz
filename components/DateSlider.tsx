"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";

interface DateSliderProps {
  selectedDate: DateTime;
  onDateSelect: (date: DateTime) => void;
  availableDates: DateTime[];
}

export default function DateSlider({
  selectedDate,
  onDateSelect,
  availableDates,
}: DateSliderProps) {
  const [dates, setDates] = useState<DateTime[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate next 14 days
    const newDates = Array.from({ length: 14 }, (_, i) =>
      DateTime.now().plus({ days: i }).startOf("day")
    );
    setDates(newDates);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const isDateAvailable = (date: DateTime) => {
    return availableDates.some((availableDate) =>
      availableDate.hasSame(date, "day")
    );
  };

  const isPastDate = (date: DateTime) => {
    return date < DateTime.now().startOf("day");
  };

  return (
    <div className="relative w-full">
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
        onClick={() => scroll("left")}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>

      <div
        ref={sliderRef}
        className="flex overflow-x-auto gap-2 py-4 px-8 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {dates.map((date) => {
          const isSelected = date.hasSame(selectedDate, "day");
          const isAvailable = isDateAvailable(date);
          const isToday = date.hasSame(DateTime.now(), "day");
          const isPast = isPastDate(date);

          return (
            <button
              key={date.toISO()}
              onClick={() => onDateSelect(date)}
              className={`flex-shrink-0 w-20 p-3 rounded-lg snap-start transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : isPast
                  ? "bg-muted/50 cursor-not-allowed opacity-50"
                  : isAvailable
                  ? "glass-effect hover:bg-primary/10"
                  : "glass-effect hover:bg-primary/10"
              }`}
              disabled={isPast}
            >
              <div className="text-sm font-medium">
                {date.toFormat("ccc")}
              </div>
              <div className="text-2xl font-bold">{date.toFormat("d")}</div>
              <div className="text-xs">
                {isToday ? "Today" : date.toFormat("LLL")}
              </div>
              {!isPast && !isAvailable && (
                <div className="text-[10px] text-muted-foreground mt-1">
                  No slots
                </div>
              )}
            </button>
          );
        })}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
        onClick={() => scroll("right")}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

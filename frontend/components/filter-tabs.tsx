"use client"

import { Button } from "@/components/ui/button"

interface FilterTabsProps {
  currentFilter: "all" | "upcoming" | "ended"
  onFilterChange: (filter: "all" | "upcoming" | "ended") => void
}

export function FilterTabs({ currentFilter, onFilterChange }: FilterTabsProps) {
  const filters = [
    { key: "all" as const, label: "Tất cả sự kiện" },
    { key: "upcoming" as const, label: "Sắp diễn ra" },
    { key: "ended" as const, label: "Đã kết thúc" },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.key}
          variant={currentFilter === filter.key ? "default" : "outline"}
          onClick={() => onFilterChange(filter.key)}
          className="transition-all duration-200"
        >
          {filter.label}
        </Button>
      ))}
    </div>
  )
}

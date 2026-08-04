import React from "react"
import {
  Table,
  TableContent,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardContent,
  Button,
} from "@heroui/react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DataTableProps<T> {
  columns: {
    header: string
    accessorKey?: keyof T | string
    cell?: (item: T) => React.ReactNode
    className?: string
  }[]
  data: T[]
  emptyText?: string
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  emptyText = "No items match your criteria.",
  currentPage,
  totalPages,
  onPageChange,
}: DataTableProps<T>) {
  return (
    <Card className="border border-divider bg-content1 shadow-xs rounded-2xl overflow-hidden">
      <CardContent className="p-0 overflow-hidden">
        <Table>
          <TableContent aria-label="Data table">
            <TableHeader>
              {columns.map((col, idx) => (
                <TableColumn key={String(col.accessorKey || idx)} className={col.className}>
                  {col.header}
                </TableColumn>
              ))}
            </TableHeader>
            <TableBody items={data}>
              {(item: any) => (
                <TableRow key={String(item.id || item.name || Math.random())}>
                  {columns.map((col, colIdx) => (
                    <TableCell key={colIdx} className={col.className}>
                      {col.cell ? col.cell(item) : String((item as any)[col.accessorKey as string] || "")}
                    </TableCell>
                  ))}
                </TableRow>
              )}
            </TableBody>
          </TableContent>
        </Table>

        {totalPages !== undefined && totalPages > 1 && onPageChange && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-divider text-xs text-default-400">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                isIconOnly
                isDisabled={currentPage === 1}
                onPress={() => onPageChange(Math.max(1, (currentPage || 1) - 1))}
              >
                <ChevronLeft className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                isIconOnly
                isDisabled={currentPage === totalPages}
                onPress={() => onPageChange(Math.min(totalPages, (currentPage || 1) + 1))}
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

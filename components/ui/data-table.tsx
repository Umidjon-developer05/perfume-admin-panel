'use client'

import type React from 'react'

import { useState } from 'react'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'

interface DataTableProps<T> {
	data: T[]
	columns: {
		header: string
		accessorKey: string
		cell?: (item: T) => React.ReactNode
	}[]
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
	}
	onPageChange: (page: number) => void
	onLimitChange: (limit: number) => void
	onSearch: (search: string) => void
	searchPlaceholder?: string
	filters?: {
		name: string
		options: { label: string; value: string }[]
		value: string
		onChange: (value: string) => void
	}[]
}

export function DataTable<T>({
	data,
	columns,
	pagination,
	onPageChange,
	onLimitChange,
	onSearch,
	searchPlaceholder = 'Search...',
	filters = [],
}: DataTableProps<T>) {
	const [searchValue, setSearchValue] = useState('')

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		onSearch(searchValue)
	}

	return (
		<div className='space-y-4'>
			<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
				<form
					onSubmit={handleSearch}
					className='flex w-full max-w-sm items-center space-x-2'
				>
					<Input
						type='search'
						placeholder={searchPlaceholder}
						value={searchValue}
						onChange={e => setSearchValue(e.target.value)}
					/>
					<Button type='submit' size='icon'>
						<Search className='h-4 w-4' />
						<span className='sr-only'>Search</span>
					</Button>
				</form>
				<div className='flex flex-wrap gap-2'>
					{filters.map(filter => (
						<div key={filter.name} className='flex items-center gap-2'>
							<span className='text-sm font-medium'>{filter.name}:</span>
							<Select value={filter.value} onValueChange={filter.onChange}>
								<SelectTrigger className='h-8 w-[180px]'>
									<SelectValue placeholder={`Select ${filter.name}`} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>All</SelectItem>
									{filter.options.map(option => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					))}
				</div>
			</div>

			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							{columns.map(column => (
								<TableHead key={column.accessorKey}>{column.header}</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									No results.
								</TableCell>
							</TableRow>
						) : (
							data.map((row, i) => (
								<TableRow key={i}>
									{columns.map(column => (
										<TableCell key={column.accessorKey}>
											{column.cell
												? column.cell(row)
												: (row as any)[column.accessorKey]}
										</TableCell>
									))}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
				<div className='flex items-center gap-2 text-sm text-muted-foreground'>
					<div>
						Page {pagination.page} of {pagination.totalPages}
					</div>
					<div>|</div>
					<div>Total {pagination.total} items</div>
				</div>
				<div className='flex items-center gap-2'>
					<div className='flex items-center gap-1'>
						<span className='text-sm font-medium'>Rows per page:</span>
						<Select
							value={pagination.limit.toString()}
							onValueChange={value => onLimitChange(Number(value))}
						>
							<SelectTrigger className='h-8 w-[70px]'>
								<SelectValue placeholder={pagination.limit.toString()} />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='10'>10</SelectItem>
								<SelectItem value='20'>20</SelectItem>
								<SelectItem value='50'>50</SelectItem>
								<SelectItem value='100'>100</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className='flex items-center gap-1'>
						<Button
							variant='outline'
							size='icon'
							onClick={() => onPageChange(pagination.page - 1)}
							disabled={pagination.page <= 1}
						>
							<ChevronLeft className='h-4 w-4' />
							<span className='sr-only'>Previous page</span>
						</Button>
						<Button
							variant='outline'
							size='icon'
							onClick={() => onPageChange(pagination.page + 1)}
							disabled={pagination.page >= pagination.totalPages}
						>
							<ChevronRight className='h-4 w-4' />
							<span className='sr-only'>Next page</span>
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

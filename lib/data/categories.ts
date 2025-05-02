import { connectToDatabase } from '@/lib/models/db'
import CategoryModel from '@/lib/models/category.model'
import ProductModel from '@/lib/models/product.model'
interface CategoryType {
	_id: string
	name: string
	// Add other properties that are relevant to your category document
}
export async function getCategories(page = 1, limit = 10, search = '') {
	try {
		await connectToDatabase()

		const query = search ? { name: { $regex: search, $options: 'i' } } : {}

		const skip = (page - 1) * limit

		const categories = await CategoryModel.find(query)
			.sort({ name: 1 })
			.skip(skip)
			.limit(limit)
			.lean()

		const total = await CategoryModel.countDocuments(query)

		// Get product counts for each category
		const categoriesWithCounts = await Promise.all(
			categories.map(async category => {
				const productCount = await ProductModel.countDocuments({
					category: category._id,
				})
				return {
					...category,
					productCount,
				}
			})
		)

		return {
			categories: categoriesWithCounts,
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		}
	} catch (error) {
		console.error('Failed to fetch categories:', error)
		throw new Error('Failed to fetch categories')
	}
}

export async function getAllCategories() {
	try {
		await connectToDatabase()
		const categories = await CategoryModel.find().sort({ name: 1 }).lean()
		return categories
	} catch (error) {
		console.error('Failed to fetch all categories:', error)
		throw new Error('Failed to fetch all categories')
	}
}

export async function getCategoryById(id: string) {
	try {
		await connectToDatabase()
		const category = await CategoryModel.findById(id).lean()
		return category
	} catch (error) {
		console.error('Failed to fetch category:', error)
		throw new Error('Failed to fetch category')
	}
}

export async function createCategory(categoryData: any) {
	try {
		await connectToDatabase()
		const category = new CategoryModel(categoryData)
		await category.save()
		return category
	} catch (error) {
		console.error('Failed to create category:', error)
		throw new Error('Failed to create category')
	}
}

export async function updateCategory(id: string, categoryData: any) {
	try {
		await connectToDatabase()
		const category = await CategoryModel.findByIdAndUpdate(id, categoryData, {
			new: true,
		})
		return category
	} catch (error) {
		console.error('Failed to update category:', error)
		throw new Error('Failed to update category')
	}
}

export async function deleteCategory(id: string) {
	try {
		await connectToDatabase()

		// Check if category is used in any products
		const productsWithCategory = await ProductModel.countDocuments({
			category: id,
		})

		if (productsWithCategory > 0) {
			throw new Error(
				`Cannot delete category. It is used in ${productsWithCategory} products.`
			)
		}

		await CategoryModel.findByIdAndDelete(id)
		return { success: true }
	} catch (error) {
		console.error('Failed to delete category:', error)
		throw new Error(
			error instanceof Error ? error.message : 'Failed to delete category'
		)
	}
}

export async function getCategoryStats() {
	try {
		await connectToDatabase()

		const totalCategories = await CategoryModel.countDocuments()

		// Get categories with product counts
		const categoriesWithProducts = await ProductModel.aggregate([
			{ $group: { _id: '$category', count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
			{ $limit: 5 },
		])

		// Get category details
		const topCategories = await Promise.all(
			categoriesWithProducts.map(async item => {
				const category = (await CategoryModel.findOne(
					{ _id: item._id },
					'name _id'
				).lean()) as CategoryType | null
				return {
					_id: item._id,
					name: category?.name ?? 'Unknown',
					count: item.count,
				}
			})
		)

		return {
			totalCategories,
			topCategories,
		}
	} catch (error) {
		console.error('Failed to fetch category stats:', error)
		throw new Error('Failed to fetch category stats')
	}
}

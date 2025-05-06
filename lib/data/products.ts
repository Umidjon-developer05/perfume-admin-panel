import { connectToDatabase } from '@/lib/models/db'
import ProductModel from '@/lib/models/product.model'

export async function getProducts(
	page = 1,
	limit = 10,
	category = '',
	search = ''
) {
	try {
		await connectToDatabase()

		let query: any = {}

		if (category) {
			query.category = category
		}

		if (search) {
			query = {
				...query,
				$or: [
					{ name: { $regex: search, $options: 'i' } },
					{ description: { $regex: search, $options: 'i' } },
				],
			}
		}

		const skip = (page - 1) * limit

		const products = await ProductModel.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean()
			.populate('category', 'name')
		console.log(products)
		const total = await ProductModel.countDocuments(query)

		return {
			products,
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		}
	} catch (error) {
		console.error('Failed to fetch products:', error)
		throw new Error('Failed to fetch products')
	}
}

export async function getProductById(id: string) {
	try {
		await connectToDatabase()
		const product = await ProductModel.findById(id).populate('category').lean()

		return product
	} catch (error) {
		console.error('Failed to fetch product:', error)
		throw new Error('Failed to fetch product')
	}
}

export async function createProduct(productData: any) {
	try {
		await connectToDatabase()
		console.log(productData)
		const product = new ProductModel(productData)
		await product.save()
		return product
	} catch (error) {
		console.error('Failed to create product:', error)
		throw new Error('Failed to create product')
	}
}

export async function updateProduct(id: string, productData: any) {
	try {
		await connectToDatabase()
		console.log(id, productData)
		const product = await ProductModel.findByIdAndUpdate(id, productData, {
			new: true,
		})
		return product
	} catch (error) {
		console.error('Failed to update product:', error)
		throw new Error('Failed to update product')
	}
}

export async function deleteProduct(id: string) {
	try {
		await connectToDatabase()
		await ProductModel.findByIdAndDelete(id)
		return { success: true }
	} catch (error) {
		console.error('Failed to delete product:', error)
		throw new Error('Failed to delete product')
	}
}

export async function getProductStats() {
	try {
		await connectToDatabase()

		const totalProducts = await ProductModel.countDocuments()
		const inStockProducts = await ProductModel.countDocuments({ inStock: true })
		const outOfStockProducts = await ProductModel.countDocuments({
			inStock: false,
		})
		const featuredProducts = await ProductModel.countDocuments({
			featured: true,
		})

		return {
			totalProducts,
			inStockProducts,
			outOfStockProducts,
			featuredProducts,
		}
	} catch (error) {
		console.error('Failed to fetch product stats:', error)
		throw new Error('Failed to fetch product stats')
	}
}

import { getProductsAction } from "@/app/actions/products";
import { getCategoriesAction } from "@/app/actions/categories";
import { ProductList } from "@/components/dashboard/product-list";

export default async function ProductsPage() {
    const products = await getProductsAction();
    const categories = await getCategoriesAction();



    const mappedProducts = products?.map(p => ({
        ...p,
        status: p.status || 'draft'
    })) || [];

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <ProductList initialProducts={mappedProducts} categories={categories} />
        </div>
    );
}

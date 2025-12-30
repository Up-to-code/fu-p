import { getCategoriesAction } from "@/app/actions/categories";
import { CategoryList } from "@/components/dashboard/category-list";

export default async function CategoriesPage() {
    const categories = await getCategoriesAction();

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <CategoryList initialCategories={categories} />
        </div>
    );
}

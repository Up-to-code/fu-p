export interface SearchResult {
    products: {
        id: string;
        name: string;
        category: string | null;
        price: string;
    }[];
    orders: {
        id: string;
        customer: string | null;
        status: string;
        amount: string;
    }[];
    employees: {
        id: string;
        name: string | null;
        email: string | null;
        role: string | null;
    }[];
}

export interface ISearchService {
    globalSearch(orgId: string, query: string): Promise<SearchResult>;
}

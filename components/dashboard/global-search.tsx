"use client"

import * as React from "react"
import { Search, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { globalSearchAction } from "@/app/actions/search"
import { CurrencyDisplay } from "@/components/currency-display"

export function GlobalSearch() {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [data, setData] = React.useState<{
        products: any[];
        orders: any[];
        employees: any[];
    } | null>(null)
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    React.useEffect(() => {
        if (!open) {
            setQuery("")
            setData(null)
        }
    }, [open])

    // Debounce search
    React.useEffect(() => {
        if (query.length < 2) {
            setData(null)
            return
        }

        const timer = setTimeout(async () => {
            setLoading(true)
            const results = await globalSearchAction(query)
            setData(results)
            setLoading(false)
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <Button
                variant="outline"
                className="relative h-10 w-full justify-start rounded-lg text-sm text-muted-foreground sm:w-64 sm:pr-12 md:w-80 lg:w-96"
                onClick={() => setOpen(true)}
            >
                <span className="hidden lg:inline-flex">Search products, orders...</span>
                <span className="inline-flex lg:hidden">Search...</span>
                <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Type to search..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    <CommandEmpty>
                        {loading ? (
                            <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Searching...
                            </div>
                        ) : (
                            "No results found."
                        )}
                    </CommandEmpty>

                    {data?.products?.length ? (
                        <CommandGroup heading="Products">
                            {data.products.map((product) => (
                                <CommandItem
                                    key={product.id}
                                    onSelect={() => runCommand(() => router.push(`/dashboard/products?search=${product.id}`))} // Or open modal
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    <span>{product.name}</span>
                                    <span className="ml-auto text-xs text-muted-foreground"><CurrencyDisplay amount={product.price} /></span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ) : null}

                    {data?.orders?.length ? (
                        <>
                            <CommandSeparator />
                            <CommandGroup heading="Orders">
                                {data.orders.map((order) => (
                                    <CommandItem
                                        key={order.id}
                                        onSelect={() => runCommand(() => router.push(`/dashboard/orders?id=${order.id}`))}
                                    >
                                        <Search className="mr-2 h-4 w-4" />
                                        <span>Order #{order.id.slice(0, 8)}</span>
                                        <span className="ml-auto text-xs text-muted-foreground">{order.customer} - <CurrencyDisplay amount={order.amount} /></span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </>
                    ) : null}

                    {data?.employees?.length ? (
                        <>
                            <CommandSeparator />
                            <CommandGroup heading="Employees">
                                {data.employees.map((emp) => (
                                    <CommandItem
                                        key={emp.id}
                                        onSelect={() => runCommand(() => router.push(`/dashboard/employees`))}
                                    >
                                        <Search className="mr-2 h-4 w-4" />
                                        <span>{emp.name}</span>
                                        <span className="ml-auto text-xs text-muted-foreground">{emp.role}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </>
                    ) : null}
                </CommandList>
            </CommandDialog>
        </>
    )
}

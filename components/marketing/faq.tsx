import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-slate-500">
                        Everything you need to know about the Houses Partner Program.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>How do I become a partner?</AccordionTrigger>
                        <AccordionContent>
                            Simply click the "Join Houses" button, create an account, and verify your business details. Once approved, you can start listing products immediately.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>What are the fees?</AccordionTrigger>
                        <AccordionContent>
                            We offer a free tier for small inventories and a premium tier for larger catalogs with advanced analytics. We take a small commission on successful sales.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Can I integrate with my existing ERP?</AccordionTrigger>
                        <AccordionContent>
                            Yes! We offer API access for inventory synchronization and order management on our Enterprise plan.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>How does shipping work?</AccordionTrigger>
                        <AccordionContent>
                            You are responsible for fulfilling orders. We provide the customer details and shipping labels generation tools to make it easy.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    );
}

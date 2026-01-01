import { auth } from "@/lib/auth/config";
import { organizationRepository } from "@/lib/infrastructure/repositories/organization.repository";
import { userRepository } from "@/lib/infrastructure/repositories/user.repository";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { joinOrganizationAction } from "@/app/actions/join-org";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default async function JoinPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ role?: string }>
}) {
    const { slug } = await params;
    const { role } = await searchParams;

    // Check organization via repository
    const org = await organizationRepository.findBySlug(slug);

    const session = await auth.api.getSession({ headers: await headers() });

    if (!org) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-red-600">Organization Not Found</CardTitle>
                        <CardDescription>The invite link implies an organization that does not exist.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Link href="/" className="w-full"><Button variant="outline" className="w-full">Go Home</Button></Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (!session?.user) {
        // Redirect to login with callback
        redirect(`/login?callbackUrl=/join/${slug}${role ? `?role=${role}` : ''}`);
    }

    // Check if user is already a member via repository
    const currentUser = await userRepository.findById(session.user.id);
    const isAlreadyMember = currentUser?.organizationId === org.id;

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Join {org.name}</CardTitle>
                    <CardDescription>
                        You have been invited to join this organization{role ? ` as a ${role}` : ''}.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 py-8">
                    <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-3xl font-bold text-blue-600">{org.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Logged in as</p>
                        <p className="font-medium text-slate-900">{session.user.email}</p>
                    </div>

                    {isAlreadyMember && (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>You are already a member</span>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    {!isAlreadyMember ? (
                        <form action={async () => {
                            "use server";
                            await joinOrganizationAction(org.id, role);
                        }} className="w-full">
                            <Button className="w-full" size="lg">Join Organization</Button>
                        </form>
                    ) : (
                        <Link href="/dashboard" className="w-full">
                            <Button className="w-full" variant="secondary">Go to Dashboard</Button>
                        </Link>
                    )}
                    <Link href="/dashboard" className="w-full">
                        <Button variant="ghost" className="w-full">Cancel</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}

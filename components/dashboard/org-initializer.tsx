"use client";

import { useEffect } from "react";
import { useOrgStore, OrganizationStatus } from "@/store/org-store";
import { getOrganizationAction } from "@/app/actions/get-organization";

export function OrgInitializer() {
    const { setOrganization, setLoading } = useOrgStore();

    useEffect(() => {
        const fetchOrg = async () => {
            setLoading(true);
            try {
                const org = await getOrganizationAction();
                if (org) {
                    setOrganization({
                        id: org.id,
                        name: org.name,
                        ownerId: org.ownerId,
                        status: org.status as OrganizationStatus,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch organization", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrg();
    }, [setOrganization, setLoading]);

    return null;
}

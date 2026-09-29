"use client";

import { Button, Card, CardBody, CardHeader, TextInput } from "@niagads/ui";
import Link from "next/link";
import { useState } from "react";

export const HeroSectionSearch = () => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <Card>
            <CardHeader>Search the site</CardHeader>
            <CardBody>
                <TextInput value={searchTerm} onChange={setSearchTerm} placeholder="Search NIAGADS Data..." />
                <Link href={`/search?term=${searchTerm}`}>
                    <Button> Search </Button>
                </Link>
            </CardBody>
        </Card>
    );
};

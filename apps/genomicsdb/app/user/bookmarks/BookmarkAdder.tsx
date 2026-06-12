"use client";

import { getPublicUrl } from "@/lib/utils";
import { Button } from "@niagads/ui";
import useSWRMutation from "swr/mutation";


interface Payload {
    recordId: string;
    name: string;
}

interface Response {
    recordId: string;
    name: string;
}

export const BookmarkAdder = () => {
    const { trigger, isMutating, error } = useSWRMutation(`${getPublicUrl()}/api/bookmarks`, (url: string, { arg }: { arg: Payload}) =>
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(arg),
        })
    );

    const handleAddBookmark = () => {
        trigger({
            recordId: "test",
            name: "test1",
        })
    };

    return <Button onClick={() => handleAddBookmark()}>Add bookmark</Button>;
};

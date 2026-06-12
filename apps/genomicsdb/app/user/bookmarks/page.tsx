import { addBookmark } from "@/app/api/bookmarks/route";
import { getPublicUrl } from "@/lib/utils";
import { Button, Card, CardBody, CardHeader } from "@niagads/ui";
import { BookmarkAdder } from "./BookmarkAdder";

const UserBookmarksPage = async () => {
    const bookmarks = await fetch(`${getPublicUrl()}/api/bookmarks`);

    return (
        <div>
            <Card>
                <CardHeader>Bookmarks</CardHeader>
                <CardBody>
                    <BookmarkAdder />
                </CardBody>
            </Card>
        </div>
    );
};

export default UserBookmarksPage;

import { Card, CardBody, CardHeader } from "@niagads/ui";

const UserBookmarksPage = async () => {
    const bookmarks = await fetch("http://localhost:3000/api/bookmarks");
    console.log(bookmarks)

    return <div>
        <Card>
            <CardHeader>Bookmarks</CardHeader>
            <CardBody>
            </CardBody>
        </Card>
    </div>;
};

export default UserBookmarksPage;

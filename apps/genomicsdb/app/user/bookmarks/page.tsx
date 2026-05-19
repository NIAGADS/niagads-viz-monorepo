const BookmarkPage = async ({ params }: RecordPageProps) => {
    const bookmarks = await fetch("http://localhost:3000/api/bookmarks");
    console.log(bookmarks)
    return (
        <div>
        </div>
    )
};

export default BookmarkPage;

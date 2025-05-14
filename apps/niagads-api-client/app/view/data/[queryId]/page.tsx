// /view/data[queryId]

import { getJsonValueFromCache } from "@/utils/cache"
// import { GoslingWrapper } from "@/components/Gosling/GoslingWrapper"

type props = { params: any };
export default async function Page({ params }: props) {
    const specification = await getJsonValueFromCache(params.queryId, 'VIEW')

    return (
        specification ? <main>
           {JSON.stringify(specification)}
        </main> : <div>Response has expired</div>
    );
}

//
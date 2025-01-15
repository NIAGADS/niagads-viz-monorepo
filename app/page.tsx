import dynamic from 'next/dynamic'
import { MemoIGVBrowser as GenomeBrowser } from "@/components/IGVBrowser/IGVBrowser";


export default function Home() {
    return <GenomeBrowser featureSearchURI="/service/track/feature?id=" genome="hg38" tracks={[]}/>
}

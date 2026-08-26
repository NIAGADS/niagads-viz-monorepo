"use client";

import { Button, Card, CardHeader, Footer } from "@niagads/ui";
import { APISearch } from "@niagads/ui/client";
import { Github, Twitter } from "lucide-react";

import styles from "./home-page.module.css";

export default function Home() {
    return (
        <div>
            <div className={styles["top-section"]}>
                <div>
                    <div>The National Institute on Aging Genetics of Alzheimer's Disease Data Storage Site</div>
                    <div>short description</div>
                    <Card>
                        <CardHeader>Search</CardHeader>
                        <APISearch 
                            suggestions={[]}
                            onClick={() => console.log("click search")}
                            onSearch={() => console.log("searching")}
                            onValueChange={(value) => console.log(value)}
                            error={""}
                        />
                    </Card>
                </div>
                <div>
                    <Button>Browse Datasets</Button>
                    <Button>Submit Data</Button>
                    <div>
                        <Twitter />
                        <Github />
                    </div>
                </div>
            </div>
            <hr />
            <div>
            </div>
            <hr />
            <div>
                <div>
                    <Button>Sign up for Help Hours</Button>
                    <Button>Other Button</Button>
                </div>
                <div>

                </div>
            </div>
            <Footer
                siteName="NIAGADS"
                links={[
                    { display: "About", url: "/about" },
                    { display: "Contact", url: "#" },
                    { display: "Privacy", url: "#" },
                    { display: "Terms", url: "#" },
                ]}
            />
        </div>
    );
}

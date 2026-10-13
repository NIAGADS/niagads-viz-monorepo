import type { Metadata } from "next";
import { ContactPage } from "@/components/ContactPage/ContactPage";

export const metadata: Metadata = {
    title: "Contact Us | NIAGADS",
    description:
        "Contact NIAGADS for general inquiries, technical support, and data access assistance.",
};

export default function Page() {
    return (
         <main>
            <div className="content-section content-section-centered">
                <ContactPage
                    helpHoursUrl="https://bookings.cloud.microsoft/book/NIAGADS11HelpHours@PennMedicine.onmicrosoft.com/?ismsaljsauthenabled=true"
                />
            </div>
        </main>
    );
}
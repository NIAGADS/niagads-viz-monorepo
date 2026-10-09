import { ArrowRight, Mail } from "lucide-react";
import { Card, CardBody } from "@niagads/ui";
import styles from "./subscribe-card.module.css";

export const SubscribeCard = () => {
    return (
        <Card>
            <CardBody className={styles["subscribe-card-body"]}>
                <div className={styles["subscribe-card-header"]}>
                    <div className={styles["subscribe-card-icon"]}>
                        <Mail aria-hidden="true" size={22} />
                    </div>

                    <div>
                        <p className="text-base font-semibold">
                            Stay connected
                        </p>

                        <p className="text-sm">
                            Get NIAGADS news and updates.
                        </p>
                    </div>
                </div>
            
                    <a
                        href="https://eepurl.com/iA04J-"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles["subscribe-button"]}
                    > 
                        <span>Subscribe</span>
                        <ArrowRight aria-hidden="true" size={18} />
                    </a>
                       
            </CardBody>
        </Card>
    );
};
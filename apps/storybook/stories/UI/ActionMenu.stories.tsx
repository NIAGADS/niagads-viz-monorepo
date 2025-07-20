import { ActionMenu } from "@niagads/ui/client";
import { Atom } from "lucide-react";

export default {
    title: "UI/ActionMenu",
    component: ActionMenu,
    argTypes: {
        label: { control: "text" },
        className: { control: false },
        style: { control: false },
    },
    args: {
        label: "Open Action Menu",
    },
};

export const WithForm = (args) => (
    <div style={{ width: 300 }}>
        <ActionMenu {...args}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    alert("Form submitted!");
                }}
                style={{ display: "flex", flexDirection: "column", gap: 8, padding: "1rem" }}
            >
                <label>
                    Name:
                    <input type="text" name="name" style={{ marginLeft: 8 }} />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" style={{ marginLeft: 8 }} />
                </label>
                <button type="submit">Submit</button>
            </form>
        </ActionMenu>
        <div style={{ marginTop: 16, color: "#888", fontSize: "0.95em" }}>(Open the menu to see the custom form.)</div>
    </div>
);

export const WithArbitraryContent = (args) => (
    <div style={{ width: 300 }}>
        <ActionMenu {...args} icon={Atom}>
            <div style={{ padding: "1rem", fontSize: "0.8rem" }}>
                <h4>Arbitrary Content</h4>
                <p>You can put any React node here, such as lists, images, or even other components.</p>
                <ul>
                    <li>Item 1</li>
                    <li>Item 2</li>
                </ul>
            </div>
        </ActionMenu>
        <div style={{ marginTop: 16, color: "#888", fontSize: "0.95em" }}>
            (Open the menu to see arbitrary content.)
        </div>
    </div>
);

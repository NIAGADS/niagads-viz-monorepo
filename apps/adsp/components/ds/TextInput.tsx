"use client";
import { useState } from "react";
import type { CSSProperties, InputHTMLAttributes } from "react";

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "style"> {
  value?: string;
  onChange?: (value: string) => void;
  style?: CSSProperties;
}

/** NIAGADS TextInput — full-width, neutral border, brand-blue focus ring. */
export function TextInput({ value, onChange, placeholder = "Search", type = "text", className = "", style = {}, ...rest }: TextInputProps) {
  const [focus, setFocus] = useState(false);
  return (
    <input type={type} value={value} placeholder={placeholder}
      onChange={(e) => onChange?.(e.currentTarget.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      className={className}
      style={{
        display: "block", width: "100%", borderRadius: "var(--border-radius)", border: `1px solid ${focus ? "var(--secondary-blue)" : "#e5e5e5"}`,
        background: "transparent", padding: "0.25rem 0.75rem", fontSize: "1rem", fontFamily: "var(--font-sans)", lineHeight: 1.6, outline: "none",
        boxShadow: focus ? "0 1px 2px 0 rgba(61,90,128,0.12)" : "none", transition: "border-color .2s, box-shadow .2s", ...style,
      }}
      {...rest} />
  );
}

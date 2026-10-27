"use client";

import { Component, type ReactNode } from "react";
import ErrorAlert from "./ErrorAlert";

export default class ComponentBoundary extends Component<
    { children: ReactNode; fallback: ReactNode },
    { error: Error | null }
> {
    state = { error: null as Error | null };
    static getDerivedStateFromError(error: Error) {
        return { error };
    }
    render() {
        return this.state.error ? (
            <ErrorAlert error={this.state.error}>{this.props.fallback}</ErrorAlert>
        ) : (
            this.props.children
        );
    }
}

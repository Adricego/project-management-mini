import type { ReactNode } from "react";

export function Card(props: { title: string; children: ReactNode }) {
    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">{props.title}</h2>
        </div>
        {props.children}
        </div>
    );
}
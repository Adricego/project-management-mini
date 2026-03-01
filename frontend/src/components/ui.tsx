import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
        {...props}
        className={[
            "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900",
            "outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200",
            props.className || ""
        ].join(" ")}
        />
    );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            {...props}
                className={[
                    "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900",
                    "outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200",
                props.className || ""
            ].join(" ")}
        />
    );
}

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={[
                "inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-white",
                "hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60",
            props.className || ""
        ].join(" ")}
        />
    );
}
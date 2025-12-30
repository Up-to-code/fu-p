"use client";
import React from "react";
import { X } from "lucide-react";
import { Button } from "./button";

export function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in zoom-in duration-200">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden border">
                <div className="flex justify-between items-center p-4 border-b bg-slate-50">
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <Button variant="ghost" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
}

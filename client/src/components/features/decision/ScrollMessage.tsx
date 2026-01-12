"use client"

import { motion, AnimatePresence } from "framer-motion"

import ReactMarkdown from "react-markdown"

interface ScrollMessageProps {
    text: string
    isOpen: boolean
    theme?: "default" | "judge"
}

export default function ScrollMessage({ text, isOpen, theme = "default" }: ScrollMessageProps) {
    const isJudge = theme === "judge"

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="overflow-hidden w-full max-w-sm mx-auto mt-4"
                >
                    <div className={`p-6 shadow-xl relative ${isJudge
                            ? "bg-stone-50 border-4 border-double border-amber-900/20 rounded-lg"
                            : "bg-[#fdfbf7] rounded-sm shadow-inner border-y-8 border-amber-700"
                        }`}>
                        {/* Texture overlays */}
                        {!isJudge && (
                            <>
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-black/10 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-t from-black/10 to-transparent"></div>
                            </>
                        )}

                        <div className={`text-lg leading-relaxed ${isJudge
                                ? "font-serif text-slate-800 font-medium text-center italic"
                                : "font-serif text-amber-900"
                            }`}>
                            <ReactMarkdown
                                components={{
                                    strong: ({ node, ...props }) => <span className={isJudge ? "text-slate-900 font-bold" : "text-amber-800 font-bold"} {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 my-2 text-left" {...props} />,
                                    li: ({ node, ...props }) => <li className="pl-1" {...props} />
                                }}
                            >
                                {text}
                            </ReactMarkdown>
                        </div>

                        {isJudge && (
                            <div className="flex justify-center mt-4 text-amber-900/20">
                                • • •
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

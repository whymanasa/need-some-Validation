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
                    className="overflow-hidden w-full max-w-[90vw] md:max-w-md mx-auto mt-4 break-words hyphens-auto"
                >
                    <div className={`p-8 md:p-10 shadow-xl relative ${isJudge
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

                        <div className={`text-lg md:text-xl leading-loose tracking-wide ${isJudge
                            ? "font-serif text-slate-800 font-medium text-center italic"
                            : "font-serif text-amber-900"
                            }`}>
                            <ReactMarkdown
                                components={{
                                    p: ({ node, ...props }) => <p className="mb-6 last:mb-0" {...props} />,
                                    strong: ({ node, ...props }) => <span className={isJudge ? "text-slate-900 font-bold" : "text-amber-800 font-bold"} {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-3 my-4 text-left" {...props} />,
                                    li: ({ node, ...props }) => <li className="pl-2" {...props} />
                                }}
                            >
                                {text}
                            </ReactMarkdown>
                        </div>

                        {isJudge && (
                            <div className="flex justify-center mt-6 text-amber-900/20 text-xl tracking-[0.5em]">
                                • • •
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

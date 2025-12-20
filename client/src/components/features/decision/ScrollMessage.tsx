"use client"

import { motion, AnimatePresence } from "framer-motion"

interface ScrollMessageProps {
    text: string
    isOpen: boolean
}

export default function ScrollMessage({ text, isOpen }: ScrollMessageProps) {
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
                    <div className="bg-[#fdfbf7] p-6 rounded-sm shadow-inner border-y-8 border-amber-700 relative">
                        {/* Scroll texture/decoration */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-black/10 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-t from-black/10 to-transparent"></div>

                        <p className="font-serif text-lg leading-relaxed text-amber-900 first-letter:text-3xl first-letter:font-bold first-letter:text-amber-800 first-letter:mr-1 first-letter:float-left">
                            {text}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import ScrollMessage from "./ScrollMessage"

interface AngelCardProps {
    content: string
    loading: boolean
}

export default function AngelCard({ content, loading }: AngelCardProps) {
    const [isScrollOpen, setScrollOpen] = useState(false)

    return (
        <div className="flex flex-col items-center justify-center h-[100dvh] w-full relative overflow-hidden transition-all duration-500">
            {/* Angel Character Section */}
            <motion.div
                className="relative z-10 w-full flex items-center justify-center transition-all duration-500"
            >
                <motion.div
                    className="cursor-pointer"
                    onClick={() => !loading && setScrollOpen(!isScrollOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <img
                        src="/angel.png"
                        alt="Angel"
                        className={`transition-all duration-500 object-contain drop-shadow-2xl brightness-110 ${isScrollOpen ? "w-auto h-[25vh]" : "w-64 md:w-80 h-auto max-h-[45vh]"
                            }`}
                    />
                </motion.div>
            </motion.div>

            {/* Message/Loading Section */}
            <motion.div
                className="w-full relative z-20 flex flex-col items-center justify-start bg-white/0"
            >
                <div className="w-full max-w-md px-4 pointer-events-auto">
                    {loading ? (
                        <motion.div
                            animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.5 }}
                            className="text-sky-600 font-serif font-semibold text-lg bg-white/90 px-8 py-4 rounded-full shadow-lg border-2 border-sky-300 mx-auto mt-8"
                            style={{ fontFamily: "var(--font-playfair), serif" }}
                        >
                            Listening to the greater good...
                        </motion.div>
                    ) : (
                        <ScrollMessage
                            text={content || "write your problem and let the angel guide you..."}
                            isOpen={isScrollOpen}
                        />
                    )}
                </div>
            </motion.div>

            {/* Hint */}
            {!isScrollOpen && !loading && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-10 text-sky-700/60 text-sm italic font-serif z-0"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                    (Tap for Guidance)
                </motion.p>
            )}
        </div>
    )
}

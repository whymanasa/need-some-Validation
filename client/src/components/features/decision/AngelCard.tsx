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
        <div className="flex flex-col items-center justify-center min-h-[100dvh] w-full relative pointer-events-none gap-6">
            {/* Halo Animation - Drops from top */}


            {/* Angel Character - Fades in after Halo */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="relative z-10 cursor-pointer pointer-events-auto"
                onClick={() => !loading && setScrollOpen(!isScrollOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <img src="/angel.png" alt="Angel" className="w-64 md:w-80 h-auto drop-shadow-2xl brightness-110" />
            </motion.div>



            {/* Loading State or Scroll Message */}
            <div className="mt-8 w-full max-w-md px-4 min-h-[100px] flex justify-center pointer-events-auto">
                {loading ? (
                    <motion.div
                        animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.5 }}
                        className="text-sky-600 font-serif font-semibold text-lg bg-white/90 px-8 py-4 rounded-full shadow-lg border-2 border-sky-300"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                        Listening to the greater good...
                    </motion.div>
                ) : (
                    <ScrollMessage text={content || "Tap the Angel to see the message..."} isOpen={isScrollOpen} />
                )}
            </div>

            {/* Hint */}
            {!isScrollOpen && !loading && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-10 text-sky-700/60 text-sm italic font-serif"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                    (Tap for Guidance)
                </motion.p>
            )}
        </div>
    )
}

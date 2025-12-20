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
        <div className="flex flex-col items-center justify-center min-h-screen w-full relative pointer-events-none">
            {/* Halo Animation - Drops from top */}
            <motion.img
                src="/halo.png"
                alt="Halo"
                initial={{ y: -200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 10, delay: 0.3 }}
                className="w-32 h-auto z-20 mb-[-20px] pointer-events-auto drop-shadow-2xl"
            />

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
                <img src="/angel.png" alt="Angel" className="w-48 h-auto drop-shadow-2xl brightness-110" />
            </motion.div>

            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-4xl font-serif text-sky-700 mt-4 tracking-wide bg-white/60 px-6 py-2 rounded-full backdrop-blur-sm pointer-events-auto border-2 border-sky-300/50 shadow-lg"
                style={{ fontFamily: "var(--font-playfair), serif" }}
            >
                The Angel
            </motion.h2>

            {/* Loading State or Scroll Message */}
            <div className="mt-8 w-full max-w-md px-4 min-h-[100px] flex justify-center pointer-events-auto">
                {loading ? (
                    <motion.div
                        animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.5 }}
                        className="text-sky-600 font-serif font-semibold text-lg bg-white/90 px-8 py-4 rounded-full shadow-lg border-2 border-sky-300"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                        Listening to your conscience...
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
                    (Tap the Angel)
                </motion.p>
            )}
        </div>
    )
}

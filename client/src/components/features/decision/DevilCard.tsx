"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import ScrollMessage from "./ScrollMessage"

interface DevilCardProps {
    content: string
    loading: boolean
}

export default function DevilCard({ content, loading }: DevilCardProps) {
    const [isScrollOpen, setScrollOpen] = useState(false)

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full relative pointer-events-none">
            {/* Horns Animation - Drops from top */}


            {/* Devil Character - Fades in after Horns */}
            {/* Flickering Glow */}
            <motion.div
                className="absolute z-0 w-64 h-64 rounded-full bg-orange-600/30 blur-3xl"
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative z-10 cursor-pointer pointer-events-auto"
                onClick={() => !loading && setScrollOpen(!isScrollOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <img
                    src="/devil.png"
                    alt="Devil"
                    className="w-80 h-auto drop-shadow-2xl contrast-125 hover:brightness-110 transition-all duration-300"
                    style={{ filter: "drop-shadow(0 0 30px rgba(244, 108, 17, 0.3))" }}
                />
            </motion.div>



            {/* Loading State or Scroll Message */}
            <div className="mt-8 w-full max-w-md px-4 min-h-[100px] flex justify-center pointer-events-auto z-10">
                {loading ? (
                    <motion.div
                        animate={{ skewX: [0, -5, 5, 0], opacity: [0.8, 1, 0.8] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                        className="text-red-400 font-black text-lg bg-black/90 px-8 py-4 rounded-lg border-2 border-red-900 shadow-red-900/40 shadow-xl"
                        style={{
                            fontFamily: "var(--font-black-ops), sans-serif",
                            textShadow: "2px 2px 0 rgba(0,0,0,0.5)",
                        }}
                    >
                        Calculating personal gain...
                    </motion.div>
                ) : (
                    <ScrollMessage text={content || "Tap the Devil to see the message..."} isOpen={isScrollOpen} />
                )}
            </div>

            {/* Hint */}
            {!isScrollOpen && !loading && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-10 text-red-700/50 text-sm font-black uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-black-ops), sans-serif" }}
                >
                    (Unleash the Id)
                </motion.p>
            )}

            {/* Fire Particles */}
            <div className="absolute bottom-0 left-0 right-0 h-[80vh] overflow-hidden pointer-events-none z-0">
                {[...Array(25)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2.5 h-2.5 rounded-full"
                        style={{
                            background: "radial-gradient(circle, rgba(250, 116, 27, 0.9) 0%, rgba(255,50,0,0.4) 70%, transparent 100%)",
                            left: `${(i * 23 + 7) % 90 + 5}%`, // Pseudo-random scatter 5-95%
                            bottom: "-20px",
                            boxShadow: "0 0 20px rgba(255,120,0,0.8)",
                        }}
                        animate={{
                            y: [0, -window.innerHeight * 0.8], // Rise to 80% of screen height
                            x: [0, Math.sin(i) * 30 + (i % 2 === 0 ? 20 : -20), 0], // Wavy erratic motion
                            opacity: [0, 1, 0], // Fade in -> Fade out
                            scale: [0.5, 1.2, 0], // Grow then shrink to nothing
                        }}
                        transition={{
                            duration: 5 + (i % 4), // 5-9s duration
                            repeat: Infinity,
                            delay: (i * 13) % 7, // Scramble start times
                            ease: "easeOut",
                        }}
                    />
                ))}
            </div>
        </div >
    )
}

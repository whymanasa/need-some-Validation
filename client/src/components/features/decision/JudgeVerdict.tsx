"use client"

import { motion } from "framer-motion"

export default function JudgeVerdict() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-amber-900">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
            >
                <h2 className="text-4xl font-black mb-4 tracking-widest uppercase border-b-4 border-amber-900 pb-2">
                    The Judge
                </h2>
                <div className="w-64 h-64 bg-amber-200/50 rounded-full flex items-center justify-center mb-8 border-4 border-amber-900 mx-auto">
                    <span className="text-6xl">⚖️</span>
                </div>
                <p className="text-xl font-bold max-w-md mx-auto">
                    Verdict pending... <br />
                    <span className="text-sm font-normal opacity-70">(This feature is coming soon!)</span>
                </p>
            </motion.div>
        </div>
    )
}

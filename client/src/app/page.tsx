"use client"

import { useState } from "react"
import { useSwipeable } from "react-swipeable"
import { motion, AnimatePresence } from "framer-motion"
import AngelCard from "@/components/features/decision/AngelCard"
import DevilCard from "@/components/features/decision/DevilCard"
import JudgeVerdict from "@/components/features/decision/JudgeVerdict"
import api from "@/lib/axios"

type ViewState = "neutral" | "angel" | "devil" | "judge"

export default function Home() {
  const [view, setView] = useState<ViewState>("neutral")
  const [userInput, setUserInput] = useState("")
  const [angelReason, setAngelReason] = useState("")
  const [devilReason, setDevilReason] = useState("")
  const [loading, setLoading] = useState(false)

  // Handlers for Swipe Gestures
  const handlers = useSwipeable({
    onSwipedRight: () => {
      if (view === "neutral") setView("angel")
      else if (view === "devil") setView("neutral")
    },
    onSwipedLeft: () => {
      if (view === "neutral") setView("devil")
      else if (view === "angel") setView("neutral")
    },
    onSwipedUp: () => {
      if (view === "neutral") setView("judge")
    },
    onSwipedDown: () => setView("neutral"),
    trackMouse: true,
  })

  const handleDecide = async () => {
    if (!userInput.trim()) return

    setLoading(true)
    setAngelReason("")
    setDevilReason("")

    try {
      const [angelRes, devilRes] = await Promise.all([
        api.post("/validate", { promptType: "angel", userInput }),
        api.post("/validate", { promptType: "devil", userInput }),
      ])

      setAngelReason(angelRes.data.result)
      setDevilReason(devilRes.data.result)
    } catch (error) {
      console.error("Error fetching decisions:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main {...handlers} className="h-screen w-full relative overflow-hidden flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {/* NEUTRAL VIEW - Mysterious crossroads theme with foggy gradient */}
        {view === "neutral" && (
          <motion.div
            key="neutral"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-gradient-to-r from-blue-100/60 via-slate-200 to-red-100/60 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-slate-400/20 via-transparent to-slate-400/20 backdrop-blur-3xl" />

            <div className="w-full max-w-2xl px-6 z-10 flex flex-col items-center gap-8">
              <div className="text-center space-y-2">
                <h1
                  className="text-5xl md:text-7xl font-black text-slate-800 tracking-tighter drop-shadow-lg"
                  style={{ textShadow: "3px 3px 0 rgba(0,0,0,0.1)" }}
                >
                  DECISION<span className="text-amber-600">.</span>VALIDATOR
                </h1>
                <p className="text-slate-600 text-lg uppercase tracking-widest font-bold drop-shadow-sm">
                  Swipe Right for Salvation • Left for Sin
                </p>
              </div>

              <div className="w-full bg-gradient-to-b from-stone-200 to-stone-300 p-3 rounded-3xl shadow-2xl border-4 border-stone-400 flex flex-col md:flex-row gap-3 relative">
                {/* Stone texture effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-stone-100/50 to-transparent rounded-3xl pointer-events-none" />

                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Should I call my ex?"
                  className="relative flex-1 bg-amber-50/90 px-6 py-5 text-xl outline-none text-slate-800 placeholder:text-slate-400 font-semibold rounded-2xl border-3 border-amber-700/30 shadow-inner focus:border-amber-600 transition-all"
                  onKeyDown={(e) => e.key === "Enter" && handleDecide()}
                />
                <motion.button
                  onClick={handleDecide}
                  disabled={loading || !userInput.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-xl border-4 border-amber-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.3)" }}
                >
                  {loading ? "JUDGING..." : "SUMMON"}
                </motion.button>
              </div>

              {/* Hints */}
              <div className="flex gap-8 text-slate-500 font-black text-sm tracking-widest drop-shadow-sm">
                <span>← ANGEL</span>
                <span>JUDGE ↑</span>
                <span>DEVIL →</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ANGEL VIEW - Fluffy clouds, golden light, ethereal sky */}
        {view === "angel" && (
          <motion.div
            key="angel"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-20 bg-gradient-to-b from-sky-300 via-sky-200 to-blue-100 flex items-center justify-center overflow-hidden"
          >
            <motion.div
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 50,
                delay: 0.05,
                duration: 1.2,
              }}
              className="absolute inset-0 bg-gradient-to-b from-yellow-200/80 via-yellow-100/40 to-transparent blur-3xl pointer-events-none"
              style={{
                mixBlendMode: "screen",
                filter: "blur(100px)",
              }}
            />

            <motion.div
              className="absolute top-10 left-20 w-32 h-20 opacity-80 animate-float"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.3 }}
            >
              <svg viewBox="0 0 200 100" className="w-full h-full fill-white/90 drop-shadow-lg">
                <ellipse cx="50" cy="60" rx="40" ry="25" />
                <ellipse cx="90" cy="50" rx="50" ry="35" />
                <ellipse cx="140" cy="60" rx="45" ry="30" />
              </svg>
            </motion.div>

            <motion.div
              className="absolute top-40 right-10 w-40 h-24 opacity-70 animate-float-slow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.5 }}
            >
              <svg viewBox="0 0 200 100" className="w-full h-full fill-white/80 drop-shadow-lg">
                <ellipse cx="40" cy="55" rx="35" ry="20" />
                <ellipse cx="80" cy="45" rx="45" ry="30" />
                <ellipse cx="130" cy="55" rx="50" ry="25" />
                <ellipse cx="170" cy="60" rx="30" ry="20" />
              </svg>
            </motion.div>

            <motion.div
              className="absolute bottom-32 left-1/4 w-36 h-22 opacity-60 animate-float-delayed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.7 }}
            >
              <svg viewBox="0 0 200 100" className="w-full h-full fill-white/70 drop-shadow-lg">
                <ellipse cx="60" cy="60" rx="45" ry="28" />
                <ellipse cx="110" cy="55" rx="55" ry="32" />
                <ellipse cx="160" cy="65" rx="40" ry="25" />
              </svg>
            </motion.div>

            <div className="absolute top-4 left-4 z-30">
              <button
                onClick={() => setView("neutral")}
                className="text-sky-600 hover:text-sky-800 font-black text-lg drop-shadow-md transition-colors"
              >
                ← BACK
              </button>
            </div>
            <AngelCard content={angelReason} loading={loading} />
          </motion.div>
        )}

        {/* DEVIL VIEW - Underworld cracked earth, dark gradient, ember particles */}
        {view === "devil" && (
          <motion.div
            key="devil"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-20 bg-gradient-to-b from-zinc-900 via-red-950/60 to-zinc-950 flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20 animate-crack-pulse">
              <svg width="100%" height="100%" className="absolute inset-0">
                <defs>
                  <pattern id="cracks" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                    <path d="M0,50 Q50,30 100,50 T200,50" stroke="rgba(255,100,0,0.4)" strokeWidth="2" fill="none" />
                    <path d="M50,0 Q30,50 50,100 T50,200" stroke="rgba(255,100,0,0.3)" strokeWidth="1.5" fill="none" />
                    <path
                      d="M150,0 Q170,50 150,100 T150,200"
                      stroke="rgba(255,100,0,0.3)"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <circle cx="100" cy="100" r="3" fill="rgba(255,50,0,0.5)" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cracks)" />
              </svg>
            </div>

            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bottom-0 w-2 h-2 bg-orange-500 rounded-full blur-sm animate-ember"
                style={{
                  left: `${10 + i * 8}%`,
                  animationDelay: `${i * 0.8}s`,
                  boxShadow: "0 0 10px rgba(255,150,0,0.8)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.8,
                  ease: "linear",
                }}
              />
            ))}

            <div className="absolute top-4 right-4 z-30">
              <button
                onClick={() => setView("neutral")}
                className="text-red-700 hover:text-red-500 font-black text-lg drop-shadow-md transition-colors"
              >
                BACK →
              </button>
            </div>
            <DevilCard content={devilReason} loading={loading} />
          </motion.div>
        )}

        {/* JUDGE VIEW */}
        {view === "judge" && (
          <motion.div
            key="judge"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-20 bg-gradient-to-b from-amber-100 to-amber-50 flex items-center justify-center"
          >
            <div className="absolute top-4 right-4 z-30">
              <button
                onClick={() => setView("neutral")}
                className="text-amber-900 hover:text-amber-700 font-black text-lg drop-shadow-md transition-colors"
              >
                ↓ BACK
              </button>
            </div>
            <JudgeVerdict />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useSwipeable } from "react-swipeable"
import { motion, AnimatePresence } from "framer-motion"
import AngelCard from "@/components/features/decision/AngelCard"
import DevilCard from "@/components/features/decision/DevilCard"
import JudgeVerdict from "@/components/features/decision/JudgeVerdict"
import api from "@/lib/axios"

type ViewState = "neutral" | "angel" | "devil" | "judge"

const PLACEHOLDERS = [
  "Pizza or Salad?",
  "Quit my job?",
  "Buy the shoes?",
  "Gym or Nap?",
  "Text him back?",
  "One more episode?",
]

export default function Home() {
  const [view, setView] = useState<ViewState>("neutral")
  const [userInput, setUserInput] = useState("")
  const [angelReason, setAngelReason] = useState("")
  const [devilReason, setDevilReason] = useState("")
  const [judgeReason, setJudgeReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [lastSubmittedInput, setLastSubmittedInput] = useState("")

  // Dynamic Placeholder State
  const [placeholder, setPlaceholder] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  const [typingSpeed, setTypingSpeed] = useState(150)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Typewriter Effect
  useEffect(() => {
    const handleType = () => {
      const i = loopNum % PLACEHOLDERS.length
      const fullText = PLACEHOLDERS[i]

      setPlaceholder(
        isDeleting ? fullText.substring(0, placeholder.length - 1) : fullText.substring(0, placeholder.length + 1),
      )

      setTypingSpeed(isDeleting ? 50 : 150)

      if (!isDeleting && placeholder === fullText) {
        setTimeout(() => setIsDeleting(true), 2000) // Wait before deleting
      } else if (isDeleting && placeholder === "") {
        setIsDeleting(false)
        setLoopNum(loopNum + 1)
      }
    }

    const timer = setTimeout(handleType, typingSpeed)
    return () => clearTimeout(timer)
  }, [placeholder, isDeleting, loopNum, typingSpeed])

  // Handlers for Swipe Gestures
  const handlers = useSwipeable({
    onSwipedRight: () => {
      if (view === "neutral")
        setView("angel") // Go Left (Angel)
      else setView("neutral") // Return home from anywhere
    },
    onSwipedLeft: () => {
      if (view === "neutral")
        setView("devil") // Go Right (Devil)
      else setView("neutral") // Return home from anywhere
    },
    onSwipedUp: () => {
      if (view === "neutral") setView("judge")
    },
    onSwipedDown: () => setView("neutral"),
    trackMouse: true,
  })

  const handleDecide = async () => {
    if (!userInput.trim() || userInput === lastSubmittedInput) return

    setLoading(true)
    setAngelReason("")
    setDevilReason("")
    setJudgeReason("")

    try {
      const [angelRes, devilRes, judgeRes] = await Promise.all([
        api.post("/validate", { promptType: "angel", userInput }),
        api.post("/validate", { promptType: "devil", userInput }),
        api.post("/validate", { promptType: "judge", userInput }),
      ])

      setAngelReason(angelRes.data.result)
      setDevilReason(devilRes.data.result)
      setJudgeReason(judgeRes.data.result)
      setLastSubmittedInput(userInput)
    } catch (error) {
      console.error("Error fetching decisions:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      {...handlers}
      className="h-[100dvh] w-full relative overflow-hidden flex flex-col items-center justify-center"
    >
      <AnimatePresence mode="wait">
        {/* NEUTRAL VIEW - Split Crossroads Theme */}
        {view === "neutral" && (
          <motion.div
            key="neutral"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-zinc-950 flex items-center justify-center overflow-hidden"
          >
            {/* Split Ambient Background - Angel Left, Devil Right */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[30%] -left-[10%] w-[80%] md:w-[50%] h-[70%] bg-sky-900/20 rounded-full blur-[100px] md:blur-[150px]" />
              <div className="absolute top-[30%] -right-[10%] w-[80%] md:w-[50%] h-[70%] bg-red-900/20 rounded-full blur-[100px] md:blur-[150px]" />

              {/* Floating '?' Particles */}
              {mounted &&
                [...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-zinc-800 font-serif font-bold text-2xl md:text-4xl opacity-20 pointer-events-none"
                    initial={{
                      x: Math.random() * window.innerWidth,
                      y: Math.random() * window.innerHeight,
                      opacity: 0,
                    }}
                    animate={{
                      y: [0, -100],
                      opacity: [0, 0.3, 0],
                      rotate: [0, 20, -20],
                    }}
                    transition={{
                      duration: 10 + Math.random() * 5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 2,
                      ease: "linear",
                    }}
                  >
                    ?
                  </motion.div>
                ))}
            </div>

            <div className="w-full max-w-3xl px-4 sm:px-6 z-10 flex flex-col items-center gap-6 sm:gap-10">
              <div className="text-center space-y-2 sm:space-y-4">
                <h1
                  className="text-3xl sm:text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-slate-100 to-red-200 tracking-tighter"
                  style={{ filter: "drop-shadow(0 0 30px rgba(255,255,255,0.1))" }}
                >
                  DECISION<span className="text-zinc-500">.</span>VALIDATOR
                </h1>
                <p className="text-zinc-400 text-xs sm:text-base md:text-lg font-medium italic tracking-wide px-2">
                  For when you know the answer, but really want a second opinion.
                </p>
              </div>

              {/* Glassmorphism Input Container with Split accent */}
              <div className="w-full bg-white/5 backdrop-blur-2xl p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 flex flex-col sm:flex-row gap-3 sm:gap-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={placeholder + "|"}
                  className="relative flex-1 bg-black/40 px-4 sm:px-8 py-4 sm:py-6 text-base sm:text-xl outline-none text-zinc-100 placeholder:text-zinc-600 font-medium rounded-xl sm:rounded-2xl border border-white/5 focus:border-zinc-500/50 focus:bg-black/60 transition-all shadow-inner"
                  onKeyDown={(e) => e.key === "Enter" && handleDecide()}
                />
                <motion.button
                  onClick={handleDecide}
                  disabled={loading || !userInput.trim() || userInput === lastSubmittedInput}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative bg-gradient-to-br from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700 text-white px-6 sm:px-10 py-4 sm:py-6 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-xl shadow-lg border border-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 whitespace-nowrap"
                  style={{ boxShadow: "0 0 20px rgba(161, 161, 170, 0.2)" }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                      <span
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <span
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </span>
                  ) : (
                    "SUMMON"
                  )}
                </motion.button>
              </div>

              <div className="h-12 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center"
                    >
                      <p className="text-zinc-400 font-serif italic text-sm sm:text-base animate-pulse">
                        The Judge is deliberating...
                      </p>
                    </motion.div>
                  ) : angelReason ? (
                    <motion.div
                      key="instruction"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center"
                    >

                      <div className="flex gap-8 text-zinc-500 font-bold text-[10px] sm:text-xs tracking-[0.25em] flex-wrap justify-center">
                        <motion.button
                          onClick={() => setView("angel")}
                          className="hover:text-sky-400 transition-colors cursor-pointer"
                          whileHover={{ scale: 1.1 }}
                        >
                          ← ANGEL
                        </motion.button>
                        <motion.button
                          onClick={() => setView("judge")}
                          className="hover:text-amber-500 transition-colors cursor-pointer"
                          whileHover={{ scale: 1.1 }}
                        >
                          JUDGE ↑
                        </motion.button>
                        <motion.button
                          onClick={() => setView("devil")}
                          className="hover:text-red-400 transition-colors cursor-pointer"
                          whileHover={{ scale: 1.1 }}
                        >
                          DEVIL →
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="hints"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-3 sm:gap-6 md:gap-12 text-zinc-600 font-bold text-[8px] sm:text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] flex-wrap justify-center"
                    >
                      <button
                        onClick={() => setView("angel")}
                        className="hover:text-sky-400 transition-colors cursor-pointer"
                      >
                        ← ANGEL
                      </button>
                      <button
                        onClick={() => setView("judge")}
                        className="hover:text-amber-500 transition-colors cursor-pointer"
                      >
                        JUDGE ↑
                      </button>
                      <button
                        onClick={() => setView("devil")}
                        className="hover:text-red-400 transition-colors cursor-pointer"
                      >
                        DEVIL →
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
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
              className="absolute top-4 sm:top-10 left-4 sm:left-20 w-20 sm:w-32 h-12 sm:h-20 opacity-80 animate-float"
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
              className="absolute top-20 sm:top-40 right-2 sm:right-10 w-24 sm:w-40 h-14 sm:h-24 opacity-70 animate-float-slow"
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
              className="absolute bottom-24 sm:bottom-32 left-1/4 w-24 sm:w-36 h-14 sm:h-22 opacity-60 animate-float-delayed"
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

            <div className="absolute top-4 right-4 z-30">
              <button
                onClick={() => setView("neutral")}
                className="text-sky-600 hover:text-sky-800 font-black text-sm sm:text-lg drop-shadow-md transition-colors"
              >
                BACK →
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

            <div className="absolute top-4 left-4 z-30">
              <button
                onClick={() => setView("neutral")}
                className="text-red-700 hover:text-red-500 font-black text-sm sm:text-lg drop-shadow-md transition-colors"
              >
                ← BACK
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
            className="absolute inset-0 z-20 bg-white bg-gradient-to-b from-neutral-200 to-neutral-50 flex items-center justify-center"
            style={{
              backgroundImage: "radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.05) 0%, transparent 100%)",
            }}
          >
            <div className="absolute top-4 right-4 z-30">
              <button
                onClick={() => setView("neutral")}
                className="text-stone-800 hover:text-amber-700 font-black text-sm sm:text-lg drop-shadow-md transition-colors"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                ↓ DISMISS
              </button>
            </div>
            <JudgeVerdict content={judgeReason} loading={loading} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

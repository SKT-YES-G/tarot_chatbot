import { motion } from "motion/react";

interface ChatMessageProps {
  message: string;
  isUser?: boolean;
}

export function ChatMessage({ message, isUser = false }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-5 py-4 ${
          isUser
            ? "bg-gradient-to-r from-amber-600/90 to-orange-600/90 text-white border border-amber-400/30"
            : "bg-purple-800/40 text-purple-100 border border-purple-500/20"
        }`}
      >
        <div className="whitespace-pre-wrap leading-relaxed">{message}</div>
      </div>
    </motion.div>
  );
}

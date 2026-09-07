import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  SentIcon,
} from "@hugeicons/core-free-icons";

const SHIKIGAMI_IMAGE = "/chatbot-image/shikigami.png";

const API_URL = import.meta.env.VITE_SHIKIGAMI_API_URL || "";

const createId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const QUICK_ACTIONS = [
  {
    label: "FIND A DROP",
    prompt: "Show me the latest ZENJI drops.",
  },
  {
    label: "SIZE GUIDE",
    prompt: "Help me choose the right T-shirt size.",
  },
  {
    label: "ORDER HELP",
    prompt: "I need help with my order.",
  },
  {
    label: "PICK FOR ME",
    prompt: "Recommend an anime T-shirt for me.",
  },
];

const STARTING_MESSAGES = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Summoning complete.\n\nI’m Shikigami. I can help you discover drops, choose your size, find a piece, or answer order questions.",
  },
];

function getLocalReply(message) {
  const text = message.toLowerCase();

  if (
    text.includes("latest") ||
    text.includes("drop") ||
    text.includes("new")
  ) {
    return "The newest pieces are waiting. Tell me what anime, character, or style you’re looking for and I’ll narrow the hunt.";
  }

  if (
    text.includes("size") ||
    text.includes("fit") ||
    text.includes("oversized")
  ) {
    return "Send me your height, weight, usual size, and whether you prefer a regular or oversized fit.";
  }

  if (
    text.includes("order") ||
    text.includes("track") ||
    text.includes("delivery")
  ) {
    return "Send me your order number and tell me whether you need tracking, delivery information, or help with an order issue.";
  }

  if (
    text.includes("recommend") ||
    text.includes("pick") ||
    text.includes("anime")
  ) {
    return "Tell me your anime or character preference and the style you want — minimal, dark, aggressive, vintage, or statement.";
  }

  if (text.includes("shipping")) {
    return "Tell me where you’re ordering from and I’ll guide you toward the right shipping information.";
  }

  if (
    text.includes("return") ||
    text.includes("refund") ||
    text.includes("exchange")
  ) {
    return "Tell me whether you need a return, exchange, or refund and briefly describe what happened.";
  }

  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey")
  ) {
    return "You found me. What are we hunting today?";
  }

  return "Ask me about drops, products, sizing, recommendations, shipping, or an existing order.";
}

async function getShikigamiResponse(message, history) {
  if (!API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 650));
    return getLocalReply(message);
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      history: history.map(({ role, content }) => ({
        role,
        content,
      })),
    }),
  });

  if (!response.ok) {
    throw new Error("Shikigami API request failed.");
  }

  const data = await response.json();

  if (!data?.reply) {
    throw new Error("Invalid Shikigami API response.");
  }

  return data.reply;
}

function ShikigamiAvatar({ size = "md" }) {
  const sizes = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  return (
    <div
      className={`
        relative
        shrink-0
        overflow-hidden
        rounded-full
        border
        border-[#a51622]/60
        bg-black
        ${sizes[size]}
      `}
    >
      <img
        src={SHIKIGAMI_IMAGE}
        alt="Shikigami"
        className="h-full w-full object-cover"
        draggable="false"
      />

      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <ShikigamiAvatar size="sm" />

      <div className="border border-white/10 bg-[#141313] px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((item) => (
            <motion.span
              key={item}
              className="h-1 w-1 rounded-full bg-[#c92732]"
              animate={{
                opacity: [0.3, 1, 0.3],
                y: [0, -2, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: item * 0.12,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ShikigamiChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(STARTING_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping, open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;

    if (window.innerWidth < 640) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const sendMessage = async (customMessage) => {
    const cleanMessage = (customMessage ?? input).trim();

    if (!cleanMessage || isTyping) return;

    const userMessage = {
      id: createId(),
      role: "user",
      content: cleanMessage,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }

    try {
      const reply = await getShikigamiResponse(
        cleanMessage,
        updatedMessages
      );

      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          content: reply,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          content:
            "The connection is unstable. Try summoning me again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleTextareaChange = (event) => {
    const element = event.target;

    setInput(element.value);

    element.style.height = "40px";
    element.style.height = `${Math.min(element.scrollHeight, 96)}px`;
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* CHAT WINDOW */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 18,
              scale: 0.96,
            }}
            transition={{
              duration: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              fixed
              inset-x-2
              bottom-2
              top-16
              z-[100]
              flex
              flex-col
              overflow-hidden
              border
              border-white/10
              bg-[#090909]
              shadow-2xl

              sm:inset-auto
              sm:bottom-20
              sm:right-5
              sm:h-[520px]
              sm:w-[345px]
            "
          >
            {/* HEADER */}

            <div className="relative shrink-0 overflow-hidden border-b border-white/10">
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={SHIKIGAMI_IMAGE}
                  alt=""
                  className="
                    absolute
                    -right-14
                    -top-14
                    h-40
                    w-40
                    object-cover
                    opacity-[0.06]
                  "
                />

                <div className="absolute -right-20 bottom-0 h-px w-48 -rotate-45 bg-[#a51622]/30" />
              </div>

              <div className="relative flex items-center justify-between px-3.5 py-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="relative">
                    <ShikigamiAvatar size="lg" />

                    <span
                      className="
                        absolute
                        bottom-0
                        right-0
                        h-2.5
                        w-2.5
                        rounded-full
                        border-2
                        border-[#090909]
                        bg-[#c92732]
                      "
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-[16px] font-black tracking-[-0.03em] text-[#f0ede5]">
                        SHIKIGAMI.
                      </h3>

                      <span
                        className="
                          h-1
                          w-1
                          rounded-full
                          bg-[#c92732]
                        "
                      />
                    </div>

                    <p className="mt-0.5 text-[9px] tracking-wide text-white/35">
                      Bound to guide your next drop.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close Shikigami"
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    border
                    border-white/10
                    text-white/45
                    transition
                    duration-200
                    hover:border-[#a51622]/70
                    hover:bg-[#a51622]/10
                    hover:text-white
                  "
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={15}
                    strokeWidth={1.7}
                  />
                </button>
              </div>

              <div
                className="
                  relative
                  flex
                  h-6
                  items-center
                  border-t
                  border-white/[0.05]
                  bg-white/[0.012]
                  px-3.5
                "
              >
                <span className="mr-2 h-1 w-1 rounded-full bg-[#c92732]" />

                <p className="text-[7px] uppercase tracking-[0.2em] text-white/25">
                  Channel stable
                </p>

                <span className="ml-auto text-[8px] text-[#c92732]/50">
                  式神
                </span>
              </div>
            </div>

            {/* MESSAGES */}

            <div
              ref={scrollRef}
              className="
                flex-1
                overflow-y-auto
                px-3.5
                py-4
                [scrollbar-color:#252525_transparent]
                [scrollbar-width:thin]
              "
            >
              <div className="space-y-4">
                {messages.map((message) => {
                  const assistant = message.role === "assistant";

                  return (
                    <motion.div
                      key={message.id}
                      initial={{
                        opacity: 0,
                        y: 6,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className={`
                        flex
                        items-end
                        gap-2

                        ${
                          assistant
                            ? "justify-start"
                            : "justify-end"
                        }
                      `}
                    >
                      {assistant && (
                        <ShikigamiAvatar size="sm" />
                      )}

                      <div
                        className={`
                          relative
                          max-w-[82%]
                          px-3
                          py-2.5
                          text-[11px]
                          leading-[1.65]

                          ${
                            assistant
                              ? `
                                border
                                border-white/10
                                bg-[#141313]
                                text-[#d8d4ca]
                              `
                              : `
                                border
                                border-[#a51622]
                                bg-[#a51622]
                                text-white
                              `
                          }
                        `}
                      >
                        <p className="whitespace-pre-wrap">
                          {message.content}
                        </p>

                        {assistant && (
                          <span className="absolute -left-px top-0 h-2.5 w-[2px] bg-[#c92732]" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {isTyping && <TypingIndicator />}
              </div>

              {/* QUICK ACTIONS */}

              {messages.length <= 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="mt-5"
                >
                  <p className="mb-2.5 text-[7px] font-semibold uppercase tracking-[0.22em] text-white/25">
                    QUICK SUMMON
                  </p>

                  <div className="grid grid-cols-2 gap-1.5">
                    {QUICK_ACTIONS.map((action) => (
                      <button
                        key={action.label}
                        type="button"
                        onClick={() =>
                          sendMessage(action.prompt)
                        }
                        className="
                          group
                          relative
                          overflow-hidden
                          border
                          border-white/[0.09]
                          bg-white/[0.02]
                          px-3
                          py-2.5
                          text-left
                          transition
                          duration-300
                          hover:border-[#a51622]/60
                          hover:bg-[#a51622]/[0.06]
                        "
                      >
                        <span className="text-[8px] font-bold tracking-[0.14em] text-[#d8d4ca]">
                          {action.label}
                        </span>

                        <span
                          className="
                            absolute
                            bottom-0
                            left-0
                            h-px
                            w-0
                            bg-[#c92732]
                            transition-all
                            duration-300
                            group-hover:w-full
                          "
                        />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* INPUT */}

            <div className="shrink-0 border-t border-white/10 bg-[#0c0c0c] p-2.5">
              <div
                className={`
                  relative
                  flex
                  items-end
                  gap-1.5
                  border
                  bg-black
                  p-1.5
                  transition-colors

                  ${
                    input
                      ? "border-[#a51622]/55"
                      : "border-white/10"
                  }
                `}
              >
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  maxLength={500}
                  rows={1}
                  placeholder="ASK SHIKIGAMI..."
                  className="
                    h-10
                    max-h-24
                    min-h-10
                    flex-1
                    resize-none
                    bg-transparent
                    px-2.5
                    py-[11px]
                    text-[10px]
                    leading-[18px]
                    text-[#eeeae0]
                    outline-none
                    placeholder:text-[8px]
                    placeholder:font-semibold
                    placeholder:tracking-[0.16em]
                    placeholder:text-white/20
                  "
                />

                <button
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping}
                  aria-label="Send message"
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    bg-[#a51622]
                    text-white
                    transition
                    duration-200
                    hover:bg-[#c12532]
                    disabled:cursor-not-allowed
                    disabled:bg-white/[0.06]
                    disabled:text-white/20
                  "
                >
                  <HugeiconsIcon
                    icon={SentIcon}
                    size={15}
                    strokeWidth={1.7}
                  />
                </button>
              </div>

              <p
                className="
                  mt-2
                  px-1
                  text-[6px]
                  uppercase
                  tracking-[0.17em]
                  text-white/15
                "
              >
                Enter to send · Shift + Enter
              </p>
            </div>

            <div className="flex h-[2px] shrink-0">
              <div className="w-[16%] bg-[#a51622]" />
              <div className="flex-1 bg-white/[0.04]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING SHIKIGAMI */}

      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.7,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.75,
            }}
            className="
              fixed
              bottom-4
              right-4
              z-[99]

              sm:bottom-5
              sm:right-5
            "
          >
            <motion.div
              animate={{
                scale: [1, 1.14, 1],
                opacity: [0.25, 0.06, 0.25],
              }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                pointer-events-none
                absolute
                inset-[-6px]
                rounded-full
                border
                border-[#a51622]/50
              "
            />

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Summon Shikigami"
              className="
                group
                relative
                flex
                h-[54px]
                w-[54px]
                items-center
                justify-center
                overflow-hidden
                rounded-full
                border
                border-[#a51622]/70
                bg-black
                shadow-[0_8px_28px_rgba(120,0,10,0.25)]
                transition
                duration-300

                hover:scale-105
                hover:border-[#d42b37]
                hover:shadow-[0_10px_35px_rgba(165,22,34,0.35)]
              "
            >
              <img
                src={SHIKIGAMI_IMAGE}
                alt="Shikigami"
                className="
                  h-full
                  w-full
                  object-cover
                  transition
                  duration-500
                  group-hover:scale-110
                "
                draggable="false"
              />

              <span
                className="
                  absolute
                  bottom-[4px]
                  right-[4px]
                  h-2
                  w-2
                  rounded-full
                  border
                  border-black
                  bg-[#c92732]
                "
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
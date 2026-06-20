"use client";

import { useEffect, useRef, useState } from "react";
import {
  Send,
  Search,
  MessageCircle,
  ArrowLeft,
  MoreVertical,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { socket } from "@/lib/socket";
import { useAuthStore } from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import SharedNavbar from "@/components/SharedNavbar";
import api from "@/lib/api";

interface Conversation {
  _id: string;
  participants: {
    _id: string;
    username: string;
    avatar?: string;
    role: "talent" | "startup";
  }[];
  lastMessage?: {
    text: string;
    createdAt: string;
  };
}

interface Message {
  _id: string;
  conversation: string;
  text: string;
  sender: {
    _id: string;
    username: string;
  };
  createdAt: string;
  isEdited?: boolean;
  editedAt?: string;
  isDeleted?: boolean;
  isRead?: boolean;
  readAt?: string | null;
}

export default function MessagesPage() {
  return (
    <ProtectedRoute allowedRole="startup">
      <MessagesContent />
    </ProtectedRoute>
  );
}

function MessagesContent() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);

  const [text, setText] = useState("");
  const [search, setSearch] = useState("");

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editText, setEditText] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuthStore();

  const fetchConversations = async () => {
    const res = await api.get("/conversations");
    setConversations(res.data.conversations || []);
  };

  const getOtherUser = (conversation: Conversation) => {
    return conversation.participants.find((p) => p._id !== user?._id);
  };

  const getConversationTitle = (conversation: Conversation) => {
    return getOtherUser(conversation)?.username || "Conversation";
  };

  const openConversation = async (conversation: Conversation) => {
    if (activeConversation?._id) {
      socket.emit("leaveConversation", activeConversation._id);
    }

    setActiveConversation(conversation);
    setOpenMenuId(null);
    setEditingMessage(null);

    socket.emit("joinConversation", conversation._id);

    const res = await api.get(`/messages/${conversation._id}`);
    setMessages(res.data.messages || []);

    await api.patch(`/messages/${conversation._id}/read`);
    fetchConversations();
  };

  const sendMessage = async () => {
    if (!text.trim() || !activeConversation) return;

    const messageText = text.trim();
    setText("");

    const res = await api.post(`/messages/${activeConversation._id}`, {
      text: messageText,
    });

    setMessages((prev) => {
      const exists = prev.some((m) => m._id === res.data.newMessage._id);
      if (exists) return prev;
      return [...prev, res.data.newMessage];
    });

    fetchConversations();
  };

  const startEdit = (message: Message) => {
    setEditingMessage(message);
    setEditText(message.text);
    setOpenMenuId(null);
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setEditText("");
  };

  const saveEdit = async () => {
    if (!editingMessage || !editText.trim()) return;

    const res = await api.patch(
      `/messages/message/${editingMessage._id}/edit`,
      {
        text: editText.trim(),
      },
    );

    const updated = res.data.updatedMessage;

    setMessages((prev) =>
      prev.map((m) => (m._id === updated._id ? updated : m)),
    );

    cancelEdit();
    fetchConversations();
  };

  const deleteForMe = async (messageId: string) => {
    await api.delete(`/messages/message/${messageId}/me`);

    setMessages((prev) => prev.filter((m) => m._id !== messageId));
    setOpenMenuId(null);
    fetchConversations();
  };

  const deleteForEveryone = async (messageId: string) => {
    const res = await api.delete(`/messages/message/${messageId}/everyone`);
    const deleted = res.data.deletedMessage;

    setMessages((prev) =>
      prev.map((m) => (m._id === deleted._id ? deleted : m)),
    );

    setOpenMenuId(null);
    fetchConversations();
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    const savedId = sessionStorage.getItem("openConversationId");

    if (!savedId || conversations.length === 0 || activeConversation) return;

    const conversation = conversations.find((c) => c._id === savedId);

    if (conversation) {
      sessionStorage.removeItem("openConversationId");
      openConversation(conversation);
    }
  }, [conversations, activeConversation]);

  useEffect(() => {
    if (!user?._id) return;

    if (!socket.connected) socket.connect();

    socket.emit("register", user._id);

    socket.on("newMessage", (message: Message) => {
      setMessages((prev) => {
        if (message.conversation !== activeConversation?._id) return prev;

        const exists = prev.some((m) => m._id === message._id);

        if (exists) {
          return prev.map((m) => (m._id === message._id ? message : m));
        }

        return [...prev, message];
      });

      fetchConversations();
    });

    return () => {
      socket.off("newMessage");
    };
  }, [user?._id, activeConversation?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredConversations = conversations.filter((conversation) =>
    getConversationTitle(conversation)
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const activeUser = activeConversation
    ? getOtherUser(activeConversation)
    : null;

  return (
    <>
      <SharedNavbar />

      <main className="fixed inset-x-0 bottom-0 top-[76px] overflow-hidden bg-[#F6F5F0] p-3 text-neutral-950 sm:p-5">
        <div className="mx-auto grid h-full max-w-7xl overflow-hidden rounded-[30px] border border-black/[0.06] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.08)] md:grid-cols-[380px_1fr]">
          <aside
            className={`h-full min-h-0 overflow-hidden border-r border-black/[0.06] bg-white ${
              activeConversation ? "hidden md:flex" : "flex"
            } flex-col`}
          >
            <div className="shrink-0 border-b border-black/[0.06] px-5 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
                Inbox
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
                Messages
              </h1>

              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-black/[0.06] bg-[#F6F5F0] px-4 py-3">
                <Search className="h-4 w-4 text-neutral-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations"
                  className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-neutral-400"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => {
                const isActive = activeConversation?._id === conversation._id;
                const title = getConversationTitle(conversation);
                const otherUser = getOtherUser(conversation);

                return (
                  <button
                    key={conversation._id}
                    onClick={() => openConversation(conversation)}
                    className={`flex w-full items-center gap-4 border-b border-black/[0.04] px-5 py-4 text-left transition ${
                      isActive ? "bg-[#F6F5F0]" : "hover:bg-[#FAFAF8]"
                    }`}
                  >
                    <Avatar
                      name={title}
                      src={otherUser?.avatar}
                      active={isActive}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-[15px] font-semibold text-neutral-950">
                          {title}
                        </p>

                        <p className="shrink-0 text-[11px] font-medium text-neutral-400">
                          {conversation.lastMessage?.createdAt
                            ? new Date(
                                conversation.lastMessage.createdAt,
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </p>
                      </div>

                      <p className="mt-1 line-clamp-1 text-sm leading-5 text-neutral-500">
                        {conversation.lastMessage?.text || "No messages yet"}
                      </p>
                    </div>
                  </button>
                );
              })}

              {filteredConversations.length === 0 && (
                <div className="flex h-full items-center justify-center p-8 text-center">
                  <div>
                    <MessageCircle className="mx-auto h-10 w-10 text-neutral-300" />
                    <p className="mt-3 text-sm font-medium text-neutral-500">
                      No conversations found
                    </p>
                  </div>
                </div>
              )}
            </div>
          </aside>

          <section
            className={`h-full min-h-0 min-w-0 overflow-hidden bg-[#F8F7F3] ${
              activeConversation
                ? "flex flex-col"
                : "hidden md:flex md:flex-col"
            }`}
          >
            {!activeConversation ? (
              <div className="flex h-full items-center justify-center p-10 text-center">
                <div>
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-white shadow-sm">
                    <MessageCircle className="h-9 w-9 text-neutral-950" />
                  </div>

                  <h2 className="mt-6 text-4xl font-semibold tracking-[-0.06em]">
                    Your messages
                  </h2>

                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-neutral-500">
                    Select a conversation to start chatting.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex h-[84px] shrink-0 items-center justify-between border-b border-black/[0.05] bg-white px-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <button
                      onClick={() => setActiveConversation(null)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F6F5F0] text-neutral-700 md:hidden"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>

                    <Avatar
                      name={activeUser?.username}
                      src={activeUser?.avatar}
                      active
                    />

                    <div className="min-w-0">
                      <h2 className="truncate text-base font-semibold">
                        {activeUser?.username || "Conversation"}
                      </h2>
                      <p className="text-xs font-medium capitalize text-neutral-400">
                        {activeUser?.role || "User"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8">
                  <div className="mx-auto flex max-w-3xl flex-col gap-2">
                    {messages.map((message) => {
                      const isMine = message.sender._id === user?._id;
                      const isEditing = editingMessage?._id === message._id;

                      return (
                        <div
                          key={message._id}
                          className={`group flex ${
                            isMine ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div className="relative max-w-[82%] md:max-w-[65%]">
                            <div
                              className={`rounded-[22px] px-4 py-2.5 shadow-sm ${
                                isMine
                                  ? "rounded-br-md bg-neutral-950 text-white"
                                  : "rounded-bl-md bg-white text-neutral-950"
                              }`}
                            >
                              {isEditing ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    value={editText}
                                    onChange={(e) =>
                                      setEditText(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") saveEdit();
                                      if (e.key === "Escape") cancelEdit();
                                    }}
                                    className="min-w-0 flex-1 rounded-full bg-white/10 px-3 py-2 text-sm font-medium outline-none"
                                    autoFocus
                                  />

                                  <button
                                    onClick={saveEdit}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-950"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>

                                  <button
                                    onClick={cancelEdit}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <p className="whitespace-pre-wrap break-words text-sm font-medium leading-6">
                                    {message.text}
                                  </p>

                                  <p
                                    className={`mt-1 text-right text-[10px] font-medium ${
                                      isMine
                                        ? "text-white/50"
                                        : "text-neutral-400"
                                    }`}
                                  >
                                    {message.isEdited && !message.isDeleted
                                      ? "edited · "
                                      : ""}

                                    {new Date(
                                      message.createdAt,
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}

                                    {isMine && (
                                      <span className="ml-1">
                                        · {message.isRead ? "Seen" : "Sent"}
                                      </span>
                                    )}
                                  </p>
                                </>
                              )}
                            </div>

                            {isMine && !isEditing && (
                              <div className="absolute -left-10 top-1 opacity-0 transition group-hover:opacity-100">
                                <button
                                  onClick={() =>
                                    setOpenMenuId(
                                      openMenuId === message._id
                                        ? null
                                        : message._id,
                                    )
                                  }
                                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-500 shadow-sm transition hover:text-neutral-950"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>

                                {openMenuId === message._id && (
                                  <div className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-1 shadow-[0_18px_45px_rgba(0,0,0,0.12)]">
                                    {!message.isDeleted && (
                                      <button
                                        onClick={() => startEdit(message)}
                                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-neutral-700 hover:bg-[#F6F5F0]"
                                      >
                                        <Pencil className="h-4 w-4" />
                                        Edit
                                      </button>
                                    )}

                                    <button
                                      onClick={() => deleteForMe(message._id)}
                                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-neutral-700 hover:bg-[#F6F5F0]"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Delete for me
                                    </button>

                                    {!message.isDeleted && (
                                      <button
                                        onClick={() =>
                                          deleteForEveryone(message._id)
                                        }
                                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        Delete everyone
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    <div ref={bottomRef} />
                  </div>
                </div>

                <div className="shrink-0 border-t border-black/[0.06] bg-white px-4 py-3">
                  <div className="mx-auto flex max-w-3xl items-center gap-3">
                    <input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") sendMessage();
                      }}
                      placeholder="Type a message"
                      className="h-12 min-w-0 flex-1 rounded-full border border-black/[0.06] bg-[#F6F5F0] px-5 text-sm font-medium outline-none placeholder:text-neutral-400"
                    />

                    <button
                      onClick={sendMessage}
                      disabled={!text.trim()}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

function Avatar({
  name,
  src,
  active,
}: {
  name?: string;
  src?: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold ${
        active ? "bg-neutral-950 text-white" : "bg-[#F6F5F0] text-neutral-700"
      }`}
    >
      {src ? (
        <img
          src={src}
          alt={name || "User"}
          className="h-full w-full object-cover"
        />
      ) : (
        name?.charAt(0)?.toUpperCase() || "M"
      )}
    </div>
  );
}

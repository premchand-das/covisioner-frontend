"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";

interface RequestUser {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  role: "talent" | "startup";
}

interface ConnectionRequest {
  _id: string;
  type: string;
  status: string;
  message?: string;
  sender?: RequestUser;
  receiver?: RequestUser;
  createdAt: string;
}

export default function ConnectionsPage() {
  return (
    <ProtectedRoute>
      <ConnectionsContent />
    </ProtectedRoute>
  );
}

function ConnectionsContent() {
  const [received, setReceived] = useState<ConnectionRequest[]>([]);
  const [sent, setSent] = useState<ConnectionRequest[]>([]);

  const fetchRequests = async () => {
    const receivedRes = await api.get("/connections/requests/received");
    const sentRes = await api.get("/connections/requests/sent");

    setReceived(receivedRes.data.requests);
    setSent(sentRes.data.requests);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const respondRequest = async (
    requestId: string,
    status: "accepted" | "rejected"
  ) => {
    await api.patch(`/connections/${requestId}/respond`, {
      status,
    });

    fetchRequests();
  };

  return (
    <main className="min-h-screen bg-[#070A12] p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">Connections</h1>
        <p className="mt-2 text-white/50">
          Manage hiring, co-founder, and connection requests.
        </p>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">Received Requests</h2>

          <div className="mt-5 grid gap-4">
            {received.map((req) => (
              <div
                key={req._id}
                className="rounded-2xl border border-white/10 bg-white/[0.05] p-6"
              >
                <div className="flex flex-col justify-between gap-5 md:flex-row">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {req.sender?.username}
                    </h3>

                    <p className="mt-1 text-sm text-white/50">
                      {req.sender?.role} • {req.type}
                    </p>

                    <p className="mt-4 text-white/60">
                      {req.message || "No message provided."}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => respondRequest(req._id, "accepted")}
                      className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => respondRequest(req._id, "rejected")}
                      className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-300"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {received.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-8 text-center text-white/50">
                No received requests.
              </div>
            )}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Sent Requests</h2>

          <div className="mt-5 grid gap-4">
            {sent.map((req) => (
              <div
                key={req._id}
                className="rounded-2xl border border-white/10 bg-white/[0.05] p-6"
              >
                <h3 className="text-xl font-semibold">
                  {req.receiver?.username}
                </h3>

                <p className="mt-1 text-sm text-white/50">
                  {req.receiver?.role} • {req.type}
                </p>

                <p className="mt-4 text-white/60">
                  {req.message || "No message provided."}
                </p>

                <span className="mt-4 inline-block rounded-full bg-white/10 px-3 py-1 text-sm capitalize text-white/70">
                  {req.status}
                </span>
              </div>
            ))}

            {sent.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-8 text-center text-white/50">
                No sent requests.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
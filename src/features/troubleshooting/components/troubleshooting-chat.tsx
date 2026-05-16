"use client";

import { FormEvent, useState } from "react";
import { Bot, Send, User } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  "Why are my leaves turning yellow?",
  "How often should I water this week?",
  "What should I do if seeds do not germinate?",
];

export function TroubleshootingChat({ projectId }: { projectId: string }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Ask me about pests, watering, leaf color, soil, or delays. I will answer using this project context.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };
    setMessages((current) => [...current, userMessage]);
    setQuestion("");
    setLoading(true);

    const response = await fetch("/api/ai/troubleshoot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, question: trimmed }),
    });
    const data = (await response.json()) as { answer?: string };

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          data.answer ??
          "I could not answer that right now. Try adding more details about the symptom.",
      },
    ]);
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Troubleshooting assistant"
        description="Ask project-aware questions. For serious crop disease, chemical use, or food safety decisions, confirm with a local expert."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardContent className="space-y-5 p-5">
            <div className="max-h-[55vh] space-y-4 overflow-y-auto pr-1">
              {messages.map((message) => {
                const assistant = message.role === "assistant";

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      !assistant && "justify-end",
                    )}
                  >
                    {assistant ? (
                      <Bot className="mt-2 h-5 w-5 shrink-0 text-primary" />
                    ) : null}
                    <div
                      className={cn(
                        "max-w-[85%] rounded-xl px-4 py-3 text-sm leading-6",
                        assistant
                          ? "bg-muted text-foreground"
                          : "bg-primary text-primary-foreground",
                      )}
                    >
                      {message.content}
                    </div>
                    {!assistant ? (
                      <User className="mt-2 h-5 w-5 shrink-0 text-primary" />
                    ) : null}
                  </div>
                );
              })}
              {loading ? (
                <p className="text-sm text-muted-foreground">AI is checking the plan context...</p>
              ) : null}
            </div>
            <form className="flex flex-col gap-3 sm:flex-row" onSubmit={sendMessage}>
              <Textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Describe the plant symptom or farming question..."
                className="min-h-20"
              />
              <Button type="submit" disabled={loading}>
                <Send className="h-4 w-4" /> Send
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-5">
            <h2 className="font-semibold">Suggested beginner questions</h2>
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion}
                type="button"
                variant="outline"
                className="h-auto w-full justify-start whitespace-normal text-left"
                onClick={() => setQuestion(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

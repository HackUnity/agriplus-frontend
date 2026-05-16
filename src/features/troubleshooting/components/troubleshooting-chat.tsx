"use client";

import { FormEvent, useState } from "react";
import { Bot, Send, User } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DiagnosisImageUpload } from "@/features/troubleshooting/components/diagnosis-image-upload";
import { ProjectContextPanel } from "@/features/troubleshooting/components/project-context-panel";
import {
  DIAGNOSIS_CATEGORIES,
  type DiagnosisCategory,
} from "@/features/troubleshooting/constants";
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

function buildQuestionPayload(
  question: string,
  category: DiagnosisCategory | null,
) {
  const parts = [question.trim()];
  if (category) {
    parts.push(`Category: ${category}`);
  }
  return parts.join("\n");
}

export function TroubleshootingChat({ projectId }: { projectId: string }) {
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState<DiagnosisCategory | null>(null);
  const [image, setImage] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Ask me about pests, watering, leaf color, soil, or delays. I will answer using this project context.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  function selectCategory(next: DiagnosisCategory) {
    setCategory((current) => (current === next ? null : next));
  }

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) {
      return;
    }

    const payload = buildQuestionPayload(trimmed, category);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: payload,
    };
    setMessages((current) => [...current, userMessage]);
    setQuestion("");
    setLoading(true);

    const response = await fetch("/api/ai/troubleshoot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, question: payload }),
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
                        "max-w-[85%] rounded-xl px-4 py-3 text-sm leading-6 whitespace-pre-wrap",
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
                <p className="text-sm text-muted-foreground">
                  AI is checking the plan context...
                </p>
              ) : null}
            </div>

            <form className="space-y-5 border-t pt-5" onSubmit={sendMessage}>
              <ProjectContextPanel projectId={projectId} />

              <div className="space-y-2">
                <Label className="text-sm font-medium">Quick diagnosis category</Label>
                <div className="flex flex-wrap gap-2">
                  {DIAGNOSIS_CATEGORIES.map((item) => {
                    const active = category === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => selectCategory(item)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:bg-muted",
                        )}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Textarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Example: Tomato leaves turned yellow after heavy rain and growth became slow."
                  className="min-h-24"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="shrink-0 sm:self-end"
                >
                  <Send className="h-4 w-4" /> Send
                </Button>
              </div>

              <DiagnosisImageUpload value={image} onChange={setImage} />
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

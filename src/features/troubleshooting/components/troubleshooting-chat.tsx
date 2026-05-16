"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, User } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ChatPromptComposer } from "@/features/troubleshooting/components/chat-prompt-composer";
import {
  DIAGNOSIS_CATEGORIES,
  type DiagnosisCategory,
} from "@/features/troubleshooting/constants";
import {
  askTroubleshootingExpert,
  buildCultivationPlanForExpert,
} from "@/lib/api/troubleshoot";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
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

type StepContext = {
  title: string;
  description: string;
};

export function TroubleshootingChat({
  projectId,
  stepContext,
}: {
  projectId: string;
  stepContext?: StepContext;
}) {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  function selectCategory(next: DiagnosisCategory) {
    setCategory((current) => (current === next ? null : next));
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) {
      return;
    }

    const payload = buildQuestionPayload(trimmed, category);
    const sentImage = image;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: payload,
      image: sentImage,
    };
    setMessages((current) => [...current, userMessage]);
    setQuestion("");
    setImage(undefined);
    setLoading(true);

    const cultivationPlan = buildCultivationPlanForExpert(projectId);
    let assistantContent: string;

    if (!cultivationPlan) {
      assistantContent =
        "No cultivation plan is available for this project yet. Complete onboarding with a land photo first, then ask again.";
    } else {
      try {
        const { answer } = await askTroubleshootingExpert({
          cultivation_plan: cultivationPlan,
          question: payload,
          targetedStepDescription: stepContext?.description,
        });
        assistantContent = answer;
      } catch (error) {
        assistantContent =
          error instanceof Error
            ? error.message
            : "I could not answer that right now. Try adding more details about the symptom.";
      }
    }

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: assistantContent,
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

      <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
        <Card className="flex flex-col overflow-hidden">
          <CardContent className="flex h-[min(720px,calc(100dvh-13rem))] flex-col p-0">
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <div className="space-y-4">
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
                          "max-w-[85%] space-y-2 rounded-xl px-4 py-3 text-sm leading-6",
                          assistant
                            ? "bg-muted text-foreground"
                            : "bg-primary text-primary-foreground",
                        )}
                      >
                        {message.image ? (
                          <div className="h-20 w-20 overflow-hidden rounded-lg border border-white/20">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={message.image}
                              alt="Attached plant photo"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : null}
                        <p className="whitespace-pre-wrap">{message.content}</p>
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
                <div ref={messagesEndRef} aria-hidden />
              </div>
            </div>

            <form
              className="shrink-0 space-y-4 border-t bg-background p-5"
              onSubmit={sendMessage}
            >
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Quick diagnosis category
                </Label>
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

              <ChatPromptComposer
                question={question}
                onQuestionChange={setQuestion}
                image={image}
                onImageChange={setImage}
                onSubmit={sendMessage}
                loading={loading}
                label={stepContext?.title}
                placeholder="Example: Tomato leaves turned yellow after heavy rain and growth became slow."
              />
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

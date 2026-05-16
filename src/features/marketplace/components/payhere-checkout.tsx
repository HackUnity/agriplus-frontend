"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

type PayhereCheckoutProps = {
  checkoutUrl: string;
  fields: Record<string, string>;
  sandbox?: boolean;
  onSubmitted?: () => void;
  onCompleted?: (payhereOrderId: string) => void;
  onError?: (message: string) => void;
};

declare global {
  interface Window {
    payhere?: {
      startPayment: (payment: Record<string, string | boolean>) => void;
      onCompleted?: (orderId: string) => void;
      onDismissed?: () => void;
      onError?: (error: string) => void;
    };
  }
}

function loadPayhereScript(sandbox: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.payhere) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = sandbox
      ? "https://sandbox.payhere.lk/lib/payhere.js"
      : "https://www.payhere.lk/lib/payhere.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load PayHere script"));
    document.body.appendChild(script);
  });
}

/** Pay via official PayHere JS SDK (correct sandbox flag + hash). */
export function PayhereCheckout({
  checkoutUrl,
  fields,
  sandbox = true,
  onSubmitted,
  onCompleted,
  onError,
}: PayhereCheckoutProps) {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const run = async () => {
      try {
        await loadPayhereScript(sandbox);
        const ph = window.payhere;
        if (!ph) {
          throw new Error("PayHere SDK not available");
        }

        ph.onCompleted = (orderId: string) => {
          onCompleted?.(orderId);
        };
        ph.onDismissed = () => {
          toast.message("Payment cancelled");
        };
        ph.onError = (error: string) => {
          toast.error(`PayHere: ${error}`);
          onError?.(error);
        };

        const payment: Record<string, string | boolean> = {
          sandbox,
          merchant_id: fields.merchant_id,
          return_url: fields.return_url,
          cancel_url: fields.cancel_url,
          notify_url: fields.notify_url,
          order_id: fields.order_id,
          items: fields.items,
          currency: fields.currency,
          amount: fields.amount,
          hash: fields.hash,
          first_name: fields.first_name,
          last_name: fields.last_name,
          email: fields.email,
          phone: fields.phone,
          address: fields.address,
          city: fields.city,
          country: fields.country,
        };
        if (fields.custom_1) payment.custom_1 = fields.custom_1;

        ph.startPayment(payment);
        onSubmitted?.();
      } catch (err) {
        console.warn("[PayHere] SDK failed, falling back to form POST", err);
        const form = document.createElement("form");
        form.method = "POST";
        form.action = checkoutUrl;
        form.style.display = "none";
        Object.entries(fields).forEach(([name, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = name;
          input.value = value;
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
        onSubmitted?.();
      }
    };

    void run();
  }, [checkoutUrl, fields, sandbox, onSubmitted, onCompleted, onError]);

  return null;
}

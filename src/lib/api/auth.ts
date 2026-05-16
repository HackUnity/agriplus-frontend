import { apiBaseUrl } from "@/lib/env";

export type UserOut = {
  id: string;
  username: string;
  first_name: string;
  surname: string;
  email: string;
  role: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
};

export type RegisterBody = {
  first_name: string;
  surname: string;
  email: string;
  password: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export class AuthApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

function parseDetail(detail: unknown): string {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === "object" && item && "msg" in item) {
          return String((item as { msg: string }).msg);
        }
        return String(item);
      })
      .join(" ");
  }
  return "Something went wrong. Please try again.";
}

async function apiFetch(url: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch {
    throw new AuthApiError(
      "Cannot reach the backend. Start the API on port 5000 and check NEXT_PUBLIC_API_URL in .env.local.",
      0,
    );
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>;
  }
  let message = "Something went wrong. Please try again.";
  try {
    const body = (await response.json()) as { detail?: unknown };
    if (body.detail !== undefined) {
      message = parseDetail(body.detail);
    }
  } catch {
    // ignore JSON parse errors
  }
  throw new AuthApiError(message, response.status);
}

export async function register(body: RegisterBody): Promise<UserOut> {
  const response = await apiFetch(`${apiBaseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      first_name: body.first_name,
      surname: body.surname,
      email: body.email,
      password: body.password,
    }),
  });
  return handleResponse<UserOut>(response);
}

export async function login(body: LoginBody): Promise<TokenResponse> {
  const form = new URLSearchParams();
  form.set("username", body.email);
  form.set("password", body.password);

  const response = await apiFetch(`${apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
  return handleResponse<TokenResponse>(response);
}

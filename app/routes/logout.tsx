import { json, MetaFunction, LoaderFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/cloudflare";



export const meta: MetaFunction = () => {
  return [
        { title: "Team to-do app" },
    { name: "description", content: "creado por david" },
  ];
};

export const loader: LoaderFunction = async ({ request, context }: LoaderFunctionArgs) => {

  return new Response(null, {
    status: 303,
    headers: {
      Location: "/login",
      "Set-Cookie": `sessionKey=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`,
    },
  });
}

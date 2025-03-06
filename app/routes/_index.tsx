import type { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/react";


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async ({ request, context }) => {

  return redirect("/dashboard");
}

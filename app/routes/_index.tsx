import type { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/react";


export const meta: MetaFunction = () => {
  return [
        { title: "Team to-do app" },
    { name: "description", content: "creado por david" },
  ];
};

export const loader: LoaderFunction = async ({ request, context }) => {

  return redirect("/dashboard");
}

import { json, MetaFunction } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/cloudflare";



export const meta: MetaFunction = () => {
  return [
        { title: "Team to-do app" },
    { name: "description", content: "creado por david" },
  ];
};

import { useActionData } from "@remix-run/react";

export default function Index() {
  const actionData = useActionData<{ errors?: { email?: string; password?: string } }>();
  return (

    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          alt="Your Company"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Registrarse y entrar a su cuenta
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <Form method="post" className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                Nombre
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Dirección de correo electrónico
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                {actionData?.errors?.email ? (
                  <em className="text-red-500">{actionData?.errors.email}</em>
                ) : null}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Contraseña
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                {actionData?.errors?.password ? (
                  <em className="text-red-500">{actionData?.errors.password}</em>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm/6">
                <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Ya tienes una cuenta?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Crear y entrar
              </button>
            </div>
          </Form>

        </div>

      </div>
    </div>
  );
}

export async function action({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = String(formData.get("name"));
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const errors: { email?: string; password?: string } = {};

  // if (!email.includes("@")) {
  //   errors.email = "Invalid email address";
  // }

  // if (password.length < 12) {
  //   errors.password =
  //     "Password should be at least 12 characters";
  // }
  let res0 = await fetch("https://puul-api.d300.workers.dev/register", {
    method: "POST",
    body: JSON.stringify({ name: name, email: email, password: password, role: "member" }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res0) => { return res0.json() });

  if (res0.success !== true) {
    errors.email = "we have an error";
  }

  let sessionKey = "";
  let res = await fetch("https://puul-api.d300.workers.dev/login", {
    method: "POST",
    body: JSON.stringify({ email: email, password: password }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => { return res.json() });


  if (res.error === "User not found") {
    errors.email = "User not found";
  } else if (res.error === "Invalid credentials") {
    errors.password = "Invalid credentials";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  sessionKey = res.sessionKey;
  console.log(res);


  // Save the session key in the cookie
  return new Response(null, {
    status: 303,
    headers: {
      Location: "/dashboard",
      "Set-Cookie": `sessionKey=${sessionKey}; Path=/; HttpOnly; SameSite=Strict`,
    },
  });
}

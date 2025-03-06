import type { MetaFunction } from "@remix-run/cloudflare";
import { data, Form, redirect, useLoaderData } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { useState } from 'react'
import { Form, useLoaderData } from "@remix-run/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// -título, 
// -descripción,
// estimación de horas, 
// -fecha de vencimiento, 
// -estado (active, completed)
// usuarios asignados (puede ser más de uno), 
// costo monetario por tarea.

const statuses = {
  active: 'text-gray-500 bg-gray-100/10',
  completed: 'text-green-400 bg-green-400/10',
  error: 'text-rose-400 bg-rose-400/10',
}
const environments = {
  Preview: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
  Production: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
}
const deployments = [
  {
    id: 1,
    href: '#',
    taskName: 'ios-app',
    status: 'active',
    expirationDate: 'Initiated 1m 32s ago',
    description: 'Deploys from GitHub',
    assignedUsers: ['Jane Cooper'],
  },
  // More deployments...
]


interface Env {
  KVSESS: KVNamespace;
}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
import type { LoaderFunction } from "@remix-run/cloudflare";
import { c } from "node_modules/vite/dist/node/moduleRunnerTransport.d-CXw_Ws6P";

export const loader: LoaderFunction = async ({
  request,
  context,
  params
}: {
  request: Request;
  context: { env: Env };
  params: { id: string };
}) => {
  const { env } = context;
  const cookieHeader = request.headers.get("Cookie");
  //parse the cookieheader to get the key value pair of the cookie
  let cookie: { sessionKey?: string } = cookieHeader?.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    return { ...acc, [key.trim()]: value };
  }, {});

  // This is the cookieheader is used to querrythe key value pair of the cookie using cloudflare kv

  const user = await fetch("https://puul-api.d300.workers.dev/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${cookie.sessionKey}`,
    },
  }).then((res) => { return res.json() });

  const tasks: { results: { id: string }[] } = await fetch("https://puul-api.d300.workers.dev/tasks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${cookie.sessionKey}`,
    },
  }).then((res) => res.json());

  const id = Number(params.id ?? "");
  let task = tasks.results.find((task) => task.id === id);
  console.log(task);

  return { user, task};
};


export default function Index() {
  let data = useLoaderData();
  let task = { ...data.task, assignedUsers: data.task.assignedUsers.map((user) => user.email) };

  const [formData, setFormData] = useState(task);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (

    <>
    <div className="max-w-2xl mx-auto p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Editar Tarea</h2>
      <Form method="post" className="space-y-4">
        <input type="hidden" name="id" value={formData.id} />
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="estimated_hours" className="block text-sm font-medium text-gray-700">Horas estimadas</label>
          <input
            type="number"
            name="estimated_hours"
            value={formData.estimated_hours}
            onChange={handleChange}
            required
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">Fecha de entrega</label>
          <input
            type="datetime-local"
            name="due_date"
            value={formData.due_date.split(".")[0]}
            onChange={handleChange}
            required
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          >
            <option value="active">Activo</option>
            <option value="completed">Completado</option>
          </select>
        </div>
        <div>
          <label htmlFor="cost" className="block text-sm font-medium text-gray-700">Costo</label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            required
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="assignedUsers" className="block text-sm font-medium text-gray-700">Usuarios asignados</label>
          <input
            type="text"
            name="assignedUsers"
            value={formData.assignedUsers}
            onChange={handleChange}
            required
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md">Guardar Cambios</button>
      </Form>
    </div>
    </>
  );
}

export const action: ActionFunction = async ({ request, params }) => {
  const body = new URLSearchParams(await request.text());
  let id;
  const idbody = Number(body.get("id") ?? "");
  const idurl = Number(params.id ?? "");
  if (idbody !== idurl) {
    return redirect("/dashboard");
  } else {
    id = idbody;
  }
  const title = body.get("title");
  const description = body.get("description");
  const estimated_hours = Number(body.get("estimated_hours") ?? 0);
  const due_date = body.get("due_date");
  const status = body.get("status");
  const cost = Number(body.get("cost") ?? 0);
  const assignedUsers = body.get("assignedUsers");
  const cookieHeader = request.headers.get("Cookie");
  //parse the cookieheader to get the key value pair of the cookie
  let cookie: { sessionKey?: string } = cookieHeader?.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    return { ...acc, [key.trim()]: value };
  }, {});

  let formatedAssignedUsers = assignedUsers.split(",").map((user) => (user.trim()));
  await fetch(`https://puul-api.d300.workers.dev/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${cookie.sessionKey}`,
    },
    body: JSON.stringify({ title, description, estimatedHours: estimated_hours, dueDate: due_date, status, cost, assignedUsers: formatedAssignedUsers }),
  });

  return redirect("/dashboard");
}
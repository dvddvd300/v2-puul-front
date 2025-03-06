import type { MetaFunction } from "@remix-run/cloudflare";
import { data, Form, redirect, useLoaderData } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { useState } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from '@headlessui/react'
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Bars3Icon, ChevronRightIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

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
        { title: "Team to-do app" },
    { name: "description", content: "creado por david" },
  ];
};
import type { LoaderFunction } from "@remix-run/cloudflare";
import { c } from "node_modules/vite/dist/node/moduleRunnerTransport.d-CXw_Ws6P";

export const loader: LoaderFunction = async ({
  request,
  context
}: {
  request: Request;
  context: { env: Env };
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

  const tasks = await fetch(`https://puul-api.d300.workers.dev/tasks?unassigned=true`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${cookie.sessionKey}`,
    },
  }).then((res) => { return res.json() });
  console.log(tasks);

  return { user, tasks };
};


export default function Index() {
  let data = useLoaderData();


  let tasklist = data.tasks.results;
  return (

    <>

      <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <h1 className="text-base/7 font-semibold text-white">Todas las tareas</h1>

        {/* Sort dropdown
        <Menu as="div" className="relative">
          <MenuButton className="flex items-center gap-x-1 text-sm/6 font-medium text-white">
            Sort by
            <ChevronUpDownIcon aria-hidden="true" className="size-5 text-gray-500" />
          </MenuButton>
          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <MenuItem>
              <a
                href="#"
                className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
              >
                Name
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href="#"
                className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
              >
                Date updated
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href="#"
                className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
              >
                Environment
              </a>
            </MenuItem>
          </MenuItems>
        </Menu> */}
      </header>        {/* Deployment list */}
      <ul role="list" className="divide-y divide-white/5">
        {tasklist.map((taskitem) => (
            <li key={taskitem.id} className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="min-w-0 flex-auto">
              <div className="flex items-center gap-x-3">
              <div className={classNames(statuses[taskitem.status], 'flex-none rounded-full p-1')}>
                <div className="size-2 rounded-full bg-current" />
              </div>
              <h2 className="min-w-0 text-sm/6 font-semibold text-white">
                <a href={`/dashboard/edit/${taskitem.id}`} className="block truncate">
                <span className="whitespace-nowrap">{taskitem.title}</span>
                <span className="absolute inset-0" />
                </a>
              </h2>
              </div>
              <div className="mt-3 flex items-center gap-x-2.5 text-xs/5 text-gray-400">
              <p className="truncate">{taskitem.description}</p>
              <svg viewBox="0 0 2 2" className="size-0.5 flex-none fill-gray-300">
                <circle r={1} cx={1} cy={1} />
              </svg>
              <p className="whitespace-nowrap">{taskitem.due_date}</p>
              <svg viewBox="0 0 2 2" className="size-0.5 flex-none fill-gray-300">
                <circle r={1} cx={1} cy={1} />
              </svg>
              <p className="whitespace-nowrap">{taskitem.estimated_hours}h</p>
              </div>
            </div>
            {taskitem.assignedUsers.length > 0 ? (
              taskitem.assignedUsers.map((user) => (
              (user.name && user.name !== "null") || user.email ? (
                <span title={user.name || user.email} key={user.name || user.email} className="flex-none">
                <img
                  src={`https://ui-avatars.com/api/?name=${user.name || user.email}&size=32&background=random`}
                  alt={user.name || user.email}
                  className="w-8 h-8 rounded-full"
                />
                </span>
              ) : null
              ))
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-700" />
            )}
            </li>
        ))}
      </ul>
    </>
  );
}

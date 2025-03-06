import type { MetaFunction } from "@remix-run/cloudflare";
import { Form, useLoaderData, Outlet, useLocation } from "@remix-run/react";
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
  PlusIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { Bars3Icon, ChevronRightIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}




interface Env {
  KVSESS: KVNamespace;
}

export const meta: MetaFunction = () => {
  return [
        { title: "Team to-do app" },
    { name: "description", content: "creado por david" },
  ];
};
import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";

export const loader: LoaderFunction = async ({
  request,
  context
}: {
  request: Request;
  context: { env: Env };
}) => {
  const { env } = context;
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) {
    return redirect("/login");
  }
  let cookie: { sessionKey?: string } = cookieHeader?.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    return { ...acc, [key.trim()]: value };
  }, {} as { sessionKey?: string });

  //if the cookie is not present redirect to the login page
  if (!cookie.sessionKey || cookie.sessionKey === "") {
    return redirect("/login");
  }

  // This is the cookieheader is used to querrythe key value pair of the cookie using cloudflare kv

  const user = await fetch("https://puul-api.d300.workers.dev/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${cookie.sessionKey}`,
    },
  }).then((res) => { return res.json() });
  return { user };
};


export default function Index() {
  let data = useLoaderData();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  let navigation = [
    { name: 'Mis Tareas', href: '/dashboard/my-tasks', icon: FolderIcon },
    { name: 'Tareas sin asignar', href: '/dashboard/unassigned', icon: ServerIcon },
    { name: 'Tareas completadas', href: '/dashboard/completed', icon: SignalIcon },
    { name: 'Todas las tareas', href: '/dashboard/tasks', icon: GlobeAltIcon },
    { name: 'Nueva Tarea', href: '/dashboard/new', icon: PlusIcon },
    { name: 'Salir', href: '/logout', icon: ArrowRightOnRectangleIcon },
  ]
  return (
    <div className="h-full bg-gray-900">
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 xl:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10">
              <div className="flex h-16 shrink-0 items-center">
                <img
                  alt="Your Company"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-auto"
                />
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className=
                            {`group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold ${location.pathname === item.href ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
                          >
                            <item.icon aria-hidden="true" className="size-6 shrink-0" />
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li>
                  </li>
                  <li className="-mx-6 mt-auto">
                    <a
                      href="#"
                      className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-gray-800"
                    >
                      <img
                        alt=""
                        src="data:image/png;base64,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"
                        className="size-8 rounded-full bg-gray-800"
                      />
                      <span className="sr-only">Tu nombre</span>
                      <div className="flex flex-col">
                        <span>{data?.user?.name?.trim() || "Unknown User"}</span>
                        <span className="text-gray-400">{data?.user?.email?.trim() || "No Email"}</span>
                      </div>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5">
          <div className="flex h-16 shrink-0 items-center">
            <img
              alt="Your Company"
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
              className="h-8 w-auto"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className=
                        {`group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold ${location.pathname === item.href ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
                      >
                        <item.icon aria-hidden="true" className="size-6 shrink-0" />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
              </li>
              <li className="-mx-6 mt-auto">
                <a
                  href="#"
                  className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-gray-800"
                >
                  <img
                    alt=""
                    src="data:image/png;base64,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"
                    className="size-8 rounded-full bg-gray-800"
                  />
                  <span className="sr-only">Tu nombre</span>
                  <div className="flex flex-col">
                    <span>{data?.user?.name?.trim() || "Unknown User"}</span>
                    <span className="text-gray-400">{data?.user?.email?.trim() || "No Email"}</span>
                  </div>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="xl:pl-72">
        {/* Sticky search header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">
          <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-white xl:hidden">
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-5" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form action="#" method="GET" className="grid flex-1 grid-cols-1">
              <input
                name="search"
                type="search"
                placeholder="Search"
                aria-label="Search"
                className="col-start-1 row-start-1 block size-full bg-transparent pl-8 text-base text-white outline-none placeholder:text-gray-500 sm:text-sm/6"
              />
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-500"
              />
            </form>
          </div>
        </div>
        <main className="lg:pr-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

"use client";
import { Fragment, useState, ReactNode, useEffect } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  ChartPieIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useUserContext } from "@/context/UserContext";
import {
  BadgePlus,
  LogOut,
  Mail,
  TruckIcon,
  UploadCloudIcon,
  User,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import axios, { AxiosResponse } from "axios";
import config from "@/config";
import Loader from "@/components/loader";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatCreatedAtDate } from "@/lib/utils";

interface DocumentData {
  images: string[];
}

const navigation = [
  {
    name: "Upload Documents",
    href: "/upload",
    icon: UploadCloudIcon,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: ChartPieIcon,
    disabled: true,
  },
  {
    name: "Communications",
    href: "/dashboard/communications",
    icon: BellIcon,
    disabled: true,
  },
  {
    name: "Documents",
    href: "/dashboard/documents",
    icon: PhotoIcon,
    disabled: true,
  },
  {
    name: "Vehicle Information",
    href: "/dashboard/vehicleInfo",
    icon: TruckIcon,
    disabled: true,
  },
];

const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);

  const { userInfo, logout } = useUserContext();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }

    setIsClient(true);
  }, [userInfo]);

  async function fetchDocuments() {
    try {
      const token = Cookies.get("token");

      if (!token) {
        router.push("/login");
        return;
      }

      setLoading(true);
      const { data }: AxiosResponse<DocumentData> = await axios.get(
        `${config.apiUrl}/documents`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setImages(data.images);
      if (data.images.length > 0) {
        router.push("/dashboard/analytics");
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (images.length !== 0) {
    return;
  }

  return (
    userInfo &&
    isClient && (
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-12 w-auto"
                        src="/assets/ecowheel-logo.png"
                        alt="EcoWheel"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className={classNames(
                                    item.href === pathname
                                      ? "bg-gray-800 text-white"
                                      : "text-gray-400 hover:text-white hover:bg-gray-800",
                                    `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                                      item.disabled && "cursor-not-allowed"
                                    }`
                                  )}
                                  onClick={(e) => {
                                    if (item.disabled) {
                                      e.preventDefault();
                                      window.alert(
                                        `Please upload documents first to view ${item.name}.`
                                      );
                                    }
                                  }}
                                >
                                  <item.icon
                                    className="h-6 w-6 shrink-0"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>

                        <li className="mt-auto">
                          <button
                            onClick={() => {
                              logout();
                              router.push("/login");
                            }}
                            className="group w-full -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                          >
                            <LogOut
                              className="h-6 w-6 shrink-0"
                              aria-hidden="true"
                            />
                            Log out
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center gap-2">
              <img
                className="h-12 w-auto"
                src="/assets/ecowheel-logo.png"
                alt="EcoWheel"
              />
              <p className="text-2xl font-semibold text-white">EcoWheel</p>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            item.href === pathname
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-800",
                            `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                              item.disabled && "cursor-not-allowed"
                            }`
                          )}
                          onClick={(e) => {
                            if (item.disabled) {
                              e.preventDefault();
                              window.alert(
                                `Please upload documents first to view ${item.name}.`
                              );
                            }
                          }}
                        >
                          <item.icon
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto">
                  <button
                    onClick={() => {
                      logout();
                      router.push("/login");
                    }}
                    className="group w-full -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <LogOut className="h-6 w-6 shrink-0" aria-hidden="true" />
                    Log out
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div
              className="h-6 w-px bg-gray-900/10 lg:hidden"
              aria-hidden="true"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
                <Link
                  href=""
                  className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                  onClick={(e) => {
                    e.preventDefault();
                    window.alert(
                      `Please upload documents first to view Communications.`
                    );
                  }}
                >
                  <span className="sr-only">View Communications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </Link>

                {/* Separator */}
                <div
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                  aria-hidden="true"
                />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <Menu.Button className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                      <svg
                        className="h-full w-full text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                    <span className="hidden lg:flex lg:items-center">
                      <span
                        className="ml-4 text-sm font-semibold leading-6 text-gray-900 capitalize"
                        aria-hidden="true"
                      >
                        Welcome, {userInfo.name}
                      </span>
                      <ChevronDownIcon
                        className="ml-2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      <Menu.Item>
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <div
                              className={classNames(
                                "flex px-3 py-1 text-sm w-32 leading-6 text-gray-900 hover:bg-blue-100 cursor-pointer"
                              )}
                            >
                              View Profile
                            </div>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl font-semibold mb-2">
                                Your Profile
                              </AlertDialogTitle>
                              <AlertDialogDescription className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <User className="w-6 h-auto text-black" />
                                    <h2 className="font-semibold">Name:</h2>
                                  </div>
                                  <p className="capitalize">{userInfo.name}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <Mail className="w-6 h-auto text-black" />
                                    <h2 className="font-semibold">Email:</h2>
                                  </div>
                                  <p>{userInfo.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <BadgePlus className="w-6 h-auto text-black" />
                                    <h2 className="font-semibold">
                                      Joined on:
                                    </h2>
                                  </div>
                                  <p>
                                    {formatCreatedAtDate(userInfo.createdAt)}
                                  </p>
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="btn-normal hover:text-white hover:bg-neutral-700">
                                Back
                              </AlertDialogCancel>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </Menu.Item>

                      <Menu.Item>
                        <div
                          onClick={() => {
                            logout();
                            router.push("/login");
                          }}
                          className={classNames(
                            "block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-blue-100 cursor-pointer"
                          )}
                        >
                          log out
                        </div>
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <main className="py-10 bg-gray-50">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    )
  );
}

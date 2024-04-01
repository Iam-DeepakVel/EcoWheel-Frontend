"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import config from "@/config";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { FileSearch } from "lucide-react";
import toast from "react-hot-toast";

const actions = [
  {
    title: "RC Front Image",
    badgeName: "RC Book",
    iconForeground: "text-teal-500",
    hover: "bg-teal-100",
    iconBackground: "bg-teal-50",
    desc: "Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut at blanditiis et quo et molestiae",
    key: "rcbookfrontImageURL",
  },
  {
    title: "RC Back Image",
    badgeName: "RC Book",
    iconForeground: "text-purple-500",
    hover: "bg-purple-100",
    iconBackground: "bg-purple-50",
    desc: "Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut at blanditiis et quo et molestiae",
    key: "rcbookbackImageURL",
  },
  {
    title: "License Front Image",
    badgeName: "License",
    iconForeground: "text-sky-500",
    hover: "bg-sky-100",
    iconBackground: "bg-sky-50",
    desc: "Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut at blanditiis et quo et molestiae",
    key: "licencefrontImageURL",
  },
  {
    title: "License Back Image",
    badgeName: "License",
    iconForeground: "text-yellow-500",
    hover: "bg-yellow-100",
    iconBackground: "bg-yellow-50",
    desc: "Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut at blanditiis et quo et molestiae",
    key: "licencebackImageURL",
  },
  {
    title: "Insurance Image",
    badgeName: "Insurance",
    iconForeground: "text-rose-500",
    hover: "bg-rose-100",
    iconBackground: "bg-rose-50",
    desc: "Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut at blanditiis et quo et molestiae",
    key: "insurancefrontImageURL",
  },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function DocumentsPage() {
  const [documentsImages, setDocumentsImages] = useState<any>();

  const [imageUrl, setImageUrl] = useState<any>(null);
  const [imageTitle, setImageTitle] = useState<any>(null);

  const token = Cookies.get("token");

  const fetchDocumentsImages = async () => {
    try {
      const { data } = await axios.get(`${config.apiUrl}/documents`, {
        headers: {
          Authorization: `Bearer ${token}`, // Make sure to include the authorization header
        },
      });
      setDocumentsImages(data.images[0]);
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocumentsImages();
  }, []);

  return (
    <div>
      {!imageUrl && (
        <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
          {actions.map((action, actionIdx) => (
            <div
              key={action.title}
              onClick={() => {
                setImageUrl(documentsImages[action.key]);
                setImageTitle(action.title);
              }}
              className={classNames(
                actionIdx === 0
                  ? "rounded-tl-lg rounded-tr-lg sm:rounded-tr-none"
                  : "",
                actionIdx === 1 ? "sm:rounded-tr-lg" : "",
                actionIdx === actions.length - 2 ? "sm:rounded-bl-lg" : "",
                actionIdx === actions.length - 1
                  ? "rounded-bl-lg rounded-br-lg sm:rounded-bl-none"
                  : "",
                `group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 cursor-pointer hover:bg-blue-100
                  transition-all duration-300 ease-in-out`
              )}
            >
              <div>
                <span
                  className={classNames(
                    action.iconBackground,
                    action.iconForeground,
                    "inline-flex rounded-lg p-3"
                  )}
                >
                  {action.badgeName}
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  <div className="focus:outline-none">
                    {/* Extend touch target to entire panel */}
                    <span className="absolute inset-0" aria-hidden="true" />
                    {action.title}
                  </div>
                </h3>
                <p className="mt-2 text-sm text-gray-500">{action.desc}</p>
              </div>
              <span
                className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <FileSearch className={`${action.iconForeground} `} />
              </span>
            </div>
          ))}
        </div>
      )}

      {imageUrl && (
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">{imageTitle}</h2>
            <button
              onClick={() => {
                setImageUrl(null);
                setImageTitle(null);
              }}
              className="btn-danger flex gap-2 items-center"
            >
              <ArrowUturnLeftIcon className="w-5 h-auto" />
              Back
            </button>
          </div>
          <img src={imageUrl} className="h-full w-full" />
        </div>
      )}
    </div>
  );
}

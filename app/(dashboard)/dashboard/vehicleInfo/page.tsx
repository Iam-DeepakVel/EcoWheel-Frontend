"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import config from "@/config";
import UploadDocuments from "@/components/upload";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

const ExpiryStacks = [
  {
    name: "Vehicle Number",
    initials: "VN",
    bgColor: "bg-pink-600",
    key: "regno",
  },
  {
    name: "Insurance Expiry",
    initials: "IN",
    bgColor: "bg-yellow-500",
    key: "insurance",
  },
  {
    name: "License Expiry",
    initials: "LI",
    bgColor: "bg-purple-600",
    key: "license",
  },
  {
    name: "RC Expiry",
    initials: "RC",
    bgColor: "bg-green-500",
    key: "rcbook",
  },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function VehicleInformation() {
  const [documents, setDocuments] = useState<any>();
  const [showUploadDocumentsUI, setShowUploadDocumentsUI] = useState(false);

  const fetchDocumentsInfo = async () => {
    const token = Cookies.get("token");

    try {
      const { data } = await axios.get(
        `${config.apiUrl}/documentsInformation`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDocuments(data[0]);
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocumentsInfo();
  }, []);

  function getExpiryDate(key: string): string {
    const ExpiryDateMap: any = {
      insurance: documents.insurance.end_date,
      license: documents.license.valid_date,
      rcbook: documents.rcbook.valid_date,
    };
    return ExpiryDateMap[key];
  }

  return (
    <div>
      {!showUploadDocumentsUI && documents && (
        <div className="px-4 lg:px-6">
          {/* Top Section */}
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                Vehicle Information
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                This table presents a streamlined overview of the extracted
                information sourced from the RC book, tailored to enhance your
                understanding.
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                onClick={() => {
                  setShowUploadDocumentsUI(true);
                }}
                className="btn-normal"
              >
                Upload Documents
              </button>
            </div>
          </div>

          {/* Expiry Stacks */}
          <div className="mt-6">
            <h2 className="text-sm font-medium text-gray-500">
              Expiration Information
            </h2>
            <ul
              role="list"
              className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
            >
              {ExpiryStacks.map((item) => (
                <li
                  key={item.key}
                  className="col-span-1 flex rounded-md shadow-sm"
                >
                  <div
                    className={classNames(
                      item.bgColor,
                      "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
                    )}
                  >
                    {item.initials}
                  </div>
                  <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
                    <div className="flex-1 truncate px-4 py-2 text-sm">
                      <p className="font-medium text-gray-900 hover:text-gray-600">
                        {item.name}
                      </p>
                      <p className="text-gray-500">
                        {item.key === "regno"
                          ? documents?.rcbook?.regno
                          : formatDate(getExpiryDate(item.key))}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* RC Info Table */}
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                      >
                        Property
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {Object.entries(documents?.rcbook).map(
                      ([key, value]: any) => (
                        <tr key={key} className="even:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                            {key}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {value}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3"></td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUploadDocumentsUI && (
        <UploadDocuments
          reset={false}
          goBack={true}
          setShowUploadDocumentsUI={setShowUploadDocumentsUI}
        />
      )}
    </div>
  );
}

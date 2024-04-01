"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import config from "@/config";
import { useUserContext } from "@/context/UserContext";
import { formatCreatedAtDate, getTimeFromDate } from "@/lib/utils";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import toast from "react-hot-toast";

export default function CommunicationsPage() {
  const [communications, setCommunications] = useState<any>();
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");

  const { userInfo, updateProfile } = useUserContext();

  const fetchCommunications = async () => {
    const token = Cookies.get("token");

    try {
      const response = await axios.get(`${config.apiUrl}/communications`, {
        headers: {
          Authorization: `Bearer ${token}`, // Make sure to include the authorization header
        },
      });
      setCommunications(response.data);
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error fetching communications:", error);
    }
  };

  const updateEmail = async () => {
    const token = Cookies.get("token");
    const updateEmailToast = toast.loading("Updating Email...");
    try {
      const response = await axios.patch(
        `${config.apiUrl}/update-profile`,
        { email: newEmail, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response);
        updateProfile(response.data.email);
      }
      toast.success(`Email updated as ${response.data.email}`, {
        id: updateEmailToast,
      });
    } catch (error: any) {
      toast.error(error.response.data.message, {
        id: updateEmailToast,
      });
      console.error("Error updating email:", error);
    }
  };

  useEffect(() => {
    fetchCommunications();
  }, []);

  return (
    <>
      {communications && (
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Top Section */}
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                Communications
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                You can review the timestamp indicating when the email
                containing suggestions for CO emissions was sent to your email
                address {userInfo?.email}.
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <Sheet>
                <SheetTrigger asChild>
                  <Button className="btn-normal">Update Email</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Edit Email</SheetTitle>
                    <SheetDescription>
                      Make changes to your profile here. Click save when you're
                      done.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        New Email
                      </Label>
                      <Input
                        id="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button onClick={updateEmail}>Save changes</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Table */}
          {communications.length !== 0 ? (
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
                          Date
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                        >
                          Time
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          CO Value
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Suggestion
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {communications.map((item: any) => (
                        <tr key={item._id} className="even:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                            {formatCreatedAtDate(item.createdAt)}
                          </td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                            {getTimeFromDate(item.createdAt)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.coValue}
                          </td>
                          <td className="whitespace-nowrap truncate px-3 py-4 text-sm text-gray-500 max-w-lg">
                            {item.suggestion}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                            <AlertDialog>
                              <AlertDialogTrigger>
                                <button className="text-indigo-600 hover:text-indigo-900">
                                  View Suggestion
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Suggestion
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    <p>{item.suggestion}</p>
                                    <p className="mt-2 text-xs">
                                      {formatCreatedAtDate(item.createdAt)} |{" "}
                                      {getTimeFromDate(item.createdAt)}
                                    </p>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Back</AlertDialogCancel>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-md mt-8">
              You don't have any communications before!
            </div>
          )}
        </div>
      )}
    </>
  );
}

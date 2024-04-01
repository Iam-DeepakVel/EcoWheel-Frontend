"use client";
import axios, { AxiosResponse } from "axios";
import { useState, ChangeEvent, FormEvent } from "react";
import Cookies from "js-cookie";
import config from "@/config";
import { useRouter } from "next/navigation";
import { RefreshCwIcon, UploadCloudIcon } from "lucide-react";
import { ArrowUturnLeftIcon } from "@heroicons/react/16/solid";

export default function UploadDocuments({
  reset,
  setShowUploadDocumentsUI,
  goBack,
}: {
  reset: boolean;
  goBack?: boolean;
  setShowUploadDocumentsUI?: any;
}) {
  const router = useRouter();

  const [rcbookfrontImage, setRcbookfrontImage] = useState<File | null>(null);
  const [rcbookbackImage, setRcbookbackImage] = useState<File | null>(null);
  const [licencefrontImage, setLicencefrontImage] = useState<File | null>(null);
  const [licencebackImage, setLicencebackImage] = useState<File | null>(null);
  const [insurancefrontImage, setInsurancefrontImage] = useState<File | null>(
    null
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
    setImage: (file: File | null) => void
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
    }
  };

  // Function to check whether all files are present
  // rcbook back is optional
  function isError(): boolean {
    return (
      !rcbookfrontImage &&
      !licencefrontImage &&
      !licencebackImage &&
      !insurancefrontImage
    );
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (isError()) {
      window.alert("Please upload all documents");
      return;
    }

    try {
      const token = Cookies.get("token");
      const formData = new FormData();
      formData.append("rcbookfrontImage", rcbookfrontImage!);
      formData.append("rcbookbackImage", rcbookbackImage!);
      formData.append("licencefrontImage", licencefrontImage!);
      formData.append("licencebackImage", licencebackImage!);
      formData.append("insurancefrontImage", insurancefrontImage!);

      const { data }: AxiosResponse<any> = await axios.post(
        `${config.apiUrl}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(data);

      if (data.success) {
        router.push("/dashboard/analytics");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="flex items-center justify-center font-bold text-2xl">
        Upload Documents
      </h2>
      <p className="text-center text-sm text-muted-foreground max-w-5xl mx-auto my-4">
        Upload your RC Book, Insurance, and License documents to seamlessly
        import your vehicle details and unlock the full potential of EcoWheel.
        Safeguard your vehicle information in one secure location for easy
        access and management.
      </p>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="p-8 rounded-lg bg-white shadow-lg shadow-blue-300"
      >
        <div>
          {/* RC */}
          <div className="mb-12">
            <h2 className="font-semibold text-xl mb-4">
              1. Registration Certificate (RC)
            </h2>

            <div className="flex items-center gap-32 px-6">
              {/* RC Front */}
              <div>
                <label htmlFor="rcbookfrontImage" className="font-medium">
                  i. Front Image <span className="text-xs text-red-500">*</span>
                </label>
                {rcbookfrontImage && (
                  <div className="flex gap-2 mt-2">
                    <h2 className="font-semibold text-muted-foreground text-sm">
                      File Name:{" "}
                    </h2>
                    <span className="text-muted-foreground text-sm">
                      {rcbookfrontImage?.name || "Rc_book_back_image"}
                    </span>
                  </div>
                )}
                <div className="mt-1 flex items-center">
                  <label className="btn-normal mt-2">
                    {rcbookfrontImage ? "File Selected" : "Select File"}
                    <input
                      type="file"
                      id="rcbookfrontImage"
                      name="rcbookfrontImage"
                      accept="image/png, image/jpeg"
                      onChange={(e) =>
                        handleImageChange(e, setRcbookfrontImage)
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* RC BACK */}
              <div>
                <label htmlFor="rcbookbackImage" className="font-medium">
                  ii. Back Image{" "}
                  <span className="text-muted-foreground text-xs">
                    (If present)
                  </span>
                </label>
                {rcbookbackImage && (
                  <div className="flex gap-2 mt-2">
                    <h2 className="font-semibold text-muted-foreground text-sm">
                      File Name:{" "}
                    </h2>
                    <span className="text-muted-foreground text-sm">
                      {rcbookbackImage?.name || "Rc_book_back_image"}
                    </span>
                  </div>
                )}
                <div className="mt-1 flex items-center">
                  <label className="btn-normal mt-2">
                    {rcbookbackImage ? "File Selected" : "Select File"}
                    <input
                      type="file"
                      id="rcbookbackImage"
                      name="rcbookbackImage"
                      accept="image/png, image/jpeg"
                      onChange={(e) => handleImageChange(e, setRcbookbackImage)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* License */}
          <div className="mb-12">
            <h2 className="font-semibold text-xl mb-4">2. License</h2>

            <div className="flex items-center gap-32 px-6">
              {/* License Front */}
              <div>
                <label htmlFor="licencefrontImage" className="font-medium">
                  i. Front Image <span className="text-xs text-red-500">*</span>
                </label>
                {licencefrontImage && (
                  <div className="flex gap-2 mt-2">
                    <h2 className="font-semibold text-muted-foreground text-sm">
                      File Name:{" "}
                    </h2>
                    <span className="text-muted-foreground text-sm">
                      {licencefrontImage?.name || "license_back_image"}
                    </span>
                  </div>
                )}
                <div className="mt-1 flex items-center">
                  <label className="btn-normal mt-2">
                    {licencefrontImage ? "File Selected" : "Select File"}
                    <input
                      type="file"
                      id="licencefrontImage"
                      name="licencefrontImage"
                      accept="image/png, image/jpeg"
                      onChange={(e) =>
                        handleImageChange(e, setLicencefrontImage)
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* License Back */}
              <div>
                <label htmlFor="licencebackImage" className="font-medium">
                  ii. Back Image <span className="text-xs text-red-500">*</span>
                </label>
                {licencebackImage && (
                  <div className="flex gap-2 mt-2">
                    <h2 className="font-semibold text-muted-foreground text-sm">
                      File Name:{" "}
                    </h2>
                    <span className="text-muted-foreground text-sm">
                      {licencebackImage?.name || "Rc_book_back_image"}
                    </span>
                  </div>
                )}
                <div className="mt-1 flex items-center">
                  <label className="btn-normal mt-2">
                    {licencebackImage ? "File Selected" : "Select File"}
                    <input
                      type="file"
                      id="licencebackImage"
                      name="licencebackImage"
                      accept="image/png, image/jpeg"
                      onChange={(e) =>
                        handleImageChange(e, setLicencebackImage)
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Insurance */}
          <div className="mb-6">
            <h2 className="font-semibold text-xl mb-4">3. Insurance</h2>

            <div className="flex items-center gap-32 px-6">
              <div>
                <label htmlFor="insurancefrontImage" className="font-medium">
                  i. Front Image <span className="text-xs text-red-500">*</span>
                </label>
                {insurancefrontImage && (
                  <div className="flex gap-2 mt-2">
                    <h2 className="font-semibold text-muted-foreground text-sm">
                      File Name:{" "}
                    </h2>
                    <span className="text-muted-foreground text-sm">
                      {insurancefrontImage?.name || "insurance_image"}
                    </span>
                  </div>
                )}
                <div className="mt-1 flex items-center">
                  <label className="btn-normal mt-2">
                    {insurancefrontImage ? "File Selected" : "Select File"}
                    <input
                      type="file"
                      id="insurancefrontImage"
                      name="insurancefrontImage"
                      accept="image/png, image/jpeg"
                      onChange={(e) =>
                        handleImageChange(e, setInsurancefrontImage)
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="flex">
          <div className="ml-auto flex items-center gap-4">
            {reset && (
              <div
                onClick={() => {
                  if (!isLoading) {
                    window.location.href = "/upload";
                  } else {
                    window.alert("Please wait until upload finishes!");
                  }
                }}
                className="btn-danger flex items-center gap-2"
              >
                Reset <RefreshCwIcon />
              </div>
            )}
            {goBack && (
              <div
                onClick={() => {
                  setShowUploadDocumentsUI(false);
                }}
                className="btn-danger flex items-center gap-2"
              >
                Back <ArrowUturnLeftIcon className="w-5 h-auto" />
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-normal flex items-center gap-2 "
            >
              {isLoading ? "Uploading..." : "Submit"} <UploadCloudIcon />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

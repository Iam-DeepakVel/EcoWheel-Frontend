"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";
import axios from "axios";
import Cookies from "js-cookie";
import { useUserContext } from "@/context/UserContext";
import config from "@/config";

export default function HomePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const { setUserInfo } = useUserContext();

  async function fetchProfileAndSetInLocalStorage() {
    try {
      setLoading(true);
      const token = Cookies.get("token");

      if (!token) {
        router.push("/register");
      } else {
        const { data } = await axios.get(`${config.apiUrl}/profile`, {
          headers: {
            token: token,
          },
        });

        if (data) {
          Cookies.set("user-details", JSON.stringify(data));
          setUserInfo(data);
          router.push("/upload");
        }
      }
    } catch (error) {
      console.log("Failed to fetch profile: ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfileAndSetInLocalStorage();
  }, []);

  if (loading) {
    return <Loader />;
  }
}

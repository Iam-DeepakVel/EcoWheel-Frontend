"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import config from "@/config";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function CheckConditionPage() {
  const [engineSize, setEngineSize] = useState<string>();
  const [kilometeresRan, setKilometersRan] = useState<string>();
  const [litresConsumed, setLitresConsumed] = useState<string>();

  async function checkCondition() {
    if (!engineSize || !kilometeresRan || !litresConsumed) {
      toast.error("Please fill all the fields!");
      return;
    }

    const token = Cookies.get("token");
    const checkConditionToast = toast.loading(
      "Predicting Vehicle Condition..."
    );
    try {
      const response = await axios.post(
        `${config.apiUrl}/predict-condition`,
        { engineSize, kilometeresRan, litresConsumed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.data.status) {
        toast("Vehicle causing environmental Pollution", {
          id: checkConditionToast,
          icon: "⚠️",
        });
      } else {
        toast.success("Vehicle is in good condition!", {
          id: checkConditionToast,
        });
      }
    } catch (error: any) {
      toast.error(error.response.data.message, {
        id: checkConditionToast,
      });
      console.error("Error updating email:", error);
    }
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="sm:flex-auto mb-4">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          Vehicle Condition Check
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          You can assess the environmental impact of a vehicle by providing the
          required inputs. Based on the assessment, you will receive suggestions
          for necessary modifications if the vehicle is found to be harmful to
          the environment.{" "}
        </p>
      </div>{" "}
      <div className="space-y-6">
        <div className="max-w-lg space-y-2">
          <Label htmlFor="engineSize" className="text-right">
            Enter Engine Size
          </Label>
          <Input
            id="engineSize"
            value={engineSize}
            onChange={(e) => setEngineSize(e.target.value)}
          />
        </div>

        <div className="max-w-lg space-y-2">
          <Label htmlFor="litresConsumed" className="text-right">
            Enter Litres Consumed
          </Label>
          <Input
            id="litresConsumed"
            value={litresConsumed}
            onChange={(e) => setLitresConsumed(e.target.value)}
          />
        </div>

        <div className="max-w-lg space-y-2">
          <Label htmlFor="kilometeresRan" className="text-right">
            Enter Kilometers Ran
          </Label>
          <Input
            id="kilometeresRan"
            value={kilometeresRan}
            onChange={(e) => setKilometersRan(e.target.value)}
          />
        </div>

        <Button onClick={checkCondition}>Check Condition</Button>
      </div>
    </div>
  );
}

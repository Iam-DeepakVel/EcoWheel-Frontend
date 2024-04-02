import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(inputDate: string): string {
  try {
    // Parse input date string into Date object
    const inputDateTime = new Date(inputDate);

    // Convert month number to abbreviated month name
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const formattedDate = `${inputDateTime.getDate()} ${
      months[inputDateTime.getMonth()]
    } ${inputDateTime.getFullYear()}`;

    return formattedDate;
  } catch (error) {
    return "Invalid date format. Please provide date in the format 'YYYY-MM-DD'.";
  }
}

export function formatCreatedAtDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const date: Date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
}

export function getTimeFromDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  const date: Date = new Date(dateString);
  return date.toLocaleString("en-US", options);
}


export function formatSuggestionPoints(text: string) {
  // Split the text into separate points
  const points = text.split(". ");
  return points;
}

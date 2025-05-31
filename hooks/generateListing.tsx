import { useState } from "react";
import * as FileSystem from "expo-file-system";

// Type for listing details returned by the API
interface ListingDetails {
  title: string;
  description: string;
  material: string;
  category: string;
  brand: string;
  condition: string;
  aesthetic: string;
  price: number;
}

// Function to convert image URI to base64
const imageToBase64 = async (uri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error;
  }
};

export const useGenerateListing = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateListing = async (
    frontImageUri: string,
    backImageUri: string
  ): Promise<ListingDetails> => {
    setIsGenerating(true);
    setError(null);

    try {
      // Convert images to base64
      const frontBase64 = await imageToBase64(frontImageUri);
      const backBase64 = await imageToBase64(backImageUri);

      // Get the local IP address
      const API_URL = "http://localhost:3000/api/route";

      console.log("Making API request to:", API_URL);

      // Make API call
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          frontbase64: frontBase64,
          backbase64: backBase64,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("API Error Response:", errorData);
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("API Response:", data);
      return data;
    } catch (error) {
      console.error("Error in generateListing:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        console.error("Error stack:", error.stack);
        setError(error.message);
      }
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateListing,
    isGenerating,
    error,
  };
};

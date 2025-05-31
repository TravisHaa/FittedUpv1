import React, { useState } from "react";
import { Platform } from "react-native";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useGenerateListing } from "../../hooks/generateListing";

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

const Sell = () => {
  // State for storing images
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);

  // State for listing details (will be populated by AI)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [condition, setCondition] = useState("");
  const [aesthetic, setAesthetic] = useState("");
  const [price, setPrice] = useState(0);

  // Use the generate listing hook
  const { generateListing, isGenerating, error } = useGenerateListing();
  const [isGenerationComplete, setIsGenerationComplete] = useState(false);

  // Function to request permissions and pick an image
  const pickImage = async (
    setImageFunction: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    // Show action sheet to choose between camera and library
    Alert.alert(
      "Choose Image",
      "Would you like to take a photo or choose from your library?",
      [
        {
          text: "Take Photo",
          onPress: async () => {
            // Request camera permission
            const cameraPermission =
              await ImagePicker.requestCameraPermissionsAsync();

            if (cameraPermission.granted === false) {
              Alert.alert(
                "Permission Required",
                "You need to allow access to your camera to take photos."
              );
              return;
            }

            // Launch camera
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.8,
            });

            if (!result.canceled) {
              setImageFunction(result.assets[0].uri);
            }
          },
        },
        {
          text: "Choose from Library",
          onPress: async () => {
            // Request library permission
            const libraryPermission =
              await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (libraryPermission.granted === false) {
              Alert.alert(
                "Permission Required",
                "You need to allow access to your photos to upload images."
              );
              return;
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.8,
            });

            if (!result.canceled) {
              setImageFunction(result.assets[0].uri);
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  // Function to handle generating listing
  const handleGenerateListing = async () => {
    // Validate that both images are uploaded
    if (!frontImage || !backImage) {
      Alert.alert(
        "Missing Images",
        "Please upload both front and back images of your item."
      );
      return;
    }

    try {
      console.log("generating...");
      const listingDetails = await generateListing(frontImage, backImage);

      //parse reutnred JSON from GPT

      // Update state with AI response
      setTitle(listingDetails.title);
      setDescription(listingDetails.description);
      setCategory(listingDetails.category);
      setBrand(listingDetails.brand);
      setCondition(listingDetails.condition);
      setAesthetic(listingDetails.aesthetic);
      setPrice(listingDetails.price);

      // Update completion state
      setIsGenerationComplete(true);
    } catch (error) {
      console.error("Error generating listing:", error);
      Alert.alert("Error", "Failed to generate listing. Please try again.");
    }
  };

  // Function to handle posting to different platforms
  const postToPlatform = (platform: string) => {
    Alert.alert(
      "Post to " + platform,
      `This would post your listing to ${platform} with the generated details.`,
      [{ text: "OK" }]
    );

    // In a real implementation:
    // 1. For eBay: Use the eBay API to create a listing
    // 2. For Depop: Redirect to Depop app with pre-filled data
    // 3. For Facebook Marketplace: Redirect to Marketplace with pre-filled data
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4">
        <View className="py-4">
          <Text className="text-2xl font-bold">Sell Your Item</Text>
          <Text className="text-gray-500 mt-1">
            Upload clothing images to generate a listing
          </Text>
        </View>

        {/* Image Upload Section */}
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity
            onPress={() => pickImage(setFrontImage)}
            className="w-[48%] h-48 rounded-lg bg-gray-100 justify-center items-center overflow-hidden"
            style={{ borderWidth: 1, borderColor: "#e0e0e0" }}
          >
            {frontImage ? (
              <Image source={{ uri: frontImage }} className="w-full h-full" />
            ) : (
              <View className="items-center">
                <Ionicons name="camera-outline" size={40} color="#666" />
                <Text className="mt-2 text-gray-500">Front Image</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => pickImage(setBackImage)}
            className="w-[48%] h-48 rounded-lg bg-gray-100 justify-center items-center overflow-hidden"
            style={{ borderWidth: 1, borderColor: "#e0e0e0" }}
          >
            {backImage ? (
              <Image source={{ uri: backImage }} className="w-full h-full" />
            ) : (
              <View className="items-center">
                <Ionicons name="camera-outline" size={40} color="#666" />
                <Text className="mt-2 text-gray-500">Back Image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Generate Listing Button */}
        {!isGenerationComplete && (
          <TouchableOpacity
            onPress={handleGenerateListing}
            disabled={isGenerating || !frontImage || !backImage}
            className={`py-3 rounded-lg items-center justify-center mb-6 ${
              isGenerating || !frontImage || !backImage
                ? "bg-gray-300"
                : "bg-black"
            }`}
          >
            {isGenerating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold">Generate Listing</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Listing Details Section */}
        {isGenerationComplete && (
          <ScrollView className="mb-6">
            <Text className="text-lg font-semibold mb-4">Listing Details</Text>

            <View className="mb-4">
              <Text className="text-gray-600 mb-1">Title:</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                className="border border-gray-300 rounded-lg p-3 text-base"
                placeholder="Item title"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-1">Description:</Text>
              <ScrollView className="border border-gray-300 rounded-lg">
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  className="p-3 text-base"
                  placeholder="Item description"
                  style={{ height: 200 }}
                />
              </ScrollView>
            </View>

            <View className="flex-row justify-between mb-4">
              <View className="w-[30%]">
                <Text className="text-gray-600 mb-1">Category</Text>
                <TextInput
                  value={category}
                  onChangeText={setCategory}
                  className="border border-gray-300 rounded-lg p-3 text-base"
                  placeholder="Category"
                />
              </View>

              <View className="w-[30%]">
                <Text className="text-gray-600 mb-1">Brand</Text>
                <TextInput
                  value={brand}
                  onChangeText={setBrand}
                  className="border border-gray-300 rounded-lg p-3 text-base"
                  placeholder="Brand"
                />
              </View>

              <View className="w-[30%]">
                <Text className="text-gray-600 mb-1">Material</Text>
                <TextInput
                  value={material}
                  onChangeText={setMaterial}
                  className="border border-gray-300 rounded-lg p-3 text-base"
                  placeholder="Material"
                />
              </View>
            </View>

            <View className="flex-row justify-between mb-4">
              <View className="w-[30%]">
                <Text className="text-gray-600 mb-1">Condition</Text>
                <TextInput
                  value={condition}
                  onChangeText={setCondition}
                  className="border border-gray-300 rounded-lg p-3 text-base"
                  placeholder="Condition"
                />
              </View>

              <View className="w-[30%]">
                <Text className="text-gray-600 mb-1">Aesthetic</Text>
                <TextInput
                  value={aesthetic}
                  onChangeText={setAesthetic}
                  className="border border-gray-300 rounded-lg p-3 text-base"
                  placeholder="Aesthetic"
                />
              </View>

              <View className="w-[30%]">
                <Text className="text-gray-600 mb-1">Price</Text>
                <TextInput
                  value={price.toString()}
                  onChangeText={(text) => setPrice(Number(text) || 0)}
                  keyboardType="numeric"
                  className="border border-gray-300 rounded-lg p-3 text-base"
                  placeholder="Price"
                />
              </View>
            </View>

            <Text className="text-lg font-semibold mb-4">Post To</Text>

            <View className="flex-col justify-between mb-4">
              <TouchableOpacity
                onPress={() => postToPlatform("eBay")}
                className="w-full bg-blue-500 py-3 rounded-lg items-center"
              >
                <Text className="text-white font-semibold">eBay</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => postToPlatform("Depop")}
                className="w-full bg-pink-500 py-3 rounded-lg items-center "
              >
                <Text className="text-white font-semibold">Depop</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => postToPlatform("Facebook")}
                className="w-full bg-blue-600 py-3 rounded-lg items-center "
              >
                <Text className="text-white font-semibold">Facebook</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Sell;
const styles = StyleSheet.create({});

import React, { useState } from "react";
import { Platform } from "react-native";
import { ListingDetails } from "types/types";
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
import GradientBackground from "../../components/GradientBackground";
import GlassView from "../../components/GlassView";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useGenerateListing } from "../../hooks/generateListing";
import { useRouter } from "expo-router";

// Type for listing details returned by the API

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

// Function to prepare images for WebView
const prepareImagesForWebView = async (
  frontImage: string | null,
  backImage: string | null
) => {
  const images = [];

  if (frontImage) {
    try {
      const base64Data = await imageToBase64(frontImage);
      images.push({ data: base64Data, mimeType: "image/jpeg" });
    } catch (error) {
      console.error("Error converting front image:", error);
    }
  }

  if (backImage) {
    try {
      const base64Data = await imageToBase64(backImage);
      images.push({ data: base64Data, mimeType: "image/jpeg" });
    } catch (error) {
      console.error("Error converting back image:", error);
    }
  }

  return images;
};

const Sell = () => {
  // State for storing images
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);

  const [listingDetails, setListingDetails] = useState<ListingDetails | null>(
    null
  );
  // State for listing details (will be populated by AI)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [condition, setCondition] = useState("");
  const [aesthetic, setAesthetic] = useState("");
  const [price, setPrice] = useState(0);
  const router = useRouter();

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
      const generated = await generateListing(frontImage, backImage);
      setListingDetails(generated);
      //parse reutnred JSON from GPT

      // Update state with AI response
      if (listingDetails !== null) {
        setTitle(listingDetails.title);
        setDescription(listingDetails.description);
        setCategory(listingDetails.category);
        setBrand(listingDetails.brand);
        setCondition(listingDetails.condition);
        setAesthetic(listingDetails.aesthetic);
        setPrice(listingDetails.price);
      } else {
        console.error("Listing generated is null");
      }

      // Update completion state
      setIsGenerationComplete(true);
    } catch (error) {
      console.error("Error generating listing:", error);
      Alert.alert("Error", "Failed to generate listing. Please try again.");
    }
  };

  // Placeholder for opening Depop, eBay, or Facebook apps
  const openDepopApp = () => {
    Alert.alert(
      "Feature Coming Soon",
      "This functionality will be available in a future update."
    );
  };

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-4">
        <View className="py-4">
          <Text className="text-2xl font-bold text-white">Sell Your Item</Text>
          <Text className="text-white/70 mt-1">Upload clothing images to generate a listing</Text>
        </View>

        {/* Image Upload Section */}
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity
            onPress={() => pickImage(setFrontImage)}
            className="w-[48%] h-48 rounded-lg justify-center items-center overflow-hidden"
            style={{ borderWidth: 0 }}
          >
            <GlassView style={{ width: '100%', height: '100%' }}>
              {frontImage ? (
                <Image source={{ uri: frontImage }} className="w-full h-full" />
              ) : (
                <View className="items-center">
                  <Ionicons name="camera-outline" size={40} color="#e5e7eb" />
                  <Text className="mt-2 text-white/80">Front Image</Text>
                </View>
              )}
            </GlassView>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => pickImage(setBackImage)}
            className="w-[48%] h-48 rounded-lg justify-center items-center overflow-hidden"
            style={{ borderWidth: 0 }}
          >
            <GlassView style={{ width: '100%', height: '100%' }}>
              {backImage ? (
                <Image source={{ uri: backImage }} className="w-full h-full" />
              ) : (
                <View className="items-center">
                  <Ionicons name="camera-outline" size={40} color="#e5e7eb" />
                  <Text className="mt-2 text-white/80">Back Image</Text>
                </View>
              )}
            </GlassView>
          </TouchableOpacity>
        </View>

        {/* Generate Listing Button */}
        {!isGenerationComplete && (
          <TouchableOpacity
            onPress={handleGenerateListing}
            disabled={isGenerating || !frontImage || !backImage}
            className={`py-3 rounded-lg items-center justify-center mb-6 ${
              isGenerating || !frontImage || !backImage
                ? "bg-white/30"
                : "bg-black/80"
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
            <Text className="text-lg font-semibold mb-4 text-white">Listing Details</Text>

            <View className="mb-4">
              <Text className="text-white/80 mb-1">Title:</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                className="border border-white/20 rounded-lg p-3 text-base text-white"
                placeholder="Item title"
                placeholderTextColor="#e5e7eb"
              />
            </View>

            <View className="mb-4">
              <Text className="text-white/80 mb-1">Description:</Text>
              <ScrollView className="border border-white/20 rounded-lg">
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  className="p-3 text-base text-white"
                  placeholder="Item description"
                  style={{ height: 200 }}
                  placeholderTextColor="#e5e7eb"
                />
              </ScrollView>
            </View>

            <View className="flex-row justify-between mb-4">
              <View className="w-[30%]">
                <Text className="text-white/80 mb-1">Category</Text>
                <TextInput
                  value={category}
                  onChangeText={setCategory}
                  className="border border-white/20 rounded-lg p-3 text-base text-white"
                  placeholder="Category"
                  placeholderTextColor="#e5e7eb"
                />
              </View>

              <View className="w-[30%]">
                <Text className="text-white/80 mb-1">Brand</Text>
                <TextInput
                  value={brand}
                  onChangeText={setBrand}
                  className="border border-white/20 rounded-lg p-3 text-base text-white"
                  placeholder="Brand"
                  placeholderTextColor="#e5e7eb"
                />
              </View>

              <View className="w-[30%]">
                <Text className="text-white/80 mb-1">Material</Text>
                <TextInput
                  value={material}
                  onChangeText={setMaterial}
                  className="border border-white/20 rounded-lg p-3 text-base text-white"
                  placeholder="Material"
                  placeholderTextColor="#e5e7eb"
                />
              </View>
            </View>

            <View className="flex-row justify-between mb-4">
              <View className="w-[30%]">
                <Text className="text-white/80 mb-1">Condition</Text>
                <TextInput
                  value={condition}
                  onChangeText={setCondition}
                  className="border border-white/20 rounded-lg p-3 text-base text-white"
                  placeholder="Condition"
                  placeholderTextColor="#e5e7eb"
                />
              </View>

              <View className="w-[30%]">
                <Text className="text-white/80 mb-1">Aesthetic</Text>
                <TextInput
                  value={aesthetic}
                  onChangeText={setAesthetic}
                  className="border border-white/20 rounded-lg p-3 text-base text-white"
                  placeholder="Aesthetic"
                  placeholderTextColor="#e5e7eb"
                />
              </View>

              <View className="w-[30%]">
                <Text className="text-white/80 mb-1">Price</Text>
              <TextInput
                  value={price.toString()}
                onChangeText={(text: string) => setPrice(Number(text) || 0)}
                  keyboardType="numeric"
                  className="border border-white/20 rounded-lg p-3 text-base text-white"
                  placeholder="Price"
                  placeholderTextColor="#e5e7eb"
                />
              </View>
            </View>

            <Text className="text-lg font-semibold mb-4 text-white">Post To</Text>

            <View className="flex-col justify-between mb-4">
              <TouchableOpacity
                onPress={async () => {
                  try {
                    // Prepare listing data to pass to WebView
                    const images = await prepareImagesForWebView(
                      frontImage,
                      backImage
                    );
                    const listingData = {
                      title,
                      description,
                      category,
                      brand,
                      condition,
                      aesthetic,
                      price,
                      material,
                      images,
                    };

                    // Navigate to eBay WebView with listing data
                    router.push({
                      pathname: "/platformWebView",
                      params: {
                        listingData: JSON.stringify(listingData),
                        platform: "ebay",
                        url: "https://www.ebay.com/sh/lst/active",
                      },
                    });
                  } catch (error) {
                    console.error("Error preparing listing data:", error);
                    Alert.alert(
                      "Error",
                      "Failed to prepare listing data. Please try again."
                    );
                  }
                }}
                className="w-full py-3 rounded-lg items-center"
              >
                <GlassView>
                  <Text className="text-white font-semibold">eBay</Text>
                </GlassView>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  try {
                    // Prepare listing data to pass to WebView
                    const images = await prepareImagesForWebView(
                      frontImage,
                      backImage
                    );
                    const listingData = {
                      title,
                      description,
                      category,
                      brand,
                      condition,
                      aesthetic,
                      price,
                      material,
                      images,
                    };

                    // Navigate to WebView with listing data
                    router.push({
                      pathname: "/platformWebView",
                      params: { listingData: JSON.stringify(listingData) },
                    });
                  } catch (error) {
                    console.error("Error preparing listing data:", error);
                    Alert.alert(
                      "Error",
                      "Failed to prepare listing data. Please try again."
                    );
                  }
                }}
                className="w-full py-3 rounded-lg items-center"
              >
                <GlassView>
                  <Text className="text-white font-semibold">Depop</Text>
                </GlassView>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  try {
                    // Prepare listing data to pass to WebView
                    const images = await prepareImagesForWebView(
                      frontImage,
                      backImage
                    );
                    const listingData = {
                      title,
                      description,
                      category,
                      brand,
                      condition,
                      aesthetic,
                      price,
                      material,
                      images,
                    };

                    // Navigate to Facebook Marketplace WebView with listing data
                    router.push({
                      pathname: "/platformWebView",
                      params: {
                        listingData: JSON.stringify(listingData),
                        platform: "facebook",
                        url: "https://www.facebook.com/marketplace/create/item",
                      },
                    });
                  } catch (error) {
                    console.error("Error preparing listing data:", error);
                    Alert.alert(
                      "Error",
                      "Failed to prepare listing data. Please try again."
                    );
                  }
                }}
                className="w-full py-3 rounded-lg items-center"
              >
                <GlassView>
                  <Text className="text-white font-semibold">Facebook</Text>
                </GlassView>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Sell;
const styles = StyleSheet.create({});

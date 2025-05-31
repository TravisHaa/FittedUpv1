import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native";
import React from "react";

// Closet screen - displays user's listed items (static UI for MVP)
const Closet = () => {
    // Mock data for listed items
    const mockListedItems = [
        { id: 1, title: "Vintage Nike Hoodie", price: "$45", image: "https://placehold.co/100x100/png?text=Nike" },
        { id: 2, title: "Levi's Denim Jacket", price: "$65", image: "https://placehold.co/100x100/png?text=Levis" },
        { id: 3, title: "Adidas Track Pants", price: "$35", image: "https://placehold.co/100x100/png?text=Adidas" },
        { id: 4, title: "Champion T-Shirt", price: "$25", image: "https://placehold.co/100x100/png?text=Champion" },
        { id: 5, title: "Patagonia Fleece", price: "$85", image: "https://placehold.co/100x100/png?text=Patagonia" },
    ];

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-4 py-4">
                <Text className="text-2xl font-bold">My Closet</Text>
                <Text className="text-gray-500 mt-1">Items you've listed for sale</Text>
            </View>

            <ScrollView className="flex-1 px-4">
                {mockListedItems.map((item) => (
                    <View key={item.id} className="flex-row items-center p-3 bg-gray-50 rounded-lg mb-3">
                        <Image 
                            source={{ uri: item.image }} 
                            className="w-20 h-20 rounded-md" 
                        />
                        <View className="ml-3 flex-1">
                            <Text className="font-semibold text-base">{item.title}</Text>
                            <Text className="text-green-600 font-bold">{item.price}</Text>
                            <View className="flex-row mt-1">
                                <View className="bg-blue-100 rounded-full px-2 py-1 mr-1">
                                    <Text className="text-xs text-blue-800">eBay</Text>
                                </View>
                                <View className="bg-pink-100 rounded-full px-2 py-1 mr-1">
                                    <Text className="text-xs text-pink-800">Depop</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default Closet
const styles = StyleSheet.create({})
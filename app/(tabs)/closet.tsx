import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native";
import GradientBackground from "../../components/GradientBackground";
import GlassView from "../../components/GlassView";
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
        <GradientBackground>
            <SafeAreaView className="flex-1">
                <View className="px-4 py-4">
                    <Text className="text-2xl font-bold text-white">My Closet</Text>
                    <Text className="text-white/70 mt-1">Items you've listed for sale</Text>
                </View>

                <ScrollView className="flex-1 px-4">
                    {mockListedItems.map((item) => (
                        <GlassView key={item.id} style={{ marginBottom: 12 }}>
                            <View className="flex-row items-center">
                                <Image 
                                    source={{ uri: item.image }} 
                                    className="w-20 h-20 rounded-md" 
                                />
                                <View className="ml-3 flex-1">
                                    <Text className="font-semibold text-base text-white">{item.title}</Text>
                                    <Text className="text-green-300 font-bold">{item.price}</Text>
                                    <View className="flex-row mt-1">
                                        <GlassView style={{ marginRight: 6 }}>
                                            <Text className="text-xs text-white">eBay</Text>
                                        </GlassView>
                                        <GlassView>
                                            <Text className="text-xs text-white">Depop</Text>
                                        </GlassView>
                                    </View>
                                </View>
                            </View>
                        </GlassView>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </GradientBackground>
    )
}

export default Closet
const styles = StyleSheet.create({})
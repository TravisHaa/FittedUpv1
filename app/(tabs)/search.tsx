import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native'
import GradientBackground from '../../components/GradientBackground'
import GlassView from '../../components/GlassView'



// Search screen component for displaying search functionality
const Search = () => {
  return (
    <GradientBackground>
      <SafeAreaView className="flex-1">
        <View className="px-4 py-4">
          <GlassView>
            <Text className="text-white text-lg">Search Screen</Text>
          </GlassView>
        </View>
      </SafeAreaView>
    </GradientBackground>
  )
}

export default Search

const styles = StyleSheet.create({})

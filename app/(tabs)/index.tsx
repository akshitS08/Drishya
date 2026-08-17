import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Image, ScrollView, View } from "react-native";

const Index = () => {
  return (
   <View className= "flex-1 bg-primary ">
    <Image source={images.bg}
    className="absolute w-full z-0"
    />
    <ScrollView className="flex-1 px-5" 
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{minHeight: "100%", paddingBottom: 10}}
    >
      <Image source={icons.logo} className="w-44 h-24 mt-20 mb-3 mx-auto" />
    </ScrollView>
   </View>
  );
}

export default Index; 
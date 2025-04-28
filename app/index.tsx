import { Colors } from "@/utils/Colors";
import { Stack } from "expo-router";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Image,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Dropdown } from "react-native-element-dropdown";
import { useState } from "react";
import { getImageDimensions } from "@/utils/helper";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import moment from "moment";

const examplePrompts = [
  "A serene sunset over a mountain range with a calm lake reflecting the colors of the sky.",
  "A cyberpunk-style female warrior with glowing blue armor and a robotic arm.",
  "A majestic lion with a golden mane sitting on a rock during sunset.",
  "A spaceship flying through a galaxy filled with colorful nebulae and stars.",
  "A grand ancient castle on a hill surrounded by mist and forests.",
  "A dragon flying over a medieval village with fire in the background.",
  "A futuristic cityscape with flying cars and neon lights at night.",
  "A magical library with floating books and glowing orbs of light.",
];

const modelData = [
  { label: "Flux.1-dev", value: "black-forest-labs/FLUX.1-dev" },
  { label: "FLUX.1-schnell", value: "black-forest-labs/FLUX.1-schnell" },
  {
    label: "Stable Diffusion 3.5L",
    value: "stabilityai/stable-diffusion-3.5-large",
  },
  {
    label: "Stable Diffusion XL",
    value: "stabilityai/stable-diffusion-xl-base-1.0",
  },
  {
    label: "Stable Diffusion v1.5",
    value: "stable-diffusion-v1-5/stable-diffusion-v1-5",
  },
];

const aspectRadioData = [
  { label: "1/1", value: "1/1" },
  { label: "16/9", value: "16/9" },
  { label: "9/16", value: "9/16" },
];

export default function Index() {
  const [prompt, setPrompt] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [aspectRatio, setAspectRatio] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<any>("");
  const [isFocus, setIsFocus] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generatePrompt = () => {
    const prompt =
      examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    setPrompt(prompt);
  };

  const generateImage = async () => {
    console.log(prompt, model, aspectRatio);
    setIsLoading(true);
    const MODEL_URL = `https://router.huggingface.co/hf-inference/models/${model}`;
    const { width, height } = getImageDimensions(aspectRatio);
    console.log("width", width, "height", height);

    const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

    try {
      const response = await fetch(MODEL_URL, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            width,
            height,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Hata mesajını ayrıştır
        console.error("API Error:", errorData); // Hata detaylarını konsola yazdır
        throw new Error(
          errorData.error || "An error occurred while generating the image."
        );
      }

      const blob = await response.blob();
      console.log(blob);

      const fileReaderInstance = new FileReader();
      fileReaderInstance.readAsDataURL(blob);
      fileReaderInstance.onload = () => {
        const base64data = fileReaderInstance.result;
        console.log("image url", base64data);
        setIsLoading(false);
        setImageUrl(base64data);
      };
    } catch (error) {
      console.error("Error:", error.message || error); // Hata mesajını konsola yazdır
      alert(error.message || "An error occurred while generating the image.");
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    const base64data = imageUrl.split("data:image/jpeg;base64")[1];
    const date = moment().format("YYYYMMDDHHmmss");

    try {
      const filename = FileSystem.documentDirectory + `${date}.jpg`;
      await FileSystem.writeAsStringAsync(filename, base64data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await MediaLibrary.saveToLibraryAsync(filename);
      alert("Downloaded Successfully!");
    } catch (error) {
      console.log(error);
    }
  };
  const handleSharing = async () => {
    const base64data = imageUrl.split("data:image/jpeg;base64")[1];
    const date = moment().format("YYYYMMDDHHmmss");

    try {
      const filename = FileSystem.documentDirectory + `${date}.jpg`;
      await FileSystem.writeAsStringAsync(filename, base64data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      Sharing.shareAsync(filename);
      alert("Shared Successfully!");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Stack.Screen
        options={{
          title: "AI Image Generator",
          headerStyle: { backgroundColor: Colors.background },
          headerTitleStyle: { color: Colors.text },
          headerTitleAlign: "center",
        }}
      />
      <StatusBar hidden={true} />

      <View style={styles.container}>
        <View style={{ height: 150, marginBottom: -5 }}>
          <TextInput
            style={styles.inputField}
            placeholder="Describe your imagination in detail..."
            placeholderTextColor={Colors.placeholder}
            numberOfLines={3}
            multiline={true}
            textAlignVertical="top"
            value={prompt}
            onChangeText={(text) => setPrompt(text)}
          />
          <TouchableOpacity
            style={styles.ideaBtn}
            onPress={() => generatePrompt()}
          >
            <FontAwesome5 name="dice" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          containerStyle={styles.dropdownContainer}
          data={modelData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Select Model" : "..."}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          itemTextStyle={styles.itemTextStyle}
          searchPlaceholder="Search..."
          value={model}
          dropdownPosition="auto"
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setModel(item.value);
            setIsFocus(false);
          }}
          renderItem={(item) => (
            <View
              style={[
                styles.item,
                model === item.value && styles.selectedItem, // Seçilen öğe için özel stil
              ]}
            >
              <Text style={styles.itemText}>{item.label}</Text>
            </View>
          )}
        />
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          containerStyle={styles.dropdownContainer}
          data={aspectRadioData}
          search={false}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Select Aspect Ratio" : "..."}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          itemTextStyle={styles.itemTextStyle}
          value={aspectRatio}
          dropdownPosition="auto"
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setAspectRatio(item.value);
            setIsFocus(false);
          }}
          renderItem={(item) => (
            <View
              style={[
                styles.item,
                aspectRatio === item.value && styles.selectedItem, // Seçilen öğe için özel stil
              ]}
            >
              <Text style={styles.itemText}>{item.label}</Text>
            </View>
          )}
        />

        <TouchableOpacity style={styles.button} onPress={() => generateImage()}>
          <Text style={styles.buttonText}>Generate</Text>
        </TouchableOpacity>

        {isLoading && (
          <View style={styles.imageContainer}>
            <ActivityIndicator size={"large"} color={Colors.accent} />
          </View>
        )}

        {imageUrl && (
          <>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: imageUrl,
                }}
                style={styles.image}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => {
                  handleDownload();
                }}
              >
                <FontAwesome5 name="download" size={20} color={Colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => {
                  handleSharing();
                }}
              >
                <FontAwesome5 name="share" size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </>
  );
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  inputField: {
    backgroundColor: Colors.dark,
    padding: 20,
    borderRadius: 10,
    borderColor: Colors.accent,
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.2,
    height: windowHeight * 0.15, // Dinamik yükseklik
    color: Colors.text,
    textAlign: "left",
  },
  ideaBtn: {
    backgroundColor: Colors.accent,
    padding: 7,
    borderRadius: 50,
    alignSelf: "flex-end",
    marginTop: -45, // Butonu yukarı kaydır
    marginRight: 10, // Sağdan boşluk
  },
  dropdown: {
    height: 50,
    backgroundColor: Colors.dark,
    borderColor: Colors.accent,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10, // Dropdown'lar arasında boşluk
  },
  dropdownContainer: {
    backgroundColor: Colors.dark,
    borderRadius: 10,
    borderColor: Colors.accent,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: -50, // Açılan menüyü yukarı kaydır
  },
  button: {
    backgroundColor: Colors.accent,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.2,
    textAlign: "center",
  },
  imageContainer: {
    marginTop: 30,
    width: windowWidth - 40,
    height: windowHeight * 0.3, // Dinamik yükseklik
    borderRadius: 10,
    borderColor: Colors.accent,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden", // Taşan görüntüyü gizle
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    resizeMode: "contain",
    width: "100%",
  },
  downloadButton: {
    backgroundColor: Colors.accent,
    padding: 16,
    borderRadius: 50,
    alignSelf: "flex-end",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 30,
    marginBottom: 10,
  },
  placeholderStyle: {
    color: Colors.text, // Placeholder yazı rengi
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.2,
    textAlign: "left",
  },
  selectedTextStyle: {
    color: Colors.text, // Seçilen öğe yazı rengi
    fontSize: 16,
    fontWeight: "500",
  },
  inputSearchStyle: {
    color: Colors.text, // Arama kutusu yazı rengi
    fontSize: 16,
  },
  itemTextStyle: {
    color: Colors.text, // Açılan menüdeki yazı rengi
    fontSize: 16,
  },
  item: {
    padding: 10,
    backgroundColor: Colors.dark, // Varsayılan arka plan
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.accent,
  },
  selectedItem: {
    backgroundColor: Colors.accent, // Seçilen öğe arka plan rengi
  },
  itemText: {
    fontSize: 16,
    color: Colors.text, // Açılan menüdeki yazı rengi
  },
});

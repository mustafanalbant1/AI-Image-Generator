# AI Image Generator 📸✨

Bu proje, kullanıcının verdiği açıklamaya (prompt) göre yapay zeka destekli görseller oluşturan bir **React Native** uygulamasıdır.  
Projede Hugging Face API'leri kullanılarak farklı modellerden görseller üretilmektedir.

## Özellikler

- 📜 Prompt (açıklama) girerek görsel oluşturma
- 🎲 Rastgele prompt önerisi
- 🧠 Farklı AI modelleri arasından seçim yapabilme
- 📐 Görsel boyutu için farklı en-boy oranları seçebilme
- 💾 Görselleri indirme ve paylaşma
- 🔥 Yükleme sırasında `ActivityIndicator` ile yüklenme animasyonu

## Kullanılan Teknolojiler

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [expo-router](https://expo.dev/router)
- [Hugging Face Inference API](https://huggingface.co/inference-api)
- [react-native-element-dropdown](https://www.npmjs.com/package/react-native-element-dropdown)
- [expo-sharing](https://docs.expo.dev/versions/latest/sdk/sharing/)
- [expo-media-library](https://docs.expo.dev/versions/latest/sdk/media-library/)
- [expo-file-system](https://docs.expo.dev/versions/latest/sdk/filesystem/)
- [moment.js](https://momentjs.com/)
- [FontAwesome5 Icons](https://fontawesome.com/)

## Kurulum 🚀

1. Depoyu klonlayın:

    ```bash
    git clone https://github.com/kullaniciadi/ai-image-generator.git
    cd ai-image-generator
    ```

2. Bağımlılıkları yükleyin:

    ```bash
    npm install
    # veya
    yarn install
    ```

3. `.env` dosyası oluşturun ve Hugging Face API anahtarınızı ekleyin:

    ```env
    EXPO_PUBLIC_API_KEY=YOUR_HUGGINGFACE_API_KEY
    ```

4. Projeyi çalıştırın:

    ```bash
    npx expo start
    ```

## Kullanım 📱

- Prompt yazın ya da 🎲 butonuna basarak rastgele bir prompt oluşturun.
- Model seçin.
- Aspect Ratio (Görsel oranı) seçin.
- `Generate` butonuna basarak görseli oluşturun.
- Oluşturulan görseli ister **indir**, ister **paylaş**!

## Görseller

| Prompt Girişi ve Model Seçimi | Görsel Üretimi ve İndirme |
| :---------------------------: | :-----------------------: |
| ![Prompt Girişi](assets/screens/prompt-screen.png) | ![Görsel Üretimi](assets/screens/image-screen.png) |

## Dizin Yapısı

```bash
src/
 ├── utils/
 │    ├── Colors.ts
 │    └── helper.ts
 ├── components/
 │    └── (Varsa componentlar buraya)
 └── screens/
      └── Index.tsx

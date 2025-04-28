export const getImageDimensions = (aspectRadio: string, baseSize = 512) => {
  const [width, height] = aspectRadio.split("/").map(Number);
  const scaleFactor = baseSize / Math.sqrt(width * height);
  let calculatedWidth = Math.round(width * scaleFactor);
  let calculatedHeight = Math.round(height * scaleFactor);

  calculatedWidth = Math.floor(calculatedWidth / 16);
  calculatedHeight = Math.floor(calculatedHeight / 16);

  return {
    width: calculatedWidth,
    height: calculatedHeight,
  };
};

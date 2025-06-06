import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// API box type using tuples
type BoxTuples = {
  top_left: [number, number];
  top_right: [number, number];
  bottom_left: [number, number];
  bottom_right: [number, number];
};

// Convert tuples to { x, y, width, height }
function tuplesToBoxDims(box?: BoxTuples) {
  if (!box) return undefined;
  const x = box.top_left[0];
  const y = box.top_left[1];
  const width = box.top_right[0] - box.top_left[0];
  const height = box.bottom_left[1] - box.top_left[1];
  return { x, y, width, height };
}

function getDebugBoxTuples(boxSize = 240): BoxTuples {
  const x = (screenWidth - boxSize) / 2;
  const y = (screenHeight - boxSize) / 2;
  return {
    top_left: [x, y],
    top_right: [x + boxSize, y],
    bottom_left: [x, y + boxSize],
    bottom_right: [x + boxSize, y + boxSize],
  };
}

// hook to create a box in a set location
export const useBouncingBox = (
  boxSize = 240,
  intervalMs = 1000,
  durationMs = 900,
  apiBox?: BoxTuples
) => {
  // Use tuplesToBoxDims to get {x, y, width, height}
  const initialBox = tuplesToBoxDims(apiBox) ?? tuplesToBoxDims(getDebugBoxTuples())!;
  const [boxDims, setBoxDims] = useState(initialBox);
  const position = useRef(new Animated.ValueXY({ x: boxDims.x, y: boxDims.y })).current;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const moveBox = () => {
      const nextBoxDims = tuplesToBoxDims(apiBox) ?? tuplesToBoxDims(getDebugBoxTuples())!;
      setBoxDims(nextBoxDims);
      Animated.timing(position, {
        toValue: { x: nextBoxDims.x, y: nextBoxDims.y },
        duration: durationMs,
        useNativeDriver: false,
      }).start();

      timeoutId = setTimeout(moveBox, intervalMs);
    };

    moveBox();

    return () => {
      clearTimeout(timeoutId);
      position.stopAnimation();
    };
  }, [boxSize, intervalMs, durationMs, apiBox, position]);

  return { position, width: boxDims.width, height: boxDims.height };
};
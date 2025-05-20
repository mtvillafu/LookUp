import { useEffect, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const useBouncingBox = (boxSize = 60, speedX = 2, speedY = 3) => {
  const position = useRef(new Animated.ValueXY({ x: 100, y: 100 })).current;
  const direction = useRef({ x: speedX, y: speedY }).current;
  const coords = useRef({ x: 100, y: 100 }); // Track coordinates manually

  useEffect(() => {
    let animationFrameId: number;

    const update = () => {
      // Move based on direction
      coords.current.x += direction.x;
      coords.current.y += direction.y;

      // Bounce off screen edges
      if (coords.current.x <= 0 || coords.current.x + boxSize >= screenWidth) direction.x *= -1;
      if (coords.current.y <= 0 || coords.current.y + boxSize >= screenHeight) direction.y *= -1;

      // Apply new position to Animated.ValueXY
      position.setValue({
        x: coords.current.x,
        y: coords.current.y,
      });

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return position;
};

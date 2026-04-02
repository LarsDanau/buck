import type { AnimateProps, Transition } from "react-native-ease";
import type { PressableProps } from "react-native";

// Constants
const TAB_HIT_SLOP_TOP = 16;
const TAB_HIT_SLOP_BOTTOM = 16;
const TAB_HIT_SLOP_LEFT = 20;
const TAB_HIT_SLOP_RIGHT = 20;

const TAB_PRESS_SPRING_DAMPING = 16;
const TAB_PRESS_SPRING_STIFFNESS = 280;
const TAB_PRESS_SPRING_MASS = 0.8;

const DEFAULT_SCALE = 1;

export const tabPressableHitSlop: PressableProps["hitSlop"] = {
  top: TAB_HIT_SLOP_TOP,
  bottom: TAB_HIT_SLOP_BOTTOM,
  left: TAB_HIT_SLOP_LEFT,
  right: TAB_HIT_SLOP_RIGHT,
};

export const tabPressTransition: Transition = {
  transform: {
    type: "spring",
    damping: TAB_PRESS_SPRING_DAMPING,
    stiffness: TAB_PRESS_SPRING_STIFFNESS,
    mass: TAB_PRESS_SPRING_MASS,
  },
};

export function getScaleAnimation(
  isPressed: boolean,
  pressedScale: number,
): AnimateProps {
  return {
    scale: isPressed ? pressedScale : DEFAULT_SCALE,
  };
}

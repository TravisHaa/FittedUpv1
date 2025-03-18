import { Text, TextProps } from "react-native";

interface StyledTextProps extends TextProps {
  variant?: "default" | "title" | "subtitle";
}

export  function StyledText({
  style,
  variant = "default",
  ...props
}: StyledTextProps) {
  const variants = {
    default: {
      fontFamily: "future-italic-bold",
      fontSize: 16,
    },
    title: {
      fontFamily: "future-italic-bold",
      fontSize: 24,
      fontWeight: "bold",
      color: "white",
    },
    subtitle: {
      fontFamily: "future-italic-bold",
      fontSize: 20,
      color: "white",
    },
  };

  return <Text style={[variants[variant], style]} {...props} />;
}

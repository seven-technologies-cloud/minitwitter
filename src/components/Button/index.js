import { CustomButton } from "./styles";

export function Button({ text, onClick }) {
  return <CustomButton onClick={onClick}>{text}</CustomButton>;
}

import React from "react";
import { CharactersRemainingText, CustomTextArea } from "./styles";

export function TextArea({ onChange, value }) {
  return (
    <>
      <CustomTextArea maxLength={777} onChange={onChange} value={value} />
      <CharactersRemainingText>{value.length}/777</CharactersRemainingText>
    </>
  );
}

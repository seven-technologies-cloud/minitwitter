import { Fragment } from "react";
import { SwitchContainer } from "./styles";

export function Switcher({ options, optionChecked, onChange }) {
  function handleOnChangeFilter(event) {
    onChange(event.target.value);
  }

  return (
    <SwitchContainer>
      {options.map((currentOption, index) => {
        return (
          <Fragment key={index}>
            <input
              type="radio"
              id={currentOption.value}
              value={currentOption.value}
              onChange={handleOnChangeFilter}
              checked={optionChecked === index}
            />
            <label htmlFor={currentOption.value}>{currentOption.label}</label>
          </Fragment>
        );
      })}
    </SwitchContainer>
  );
}

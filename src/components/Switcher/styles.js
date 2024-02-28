import styled from "styled-components";

export const SwitchContainer = styled.div`
  display: flex;
  overflow: hidden;

  input {
    border: 0;
    height: 1px;
    width: 1px;
    overflow: hidden;
    position: absolute;
    clip: rect(0, 0, 0, 0);
  }

  label {
    color: black;
    font-size: 12px;
    padding: 8px 16px;
    text-align: center;
    background-color: white;
    border: 1px solid white;
    transition: all 0.1s ease-in-out;

    &:hover {
      cursor: pointer;
    }
  }

  input:checked + label {
    color: white;
    box-shadow: none;
    border: 1px solid var(--twitter);
    background-color: var(--twitter);
  }

  label:first-of-type {
    border-radius: 4px 0 0 4px;
  }

  label:last-of-type {
    border-radius: 0 4px 4px 0;
  }
`;

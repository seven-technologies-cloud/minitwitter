import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    --dark-gray: #7B7B89;
    --background: #F0F0F2;
    --medium-gray:  #e5e5e5;
    
    --twitter: #1DA1F2;
  }
   
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body,
  input,
  textarea,
  button {
    font-family: "Poppins", sans-serif;
    font-weight: 500;
  }

  h1,
  h2,
  h3,
  h4 {
    font-weight: 700;
  }

  body {
    background: var(--background);
    -webkit-font-smoothing: antialiased;
  }

  button {
    cursor: pointer;
  }

  .react-modal-overlay {
    background: rgba(0, 0, 0, 0.5);

    position: fixed;

    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .react-modal-content {
    width: 100%;
    max-width: 872px;

    max-height: 600px;
    overflow-y: scroll;


    background-color: var(--background);
    padding: 16px;
    position: relative;
    border-radius: 8px;
  }
`;

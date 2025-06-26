import React from "react";
import copyButton from "./CopyButton.module.css";

type CopyType = {
  position?: "absolute" | "relative";
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};

function CopyButton(props: CopyType) {
  return (
    <button
      style={{
        ...(props.position && { position: props.position }),
        ...(props.top && { top: props.top }),
        ...(props.right && { right: props.right }),
        ...(props.bottom && { bottom: props.bottom }),
        ...(props.left && { left: props.left }),
      }}
      className={copyButton.Btn}
    >
      <span className={copyButton.svgIcon}>
        <svg
          fill="white"
          viewBox="0 0 384 512"
          height="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
        </svg>
      </span>
      <span className={copyButton.text}>Kopyala</span>
      
    </button>
  );
}

export default CopyButton;

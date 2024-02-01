import React from "react";

import ReactDOM from "react-dom";
import Lottie from "react-lottie";

import animation from "../../../public/json/lotte.json";

class Modal extends React.Component {
  el: any;

  constructor(props: any) {
    super(props);
    // @ts-ignore
    this.el = (window as any).document.createElement("div");
  }

  componentDidMount() {
    // @ts-ignore
    const modalRoot = (window as any).document.getElementById("confetti-root");
    modalRoot.style.display = "block";
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    // @ts-ignore
    const modalRoot = (window as any).document.getElementById("confetti-root");
    modalRoot.style.display = "none";
    modalRoot.removeChild(this.el);
  }

  render() {
    // @ts-ignore
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}

const ConfettiModal = ({ show }: any) => {
  if (!show) return null;
  return (
    <Modal>
      <div style={{ zIndex: 1001, pointerEvents: "none" }}>
        <Lottie
          options={{
            animationData: animation,
          }}
          speed={0.7}
        />
      </div>
    </Modal>
  );
};

export default ConfettiModal;

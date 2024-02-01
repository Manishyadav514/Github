import React, { useState } from "react";

import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import PopupModal from "./PopupModal";

const PreOrderModal = ({ show, onRequestClose, productId }: any) => {
  const [email, setEmail] = useState("");
  const [ErrorMsg, setErrorMsg] = useState(false);
  const profile = useSelector((store: ValtioStore) => store.userReducer.userProfile);
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (re.test(event.target.value) || email === "") {
      setErrorMsg(false);
    } else {
      setErrorMsg(true);
    }
    setEmail(event.target.value);
  };

  const notifySubmit = () => {
    const payload = {
      consumer_email: email,
      consumer_id: profile?.id,
      source: "product_attribute_set",
      source_id: JSON.stringify(productId),
      type: "OUTOFSTOCK",
    };
    onRequestClose();
    console.log(payload);
  };

  return (
    <PopupModal show={show} type="center-modal" onRequestClose={onRequestClose}>
      <section>
        <div
          className="relative bg-black PreOrderModal w-full right-0"
          style={{
            padding: "38px 20px 20px",
            border: "1px solid #de9064",
            outline: "#de9064 solid 1px",
          }}
        >
          <div
            aria-hidden
            className="absolute"
            style={{
              color: "#fff",
              opacity: 1,
              fontWeight: 300,
              fontSize: "40px",
              right: "10px",
              top: "-10px",
            }}
            onClick={onRequestClose}
          >
            ×
          </div>
          <h1 className="text-center text-lg font-medium uppercase text-white tracking-widest">Pre Order Disabled</h1>
          <p className="my-8 text-white font-light leading-tight">
            We have temporarily disabled Preorder for now, we&apos;ll intimate you as soon as it starts.
          </p>
          <form id="form" className="my-6">
            <div className="flex">
              <h2 className="text-sm text-hairline text-white">Email</h2>
            </div>
            <div style={{ borderBottom: "1px solid #de9064" }}>
              <input
                type="email"
                className="mt-2 bg-black text-center text-white text-xl outline-none"
                value={email}
                pattern="[A-Za-z0-9]+"
                required
                onChange={handleOnChange}
              />
            </div>
            {ErrorMsg && (
              <p className="text-sm" style={{ color: "#e8928d" }}>
                Please enter valid email
              </p>
            )}

            <div className="flex mt-2 justify-end">
              <button
                className="mt-2 bg-white"
                disabled={ErrorMsg}
                type="submit"
                onClick={notifySubmit}
                style={{
                  letterSpacing: " .5px",
                  fontSize: "18px",
                  padding: "2.5px 10px",
                  fontWeight: 400,
                  borderRadius: "2px",
                }}
              >
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </section>
    </PopupModal>
  );
};

export default PreOrderModal;

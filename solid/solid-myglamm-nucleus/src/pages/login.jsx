import { useNavigate } from "@solidjs/router";
import {onMount} from "solid-js";
import AuthAPI from "../services/auth";
import { LOCALSTORAGE } from '../constants/Storage.constant'
import { setLocalStorageValue } from "../utils/localStorage";

export default function Login() {
  let googleBtn;
  const navigate = useNavigate();

  onMount(() => {
    const src = "https://accounts.google.com/gsi/client";
    const id =
      "909846177158-d8b783553cbj3di0evm1csn48og2bqlv.apps.googleusercontent.com";

    loadScript(src)
      .then(() => {
        google.accounts.id.initialize({
          client_id: id,
          callback: handleCredentialResponse,
        });
        google.accounts.id.prompt();
        google.accounts.id.renderButton(googleBtn, {
          size: "large",
          theme: "filled_blue",
          type: "standard",
          size: "large",
          shape: "circle",
          logo_alignment: "left",
          width: "400",
        });
      })
      .catch(console.error);

    return () => {
      const scriptTag = document.querySelector(`script[src="${src}"]`);
      if (scriptTag) document.body.removeChild(scriptTag);
    };
  });

  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.body.appendChild(script);
    });

  const handleCredentialResponse = async (e) => {
    const authAPI = new AuthAPI();
    try {
      const data = await authAPI.googleSignIn(e?.credential);
      if(data?.data && data?.data?.code === 200){
        setLocalStorageValue(LOCALSTORAGE.LOGGED_IN_USER,JSON.stringify(data?.data?.data))
        navigate('/select-vendorcode')
      }

    }catch (e){
      console.log(e);
    }
  };

  return (
    <>
      <div class="h-screen flex">
        <div class="px-4 w-2/4 flex items-center justify-center bg-white">
          <div class="flex flex-col items-center text-center">
            <h2 class="text-2xl	font-semibold text-black">Welcome to Nucleus</h2>
            <p class="text-sm mt-4 mb-6">
              Merge ecommerce website and application with a few clicks.
            </p>
            <div id="googleButton" class="text-center" ref={googleBtn}></div>
          </div>
        </div>
        <div class="px-4 w-2/4 flex items-center justify-center bg-[var(--primary-light-color)]">
          <img src="/images/login.png" alt="login" />
        </div>
      </div>
    </>
  );
}

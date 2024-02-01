import LoadSpinner from "@libComponents/Common/LoadSpinner";

const CTAButton = ({ CTA, clickAction, loading = false, isNewDesign = false }: any) => {
  return (
    <button
      type="button"
      className={`text-white w-full bg-ctaImg p-2 text-xs uppercase rounded ${isNewDesign ? "h-7 flex items-center justify-center": "min-h-[32px]" }`}
      onClick={clickAction}
      disabled={loading}
    >
      {loading ? <LoadSpinner className=" w-4 mx-auto" /> : CTA}
    </button>
  );
};

export default CTAButton;

import LoadSpinner from "@libComponents/Common/LoadSpinner";

interface GlammClubWidgetButtonProps {
  CTA: string;
  clickAction: any;
  loading?: boolean;
  customCSSClass?: string;
}

const GlammClubWidgetButton = ({ CTA, clickAction, loading = false, customCSSClass }: GlammClubWidgetButtonProps) => {
  return (
    <button
      type="button"
      className={`${
        customCSSClass ? customCSSClass : "text-white w-full bg-ctaImg p-2 text-xs uppercase rounded min-h-[32px]"
      }`}
      onClick={clickAction}
      disabled={loading}
    >
      {loading ? <LoadSpinner className=" w-4 mx-auto" /> : CTA}
    </button>
  );
};

export default GlammClubWidgetButton;

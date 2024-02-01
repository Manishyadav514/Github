const ShowUpsellProductsTitle = ({ cartTitle, cartSubTitle }: any) => {
  return (
    <div className="mb-1 px-3">
      <h3
        className="font-semibold px-0.5 bg-no-repeat text-18 inline"
        style={{
          backgroundSize: "100% 86%",
          backgroundImage: "linear-gradient(transparent 77%, var(--color1) 0px)",
        }}
      >
        {cartTitle}
      </h3>
      <h4 className="text-13">{cartSubTitle}</h4>
    </div>
  );
};

export default ShowUpsellProductsTitle;

import React from "react";

interface PropTypes {
  letter?: string;
}

const ProfilePlaceholder = (props: PropTypes) => {
  const { letter } = props;
  const [firstLetter, setFirstLetter] = React.useState("A");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setFirstLetter(letter || "A");
    } else {
      setFirstLetter("A");
    }
  }, [letter]);
  return (
    <div className="w-[40px] h-[40px] bg-indigo-500 rounded-full flex items-center justify-center">
      <p className="text-lg font-bold text-white">{firstLetter}</p>
    </div>
  );
};

ProfilePlaceholder.defaultProps = {
  letter: false,
};

export default React.memo(ProfilePlaceholder);

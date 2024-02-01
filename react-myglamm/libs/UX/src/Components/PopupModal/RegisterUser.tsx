import React from "react";
const RegisterUser = ({ handleRegisterUser }: { handleRegisterUser: () => void }) => {
  return (
    <div className="flex items-center h-screen z-50 justify-center fixed w-full">
      <div className="bg-color2 rounded py-3 px-8" onClick={handleRegisterUser}>
        <span className="border-b-2 border-gray-300 p-0.5">Register</span> to see skin results
      </div>
    </div>
  );
};
export default RegisterUser;

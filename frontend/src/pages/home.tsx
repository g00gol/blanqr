import React from "react";

import Nav from "@/components/nav";
import SignUpCard from "@/components/SignUpCard";
import useAuthStore from "@/store/useAuthStore";

export default function HomePage(): React.ReactElement {
  const { isAuthenticated } = useAuthStore((state) => state);

  return (
    <>
      <Nav />
      <div className="w-full flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-500">
        <h1 className="text-6xl p-80 text-white">Expedite your business.</h1>
        {!isAuthenticated && (
          <span className="absolute right-0">
            <SignUpCard />
          </span>
        )}
      </div>
      <div></div>
    </>
  );
}

import Nav from "@/components/nav";
import SignUpCard from "@/components/SignUpCard";

export default function HomePage() {
  return (
    <>
      <Nav />
      <div className="w-full flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-500">
        <h1 className="text-6xl p-80">Welcome to BLANQR</h1>
        <span className="absolute right-0">
          <SignUpCard />
        </span>
      </div>
      <div></div>
    </>
  );
}

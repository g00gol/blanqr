import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import useAuthStore from "@/store/useAuthStore";

export default function Nav() {
  const { isAuthenticated, logout } = useAuthStore((state) => state);

  return (
    <nav className="sticky top-0 z-10 w-full border-b bg-background px-4 py-2 flex items-center justify-between">
      <div className="text-lg font-semibold">
        <Link to="/">💸 BLANQR</Link>
      </div>

      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <Button variant="ghost" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/payment">Create QR</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <Separator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Payments</DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button variant="outline" asChild>
            <Link to="/login">Log In</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}


import { FC } from "react";
import { Button } from "../Button";
import { LogOut, LogIn, User } from "lucide-react";

interface UserActionsProps {
  user: any;
  isAdmin: boolean;
}

export const UserActions: FC<UserActionsProps> = ({ user, isAdmin }) => {
  return user ? (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <User size={16} className="text-health-600 shrink-0" />
        <span className="text-sm font-medium truncate max-w-[150px]">
          {user?.phone || "User"}
          {isAdmin && <span className="ml-1 text-health-600">(Admin)</span>}
        </span>
      </div>
      <Button 
        onClick={() => window.location.href = '/logout'}
        variant="outline"
        size="sm"
        className="border-health-500 text-health-600 whitespace-nowrap"
      >
        <LogOut size={16} className="mr-1" />
        Sign Out
      </Button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => window.location.href = '/login'}
        variant="health"
        size="sm"
        className="whitespace-nowrap"
      >
        <User size={16} className="mr-1" />
        Admin Login
      </Button>

      <Button 
        onClick={() => window.location.href = '/login'}
        variant="health"
        size="sm"
        className="whitespace-nowrap"
      >
        Access Report
      </Button>
      <Button 
        onClick={() => window.location.href = '/general-login'}
        variant="outline"
        size="sm"
        className="border-health-500 text-health-600 whitespace-nowrap"
      >
        <LogIn size={16} className="mr-1" />
        Login
      </Button>
    </div>
  );
};

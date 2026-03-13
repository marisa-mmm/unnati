import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogIn, LogOut, User as UserIcon, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AuthHeaderProps {
  onShowHistory: () => void;
}

const AuthHeader = ({ onShowHistory }: AuthHeaderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          prompt: "select_account",
        },
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="border-border bg-card/80 backdrop-blur-sm text-foreground gap-2">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="" className="w-5 h-5 rounded-full" />
              ) : (
                <UserIcon className="w-4 h-4" />
              )}
              <span className="max-w-[120px] truncate text-xs">
                {user.user_metadata?.full_name || user.email?.split("@")[0]}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            <DropdownMenuItem onClick={onShowHistory} className="gap-2 cursor-pointer">
              <History className="w-4 h-4" />
              My History
            </DropdownMenuItem>
            <DropdownMenuItem onClick={signOut} className="gap-2 cursor-pointer text-destructive">
              <LogOut className="w-4 h-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={signIn}
          className="border-border bg-card/80 backdrop-blur-sm text-foreground gap-2"
        >
          <LogIn className="w-4 h-4" />
          Sign in with Google
        </Button>
      )}
    </div>
  );
};

export default AuthHeader;


import React from "react";
import { Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../Button";
import { RememberMeCheckbox } from "./RememberMeCheckbox";
import { CaptchaVerification } from "./CaptchaVerification";
import { AuthState } from "@/hooks/useAuth";

interface AuthPhoneFormProps {
  state: AuthState;
  updateState: (updates: Partial<AuthState>) => void;
  onSubmit: () => void;
}

export function AuthPhoneForm({ state, updateState, onSubmit }: AuthPhoneFormProps) {
  const handleCaptchaVerify = (token: string | null) => {
    if (token) {
      updateState({ captchaVerified: true, captchaError: null });
    } else {
      updateState({
        captchaVerified: false,
        captchaError: "Captcha verification failed. Please try again."
      });
    }
  };

  const handleCaptchaExpire = () => {
    updateState({
      captchaVerified: false,
      captchaError: "Captcha has expired. Please verify again."
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="phone" className="text-gray-700">
            Phone Number
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="tel"
              id="phone"
              placeholder="Enter your phone number"
              className="pl-10"
              value={state.phone}
              onChange={(e) => updateState({ phone: e.target.value })}
            />
          </div>
        </div>
        
        {!state.devMode && (
          <div className="mt-4">
            <CaptchaVerification 
              onVerify={handleCaptchaVerify}
              onExpire={handleCaptchaExpire}
              error={state.captchaError}
            />
          </div>
        )}
        
        <RememberMeCheckbox 
          checked={state.rememberMe}
          onCheckedChange={(checked) => updateState({ rememberMe: checked })}
        />
        
        {state.error && <p className="text-red-500 text-sm">{state.error}</p>}
      </div>
      
      <Button
        className="w-full mt-6"
        type="submit"
        disabled={state.loading || (!state.captchaVerified && !state.devMode)}
      >
        {state.loading ? "Sending OTP..." : "Send OTP"}
      </Button>
    </form>
  );
}

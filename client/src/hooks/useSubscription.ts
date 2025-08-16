import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface SubscriptionData {
  plan: "free" | "pro" | "ultimate";
  creditsUsed: number;
  creditsTotal: number;
  generationsToday: number;
  maxGenerations: number;
  isActive: boolean;
  expiresAt?: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData>({
    plan: "free",
    creditsUsed: 5, // Show some usage to trigger upgrade prompts
    creditsTotal: 10,
    generationsToday: 2,
    maxGenerations: 3,
    isActive: false
  });
  
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeTrigger, setUpgradeTrigger] = useState<"generation" | "exit" | "limit" | "feature">("generation");

  // Check limits
  const canGenerate = () => {
    if (subscription.plan === "free") {
      return subscription.generationsToday < subscription.maxGenerations && 
             subscription.creditsUsed < subscription.creditsTotal;
    }
    return true; // Pro/Ultimate users have higher limits
  };

  const getRemainingCredits = () => {
    return Math.max(0, subscription.creditsTotal - subscription.creditsUsed);
  };

  const getRemainingGenerations = () => {
    return Math.max(0, subscription.maxGenerations - subscription.generationsToday);
  };

  // Trigger upgrade modal
  const triggerUpgrade = (trigger: typeof upgradeTrigger = "generation") => {
    setUpgradeTrigger(trigger);
    setShowUpgradeModal(true);
  };

  // Handle generation attempt
  const handleGenerationAttempt = () => {
    if (!canGenerate()) {
      triggerUpgrade("limit");
      return false;
    }
    return true;
  };

  // Mock subscription upgrade
  const upgradeSubscription = (plan: string) => {
    console.log(`Upgrading to ${plan} plan`);
    setShowUpgradeModal(false);
    
    // In real app, this would call Stripe/payment API
    if (plan === "pro") {
      setSubscription(prev => ({
        ...prev,
        plan: "pro",
        creditsTotal: 600,
        maxGenerations: 100,
        isActive: true
      }));
    } else if (plan === "ultimate") {
      setSubscription(prev => ({
        ...prev,
        plan: "ultimate", 
        creditsTotal: 1200,
        maxGenerations: 200,
        isActive: true
      }));
    }
  };

  // Exit intent detection
  useEffect(() => {
    let exitIntentTriggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitIntentTriggered && subscription.plan === "free") {
        exitIntentTriggered = true;
        triggerUpgrade("exit");
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [subscription.plan]);

  // Usage tracking
  const trackGeneration = () => {
    setSubscription(prev => ({
      ...prev,
      creditsUsed: prev.creditsUsed + 1,
      generationsToday: prev.generationsToday + 1
    }));
  };

  return {
    subscription,
    canGenerate,
    getRemainingCredits,
    getRemainingGenerations,
    triggerUpgrade,
    handleGenerationAttempt,
    upgradeSubscription,
    trackGeneration,
    showUpgradeModal,
    setShowUpgradeModal,
    upgradeTrigger
  };
}
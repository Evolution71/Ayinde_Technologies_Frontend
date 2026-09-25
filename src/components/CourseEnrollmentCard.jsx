import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, Clock, Users, Loader, X } from "lucide-react";
import { api, getToken } from "../api";

/**
 * CourseEnrollmentCard - Professional course enrollment with subscription system
 * 
 * Features:
 * - Free 30-day trial option
 * - Square payment integration for auto-charge
 * - Multiple subscription statuses (trial, active, expired, cancelled)
 * - Trial countdown display
 * - Cancel subscription option
 * - Payment modal with Square Web Payments SDK
 * - Access status tracking
 */

export function CourseEnrollmentCard({
  course,
  enrollment,
  isAuthenticated,
  onEnrollmentSuccess,
  onLoginRequired,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [cancelling, setCancelling] = useState(false);

  // Update days remaining on mount and when enrollment changes
  useEffect(() => {
    if (enrollment?.trial_ends_at) {
      const now = new Date();
      const trialEnd = new Date(enrollment.trial_ends_at);
      const days = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
      setDaysRemaining(Math.max(0, days));
    }
  }, [enrollment]);

  // Determine access status
  const hasTrialAccess = enrollment?.status === "trial";
  const hasActiveAccess = enrollment?.status === "active";
  const isCancelled = enrollment?.status === "cancelled";
  const isExpired = enrollment?.status === "expired";
  const notEnrolled = !enrollment;

  // Format dates
  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle free trial enrollment
  const handleStartTrial = async () => {
    if (!isAuthenticated) {
      onLoginRequired?.();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const enrollData = await api.enrollInCourse(course.id);
      setSuccessMessage(
        `🎉 Trial started! Access until ${formatDate(enrollData.trial_ends_at)}`
      );
      
      // Refresh enrollment data after success
      setTimeout(() => {
        onEnrollmentSuccess?.(enrollData);
        setError(null);
      }, 1500);
    } catch (err) {
      setError(err.message || "Error starting trial");
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel subscription
  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel? You'll lose access after your current period ends.")) {
      return;
    }

    setCancelling(true);
    setError(null);

    try {
      await api.cancelSubscription(course.id);
      setSuccessMessage("Subscription cancelled. Your access will end on the expiration date.");
      
      setTimeout(() => {
        onEnrollmentSuccess?.();
      }, 1500);
    } catch (err) {
      setError(err.message || "Error cancelling subscription");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md">
        {/* Header with icon */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-3xl">{course.icon || "📚"}</span>
            </div>
            <span className="text-xs font-semibold bg-white bg-opacity-30 px-3 py-1 rounded-full">
              {course.level || "Beginner"}
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
          <p className="text-blue-100 text-sm">{course.description}</p>
        </div>

        {/* Course details */}
        <div className="p-6 space-y-4">
          {/* Duration and Instructor */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{course.duration || "8 weeks"}</span>
            </div>
            {course.instructor && (
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm">by {course.instructor}</span>
              </div>
            )}
          </div>

          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          {/* Trial Active Status */}
          {hasTrialAccess && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-blue-900">
                  🎉 Free Trial Active
                </p>
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                  {daysRemaining} days left
                </span>
              </div>
              <p className="text-sm text-blue-800">
                Access until <strong>{formatDate(enrollment.trial_ends_at)}</strong>
              </p>
              <p className="text-xs text-blue-700 pt-2 border-t border-blue-200">
                💡 Add your payment method to continue access after trial ends
              </p>
            </div>
          )}

          {/* Active Subscription Status */}
          {hasActiveAccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-green-900">
                  ✓ Full Access Unlocked
                </p>
                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                  {daysRemaining} days left
                </span>
              </div>
              <p className="text-sm text-green-800">
                Expires <strong>{formatDate(enrollment.access_expires_at)}</strong>
              </p>
            </div>
          )}

          {/* Expired Status */}
          {isExpired && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-yellow-900 mb-2">
                ⏰ Access Expired
              </p>
              <p className="text-sm text-yellow-800">
                Renew your subscription to continue learning
              </p>
            </div>
          )}

          {/* Cancelled Status */}
          {isCancelled && (
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                ✖ Subscription Cancelled
              </p>
              <p className="text-sm text-gray-700">
                Your access will end on {formatDate(enrollment.trial_ends_at || enrollment.access_expires_at)}
              </p>
            </div>
          )}

          {/* Pricing Section (Only show when not enrolled) */}
          {notEnrolled && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Starting at</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ${course.price || 100}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    {course.currency || "USD"}/month
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-700 space-y-1 pt-3 border-t border-gray-200">
                <p>
                  <span className="font-semibold">✓ 30-day free trial</span> — No
                  credit card needed initially
                </p>
                <p>
                  <span className="font-semibold">✓ Full course access</span> — All
                  lessons & resources
                </p>
                <p>
                  <span className="font-semibold">✓ Certificate</span> — Upon
                  completion
                </p>
                <p>
                  <span className="font-semibold">✓ Auto-renewal</span> — Save your card and auto-charge after trial
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {notEnrolled && (
            <div className="space-y-3 pt-4">
              <button
                onClick={handleStartTrial}
                disabled={loading}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                Start Free Trial
              </button>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    onLoginRequired?.();
                    return;
                  }
                  setShowPaymentModal(true);
                }}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                Pay Now with Square
              </button>

              <p className="text-xs text-gray-500 text-center pt-2">
                🔒 Secure payments via Square
                <br />
                💳 Visa • Mastercard • American Express
              </p>
            </div>
          )}

          {/* Trial → Paid Upgrade */}
          {hasTrialAccess && !enrollment.payment_method_id && (
            <div className="space-y-3 pt-4">
              <p className="text-sm text-gray-600 text-center">
                Save your card to continue after trial ends
              </p>
              <button
                onClick={() => setShowPaymentModal(true)}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                Save Payment Method
              </button>

              <button
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Cancel Trial
              </button>
            </div>
          )}

          {/* Active → Continue Learning */}
          {hasActiveAccess && (
            <div className="space-y-3 pt-4">
              <button
                onClick={() => (window.location.href = `/courses/${course.id}`)}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Continue Learning →
              </button>

              <button
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Cancel Subscription
              </button>
            </div>
          )}

          {/* Expired → Renew */}
          {(isExpired || isCancelled) && (
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  onLoginRequired?.();
                  return;
                }
                setShowPaymentModal(true);
              }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              Renew Access
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            Questions? Contact us at{" "}
            <a
              href="mailto:support@ayindetechnologies.com"
              className="text-blue-600 hover:underline"
            >
              support@ayindetechnologies.com
            </a>
          </p>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          course={course}
          enrollment={enrollment}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={(data) => {
            setShowPaymentModal(false);
            setSuccessMessage("✅ Payment method saved! Your card will be charged after trial ends.");
            onEnrollmentSuccess?.(data);
          }}
        />
      )}
    </>
  );
}

/**
 * PaymentModal - Square Web Payments SDK integration
 * Handles card tokenization and payment method saving
 */
function PaymentModal({ course, enrollment, onClose, onSuccess }) {
  const [step, setStep] = useState("card"); // card, processing, success
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardElement, setCardElement] = useState(null);

  // Initialize Square Web Payments SDK
  React.useEffect(() => {
    const initSquare = async () => {
      try {
        const { Web } = await import("@square/web-payments-sdk");
        
        const payments = await Web.payments(
          process.env.REACT_APP_SQUARE_APP_ID,
          { environment: "production" }
        );

        const card = await payments.card();
        await card.attach("#card-container");
        setCardElement({ payments, card });
      } catch (err) {
        setError("Failed to load payment form. Please refresh and try again.");
        console.error("Square init error:", err);
      }
    };

    initSquare();
  }, []);

  const handleSaveCard = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!cardElement) {
        setError("Payment form not loaded. Please refresh.");
        return;
      }

      // Request nonce from Square
      const result = await cardElement.payments.requestCardNonce();

      if (result.status === "OK") {
        const nonce = result.details.nonce;

        // Save payment method to backend
        const data = await api.savePaymentMethod(course.id, nonce);

        setStep("success");
        setTimeout(() => {
          onSuccess?.(data);
        }, 2000);
      } else {
        throw new Error(result.errors?.[0]?.message || "Payment failed");
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  const trialEndDate = new Date(enrollment?.trial_ends_at || new Date());
  const formattedDate = trialEndDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={() => !loading && onClose()}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {step === "card" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-600">Save Your Card</h2>
              <button
                onClick={onClose}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-gray-700 mb-2 font-semibold">{course.title}</p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900 mb-2">
                ✅ <strong>30-day free trial</strong> — Full access to all lessons
              </p>
              <p className="text-sm text-blue-900 mb-2">
                💳 Save your card for automatic renewal on <strong>{formattedDate}</strong>
              </p>
              <p className="text-sm text-blue-900">
                🚫 Cancel anytime, no questions asked
              </p>
            </div>

            <form onSubmit={handleSaveCard}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm flex gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Card Details
              </label>
              <div
                id="card-container"
                className="border border-gray-300 rounded-lg p-3 mb-6 min-h-16"
              />

              <button
                type="submit"
                disabled={loading || !cardElement}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                {loading ? "Processing..." : "Save Card & Continue"}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Your card won't be charged until after your trial ends
              </p>
            </form>
          </>
        )}

        {step === "success" && (
          <div className="text-center">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">✅ Card Saved!</h2>
            <p className="text-gray-700 mb-6">
              Your {course.title} trial is active until <strong>{formattedDate}</strong>
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Your card will be charged ${course.price || 100} after the trial period.
              You can cancel anytime.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
            >
              Start Learning
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseEnrollmentCard;
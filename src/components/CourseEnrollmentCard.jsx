import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Clock, Users, Loader } from "lucide-react";
import { api, getToken } from "../api";

/**
 * CourseEnrollmentCard - Professional course enrollment and payment component
 * Features:
 * - Free 30-day trial option
 * - Flutterwave payment integration
 * - Multiple payment methods (card, bank transfer, mobile money, USSD)
 * - Trial status display
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

  // Determine access status
  const hasTrialAccess = enrollment?.status === "trial";
  const hasActiveAccess = enrollment?.status === "active";
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
      // First, enroll in trial
      const enrollData = await api.enrollInCourse(course.id);
      setSuccessMessage(
        `Trial started! Access until ${formatDate(enrollData.trial_ends_at)}`
      );
      onEnrollmentSuccess?.(enrollData);
    } catch (err) {
      setError(err.message || "Error starting trial");
    } finally {
      setLoading(false);
    }
  };

  // Handle payment initiation (Flutterwave)
  const handlePayment = async () => {
    if (!isAuthenticated) {
      onLoginRequired?.();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Initiate payment
      const paymentData = await api.initiatePayment(course.id);

      if (paymentData.status === "trial_active") {
        setError(paymentData.message);
        return;
      }

      if (paymentData.status === "already_enrolled") {
        setSuccessMessage(paymentData.message);
        return;
      }

      if (paymentData.payment_link) {
        // Redirect to payment page
        window.location.href = paymentData.payment_link;
      }
    } catch (err) {
      setError(err.message || "Error processing payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md">
      {/* Header with icon */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <img
              src={course.icon}
              alt={course.title}
              className="w-10 h-10"
            />
          </div>
          <span className="text-xs font-semibold bg-white bg-opacity-30 px-3 py-1 rounded-full">
            {course.level}
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
        <p className="text-blue-100 text-sm">{course.description}</p>
      </div>

      {/* Course details */}
      <div className="p-6 space-y-4">
        {/* Duration and Students */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{course.duration}</span>
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

        {/* Enrollment Status */}
        {hasTrialAccess && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-semibold text-blue-900 mb-1">
              🎉 Free Trial Active
            </p>
            <p className="text-sm text-blue-800">
              Access until {formatDate(enrollment.trial_ends_at)}
            </p>
          </div>
        )}

        {hasActiveAccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm font-semibold text-green-900 mb-1">
              ✓ Full Access Unlocked
            </p>
            <p className="text-sm text-green-800">
              Expires {formatDate(enrollment.access_expires_at)}
            </p>
          </div>
        )}

        {isExpired && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm font-semibold text-yellow-900">
              ⏰ Access Expired
            </p>
            <p className="text-sm text-yellow-800">Renew your subscription</p>
          </div>
        )}

        {/* Pricing Section */}
        {notEnrolled && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Starting at</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  ${course.price}
                </span>
                <span className="text-sm text-gray-500 font-medium">
                  {course.currency}/year
                </span>
              </div>
            </div>

            <div className="text-sm text-gray-700 space-y-1 pt-3 border-t border-gray-200">
              <p>
                <span className="font-semibold">✓ 30-day free trial</span> — No
                credit card needed
              </p>
              <p>
                <span className="font-semibold">✓ Full course access</span> —
                All lessons & resources
              </p>
              <p>
                <span className="font-semibold">✓ Certificate</span> — Upon
                completion
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
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              Pay Now with Flutterwave
            </button>

            <p className="text-xs text-gray-500 text-center pt-2">
              🔒 Secure payments via Flutterwave
              <br />
              💳 Card • 🏦 Bank Transfer • 📱 Mobile Money • USSD
            </p>
          </div>
        )}

        {hasTrialAccess && (
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader className="w-4 h-4 animate-spin" />}
            Upgrade to Full Access
          </button>
        )}

        {hasActiveAccess && (
          <button
            onClick={() => (window.location.href = `/courses/${course.id}/learn`)}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            Continue Learning →
          </button>
        )}

        {isExpired && (
          <button
            onClick={handlePayment}
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
          <a href="mailto:support@ayindetechnologies.com" className="text-blue-600 hover:underline">
            support@ayindetechnologies.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default CourseEnrollmentCard;
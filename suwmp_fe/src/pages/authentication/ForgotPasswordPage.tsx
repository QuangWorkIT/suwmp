import ForgotPasswordInputEmail from "@/components/common/auth/ForgotPasswordInputEmail";

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Gradient accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-primary/5 blur-[100px] rounded-full" />

      <div className="relative z-10">
        <ForgotPasswordInputEmail />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-200 via-white to-purple-200">
      {/* Background blur balls */}
      <div className="absolute w-80 h-80 bg-purple-400 rounded-full blur-[90px] opacity-20 top-[-6rem] left-[-4rem] animate-float" />
      <div className="absolute w-80 h-80 bg-blue-400 rounded-full blur-[90px] opacity-20 bottom-[-6rem] right-[-4rem] animate-float-rev" />

      <div className="bg-white z-10 shadow-2xl rounded-3xl p-10 max-w-2xl w-full text-center space-y-6 fade-in">
        <div className="flex justify-center items-center space-x-2">
          <Sparkles className="text-purple-500 w-8 h-8" />
          <h1 className="text-4xl font-extrabold text-gray-800">ELECTRE I</h1>
        </div>

        <p className="text-gray-600 text-lg">
          Welcome to your decision support tool based on the ELECTRE I method.
          Analyze multiple alternatives and criteria to identify the most
          suitable choices.
        </p>

        <Button
          onClick={() => navigate("/electre")}
          className="mt-4 text-lg px-6 py-3"
        >
          Let&apos;s Start
        </Button>
      </div>

      {/* Inline animation styles */}
      <style>{`
        .fade-in {
          opacity: 0;
          animation: fadeIn 0.6s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-rev {
          animation: float 6s ease-in-out infinite reverse;
        }
      `}</style>
    </div>
  );
};

export default WelcomePage;

import React from "react";

interface FailedCase {
  input: string;
  output: string;
  expected: string;
}

interface CodeEvalResultProps {
  status: "correct" | "wrong";
  passedCount: number;
  totalCount: number;
  failedCases: FailedCase[];
  onAnalyzeComplexity?: () => void;
}

const CodeEvalResult: React.FC<CodeEvalResultProps> = ({
  status,
  passedCount,
  totalCount,
  failedCases,
  onAnalyzeComplexity,
}) => {
  const isCorrect = status === "correct";
  return (
    <div className="bg-[#1e1e1e] text-white p-6 rounded-lg w-full max-w-md space-y-6 font-mono shadow-lg">
      {/* Status Row */}
      <div className="flex items-center gap-3">
        <span className={`font-semibold text-lg ${isCorrect ? "text-green-400" : "text-red-400"}`}>
          {isCorrect ? "✅ Correct Answer" : "❌ Wrong Answer"}
        </span>
        <span className="text-gray-400 text-sm">
          {passedCount} / {totalCount} testcases passed
        </span>
      </div>

      {/* Failed Cases */}
      {failedCases.length > 0 && (
        <div className="space-y-6">
          {failedCases.map((tc, idx) => (
            <div key={idx} className="space-y-3">
              <div>
                <div className="text-xs text-gray-400 mb-1">Input</div>
                <div className="bg-[#2d2d2d] p-2 rounded text-sm">
                  {tc.input}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Output</div>
                <div className="bg-[#2d2d2d] p-2 rounded text-sm text-red-400">
                  {tc.output}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Expected</div>
                <div className="bg-[#2d2d2d] p-2 rounded text-sm text-green-400">
                  {tc.expected}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analyze Complexity Button */}
      <div className="flex justify-end pt-2">
        <button
          className="text-blue-400 border border-blue-400 rounded px-4 py-1 text-sm font-semibold hover:bg-blue-900 transition"
          onClick={onAnalyzeComplexity}
        >
          Analyze Complexity
        </button>
      </div>
    </div>
  );
};

export default CodeEvalResult; 
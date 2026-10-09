import React from 'react';
import { X, Languages, HelpCircle } from 'lucide-react';

interface ChineseHintModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptZh?: string;
  hints: {
    term: string;
    termZh: string;
    explanationZh: string;
  }[];
}

export const ChineseHintModal: React.FC<ChineseHintModalProps> = ({ isOpen, onClose, promptZh, hints }) => {
  if (!isOpen) return null;

  return (
    <div 
      role="dialog" 
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-[#FAF8F5] border border-stone-300 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-100/70">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-amber-800" />
            <h2 className="text-base font-semibold text-stone-900">中文題目詞彙提示 (Question Wording Clarification)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {promptZh && (
            <div className="p-4 bg-amber-50/70 border border-amber-200/90 rounded-xl space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                題目中文題意 (Question Meaning in Chinese):
              </span>
              <p className="text-sm font-semibold text-stone-900 leading-relaxed">
                "{promptZh}"
              </p>
            </div>
          )}

          <div className="p-3 bg-stone-100/90 border border-stone-200 rounded-lg text-xs text-stone-700 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 mt-0.5 shrink-0 text-stone-600" />
            <p>
              提示旨在協助理解考評局常見問法與英文詞彙，<strong>不會直接透露答案</strong>。請運用所學經濟學概念獨立推論。
            </p>
          </div>

          <div className="space-y-3">
            {hints.map((hint, idx) => (
              <div key={idx} className="p-4 bg-white border border-stone-200 rounded-lg space-y-1.5">
                <div className="flex items-baseline justify-between gap-2 border-b border-stone-100 pb-1.5">
                  <span className="font-semibold text-stone-900 text-sm">{hint.term}</span>
                  <span className="text-xs font-medium text-amber-900 bg-amber-100/60 px-2 py-0.5 rounded">
                    {hint.termZh}
                  </span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed pt-1">
                  {hint.explanationZh}
                </p>
              </div>
            ))}
          </div>

          {/* Standard DSE command words reference */}
          <div className="pt-2 border-t border-stone-200">
            <h4 className="text-xs font-semibold text-stone-600 mb-2">常用 DSE 經濟學問法速查：</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
              <div className="p-2 bg-stone-50 rounded border border-stone-200/60">
                <span className="font-medium text-stone-800">necessarily:</span>
                <p className="text-[11px] text-stone-600 mt-0.5">是否「必然/一定」發生。只要存在某種可能使其不成立，便不是必然。</p>
              </div>
              <div className="p-2 bg-stone-50 rounded border border-stone-200/60">
                <span className="font-medium text-stone-800">may increase:</span>
                <p className="text-[11px] text-stone-600 mt-0.5">「可能增加」。代表須具備特定條件（如第三選項價值超越原本放棄選項）才會發生。</p>
              </div>
              <div className="p-2 bg-stone-50 rounded border border-stone-200/60">
                <span className="font-medium text-stone-800">remains unchanged:</span>
                <p className="text-[11px] text-stone-600 mt-0.5">保持不變。若最高價值放棄選項及其價值未受任何影響，機會成本便保持不變。</p>
              </div>
              <div className="p-2 bg-stone-50 rounded border border-stone-200/60">
                <span className="font-medium text-stone-800">chosen option:</span>
                <p className="text-[11px] text-stone-600 mt-0.5">所選選項。題目詢問「...的機會成本」中，該選項就是所選選項。</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-stone-800 hover:bg-stone-900 rounded-lg transition-colors"
          >
            返回練習 (Return to Practice)
          </button>
        </div>
      </div>
    </div>
  );
};

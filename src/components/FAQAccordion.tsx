import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { FAQS } from "../data/copy";

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (idx: number) => {
    if (openIndex === idx) {
      setOpenIndex(null);
    } else {
      setOpenIndex(idx);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div 
            key={idx}
            className="bg-[#E8DFD0]/40 hover:bg-[#E8DFD0]/75 border border-[#C4A97D]/40 rounded-xl overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => toggleIndex(idx)}
              className="w-full text-left py-4 px-5 flex justify-between items-center gap-4 text-xs md:text-sm font-medium text-[#2C2A27]"
            >
              <div className="flex gap-2.5 items-center">
                <HelpCircle size={15} className="text-[#A0785A] shrink-0" />
                <span className="font-serif font-medium">{faq.question}</span>
              </div>
              <span className="shrink-0 text-[#A0785A]">
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>

            {/* Answer block with smooth transition height */}
            <div 
              className={`transition-all duration-200 ease-in-out ${
                isOpen ? "max-h-80 border-t border-[#C4A97D]/20 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              <div className="p-5 text-xs md:text-sm text-[#2C2A27]/90 leading-relaxed bg-[#F5F0E8]/40">
                {faq.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

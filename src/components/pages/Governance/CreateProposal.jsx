import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardBox from '@/components/ui/DashboardBox';
import { useTheme } from '@/context/ThemeContext';
import { useGovernance } from '@/hooks/useGovernance';
import { useWallet } from '@/context/WalletContext';
import { useToast } from '@/context/ToastContext';
import { handleTransaction } from '@/utils/transactions';

const CreateProposal = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const textColor = isDark ? 'text-gray-200' : 'text-gray-900';
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const { isConnected, isCorrectNetwork } = useWallet();
  const { propose } = useGovernance();
  const { addToast } = useToast();
  
  // Stati per i campi del form 
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [summary, setSummary] = useState('');
  const [implementation, setImplementation] = useState('');
  const [benefits, setBenefits] = useState('');
  const [risks, setRisks] = useState('');
  const [alternatives, setAlternatives] = useState('');
  const [proposalType, setProposalType] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categorie disponibili
  const categories = ['Protocol', 'Treasury', 'Governance', 'Community', 'Technical', 'Other'];

  // Gestisce l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isConnected || !isCorrectNetwork) {
      addToast({
        type: 'error',
        title: 'Wallet not ready',
        message: 'Connect your wallet and switch to Sepolia to submit.',
      });
      return;
    }

    const payload = [
      `# ${title}`,
      `Category: ${category}`,
      '',
      `Short Description: ${description}`,
      '',
      '## Summary',
      summary,
      '',
      '## Implementation',
      implementation,
      '',
      '## Benefits',
      benefits,
      '',
      '## Risks',
      risks,
      '',
      '## Alternatives',
      alternatives || 'None provided.',
    ].join('\n');

    setIsSubmitting(true);
    await handleTransaction(propose(Number(proposalType), payload), () => {
      addToast({
        type: 'success',
        title: 'Proposal submitted',
        message: 'Your proposal was submitted to governance.',
      });
      navigate('/governance');
    }, (error) => {
      addToast({ type: 'error', title: 'Submission failed', message: error.message });
    });
    setIsSubmitting(false);
  };

  return (
    <main className="pt-24 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link to="/governance" className={`${subTextColor} hover:text-[#14EFC0] transition-colors flex items-center gap-2`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Governance
            </Link>
          </div>

          <h1 className={`text-3xl font-conthrax mb-8 ${textColor}`}>Create Proposal</h1>
          
          <form onSubmit={handleSubmit}>
            <DashboardBox variant="card" className="p-6 mb-8">
              <h2 className={`text-lg font-conthrax uppercase tracking-wider ${subTextColor} mb-6`}>Basic Information</h2>

              {/* Titolo */}
              <div className="mb-6">
                <label className={`block text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`} htmlFor="title">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full rounded-lg p-3 focus:outline-none transition-all ${
                    isDark
                      ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-200 placeholder-gray-500 focus:border-[#14EFC0]/60'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-teal-500'
                  }`}
                  placeholder="Enter a descriptive title"
                  required
                />
              </div>

              {/* Categoria */}
              <div className="mb-6">
                <label className={`block text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`} htmlFor="category">
                  Category *
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full rounded-lg p-3 focus:outline-none transition-all ${
                    isDark
                      ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-200 focus:border-[#14EFC0]/60'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-teal-500'
                  }`}
                  required
                >
                  <option value="" disabled className={isDark ? 'bg-[#1a1a2e]' : 'bg-white'}>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className={isDark ? 'bg-[#1a1a2e]' : 'bg-white'}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Proposal Type */}
              <div className="mb-6">
                <label className={`block text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`} htmlFor="proposalType">
                  Proposal Type *
                </label>
                <select
                  id="proposalType"
                  value={proposalType}
                  onChange={(e) => setProposalType(e.target.value)}
                  className={`w-full rounded-lg p-3 focus:outline-none transition-all ${
                    isDark
                      ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-200 focus:border-[#14EFC0]/60'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-teal-500'
                  }`}
                  required
                >
                  <option value="0" className={isDark ? 'bg-[#1a1a2e]' : 'bg-white'}>Short (36h)</option>
                  <option value="1" className={isDark ? 'bg-[#1a1a2e]' : 'bg-white'}>Long (7d)</option>
                </select>
              </div>

              {/* Descrizione breve */}
              <div className="mb-6">
                <label className={`block text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`} htmlFor="description">
                  Short Description *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full rounded-lg p-3 focus:outline-none transition-all ${
                    isDark
                      ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-200 placeholder-gray-500 focus:border-[#14EFC0]/60'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-teal-500'
                  }`}
                  placeholder="Provide a brief description (max 200 characters)"
                  rows="2"
                  maxLength="200"
                  required
                ></textarea>
                <p className={`text-xs ${subTextColor} mt-1`}>{description.length}/200 characters</p>
              </div>
            </DashboardBox>

            <DashboardBox variant="card" className="p-6 mb-8">
              <h2 className={`text-lg font-conthrax uppercase tracking-wider ${subTextColor} mb-6`}>Detailed Information</h2>

              {/* Summary */}
              <div className="mb-6">
                <label className={`block text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`} htmlFor="summary">
                  Summary *
                </label>
                <textarea
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className={`w-full rounded-lg p-3 focus:outline-none transition-all ${
                    isDark
                      ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-200 placeholder-gray-500 focus:border-[#14EFC0]/60'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-teal-500'
                  }`}
                  placeholder="Provide a comprehensive summary of your proposal"
                  rows="4"
                  required
                ></textarea>
              </div>

              {/* Implementation */}
              <div className="mb-6">
                <label className={`block text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`} htmlFor="implementation">
                  Implementation *
                </label>
                <textarea
                  id="implementation"
                  value={implementation}
                  onChange={(e) => setImplementation(e.target.value)}
                  className={`w-full rounded-lg p-3 focus:outline-none transition-all ${
                    isDark
                      ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-200 placeholder-gray-500 focus:border-[#14EFC0]/60'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-teal-500'
                  }`}
                  placeholder="Describe how this proposal will be implemented"
                  rows="6"
                  required
                ></textarea>
                <p className={`text-xs ${subTextColor} mt-1`}>Markdown formatting is supported</p>
              </div>

              {/* Benefits */}
              <div className="mb-6">
                <label className={`block text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`} htmlFor="benefits">
                  Benefits *
                </label>
                <textarea
                  id="benefits"
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  className={`w-full rounded-lg p-3 focus:outline-none transition-all ${
                    isDark
                      ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-200 placeholder-gray-500 focus:border-[#14EFC0]/60'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-teal-500'
                  }`}
                  placeholder="List the benefits of implementing this proposal"
                  rows="4"
                  required
                ></textarea>
              </div>

              {/* Risks */}
              <div className="mb-6">
                <label className={`block text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`} htmlFor="risks">
                  Risks *
                </label>
                <textarea
                  id="risks"
                  value={risks}
                  onChange={(e) => setRisks(e.target.value)}
                  className={`w-full rounded-lg p-3 focus:outline-none transition-all ${
                    isDark
                      ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-200 placeholder-gray-500 focus:border-[#14EFC0]/60'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-teal-500'
                  }`}
                  placeholder="Identify potential risks and mitigation strategies"
                  rows="4"
                  required
                ></textarea>
              </div>

              {/* Alternatives */}
              <div className="mb-6">
                <label className={`block text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`} htmlFor="alternatives">
                  Alternatives Considered
                </label>
                <textarea
                  id="alternatives"
                  value={alternatives}
                  onChange={(e) => setAlternatives(e.target.value)}
                  className={`w-full rounded-lg p-3 focus:outline-none transition-all ${
                    isDark
                      ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-200 placeholder-gray-500 focus:border-[#14EFC0]/60'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-teal-500'
                  }`}
                  placeholder="Describe alternative approaches that were considered"
                  rows="4"
                ></textarea>
              </div>
            </DashboardBox>

            <DashboardBox variant="card" className="p-6 mb-8">
              <h2 className={`text-lg font-conthrax uppercase tracking-wider ${subTextColor} mb-6`}>Submission</h2>

              <div className="mb-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      className={`w-4 h-4 rounded focus:ring-[#14EFC0] focus:ring-2 ${
                        isDark
                          ? 'bg-[#1a1a2e]/50 border-[#2a2a4e]'
                          : 'bg-gray-50 border-gray-300'
                      }`}
                      required
                    />
                  </div>
                  <label htmlFor="terms" className={`ml-3 text-sm ${subTextColor}`}>
                    I confirm that this proposal complies with the governance guidelines and I understand that once submitted, it cannot be modified.
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Link
                  to="/governance"
                  className={`px-6 py-3 rounded-lg font-conthrax text-sm text-center transition-colors ${
                    isDark
                      ? 'border border-[#2a2a4e] text-gray-300 hover:border-[#14EFC0] hover:text-[#14EFC0]'
                      : 'border border-gray-300 text-gray-700 hover:border-teal-500 hover:text-teal-600'
                  }`}
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-lg font-conthrax text-sm transition-colors ${
                    isSubmitting
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-[#14EFC0] text-black hover:bg-[#12d4ad]'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
                </button>
              </div>
            </DashboardBox>
          </form>
        </div>
      </div>
    </main>
  );
};

export default CreateProposal;

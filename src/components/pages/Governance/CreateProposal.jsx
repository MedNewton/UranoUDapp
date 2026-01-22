import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardBox from '../../ui/DashboardBox';
import { useTheme } from '../../../context/ThemeContext';

const CreateProposal = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const textColor = isDark ? 'text-gray-200' : 'text-gray-900';
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  
  // Stati per i campi del form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [summary, setSummary] = useState('');
  const [implementation, setImplementation] = useState('');
  const [benefits, setBenefits] = useState('');
  const [risks, setRisks] = useState('');
  const [alternatives, setAlternatives] = useState('');

  // Categorie disponibili
  const categories = ['Protocol', 'Treasury', 'Governance', 'Community', 'Technical', 'Other'];

  // Gestisce l'invio del form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Qui andrebbe la logica per inviare la proposta alla blockchain
    console.log({
      title,
      category,
      description,
      summary,
      implementation,
      benefits,
      risks,
      alternatives
    });
    
    // Reindirizza alla pagina di governance
    navigate('/governance');
  };

  return (
    <main className="pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link to="/governance" className={`${subTextColor} hover:text-[#2dbdc5] transition-colors`}>
              u2190 Back to Governance
            </Link>
          </div>

          <h1 className={`text-3xl font-conthrax mb-8 ${textColor}`}>Create Proposal</h1>
          
          <form onSubmit={handleSubmit}>
            <DashboardBox className="p-6 mb-8">
              <h2 className={`text-xl font-conthrax mb-6 ${textColor}`}>Basic Information</h2>
              
              {/* Titolo */}
              <div className="mb-6">
                <label className={`block text-sm font-conthrax ${subTextColor} mb-2`} htmlFor="title">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full bg-transparent border border-gray-700 rounded-lg p-3 ${textColor} focus:border-[#2dbdc5] outline-none transition-colors`}
                  placeholder="Enter a descriptive title"
                  required
                />
              </div>
              
              {/* Categoria */}
              <div className="mb-6">
                <label className={`block text-sm font-conthrax ${subTextColor} mb-2`} htmlFor="category">
                  Category *
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full bg-transparent border border-gray-700 rounded-lg p-3 ${textColor} focus:border-[#2dbdc5] outline-none transition-colors`}
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-gray-900">{cat}</option>
                  ))}
                </select>
              </div>
              
              {/* Descrizione breve */}
              <div className="mb-6">
                <label className={`block text-sm font-conthrax ${subTextColor} mb-2`} htmlFor="description">
                  Short Description *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full bg-transparent border border-gray-700 rounded-lg p-3 ${textColor} focus:border-[#2dbdc5] outline-none transition-colors`}
                  placeholder="Provide a brief description (max 200 characters)"
                  rows="2"
                  maxLength="200"
                  required
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">{description.length}/200 characters</p>
              </div>
            </DashboardBox>

            <DashboardBox className="p-6 mb-8">
              <h2 className={`text-xl font-conthrax mb-6 ${textColor}`}>Detailed Information</h2>
              
              {/* Summary */}
              <div className="mb-6">
                <label className={`block text-sm font-conthrax ${subTextColor} mb-2`} htmlFor="summary">
                  Summary *
                </label>
                <textarea
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className={`w-full bg-transparent border border-gray-700 rounded-lg p-3 ${textColor} focus:border-[#2dbdc5] outline-none transition-colors`}
                  placeholder="Provide a comprehensive summary of your proposal"
                  rows="4"
                  required
                ></textarea>
              </div>
              
              {/* Implementation */}
              <div className="mb-6">
                <label className={`block text-sm font-conthrax ${subTextColor} mb-2`} htmlFor="implementation">
                  Implementation *
                </label>
                <textarea
                  id="implementation"
                  value={implementation}
                  onChange={(e) => setImplementation(e.target.value)}
                  className={`w-full bg-transparent border border-gray-700 rounded-lg p-3 ${textColor} focus:border-[#2dbdc5] outline-none transition-colors`}
                  placeholder="Describe how this proposal will be implemented"
                  rows="6"
                  required
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">Markdown formatting is supported</p>
              </div>
              
              {/* Benefits */}
              <div className="mb-6">
                <label className={`block text-sm font-conthrax ${subTextColor} mb-2`} htmlFor="benefits">
                  Benefits *
                </label>
                <textarea
                  id="benefits"
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  className={`w-full bg-transparent border border-gray-700 rounded-lg p-3 ${textColor} focus:border-[#2dbdc5] outline-none transition-colors`}
                  placeholder="List the benefits of implementing this proposal"
                  rows="4"
                  required
                ></textarea>
              </div>
              
              {/* Risks */}
              <div className="mb-6">
                <label className={`block text-sm font-conthrax ${subTextColor} mb-2`} htmlFor="risks">
                  Risks *
                </label>
                <textarea
                  id="risks"
                  value={risks}
                  onChange={(e) => setRisks(e.target.value)}
                  className={`w-full bg-transparent border border-gray-700 rounded-lg p-3 ${textColor} focus:border-[#2dbdc5] outline-none transition-colors`}
                  placeholder="Identify potential risks and mitigation strategies"
                  rows="4"
                  required
                ></textarea>
              </div>
              
              {/* Alternatives */}
              <div className="mb-6">
                <label className={`block text-sm font-conthrax ${subTextColor} mb-2`} htmlFor="alternatives">
                  Alternatives Considered
                </label>
                <textarea
                  id="alternatives"
                  value={alternatives}
                  onChange={(e) => setAlternatives(e.target.value)}
                  className={`w-full bg-transparent border border-gray-700 rounded-lg p-3 ${textColor} focus:border-[#2dbdc5] outline-none transition-colors`}
                  placeholder="Describe alternative approaches that were considered"
                  rows="4"
                ></textarea>
              </div>
            </DashboardBox>

            <DashboardBox className="p-6 mb-8">
              <h2 className={`text-xl font-conthrax mb-6 ${textColor}`}>Submission</h2>
              
              <div className="mb-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-700 rounded bg-transparent focus:ring-[#2dbdc5] focus:ring-2"
                      required
                    />
                  </div>
                  <label htmlFor="terms" className={`ml-2 text-sm ${subTextColor}`}>
                    I confirm that this proposal complies with the governance guidelines and I understand that once submitted, it cannot be modified.
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <Link 
                  to="/governance"
                  className="px-6 py-3 border border-gray-700 rounded-lg font-conthrax text-gray-400 hover:border-gray-500 transition-colors"
                >
                  Cancel
                </Link>
                <button 
                  type="submit"
                  className="px-6 py-3 bg-[#2dbdc5] text-white rounded-lg font-conthrax hover:bg-[#25a4ab] transition-colors"
                >
                  Submit Proposal
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

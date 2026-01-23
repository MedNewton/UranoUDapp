import React, { useState } from 'react';
import DashboardBox from '@/components/ui/DashboardBox';
import { useTheme } from '@/context/ThemeContext';
import rocketImage from '@/assets/img/uStation.webp';

const UStation = () => {
  const { isDark } = useTheme();
  const textColor = isDark ? 'text-gray-200' : 'text-gray-900';
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-600';

  // Stato per gestire il passaggio dalla pagina introduttiva al form
  const [showForm, setShowForm] = useState(false);
  
  // Stato per i campi del form
  const [formData, setFormData] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    website: '',
    jurisdiction: '',
    projectStage: '',
    teamMembers: '',
    rwaDescription: '',
    rwaValue: '',
    tokenizationObjectives: '',
    companyOverview: '',
    // File da allegare
    attachments: []
  });

  // Gestisce i cambiamenti nei campi del form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gestisce l'upload dei file
  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      attachments: [...e.target.files]
    }));
  };

  // Gestisce l'invio del form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Qui andrebbe la logica per inviare i dati al backend
    alert('Application submitted successfully!');
    // Reset del form
    setFormData({
      companyName: '',
      firstName: '',
      lastName: '',
      email: '',
      website: '',
      jurisdiction: '',
      projectStage: '',
      teamMembers: '',
      rwaDescription: '',
      rwaValue: '',
      tokenizationObjectives: '',
      companyOverview: '',
      attachments: []
    });
    // Torna alla pagina introduttiva
    setShowForm(false);
  };

  // Pagina introduttiva
  const IntroPage = () => (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-between max-w-6xl mx-auto py-8">
      <DashboardBox variant="card" className="p-6 md:p-8 w-full lg:w-2/5">
        <h1 className={`text-2xl md:text-3xl font-conthrax mb-4 text-[#14EFC0]`}>uStation</h1>
        <h2 className={`text-lg font-conthrax uppercase tracking-wider ${subTextColor} mb-6`}>Your Gateway to Tokenization</h2>

        <p className={`${textColor} mb-6 text-sm md:text-base leading-relaxed`}>
          If you want to tokenize your RWA on the uApp and access the incredible
          world of blockchain tokenization, fill out the application form. Our team
          of analysts will review your request and contact you for your
          onboarding.
        </p>

        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto px-6 py-3 bg-[#14EFC0] text-black rounded-lg font-conthrax text-sm hover:bg-[#12d4ad] transition-colors"
        >
          Start now
        </button>
      </DashboardBox>

      <div className="w-full lg:w-3/5 flex justify-center lg:justify-end lg:pl-8">
        <img
          src={rocketImage}
          alt="Tokenization Rocket"
          className="max-w-full h-auto max-h-[400px] md:max-h-[500px] lg:max-h-[550px]"
        />
      </div>
    </div>
  );

  // Form di applicazione
  const ApplicationForm = () => (
    <div className="max-w-4xl mx-auto">
      <DashboardBox variant="card" className="p-6 md:p-8">
        <h1 className={`text-2xl md:text-3xl font-conthrax mb-2 text-[#14EFC0]`}>Urano Application Form</h1>
        <p className={`${subTextColor} mb-8 text-sm md:text-base`}>
          Please fill in the following fields to submit your Real World Asset (RWA) tokenization request:
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sezione 1: Informazioni di contatto */}
          <div className="space-y-6">
            <div>
              <label className={`block text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`} htmlFor="companyName">
                1. Company / Project Name
              </label>
              <p className={`text-xs ${subTextColor} mb-2`}>Name of the entity submitting the application.</p>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                className={`w-full rounded-lg p-3 focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-200 placeholder-gray-500 focus:border-[#14EFC0]/60'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-teal-500'
                }`}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`} htmlFor="firstName">
                  2. Applicant First Name
                </label>
                <p className={`text-xs ${subTextColor} mb-2`}>First name of the primary contact person.</p>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full rounded-lg p-3 focus:outline-none transition-all ${
                    isDark
                      ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-200 placeholder-gray-500 focus:border-[#14EFC0]/60'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-teal-500'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`} htmlFor="lastName">
                  3. Applicant Last Name
                </label>
                <p className={`text-xs ${subTextColor} mb-2`}>Last name of the primary contact person.</p>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full rounded-lg p-3 focus:outline-none transition-all ${
                    isDark
                      ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-200 placeholder-gray-500 focus:border-[#14EFC0]/60'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-teal-500'
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`} htmlFor="email">
                4. Applicant Contact Email
              </label>
              <p className={`text-xs ${subTextColor} mb-2`}>Email address of the primary contact person.</p>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded-lg p-3 focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-200 placeholder-gray-500 focus:border-[#14EFC0]/60'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-teal-500'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`} htmlFor="website">
                5. Website URL
              </label>
              <p className={`text-xs ${subTextColor} mb-2`}>Official website of the company or project.</p>
              <input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                className={`w-full rounded-lg p-3 focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-200 placeholder-gray-500 focus:border-[#14EFC0]/60'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-teal-500'
                }`}
                required
              />
            </div>
          </div>
          
          {/* Sezione 2: Informazioni sul progetto */}
          <div className="space-y-6">
            <div>
              <label className={`block text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`} htmlFor="jurisdiction">
                6. Jurisdiction / Country of Incorporation
              </label>
              <p className={`text-xs ${subTextColor} mb-2`}>Legal jurisdiction or country where the company is registered.</p>
              <input
                id="jurisdiction"
                name="jurisdiction"
                type="text"
                value={formData.jurisdiction}
                onChange={handleChange}
                className={`w-full rounded-lg p-3 focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-200 placeholder-gray-500 focus:border-[#14EFC0]/60'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-teal-500'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`} htmlFor="projectStage">
                7. Stage of the Project
              </label>
              <p className={`text-xs ${subTextColor} mb-2`}>Please indicate the current stage: idea, MVP, operational, etc.</p>
              <select
                id="projectStage"
                name="projectStage"
                value={formData.projectStage}
                onChange={handleChange}
                className={`w-full rounded-lg p-3 focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-200 focus:border-[#14EFC0]/60'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-teal-500'
                }`}
                required
              >
                <option value="" disabled className={isDark ? 'bg-[#1a1a2e]' : 'bg-white'}>Please select</option>
                <option value="idea" className={isDark ? 'bg-[#1a1a2e]' : 'bg-white'}>Idea</option>
                <option value="mvp" className={isDark ? 'bg-[#1a1a2e]' : 'bg-white'}>MVP</option>
                <option value="operational" className={isDark ? 'bg-[#1a1a2e]' : 'bg-white'}>Operational</option>
                <option value="scaling" className={isDark ? 'bg-[#1a1a2e]' : 'bg-white'}>Scaling</option>
                <option value="established" className={isDark ? 'bg-[#1a1a2e]' : 'bg-white'}>Established</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`} htmlFor="teamMembers">
                8. Team Members and Roles
              </label>
              <p className={`text-xs ${subTextColor} mb-2`}>Key people involved and their respective roles.</p>
              <textarea
                id="teamMembers"
                name="teamMembers"
                value={formData.teamMembers}
                onChange={handleChange}
                rows="3"
                className={`w-full rounded-lg p-3 focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-200 placeholder-gray-500 focus:border-[#14EFC0]/60'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-teal-500'
                }`}
                required
              ></textarea>
            </div>
          </div>
          
          {/* Sezione 3: Informazioni sull'asset */}
          <div className="space-y-6">
            <div>
              <label className={`block text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`} htmlFor="rwaDescription">
                9. Which RWA are you planning to tokenize?
              </label>
              <p className={`text-xs ${subTextColor} mb-2`}>Brief description of the asset you intend to tokenize.</p>
              <textarea
                id="rwaDescription"
                name="rwaDescription"
                value={formData.rwaDescription}
                onChange={handleChange}
                rows="3"
                className={`w-full rounded-lg p-3 focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-200 placeholder-gray-500 focus:border-[#14EFC0]/60'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-teal-500'
                }`}
                required
              ></textarea>
            </div>

            <div>
              <label className={`block text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`} htmlFor="rwaValue">
                10. Total RWA Value (in USD)
              </label>
              <p className={`text-xs ${subTextColor} mb-2`}>Estimated total market value of the asset.</p>
              <input
                id="rwaValue"
                name="rwaValue"
                type="text"
                value={formData.rwaValue}
                onChange={handleChange}
                className={`w-full rounded-lg p-3 focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-200 placeholder-gray-500 focus:border-[#14EFC0]/60'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-teal-500'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`} htmlFor="tokenizationObjectives">
                11. Tokenization Objectives
              </label>
              <p className={`text-xs ${subTextColor} mb-2`}>Main goals of the tokenization process (e.g., fractional ownership, liquidity, etc.).</p>
              <textarea
                id="tokenizationObjectives"
                name="tokenizationObjectives"
                value={formData.tokenizationObjectives}
                onChange={handleChange}
                rows="3"
                className={`w-full rounded-lg p-3 focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-200 placeholder-gray-500 focus:border-[#14EFC0]/60'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-teal-500'
                }`}
                required
              ></textarea>
            </div>

            <div>
              <label className={`block text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`} htmlFor="companyOverview">
                12. Company / Project Overview (Executive Summary)
              </label>
              <p className={`text-xs ${subTextColor} mb-2`}>A concise summary describing the company/project, mission, market opportunity, and key differentiators.</p>
              <textarea
                id="companyOverview"
                name="companyOverview"
                value={formData.companyOverview}
                onChange={handleChange}
                rows="5"
                className={`w-full rounded-lg p-3 focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#1a1a2e]/50 border border-[#2a2a4e] text-gray-200 placeholder-gray-500 focus:border-[#14EFC0]/60'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-teal-500'
                }`}
                required
              ></textarea>
            </div>

            <div>
              <label className={`block text-xs font-conthrax uppercase tracking-wider ${subTextColor} mb-2`} htmlFor="attachments">
                13. Attach RWA Images or Relevant Data
              </label>
              <p className={`text-xs ${subTextColor} mb-2`}>Upload supporting visuals or documents that help describe or validate the RWA.</p>
              <div className="flex items-center justify-center w-full">
                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  isDark
                    ? 'border-[#2a2a4e] hover:border-[#14EFC0]/60 bg-[#1a1a2e]/30'
                    : 'border-gray-300 hover:border-teal-500 bg-gray-50'
                }`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className={`w-8 h-8 mb-4 ${subTextColor}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className={`mb-2 text-sm ${subTextColor}`}><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className={`text-xs ${subTextColor}`}>PDF, WEBP, JPG or GIF (MAX. 10MB)</p>
                  </div>
                  <input
                    id="attachments"
                    name="attachments"
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {formData.attachments.length > 0 && (
                <div className={`mt-3 p-3 rounded-lg ${isDark ? 'bg-[#14EFC0]/10 border border-[#14EFC0]/20' : 'bg-teal-50 border border-teal-200'}`}>
                  <p className={`text-sm ${isDark ? 'text-[#14EFC0]' : 'text-teal-700'}`}>{formData.attachments.length} file(s) selected</p>
                </div>
              )}
            </div>
          </div>

          {/* Pulsanti di azione */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className={`px-6 py-3 rounded-lg font-conthrax text-sm transition-colors ${
                isDark
                  ? 'border border-[#2a2a4e] text-gray-300 hover:border-[#14EFC0] hover:text-[#14EFC0]'
                  : 'border border-gray-300 text-gray-700 hover:border-teal-500 hover:text-teal-600'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#14EFC0] text-black rounded-lg font-conthrax text-sm hover:bg-[#12d4ad] transition-colors"
            >
              Submit Application
            </button>
          </div>
        </form>
      </DashboardBox>
    </div>
  );

  return (
    <main className="pt-24 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {showForm ? <ApplicationForm /> : <IntroPage />}
      </div>
    </main>
  );
};

export default UStation;

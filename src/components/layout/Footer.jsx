import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { RiTelegram2Fill } from 'react-icons/ri';
import { FaXTwitter } from 'react-icons/fa6';
import { HiOutlineMail } from 'react-icons/hi';
import { useTheme } from '@/context/ThemeContext';
import logoUrano from '@/assets/img/logo_urano.png';
import arb from '@/assets/img/Secondary-OneLine_AllWhite.png'

const footerColumns = [
  {
    title: 'PRODUCTS',
    links: [
      { label: 'uApp', href: 'https://docs.uranoecosystem.com/ecosystem/uapp' },
      { label: 'uShares', href: 'https://docs.uranoecosystem.com/ecosystem/ushares' },
      { label: 'uAssistant', href: 'https://docs.uranoecosystem.com/ecosystem/uassistant' },
      { label: 'uStation', href: 'https://docs.uranoecosystem.com/ecosystem/ustation' },
    ],
  },
  {
    title: 'LEARN',
    links: [
      { label: 'Docs', href: 'https://docs.uranoecosystem.com/' },
      { label: 'FAQ', href: 'https://docs.uranoecosystem.com/more/faqs' },
      { label: 'Github', href: 'https://github.com/uranoecosystem2024' },
      { label: 'Audit', href: 'https://docs.uranoecosystem.com/more/audit' },
      { label: 'uPaper', href: 'https://docs.uranoecosystem.com/more/upaper' },
    ],
  },
  {
    title: 'COMMUNITY',
    links: [
      { label: '$URANO', href: 'https://docs.uranoecosystem.com/ecosystem/uranotoken' },
      { label: 'Airdrop', href: '/airdrop', comingSoon: true },
    ],
  },
  {
    title: 'LEGAL',
    links: [
      { label: 'Terms and Conditions', href: '/terms-conditions' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Cookie Policy', href: '/cookie-policy' },
    ],
  },
];

const fullDisclaimer =
  'The content of this page is provided for informational purposes only and does not constitute an offer or solicitation to sell, or a recommendation to purchase, any financial instrument, security, or digital asset within the meaning of applicable laws and regulations, including Regulation (EU) 2023/1114 on Markets in Crypto-assets (MiCA).';

function ComingSoonPill() {
  return (
    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase leading-none text-white/80 border border-white/15 bg-gradient-to-b from-white/10 to-white/5 whitespace-nowrap">
      Coming soon
    </span>
  );
}

function FooterLink({ link, allowWrap = false, isDark = true }) {
  const isExternal = link.href.startsWith('http');
  const isComingSoon = link.comingSoon;

  const linkClasses = `
    block pl-3 pr-4 py-2 text-base rounded-lg leading-tight
    transition-colors duration-200
    group
    ${isDark ? 'text-white/55 hover:text-white/85 hover:bg-[#1A1A1A]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
    ${allowWrap ? '' : 'whitespace-nowrap overflow-hidden text-ellipsis'}
  `;

  const textClasses = `
    text-base group-hover:bg-gradient-to-r group-hover:from-[#5EBBC3] group-hover:to-[#6DE7C2]
    group-hover:bg-clip-text group-hover:text-transparent
    ${allowWrap ? '' : 'whitespace-nowrap overflow-hidden text-ellipsis'}
  `;

  const content = (
    <div className="flex flex-col items-start gap-1.5">
      <span className={textClasses}>{link.label}</span>
      {isComingSoon && <ComingSoonPill />}
    </div>
  );

  if (isComingSoon) {
    return (
      <span className={linkClasses} onClick={(e) => e.preventDefault()}>
        {content}
      </span>
    );
  }

  if (isExternal) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={link.href} className={linkClasses}>
      {content}
    </Link>
  );
}

function FooterColumnList({ column, allowWrap = false, isDark }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className={`font-semibold tracking-wide uppercase text-[10px] md:text-[13px] whitespace-nowrap px-3 ${isDark ? 'text-[#EDEDED]' : 'text-gray-800'}`}>
        {column.title}
      </h3>
      <div className="flex flex-col gap-2">
        {column.links.map((link) => (
          <FooterLink key={link.label} link={link} allowWrap={allowWrap} isDark={isDark} />
        ))}
      </div>
    </div>
  );
}

function MobileFooterLink({ link, allowWrap = false, isDark = true }) {
  const isExternal = link.href.startsWith('http');
  const isComingSoon = link.comingSoon;

  const linkClasses = `
    text-base leading-tight w-fit
    hover:text-transparent
    transition-colors duration-200
    group
    ${isDark ? 'text-white/55' : 'text-gray-600'}
    ${allowWrap ? '' : 'whitespace-nowrap'}
  `;

  const textClasses = `
    text-base group-hover:bg-gradient-to-r group-hover:from-[#5EBBC3] group-hover:to-[#6DE7C2]
    group-hover:bg-clip-text group-hover:text-transparent
  `;

  const content = (
    <span className="inline-flex items-center gap-2">
      <span className={textClasses}>{link.label}</span>
      {isComingSoon && <ComingSoonPill />}
    </span>
  );

  if (isComingSoon) {
    return (
      <span className={linkClasses} onClick={(e) => e.preventDefault()}>
        {content}
      </span>
    );
  }

  if (isExternal) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={link.href} className={linkClasses}>
      {content}
    </Link>
  );
}

function MobileFooterColumn({ title, links, allowWrap = false, twoColLinks = false, isDark = true }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className={`font-bold tracking-wide uppercase text-base whitespace-nowrap ${isDark ? 'text-[#EDEDED]' : 'text-gray-800'}`}>
        {title}
      </h3>
      <div
        className={
          twoColLinks
            ? 'grid grid-cols-2 gap-x-8 gap-y-6'
            : 'flex flex-col gap-6'
        }
      >
        {links.map((link, idx) => {
          const shouldSpan =
            twoColLinks && idx === links.length - 1 && links.length % 2 === 1;
          return (
            <div key={link.label} className={shouldSpan ? 'col-span-2' : ''}>
              <MobileFooterLink link={link} allowWrap={allowWrap} isDark={isDark} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SocialIconButton({ href, ariaLabel, children, className = '', isDark = true }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`
        flex items-center justify-center rounded-lg
        hover:bg-gradient-to-r hover:from-[#5EBBC3] hover:to-[#6DE7C2] hover:text-[#0E0E0E]
        transition-all duration-200
        ${isDark ? 'bg-[#2A2A2A] text-[#EDEDED]' : 'bg-gray-200 text-gray-700'}
        ${className}
      `}
    >
      {children}
    </a>
  );
}

function Footer() {
  const [showMore, setShowMore] = useState(false);
  const { isDark } = useTheme();

  const previewDisclaimer = useMemo(() => {
    const maxChars = 180;
    if (fullDisclaimer.length <= maxChars) return fullDisclaimer;
    const slice = fullDisclaimer.slice(0, maxChars);
    const lastSpace = slice.lastIndexOf(' ');
    return `${slice.slice(0, Math.max(0, lastSpace))}…`;
  }, []);

  return (
    <footer className={`relative w-screen -ml-[calc((100vw-100%)/2)] overflow-x-clip min-h-screen md:min-h-[80vh] mt-20 md:mt-0 ${isDark ? 'bg-black/90' : 'bg-white/90'}`}>
      {/* Background URANO text */}
      <div className="absolute left-1/2 top-2 md:top-5 -translate-x-1/2 w-full pointer-events-none select-none z-0">
        <p
          aria-hidden="true"
          className={`font-conthrax text-center text-[80px] md:text-[15.5rem] font-extrabold tracking-wider leading-[120%] bg-clip-text text-transparent whitespace-nowrap ${isDark ? 'bg-gradient-to-b from-[#262626] to-transparent' : 'bg-gradient-to-b from-[#E0E0E0] to-[#E0E0E0]'}`}
        >
          URANO
        </p>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen md:min-h-[80vh] flex flex-col px-6 md:px-16 pt-0 md:pt-12 pb-6 md:pb-10">
        {/* ==================== MOBILE ==================== */}
        <div className="block md:hidden mt-4 w-full">
          <div className="flex items-end gap-6">
            {/* Logo */}
            <div className="relative w-full max-w-[320px] h-[120px]">
              <Link to="/">
                <img
                  src={logoUrano}
                  alt="Urano"
                  className="w-full h-full object-contain object-top mt-2"
                />
              </Link>
            </div>

            {/* Arbitrum logo placeholder */}
            <div className="flex items-center justify-center -translate-y-1/2">
              <a
                href="https://arbitrum.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 text-sm hover:text-white/80 transition-colors"
              >
                <img
                  src={arb}
                  alt="Urano"
                  className={`w-44 h-10 object-contain object-top mt-2 ${isDark ? "invert-0" : "invert"}`}
                />
              </a>
            </div>
          </div>

          {/* Mobile buttons */}
          <div className="flex flex-col gap-2.5 mt-4">
            <div className="flex gap-4 items-center w-full">
              <SocialIconButton
                href="https://x.com/uranoecosystem"
                ariaLabel="X (Twitter)"
                className="w-14 h-14"
                isDark={isDark}
              >
                <FaXTwitter size={26} />
              </SocialIconButton>

              <SocialIconButton
                href="https://t.me/uranoecosystem"
                ariaLabel="Telegram"
                className="w-14 h-14"
                isDark={isDark}
              >
                <RiTelegram2Fill size={28} />
              </SocialIconButton>

              <a
                href="https://docs.uranoecosystem.com/the-legal-structure-of-urano"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 h-14 flex items-center justify-center rounded-lg text-lg font-medium whitespace-nowrap hover:bg-gradient-to-r hover:from-[#5EBBC3] hover:to-[#6DE7C2] hover:text-[#0E0E0E] transition-all duration-200 ${isDark ? 'bg-[#2A2A2A] text-[#EDEDED]' : 'bg-gray-200 text-gray-700'}`}
              >
                Compliance Note
              </a>
            </div>

            <a
              href="mailto:info@uranoecosystem.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full h-14 flex items-center justify-center gap-2 rounded-lg text-lg font-medium hover:bg-gradient-to-r hover:from-[#5EBBC3] hover:to-[#6DE7C2] hover:text-[#0E0E0E] transition-all duration-200 ${isDark ? 'bg-[#2A2A2A] text-[#EDEDED]' : 'bg-gray-200 text-gray-700'}`}
            >
              <HiOutlineMail size={26} />
              Contact us
            </a>
          </div>

          {/* Mobile columns */}
          <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-12">
            <MobileFooterColumn title="PRODUCTS" links={footerColumns[0].links} isDark={isDark} />
            <MobileFooterColumn
              title="LEARN"
              links={[
                { label: 'Docs', href: 'https://docs.uranoecosystem.com/' },
                { label: 'Audit', href: 'https://docs.uranoecosystem.com/more/audit' },
                { label: 'FAQ', href: 'https://docs.uranoecosystem.com/more/faqs' },
                { label: 'uPaper', href: 'https://docs.uranoecosystem.com/more/upaper' },
                { label: 'Github', href: 'https://github.com/uranoecosystem2024' },
              ]}
              twoColLinks
              isDark={isDark}
            />
            <MobileFooterColumn title="COMMUNITY" links={footerColumns[2].links} isDark={isDark} />
            <MobileFooterColumn title="LEGAL" links={footerColumns[3].links} allowWrap isDark={isDark} />
          </div>

          {/* Mobile disclaimer */}
          <div className="mt-14">
            <p className={`text-[15px] leading-relaxed text-left ${isDark ? 'text-white/45' : 'text-gray-500'}`}>
              {showMore ? fullDisclaimer : previewDisclaimer}{' '}
              <button
                type="button"
                onClick={() => setShowMore((v) => !v)}
                className={`transition-colors cursor-pointer bg-transparent border-none p-0 m-0 font-inherit ${isDark ? 'text-white/75 hover:text-white/90' : 'text-gray-600 hover:text-gray-800'}`}
              >
                {showMore ? 'Show less' : 'Show more'}
              </button>
            </p>

            <hr className={`mt-8 ${isDark ? 'border-white/10' : 'border-gray-300'}`} />

            <p className={`mt-6 text-[15px] text-center ${isDark ? 'text-white/45' : 'text-gray-500'}`}>
              Urano Ecosystem Sp. z o.o. © 2026
              <br />
              Urano Ecosystem. All rights reserved.
            </p>
          </div>
        </div>

        {/* ==================== DESKTOP ==================== */}
        <div className="hidden md:flex w-full flex-col">
          <div className="block w-full">
            <div className="flex items-start mt-40 mb-0 w-full">
              {/* Left logo block */}
              <div className="flex flex-col flex-shrink-0 w-fit -mt-2">
                <div className="relative w-[200px] lg:w-[260px] xl:w-[320px] h-[84px] max-w-full">
                  <Link to="/">
                    <img
                      src={logoUrano}
                      alt="Urano"
                      className="w-full h-full object-contain object-left-top"
                    />
                  </Link>
                </div>

                <div className="flex items-center gap-3 flex-nowrap">
                  <a
                    href="https://arbitrum.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 text-sm hover:text-white/80 transition-colors ml-3.5"
                  >
                    <img
                      src={arb}
                      alt="Urano"
                      className={`w-44 h-10 object-contain object-top mt-2 ${isDark ? "invert-0" : "invert"}`}
                    />
                  </a>
                </div>
              </div>

              {/* Columns */}
              <div className="flex-1 pt-2.5 flex justify-center items-start gap-4 lg:gap-6 xl:gap-8">
                {footerColumns.map((col) => {
                  const isLegal = col.title === 'LEGAL';
                  return (
                    <div
                      key={col.title}
                      className={`
                        ${isLegal
                          ? 'w-[160px] lg:w-[190px] xl:w-[220px] max-w-[180px] lg:max-w-[210px] xl:max-w-[240px]'
                          : 'w-[120px] lg:w-[150px] xl:w-[170px] max-w-[140px] lg:max-w-[170px] xl:max-w-[200px]'
                        }
                      `}
                    >
                      <FooterColumnList column={col} allowWrap={isLegal} isDark={isDark} />
                    </div>
                  );
                })}
              </div>

              {/* Right CTA cluster */}
              <div className="pt-2.5 flex-shrink-0 w-fit ml-auto">
                <div className="flex flex-col gap-3 lg:gap-4 w-fit items-end">
                  <div className="inline-flex gap-2 lg:gap-2.5 xl:gap-3 items-center justify-end w-fit max-w-full">
                    <SocialIconButton
                      href="https://x.com/uranoecosystem"
                      ariaLabel="X (Twitter)"
                      className="w-[38px] lg:w-10 xl:w-11 h-[38px] lg:h-10 xl:h-11"
                      isDark={isDark}
                    >
                      <FaXTwitter size={22} />
                    </SocialIconButton>

                    <SocialIconButton
                      href="https://t.me/uranoecosystem"
                      ariaLabel="Telegram"
                      className="w-[38px] lg:w-10 xl:w-11 h-[38px] lg:h-10 xl:h-11"
                      isDark={isDark}
                    >
                      <RiTelegram2Fill size={22} />
                    </SocialIconButton>

                    <a
                      href="https://docs.uranoecosystem.com/the-legal-structure-of-urano"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`h-[38px] lg:h-10 xl:h-11 px-3 lg:px-4 xl:px-4.5 min-w-[120px] lg:min-w-[145px] xl:min-w-[170px] flex items-center justify-center rounded-lg text-[13px] lg:text-sm font-medium whitespace-nowrap hover:bg-gradient-to-r hover:from-[#5EBBC3] hover:to-[#6DE7C2] hover:text-[#0E0E0E] transition-all duration-200 ${isDark ? 'bg-[#2A2A2A] text-[#EDEDED]' : 'bg-gray-200 text-gray-700'}`}
                    >
                      Compliance Note
                    </a>
                  </div>

                  <a
                    href="mailto:info@uranoecosystem.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full h-[38px] lg:h-10 xl:h-11 flex items-center justify-center gap-2 rounded-lg text-[13px] lg:text-sm font-medium hover:bg-gradient-to-r hover:from-[#5EBBC3] hover:to-[#6DE7C2] hover:text-[#0E0E0E] transition-all duration-200 ${isDark ? 'bg-[#2A2A2A] text-[#EDEDED]' : 'bg-gray-200 text-gray-700'}`}
                  >
                    <HiOutlineMail size={22} />
                    Contact us
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop disclaimer */}
          <hr className={`mt-12 ${isDark ? 'border-white/10' : 'border-gray-300'}`} />

          <div className="pt-10">
            <p className={`text-[12.5px] leading-relaxed text-center max-w-[980px] mx-auto ${isDark ? 'text-white/45' : 'text-gray-500'}`}>
              {fullDisclaimer}
            </p>
          </div>

          <hr className={`mt-10 ${isDark ? 'border-white/10' : 'border-gray-300'}`} />

          <p className={`mt-6 text-[13px] text-center ${isDark ? 'text-white/45' : 'text-gray-500'}`}>
            Urano Ecosystem Sp. z o.o. © 2026 Urano Ecosystem. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

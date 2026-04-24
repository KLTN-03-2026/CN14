
export default function SectionBanner({ title }) {
  return (
    <div
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen 
                 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 
                 py-12 md:py-6 overflow-hidden mb-4"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <circle cx="200" cy="100" r="120" fill="currentColor" opacity="0.3" />
          <circle cx="600" cy="80" r="140" fill="currentColor" opacity="0.2" />
          <circle cx="1000" cy="120" r="110" fill="currentColor" opacity="0.25" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
       <h3 className="text-white text-1xl md:text-2xl lg:text-3xl font-bold text-center uppercase tracking-wider text-pretty">
          {title}
        </h3>
      </div>
    </div>
  );
}


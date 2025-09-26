export default function MarqueeSection() {
  const lines = [
    "AC Repair - Plumbing - Electrician - Cleaning - Painting - Pest Control - Carpenter - Appliance Repair",
    "Verified Technicians - Same Day Service - Affordable Pricing - 30 Days Service Guarantee",
    "24/7 Support - Easy Booking - Trusted Professionals - Quality Work",
    "Trusted by Thousands - Reliable Home Services - Pluggy at Your Service",
  ]

  const Line = ({ text, reverse = false }) => (
    <div className="relative overflow-hidden">
      <div
        className={`flex whitespace-nowrap ${
          reverse ? "animate-marquee-reverse font-['Playfair_Display'] italic" : "animate-marquee font-['Poppins']"
        }`}
      >
        <span className="mx-2 sm:mx-4 md:mx-6 text-[#1A2A49] text-sm sm:text-base md:text-lg lg:text-xl font-semibold">
          {text}
        </span>
        <span className="mx-2 sm:mx-4 md:mx-6 text-[#1A2A49] text-sm sm:text-base md:text-lg lg:text-xl font-semibold">
          {text}
        </span>
      </div>
    </div>
  )

  return (
    <div className="bg-white py-8 space-y-6">
      {/* Right → Left (Playfair Display font) */}
      <Line text={lines[0]} reverse />
      {/* Left → Right (Poppins font) */}
      <Line text={lines[1]} />
      {/* Right → Left (Playfair Display font) */}
      <Line text={lines[2]} reverse />
      {/* Left → Right (Poppins font) */}
      <Line text={lines[3]} />
    </div>
  )
}

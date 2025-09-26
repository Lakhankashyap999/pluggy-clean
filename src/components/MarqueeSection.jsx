export default function MarqueeSection() {
  const lines = [
    "AC Repair - Plumbing - Electrician - Cleaning - Painting - Pest Control - Carpenter - Appliance Repair",
    "Verified Technicians - Same Day Service - Affordable Pricing - 30 Days Service Guarantee",
    "24/7 Support - Easy Booking - Trusted Professionals - Quality Work",
    "Trusted by Thousands - Reliable Home Services - Pluggy at Your Service",
  ]

  const Line = ({ text, reverse = false }) => (
    <div className="relative overflow-hidden">
      {/* ✅ Two tracks for seamless infinite loop */}
      <div
        className={`flex ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        <span className="mx-8 text-[#1A2A49] text-xl sm:text-2xl font-semibold">
          {text}
        </span>
        <span className="mx-8 text-[#1A2A49] text-xl sm:text-2xl font-semibold">
          {text}
        </span>
      </div>
    </div>
  )

  return (
    <div className="bg-white py-12 space-y-10 font-['Poppins']">
      <Line text={lines[0]} reverse />
      <Line text={lines[1]} />
      <Line text={lines[2]} reverse />
      <Line text={lines[3]} />
    </div>
  )
}

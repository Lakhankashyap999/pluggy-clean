export default function MarqueeSection() {
  const text =
    "⚡ AC Repair - Plumbing - Electrician - Cleaning - Painting - Pest Control - Carpenter - Appliance Repair - Verified Technicians - Affordable Pricing - 24/7 Support - Quality Work - Pluggy at Your Service"

  return (
    <div className="bg-white py-6 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        <span className="mx-6 text-[#1A2A49] text-sm sm:text-base md:text-lg lg:text-xl font-semibold">
          {text}
        </span>
        <span className="mx-6 text-[#1A2A49] text-sm sm:text-base md:text-lg lg:text-xl font-semibold">
          {text}
        </span>
      </div>
    </div>
  )
}



export default function Page() {
	return (
		<main className="min-h-screen w-full bg-black text-white">
			{/* Hero Section */}
			<section className="relative h-screen flex items-center justify-center">
				{/* TODO: Add fullscreen video background */}
				<div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-10">
					<h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">Gala 2026: Empowering Nepal's Future</h1>
					{/* TODO: Countdown Timer */}
					<div className="mb-6">Countdown Timer Here</div>
					<button className="px-6 py-3 bg-red-600 text-white rounded-lg text-lg font-semibold shadow-lg">Live Auction Tonight</button>
				</div>
				{/* TODO: Video element goes here */}
			</section>

			{/* Event Highlights Section */}
			<section className="py-16 bg-white text-black">
				<h2 className="text-3xl font-bold text-center mb-8">Event Highlights</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
					{/* TODO: Masonry grid of photos with lightbox hover */}
					<div className="h-48 bg-gray-200 rounded-lg">Photo 1</div>
					<div className="h-64 bg-gray-300 rounded-lg">Photo 2</div>
					<div className="h-40 bg-gray-200 rounded-lg">Photo 3</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-12 bg-black text-white flex flex-col items-center">
				<div className="flex gap-8 text-2xl font-bold">
					{/* TODO: Animated counters */}
					<div>150+ Attendees</div>
					<div>$50K Raised</div>
					<div>10 Years Impact</div>
				</div>
			</section>

			{/* RSVP CTA Section */}
			<section className="py-12 flex flex-col items-center bg-white text-black">
				<h3 className="text-xl font-semibold mb-4">RSVP for the Gala</h3>
				<a href="https://forms.gle/your-google-form-link" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow-lg">RSVP Now</a>
			</section>
		</main>
	);
}

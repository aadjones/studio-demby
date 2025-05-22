export function SocialLinks() {
  return (
    <div className="flex gap-4 justify-center items-center">
      {/* RSS Icon */}
      <a
        href="/feed.xml"
        title="Subscribe via RSS"
        className="text-xl hover:opacity-80 transition-opacity"
        target="_blank"
        rel="noopener noreferrer"
      >
        📡
      </a>
      {/* Add your other social links here */}
    </div>
  )
} 
import { MessageCircle } from 'lucide-react';

const TELEGRAM_URL = 'https://t.me/+307a44cK5RkxNmZl';

export default function Community() {
  return (
    <section className="relative overflow-hidden rounded-none border border-border text-center py-16 px-8 space-y-6">
      {/* Soft orange gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f7931a]/8 via-transparent to-[#f7931a]/4 pointer-events-none" />
      <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" />

      <div className="relative space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Community</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Join the conversation about the ORS protocol
        </p>

        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#f7931a] hover:bg-[#e8851a] text-white font-semibold text-sm transition-colors rounded-none"
          style={{ boxShadow: '0 0 24px rgba(247,147,26,0.3)' }}
        >
          <MessageCircle className="h-5 w-5" />
          Join Telegram
        </a>
      </div>
    </section>
  );
}

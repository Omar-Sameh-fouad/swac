// مسار الملف: src/components/LandingScreen.tsx
import Image from "next/image";
import Link from "next/link";

function GooglePlayIcon() { return <svg aria-hidden="true" viewBox="0 0 46 46" className="h-9 w-9 shrink-0" fill="none"><path d="M11 7.5v31l19.5-15.2L11 7.5Z" fill="#111" /><path d="m30.5 23.3 5.6-4.4c1.8-1.4 1.8-4.1 0-5.5L16.8 2.2l13.7 21.1Z" fill="#111" /><path d="m30.5 23.3-13.7 20.5 19.3-11c1.9-1.1 1.9-3.8.2-5.1l-5.8-4.4Z" fill="#111" /></svg>; }
function AppStoreIcon() { return <svg aria-hidden="true" viewBox="0 0 46 46" className="h-8 w-8 shrink-0" fill="none"><rect x="6.5" y="6.5" width="33" height="33" rx="6" stroke="currentColor" strokeWidth="3" /><path d="M18.1 29.4h9.8M16.5 25.9h13M22.2 15.5l7.2 13M24.8 15.5l-7.4 13M24.9 15.5c.4-1.6 1.3-2.8 2.7-3.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" /></svg>; }
function SocialIcon({ label, children }: { label: string; children: React.ReactNode }) { return <span aria-label={label} className="grid h-6 w-6 place-items-center rounded-full text-[18px] font-black" role="img">{children}</span>; }

function PhoneMockup() {
  return (
    <div className="relative mx-auto flex h-[292px] w-[154px] items-center justify-center rounded-[18px] bg-[#d8d4cb] shadow-[0_18px_34px_rgba(17,34,37,0.16)] sm:h-[330px] sm:w-[174px]">
      <div className="absolute inset-0 rounded-[18px] bg-[linear-gradient(135deg,#efeee8_0%,#d6d2c9_56%,#f8f6ee_100%)]" />
      <div className="relative h-[274px] w-[132px] overflow-hidden rounded-[24px] border-[7px] border-[#102c35] bg-[#fffef6] shadow-[0_10px_18px_rgba(0,0,0,0.18)] sm:h-[312px] sm:w-[150px]">
        <div className="absolute left-1/2 top-0 z-10 h-4 w-16 -translate-x-1/2 rounded-b-[12px] bg-[#0d222b]" />
        <div className="flex h-full flex-col items-center px-4 pb-4 pt-7 text-center">
          <div className="relative h-[78px] w-[88px] sm:h-[92px] sm:w-[104px]"><Image src="/images/swim-master-logo-clean.png" alt="Swim Master logo" fill priority sizes="104px" className="object-contain" /></div>
          <div className="mt-1"><p className="text-[19px] font-black leading-none text-black sm:text-[21px]">welcome</p><p className="mt-0.5 text-[5px] font-bold text-black/35 sm:text-[6px]">to swim master</p></div>
          <form className="mt-3 w-full space-y-2 text-left" aria-label="Login preview">
            <label className="block text-[6px] font-black text-black sm:text-[7px]">username<span className="mt-1 block h-[13px] rounded-full border border-black/45 bg-white sm:h-[15px]" /></label>
            <label className="block text-[6px] font-black text-black sm:text-[7px]">password<span className="mt-1 flex h-[13px] items-center justify-end rounded-full border border-black/45 bg-white px-1.5 sm:h-[15px]"><span className="grid h-[9px] w-[9px] place-items-center rounded-full border border-black/35 text-[5px] leading-none text-black/45">o</span></span></label>
          </form>
          <p className="mt-0.5 self-end text-[5px] font-bold text-black/30 sm:text-[6px]">Forget password</p>
          <button className="mt-3 h-[18px] w-[84px] rounded-full bg-[#168dab] text-[7px] font-black text-white shadow-[0_5px_8px_rgba(22,141,171,0.28)] sm:h-5 sm:w-24 sm:text-[8px]">login</button>
          <button className="mt-2 h-[18px] w-[84px] rounded-full bg-white text-[7px] font-black text-[#117f9a] shadow-[0_4px_8px_rgba(0,0,0,0.12)] sm:h-5 sm:w-24 sm:text-[8px]">sign up</button>
          <div className="mt-2 flex w-[96px] items-center gap-2 sm:w-[108px]"><span className="h-px flex-1 bg-black/25" /><span className="text-[6px] font-black text-black sm:text-[7px]">or</span><span className="h-px flex-1 bg-black/25" /></div>
          <p className="mt-1 text-[5px] font-bold text-black/35 sm:text-[6px]">login with</p>
          <div className="mt-1.5 flex items-center gap-3">
            <SocialIcon label="Google"><span className="text-[#4285f4]">G</span></SocialIcon>
            <SocialIcon label="Facebook"><span className="text-[#1877f2]">f</span></SocialIcon>
          </div>
        </div>
      </div>
    </div>
  );
}

function DownloadButton({ icon, label, href, variant }: { icon: React.ReactNode; label: string; href?: string; variant: "muted" | "primary" }) {
  const classes = variant === "primary" ? "bg-[#168dab] text-white shadow-[0_8px_18px_rgba(22,141,171,0.22)]" : "bg-[#d7d7d7] text-black";
  const className = `grid h-[52px] w-[220px] grid-cols-[54px_1fr] items-center rounded-[10px] px-5 text-left text-sm font-black transition hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,0,0,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168dab] focus-visible:ring-offset-2 ${classes}`;
  if (href) return <a className={className} href={href} rel="noreferrer" target="_blank">{icon}<span className="justify-self-center">{label}</span></a>;
  return <button className={className} type="button">{icon}<span className="justify-self-center">{label}</span></button>;
}

export function LandingScreen() {
  return (
    <main className="min-h-screen bg-[#fffef8] text-black">
      <header className="sticky top-0 z-30 bg-[#98d3dd]">
        <nav className="mx-auto flex h-16 w-full max-w-[1080px] items-center justify-start gap-4 px-5 sm:justify-between sm:gap-0 sm:px-8">
          <Link href="/" className="flex w-[82px] flex-col items-center gap-0.5 text-[11px] font-black leading-none sm:w-[104px] sm:text-[12px]"><span>Swim Master</span><Image src="/images/swim-master-logo-clean.png" alt="Swim Master" width={34} height={34} className="h-7 w-7 rounded-full object-contain sm:h-8 sm:w-8" /></Link>
          <div className="flex min-w-0 items-center gap-3 text-[11px] font-black sm:gap-12 sm:text-[12px]"><Link className="shrink-0 transition hover:text-[#126f87]" href="/">Home</Link><Link className="shrink-0 transition hover:text-[#126f87]" href="/roles">Registration</Link><a className="shrink-0 transition hover:text-[#126f87]" href="#about">About Us</a></div>
        </nav>
      </header>
      <section className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-[1080px] px-7 pb-14 pt-9 sm:px-10">
        <h1 className="text-[20px] font-black leading-tight">Home</h1>
        <div className="grid min-h-[420px] grid-cols-1 items-center gap-9 pt-7 md:min-h-[365px] md:grid-cols-[1.08fr_0.68fr_1fr] md:gap-12 md:pt-4">
          <div className="relative mx-auto h-[222px] w-full max-w-[292px] md:h-[260px] md:max-w-[332px]"><Image src="/images/swim-master-logo-clean.png" alt="Swim Master logo" fill priority sizes="(max-width: 768px) 292px, 332px" className="object-contain" /></div>
          <PhoneMockup />
          <div className="mx-auto flex w-full max-w-[270px] flex-col items-center text-center md:self-start md:pt-7 md:items-start md:text-left">
            <h2 className="text-[18px] font-black leading-tight sm:text-[20px]">Welcome to Swim Master</h2><p className="mt-1 text-[16px] font-black leading-tight">Download Our App</p>
            <div className="mt-7 flex flex-col gap-8"><DownloadButton icon={<GooglePlayIcon />} label="Google Play" href="https://play.google.com/store" variant="muted" /><DownloadButton icon={<AppStoreIcon />} label="App Store" href="https://www.apple.com/app-store/" variant="primary" /></div>
          </div>
        </div>
      </section>
      <section id="about" className="mx-auto grid w-full max-w-[1080px] grid-cols-1 gap-9 px-7 pb-16 pt-4 sm:px-10 lg:grid-cols-[1fr_0.72fr]">
        <div className="space-y-7">
          <div><h2 className="text-2xl font-black">About Us</h2><p className="mt-3 max-w-2xl text-sm font-black leading-7">Empowering Champions through smart aquatics management.</p></div>
          <div><h2 className="text-2xl font-black">Our Mission</h2><p className="mt-3 max-w-2xl text-sm font-black leading-7">At Swim Master, we believe that athletic excellence begins with structured management...</p></div>
        </div>
        <div className="relative aspect-[688/495] w-full self-start overflow-visible"><Image src="/images/swimmer-role-cutout.png" alt="Swimmer" fill sizes="(max-width: 1024px) 90vw, 360px" className="object-contain object-center" /></div>
      </section>
    </main>
  );
}
const FLAGS: Record<string, string> = {
  Iceland: "🇮🇸",
  Italy: "🇮🇹",
  Australia: "🇦🇺",
  Greece: "🇬🇷",
  Czechia: "🇨🇿",
  UK: "🇬🇧",
};

export function flag(country: string): string {
  return FLAGS[country] ?? "🏳️";
}

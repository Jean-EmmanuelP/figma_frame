export function requireToken(): string {
  const token = process.env.FIGMA_TOKEN;
  if (!token) {
    throw new Error("FIGMA_TOKEN manquant dans .env");
  }
  return token;
}

export function getPort(): number {
  return Number(process.env.PORT || 3000);
}
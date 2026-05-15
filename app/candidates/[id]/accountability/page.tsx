import AccountabilityPageClient from "./page-client"

export const dynamicParams = false

export function generateStaticParams() {
  return [{ id: "sarah-chen" }]
}

export default function AccountabilityPage() {
  return <AccountabilityPageClient />
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>
              We sent you a confirmation link. Please check your email to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              After verifying your email, you can log in to access the Municipal DAO platform.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

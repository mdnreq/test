"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  GraduationCap,
  Users,
  Vote,
  Shield,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  School,
  Calendar,
  Mail,
  Phone,
  MapPin,
  FileText,
  Award,
  Sparkles,
  Globe,
  Building2,
  UserPlus,
  AlertCircle,
  Info
} from "lucide-react"

interface FormData {
  // Personal Info
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  
  // School Info
  schoolName: string
  schoolAddress: string
  schoolProvince: string
  schoolBoard: string
  grade: string
  studentId: string
  
  // Council Info
  councilRole: string
  councilName: string
  memberCount: string
  advisorName: string
  advisorEmail: string
  
  // Verification
  schoolEmail: string
  parentGuardianName: string
  parentGuardianEmail: string
  parentGuardianPhone: string
  
  // Interests
  interests: string[]
  experience: string
  goals: string
  
  // Agreements
  termsAccepted: boolean
  parentConsent: boolean
  dataConsent: boolean
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  schoolName: "",
  schoolAddress: "",
  schoolProvince: "",
  schoolBoard: "",
  grade: "",
  studentId: "",
  councilRole: "",
  councilName: "",
  memberCount: "",
  advisorName: "",
  advisorEmail: "",
  schoolEmail: "",
  parentGuardianName: "",
  parentGuardianEmail: "",
  parentGuardianPhone: "",
  interests: [],
  experience: "",
  goals: "",
  termsAccepted: false,
  parentConsent: false,
  dataConsent: false
}

const provinces = [
  "Ontario",
  "British Columbia",
  "Alberta",
  "Manitoba",
  "Saskatchewan",
  "Quebec",
  "Nova Scotia",
  "New Brunswick",
  "Prince Edward Island",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Yukon",
  "Nunavut"
]

const grades = ["9", "10", "11", "12", "Post-Secondary"]

const councilRoles = [
  "President",
  "Vice President",
  "Secretary",
  "Treasurer",
  "Communications Officer",
  "Events Coordinator",
  "Member at Large",
  "Representative",
  "Other"
]

const interestOptions = [
  "Gen Z & Millennial Civic Engagement (Ages 12-27 & 28-43)",
  "Climate & Environment",
  "Mental Health Support",
  "Education Policy",
  "Transit & Transportation",
  "Housing Affordability",
  "Indigenous Rights",
  "LGBTQ+ Rights",
  "Anti-Racism Initiatives",
  "Digital Rights & Privacy",
  "Arts & Culture",
  "Sports & Recreation"
]

export default function SchoolCouncilRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  
  const totalSteps = 5
  const progress = (step / totalSteps) * 100

  const updateFormData = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const toggleInterest = (interest: string) => {
    const currentInterests = formData.interests
    if (currentInterests.includes(interest)) {
      updateFormData("interests", currentInterests.filter(i => i !== interest))
    } else {
      updateFormData("interests", [...currentInterests, interest])
    }
  }

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    
    switch (currentStep) {
      case 1:
        if (!formData.firstName) newErrors.firstName = "First name is required"
        if (!formData.lastName) newErrors.lastName = "Last name is required"
        if (!formData.email) newErrors.email = "Email is required"
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
        break
      case 2:
        if (!formData.schoolName) newErrors.schoolName = "School name is required"
        if (!formData.schoolProvince) newErrors.schoolProvince = "Province is required"
        if (!formData.grade) newErrors.grade = "Grade is required"
        break
      case 3:
        if (!formData.councilRole) newErrors.councilRole = "Council role is required"
        if (!formData.councilName) newErrors.councilName = "Council name is required"
        break
      case 4:
        if (!formData.parentGuardianName) newErrors.parentGuardianName = "Parent/guardian name is required"
        if (!formData.parentGuardianEmail) newErrors.parentGuardianEmail = "Parent/guardian email is required"
        break
      case 5:
        if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms"
        if (!formData.parentConsent) newErrors.parentConsent = "Parent/guardian consent is required"
        if (!formData.dataConsent) newErrors.dataConsent = "Data consent is required"
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(step)) return
    
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In production, save to database
    console.log("School Council Registration:", formData)
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <Card className="bg-white/5 border-white/10 max-w-lg w-full">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Registration Submitted!</h2>
            <p className="text-white/60 mb-6">
              Thank you for registering your school council with Next Majority DAO. We'll review your application and send a verification email to both you and your parent/guardian within 2-3 business days.
            </p>
            <div className="bg-blue-950/30 border border-blue-500/20 rounded-xl p-4 mb-6 text-left">
              <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                What happens next?
              </h4>
              <ul className="text-white/70 text-sm space-y-2">
                <li>1. Your parent/guardian will receive a consent verification email</li>
                <li>2. Your school advisor will receive a verification request</li>
                <li>3. Once verified, you'll receive your Soulbound Token (SBT)</li>
                <li>4. You can then participate in Youth Assembly and DAO governance</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Link href="/governance">
                  Explore DAO Governance
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 border-white/20 text-white bg-transparent">
                <Link href="/">
                  Return Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-r from-purple-950/50 to-pink-950/50">
        <div className="container mx-auto max-w-4xl px-6 py-6">
          <Button variant="ghost" size="sm" asChild className="text-white/70 hover:text-white mb-4">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">School Council Registration</h1>
              <p className="text-white/60">Join the Youth Assembly and participate in DAO governance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-white/60 mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-4">
            {["Personal Info", "School Details", "Council Info", "Verification", "Review & Submit"].map((label, index) => (
              <div 
                key={label}
                className={`flex flex-col items-center ${index + 1 <= step ? "text-blue-400" : "text-white/30"}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mb-1 ${
                  index + 1 < step ? "bg-blue-600 text-white" :
                  index + 1 === step ? "bg-blue-600/30 text-blue-400 border border-blue-500" :
                  "bg-white/10 text-white/30"
                }`}>
                  {index + 1 < step ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                </div>
                <span className="text-xs hidden md:block">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Banner */}
        <Card className="bg-gradient-to-r from-purple-950/30 to-pink-950/30 border-purple-500/20 mb-8">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Shield className="w-4 h-4 text-purple-400" />
                <span>Verified SBT Credential</span>
              </div>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Vote className="w-4 h-4 text-blue-400" />
                <span>Youth Assembly Voting</span>
              </div>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Award className="w-4 h-4 text-yellow-400" />
                <span>Earn $NEXT Tokens</span>
              </div>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Globe className="w-4 h-4 text-green-400" />
                <span>Connect with Candidates</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Card */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {step === 1 && <><UserPlus className="w-5 h-5 text-blue-400" /> Personal Information</>}
              {step === 2 && <><School className="w-5 h-5 text-purple-400" /> School Details</>}
              {step === 3 && <><Users className="w-5 h-5 text-green-400" /> Student Council Information</>}
              {step === 4 && <><Shield className="w-5 h-5 text-orange-400" /> Verification & Consent</>}
              {step === 5 && <><FileText className="w-5 h-5 text-pink-400" /> Review & Submit</>}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about yourself"}
              {step === 2 && "Information about your school"}
              {step === 3 && "Details about your student council role"}
              {step === 4 && "Parent/guardian consent and verification"}
              {step === 5 && "Review your information and submit"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">First Name *</Label>
                    <Input
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                      className={`bg-white/5 border-white/20 text-white ${errors.firstName ? "border-red-500" : ""}`}
                    />
                    {errors.firstName && <p className="text-red-400 text-xs">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Last Name *</Label>
                    <Input
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                      className={`bg-white/5 border-white/20 text-white ${errors.lastName ? "border-red-500" : ""}`}
                    />
                    {errors.lastName && <p className="text-red-400 text-xs">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Email Address *</Label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className={`bg-white/5 border-white/20 text-white ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Phone Number</Label>
                    <Input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Date of Birth *</Label>
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                      className={`bg-white/5 border-white/20 text-white ${errors.dateOfBirth ? "border-red-500" : ""}`}
                    />
                    {errors.dateOfBirth && <p className="text-red-400 text-xs">{errors.dateOfBirth}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: School Details */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">School Name *</Label>
                  <Input
                    placeholder="Enter your school's name"
                    value={formData.schoolName}
                    onChange={(e) => updateFormData("schoolName", e.target.value)}
                    className={`bg-white/5 border-white/20 text-white ${errors.schoolName ? "border-red-500" : ""}`}
                  />
                  {errors.schoolName && <p className="text-red-400 text-xs">{errors.schoolName}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-white">School Address</Label>
                  <Input
                    placeholder="Street address, city"
                    value={formData.schoolAddress}
                    onChange={(e) => updateFormData("schoolAddress", e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Province *</Label>
                    <Select value={formData.schoolProvince} onValueChange={(value) => updateFormData("schoolProvince", value)}>
                      <SelectTrigger className={`bg-white/5 border-white/20 text-white ${errors.schoolProvince ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map(province => (
                          <SelectItem key={province} value={province}>{province}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.schoolProvince && <p className="text-red-400 text-xs">{errors.schoolProvince}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">School Board</Label>
                    <Input
                      placeholder="e.g., Toronto District School Board"
                      value={formData.schoolBoard}
                      onChange={(e) => updateFormData("schoolBoard", e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Grade Level *</Label>
                    <Select value={formData.grade} onValueChange={(value) => updateFormData("grade", value)}>
                      <SelectTrigger className={`bg-white/5 border-white/20 text-white ${errors.grade ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {grades.map(grade => (
                          <SelectItem key={grade} value={grade}>Grade {grade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.grade && <p className="text-red-400 text-xs">{errors.grade}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Student ID (Optional)</Label>
                    <Input
                      placeholder="Your student ID number"
                      value={formData.studentId}
                      onChange={(e) => updateFormData("studentId", e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Council Info */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Council Name *</Label>
                    <Input
                      placeholder="e.g., Student Government Association"
                      value={formData.councilName}
                      onChange={(e) => updateFormData("councilName", e.target.value)}
                      className={`bg-white/5 border-white/20 text-white ${errors.councilName ? "border-red-500" : ""}`}
                    />
                    {errors.councilName && <p className="text-red-400 text-xs">{errors.councilName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Your Role *</Label>
                    <Select value={formData.councilRole} onValueChange={(value) => updateFormData("councilRole", value)}>
                      <SelectTrigger className={`bg-white/5 border-white/20 text-white ${errors.councilRole ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {councilRoles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.councilRole && <p className="text-red-400 text-xs">{errors.councilRole}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Number of Council Members</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 12"
                    value={formData.memberCount}
                    onChange={(e) => updateFormData("memberCount", e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Faculty Advisor Name</Label>
                    <Input
                      placeholder="e.g., Ms. Johnson"
                      value={formData.advisorName}
                      onChange={(e) => updateFormData("advisorName", e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Faculty Advisor Email</Label>
                    <Input
                      type="email"
                      placeholder="advisor@school.ca"
                      value={formData.advisorEmail}
                      onChange={(e) => updateFormData("advisorEmail", e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>

                {/* Interests */}
                <div className="space-y-3">
                  <Label className="text-white">Policy Interests (Select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {interestOptions.map(interest => (
                      <div
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all text-sm ${
                          formData.interests.includes(interest)
                            ? "bg-blue-600/20 border-blue-500 text-blue-400"
                            : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
                        }`}
                      >
                        {interest}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Your Goals for Joining</Label>
                  <Textarea
                    placeholder="What do you hope to achieve by joining the Youth Assembly and DAO governance?"
                    value={formData.goals}
                    onChange={(e) => updateFormData("goals", e.target.value)}
                    className="bg-white/5 border-white/20 text-white min-h-[100px]"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Verification */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="bg-orange-950/30 border border-orange-500/20 rounded-xl p-4">
                  <h4 className="text-orange-400 font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Parent/Guardian Consent Required
                  </h4>
                  <p className="text-white/70 text-sm">
                    Since you are under 18, a parent or guardian must provide consent for your participation. 
                    They will receive an email to verify and approve your registration.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Parent/Guardian Information</h4>
                  <div className="space-y-2">
                    <Label className="text-white">Parent/Guardian Full Name *</Label>
                    <Input
                      placeholder="Enter parent/guardian name"
                      value={formData.parentGuardianName}
                      onChange={(e) => updateFormData("parentGuardianName", e.target.value)}
                      className={`bg-white/5 border-white/20 text-white ${errors.parentGuardianName ? "border-red-500" : ""}`}
                    />
                    {errors.parentGuardianName && <p className="text-red-400 text-xs">{errors.parentGuardianName}</p>}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Parent/Guardian Email *</Label>
                      <Input
                        type="email"
                        placeholder="parent@email.com"
                        value={formData.parentGuardianEmail}
                        onChange={(e) => updateFormData("parentGuardianEmail", e.target.value)}
                        className={`bg-white/5 border-white/20 text-white ${errors.parentGuardianEmail ? "border-red-500" : ""}`}
                      />
                      {errors.parentGuardianEmail && <p className="text-red-400 text-xs">{errors.parentGuardianEmail}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Parent/Guardian Phone</Label>
                      <Input
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.parentGuardianPhone}
                        onChange={(e) => updateFormData("parentGuardianPhone", e.target.value)}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-semibold">School Email Verification</h4>
                  <div className="space-y-2">
                    <Label className="text-white">School Email (if different from personal)</Label>
                    <Input
                      type="email"
                      placeholder="student@school.ca"
                      value={formData.schoolEmail}
                      onChange={(e) => updateFormData("schoolEmail", e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                    />
                    <p className="text-white/50 text-xs">If you have a school-issued email, this helps verify your student status</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {step === 5 && (
              <div className="space-y-6">
                {/* Review Summary */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-blue-400" />
                      Personal Info
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/50">Name</span>
                        <span className="text-white">{formData.firstName} {formData.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Email</span>
                        <span className="text-white">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Date of Birth</span>
                        <span className="text-white">{formData.dateOfBirth}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <School className="w-4 h-4 text-purple-400" />
                      School Info
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/50">School</span>
                        <span className="text-white">{formData.schoolName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Province</span>
                        <span className="text-white">{formData.schoolProvince}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Grade</span>
                        <span className="text-white">Grade {formData.grade}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-400" />
                      Council Info
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/50">Council</span>
                        <span className="text-white">{formData.councilName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Role</span>
                        <span className="text-white">{formData.councilRole}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-orange-400" />
                      Verification
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/50">Parent/Guardian</span>
                        <span className="text-white">{formData.parentGuardianName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Contact</span>
                        <span className="text-white">{formData.parentGuardianEmail}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {formData.interests.length > 0 && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-3">Policy Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.map(interest => (
                        <Badge key={interest} className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Consent Checkboxes */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => updateFormData("termsAccepted", checked as boolean)}
                    />
                    <div>
                      <Label htmlFor="terms" className="text-white cursor-pointer">
                        I accept the Terms of Service and Privacy Policy *
                      </Label>
                      {errors.termsAccepted && <p className="text-red-400 text-xs mt-1">{errors.termsAccepted}</p>}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="parentConsent"
                      checked={formData.parentConsent}
                      onCheckedChange={(checked) => updateFormData("parentConsent", checked as boolean)}
                    />
                    <div>
                      <Label htmlFor="parentConsent" className="text-white cursor-pointer">
                        I confirm that my parent/guardian has been informed and will provide consent *
                      </Label>
                      {errors.parentConsent && <p className="text-red-400 text-xs mt-1">{errors.parentConsent}</p>}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="dataConsent"
                      checked={formData.dataConsent}
                      onCheckedChange={(checked) => updateFormData("dataConsent", checked as boolean)}
                    />
                    <div>
                      <Label htmlFor="dataConsent" className="text-white cursor-pointer">
                        I consent to the processing of my data for DAO governance participation *
                      </Label>
                      {errors.dataConsent && <p className="text-red-400 text-xs mt-1">{errors.dataConsent}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-white/10">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
                className="border-white/20 text-white bg-transparent disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              {step < totalSteps ? (
                <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Submit Registration
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h4 className="text-white font-semibold mb-1">Soulbound Token</h4>
              <p className="text-white/50 text-sm">Receive a verified SBT credential proving your council membership</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Vote className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h4 className="text-white font-semibold mb-1">Youth Assembly</h4>
              <p className="text-white/50 text-sm">Join the on-chain legislature with veto power on harmful policies</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h4 className="text-white font-semibold mb-1">Earn $NEXT</h4>
              <p className="text-white/50 text-sm">Participate in governance and earn $NEXT tokens for contributions</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

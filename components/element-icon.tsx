import { Mail, Phone, Globe, Twitter, Linkedin, Github, Instagram } from "lucide-react"

interface ElementIconProps {
  type: string
  size: number
  color: string
}

export function ElementIcon({ type, size, color }: ElementIconProps) {
  const iconProps = { size, color, strokeWidth: 2 }

  switch (type) {
    case "email":
      return <Mail {...iconProps} />
    case "phone":
      return <Phone {...iconProps} />
    case "website":
      return <Globe {...iconProps} />
    case "twitter":
      return <Twitter {...iconProps} />
    case "linkedin":
      return <Linkedin {...iconProps} />
    case "github":
      return <Github {...iconProps} />
    case "instagram":
      return <Instagram {...iconProps} />
    default:
      return null
  }
}

import type { ResumeData } from "@/lib/types"

/**
 * The resume, transcribed from Afreen_Khatun_Resume.pdf.
 *
 * This is the source of truth until Firestore has content: the site renders
 * from it instantly on first paint, then swaps in live data if Firestore
 * answers. It is also what the admin "Seed Firestore" action publishes, so
 * editing here and re-seeding is a valid way to reset the live content.
 */
export const resumeData: ResumeData = {
  profile: {
    name: "Afreen Khatun",
    role: "Full Stack Developer",
    location: "Kathmandu, Nepal",
    email: "khatunafreen742@gmail.com",
    phone: "+977 974-6401748",
    tagline:
      "I build production web platforms for government and enterprise clients — the kind where authentication, permissions and uptime are not optional.",
    about: [
      "I’m a Full Stack Developer based in Kathmandu. For the past two years I’ve worked on systems that real people depend on: Nepal’s national immigration portal, the Nepal Electricity Authority’s CRM, a government business-registration and rental platform, and a multi-tenant learning platform behind single sign-on.",
      "Most of my work lives where the frontend meets identity. Login and OTP flows, CAS-based single sign-on, dashboards whose entire UI reshapes itself around whatever permissions an admin actually holds — I’ve built and shipped each of those into production.",
      "I like the parts that compound. A Form Builder and Table Builder I wrote for one product got adopted across the platform; query optimisation on a reporting module cut load times for every report behind it. I’m currently finishing a BCA at Tribhuvan University alongside full-time work.",
    ],
    stats: [
      { value: "2+", label: "Years building for production" },
      { value: "4", label: "Flagship products shipped" },
      { value: "3", label: "Government platforms" },
    ],
    socials: [
      {
        label: "LinkedIn",
        url: "https://linkedin.com/in/afreen-khatun",
        icon: "linkedin",
      },
      { label: "Email", url: "mailto:khatunafreen742@gmail.com", icon: "mail" },
    ],
    resumeUrl: "/Afreen_Khatun_Resume.pdf",
    availability: "Open to opportunities",
    careerStart: "2024-01",
  },

  experience: [
    {
      id: "ambition-guru",
      order: 1,
      role: "Full Stack Developer",
      company: "Ambition Guru",
      location: "Kathmandu, Nepal",
      start: "2024-01",
      end: "",
      summary:
        "Joined on a four-month web development internship and moved into a full-time role. Worked across three flagship products serving government and enterprise clients, owning frontend architecture, authentication flows and the reusable component systems the teams build on.",
      highlights: [
        "Shipped the public and admin portals for Nepal’s Department of Immigration, covering eight visa service flows end to end.",
        "Built role- and permission-aware interfaces where the available navigation and actions adapt to each user’s assigned permissions.",
        "Integrated CAS single sign-on across the LMS so users authenticate once and move between connected applications.",
        "Wrote Form Builder and Table Builder components that were adopted platform-wide, cutting repeat UI work across teams.",
        "Optimised PostgreSQL queries behind the reporting modules and tuned React interfaces, reducing page load times.",
      ],
    },
    {
      id: "yaj-technologies",
      order: 2,
      role: "Full Stack Developer",
      company: "Yaj Technologies",
      location: "Kathmandu, Nepal",
      // TODO: set the real dates — leave both empty and the date line is hidden.
      start: "",
      end: "",
      summary:
        "Built the Business Registration System and eRental System, a government platform serving both flows from a single Vue.js application. Owned the registration journey end to end alongside the authentication and permission layers the whole site runs on.",
      highlights: [
        "Implemented the full business registration flow, from application through to approval, as a multi-step journey with validation at every stage.",
        "Built the eRental System within the same application, sharing its authentication, permissions and component layer.",
        "Delivered OTP-based authentication and permission-driven screens, so each user sees only the actions their role allows.",
        "Implemented CRUD across the platform’s modules with Pinia-managed state and REST API integration.",
        "Handled UI/UX implementation end to end with Vue.js and Tailwind CSS.",
      ],
    },
  ],

  projects: [
    {
      id: "nepali-port",
      order: 1,
      name: "Nepali Port",
      org: "Department of Immigration, Nepal",
      url: "https://nepaliport.immigration.gov.np",
      period: "2024 – Present",
      summary:
        "The national immigration portal — a public-facing service for travellers plus the admin portal officials use to process what those travellers submit. I built module after module across both halves.",
      stack: ["Vue.js", "Pinia", "Tailwind CSS", "REST APIs"],
      featured: true,
      modules: [
        {
          name: "Visa Services",
          points: [
            "Public-facing screens with full CRUD for Visa On-Arrival, Visa from Nepalese Mission, Electronic Travel Authorization (ETA), Visa Extension, Visa Conversion, Visa Transfer, Entry Visa and Visa Plan Upgrade.",
          ],
        },
        {
          name: "Certification & Tracking",
          points: [
            "Arrival/Departure Certification and Non-Visa Arrival/Departure Certification flows.",
            "Visa Application Track and Check Visa lookup screens.",
          ],
        },
        {
          name: "Trekking Permits",
          points: [
            "Check Trekking Permit lookup, the Trekking Agency portal, and Individual Trekking Permit request flows.",
          ],
        },
        {
          name: "Payments",
          points: ["Card payment integration for online fee collection."],
        },
        {
          name: "Admin & Permissions",
          points: [
            "Role- and permission-based dashboard where the UI and available actions adapt dynamically to each admin’s assigned permissions.",
          ],
        },
        {
          name: "Authentication",
          points: [
            "Login and OTP verification flow, shared across both the public and admin portals.",
          ],
        },
        {
          name: "UI/UX",
          points: [
            "Reusable, dynamic Vue components and end-to-end UI/UX implementation across both portals.",
          ],
        },
      ],
    },
    {
      id: "nea-crm",
      org: "Nepal Electricity Authority",
      order: 2,
      name: "NEA CRM",
      url: "https://crm.nea.org.np",
      period: "2024 – Present",
      summary:
        "Customer relationship management for the national electricity authority. Role-aware from the navigation down, with Pinia holding state across every module.",
      stack: ["Vue.js", "Pinia", "Tailwind CSS"],
      featured: true,
      modules: [
        {
          name: "Navigation",
          points: [
            "Dynamic, role-aware sidebar spanning every module of the CRM.",
          ],
        },
        {
          name: "Core CRM",
          points: [
            "Implemented functionality across the CRM’s modules end to end, with Pinia-driven state management.",
          ],
        },
        {
          name: "Authentication",
          points: ["Login and OTP-based verification flow."],
        },
      ],
    },
    {
      id: "brs-erental",
      order: 3,
      name: "Business Registration & eRental System",
      org: "Yaj Technologies · Government platform",
      url: "https://brs.yajtechnologies.com/user/login",
      period: "",
      summary:
        "A government platform running two services from one Vue.js application: business registration and equipment rental. Both share an authentication layer, a permission model and a component library, so a change in one is a change in both.",
      stack: ["Vue.js", "Pinia", "Tailwind CSS", "REST APIs"],
      featured: true,
      modules: [
        {
          name: "Business Registration",
          points: [
            "Built the end-to-end registration journey — application, submission, review and approval — as a multi-step flow with validation at each stage.",
            "Full CRUD across registration records, backed by Pinia state and REST APIs.",
          ],
        },
        {
          name: "eRental System",
          points: [
            "Implemented the rental flows inside the same application, reusing its authentication, permissions and shared components.",
            "Full CRUD across rental records and their supporting reference data.",
          ],
        },
        {
          name: "Authentication",
          points: [
            "OTP-based login and verification, shared by both services.",
          ],
        },
        {
          name: "Permissions & Access Control",
          points: [
            "Permission-driven screens and navigation: the actions a user can reach are derived from the role assigned to them.",
          ],
        },
        {
          name: "UI/UX",
          points: [
            "End-to-end UI/UX implementation in Vue.js and Tailwind CSS, with reusable components shared across both services.",
          ],
        },
      ],
    },
    {
      id: "lms-cas",
      order: 4,
      name: "Learning Management System",
      org: "Ambition Guru product suite",
      url: "",
      period: "2024 – Present",
      summary:
        "A multi-tenant LMS sitting behind CAS single sign-on, with reporting and access control built on Django permissions. My work here spanned identity, data and the component library other teams built on.",
      stack: ["React", "Django", "PostgreSQL", "Tailwind CSS", "CAS / SSO"],
      featured: true,
      modules: [
        {
          name: "Single Sign-On",
          points: [
            "Integrated CAS (Central Authentication Service) into the LMS so users authenticate once and move securely across connected applications.",
          ],
        },
        {
          name: "Reporting & Access Control",
          points: [
            "Dynamic report tables across all LMS modules.",
            "PostgreSQL query optimisation for reporting performance.",
            "Role-based access control built on Django permissions.",
          ],
        },
        {
          name: "Interface",
          points: [
            "Responsive, high-performance React and Tailwind CSS interfaces, built in coordination with backend developers via REST APIs.",
            "Performance tuning that cut page load times.",
          ],
        },
        {
          name: "Form & Table Builder",
          points: [
            "Reusable Form Builder and Table Builder components adopted platform-wide, with seamless RESTful API integration.",
            "Improved UI development speed and maintainability across teams.",
          ],
        },
      ],
    },
  ],

  skills: [
    {
      id: "frontend",
      order: 1,
      category: "Frontend",
      items: [
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "Vue.js",
        "HTML",
        "CSS",
        "Tailwind CSS",
      ],
    },
    {
      id: "backend",
      order: 2,
      category: "Backend & Data",
      items: ["Django", "REST APIs", "PostgreSQL", "Query Optimization"],
    },
    {
      id: "auth",
      order: 3,
      category: "Authentication & Security",
      items: [
        "CAS / Single Sign-On",
        "OTP-based Authentication",
        "Role-Based Access Control",
      ],
    },
    {
      id: "architecture",
      order: 4,
      category: "Architecture",
      items: ["System Architecture", "Microservices", "Multi-tenancy"],
    },
    {
      id: "state",
      order: 5,
      category: "State Management",
      items: ["Pinia", "Redux-style patterns"],
    },
    {
      id: "workflow",
      order: 6,
      category: "Tools & Workflow",
      items: [
        "Git",
        "Pull Requests & Code Review",
        "Agile Stand-ups",
        "Performance Optimization",
      ],
    },
  ],

  education: [
    {
      id: "bca",
      order: 1,
      qualification: "Bachelor of Computer Application (BCA)",
      institution: "Tribhuvan University",
      detail: "Batch 2025 · Ongoing",
      period: "Ongoing",
      grade: "",
    },
    {
      id: "grade-12",
      order: 2,
      qualification: "Higher Secondary Education (Grade 12), Science",
      institution: "Tilottama Multiple Campus, Yogikuti",
      detail: "Biology",
      period: "",
      grade: "GPA 3.01",
    },
    {
      id: "grade-11",
      order: 3,
      qualification: "Higher Secondary Education (Grade 11), Science",
      institution: "Tilottama Multiple Campus, Yogikuti",
      detail: "Biology",
      period: "",
      grade: "GPA 3.72",
    },
    {
      id: "see",
      order: 4,
      qualification: "Secondary Education Examination (SEE)",
      institution: "Deep Boarding High School, Butwal, Rupandehi",
      detail: "",
      period: "",
      grade: "GPA 3.85",
    },
  ],
}

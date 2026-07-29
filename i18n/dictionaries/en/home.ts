import type { DeepWiden } from "@/i18n/types";
import type { home as trHome } from "@/i18n/dictionaries/tr/home";

export const home = {
  metadata: {
    title: "Alihan Ceylan | Web Design and Development",
    description:
      "I design clear, effective web experiences tailored to your brand and goals.",
  },
  hero: {
    titleBefore: "Whatever you need,",
    titleAccent: "I shape it into",
    titleAfter: "a web experience.",
    description: "Digital experiences tailored to your brand and goals.",
    primaryCta: "Tell Me About Your Idea",
    secondaryCta: "View My Services",
  },
  about: {
    eyebrow: "ABOUT",
    opening: "Hello, I’m",
    name: "Alihan Ceylan",
    bridge: "and I design",
    emphasis: "clear, fast and engaging",
    closing: "websites for brands.",
  },
  showcase: {
    technicalLabel: "CONCEPT / 08",
    previewLabel: "Concept website preview",
    exampleLabel: "Example concept",
    controlsLabel: "Website concept previews",
    showConceptSuffix: "show concept",
    designs: [
      { id: "corporate", label: "Corporate Website" },
      { id: "commerce", label: "E-Commerce" },
      { id: "landing", label: "Landing Page" },
      { id: "personal", label: "Personal Brand" },
      { id: "restaurant", label: "Restaurant & Booking" },
      { id: "blog", label: "Blog & Content" },
      { id: "event", label: "Event Website" },
      { id: "custom", label: "Custom Web Project" },
    ],
    previews: {
      corporate: ["CORPORATE", "Services", "About", "DIGITAL CORPORATE EXPERIENCE", "A confident, credible digital presence.", "Explore", "Strategy", "Design", "Technology", "Clear message", "Strong structure", "Easy access"],
      commerce: ["SHOP / CONCEPT", "New", "Categories", "Cart · 2", "All", "Living", "Office", "Accessories", "Desk Lamp", "Ceramic Mug", "Minimal Bag"],
      landing: ["NEXT-GEN EXPERIENCE", "Present one idea with clarity", "A page designed to inspire action.", "Get Started →", "Clear offer", "Smooth journey", "Strong call"],
      personal: ["NAME / SURNAME", "Articles", "Contact", "EXPERTISE & PERSPECTIVE", "Turn your knowledge into a personal brand.", "Consulting", "Content", "Talks"],
      restaurant: ["TABLE", "Menu", "Book a Table", "SEASONAL FLAVOURS", "Good food, a warm welcome.", "Date", "Tonight", "Guests", "2 Guests", "Starters", "Main Courses", "Desserts"],
      blog: ["NOTES", "Design", "Technology", "Culture", "FEATURED STORY", "A calm place for thoughtful ideas.", "6 min read", "Notes on making", "Simplicity in digital work"],
      event: ["OCTOBER", "CREATIVE TECHNOLOGY MEETUP", "A day where ideas connect.", "Register", "PROGRAMME", "10:00 Opening · 11:30 Session", "Speakers"],
      custom: ["CUSTOM WORKSPACE", "A system shaped around your work.", "Membership", "Active", "Workflow", "Ready", "Requests", "Open"],
    },
  },
  faq: {
    eyebrow: "BEFORE WE START",
    title: "Let’s answer a few questions you may already have.",
    description:
      "Common questions about process, scope and technical details before starting a web project.",
    items: [
      { question: "How long does a website take to build?", answer: "Timing depends on the number of pages, content readiness, design scope and required features. I define an estimated schedule together with the project scope before work begins." },
      { question: "How is pricing determined?", answer: "Instead of fixed packages, I assess the project’s needs, design scope and technical requirements. This creates a clear proposal covering only the work you need." },
      { question: "Do I need to prepare all the content?", answer: "We can refine your existing content together. If needed, I can also support the page structure and preparation of website copy." },
      { question: "Will the website work well on mobile devices?", answer: "Every interface is planned for phones and tablets as well as desktop. Readability, usability and performance are checked across screen sizes." },
      { question: "Can you help with the domain and launch?", answer: "When needed, I can support domain, hosting, essential technical setup and launch. We choose the services according to the project requirements." },
      { question: "Can the website be expanded after launch?", answer: "I plan the foundation so new pages and features can be added where possible. Future work depends on the project’s technical structure." },
      { question: "Is SEO included?", answer: "Technical SEO foundations and a search-friendly page structure are considered during development. Content production, keyword research and ongoing SEO management can be planned separately." },
    ],
  },
} satisfies DeepWiden<typeof trHome>;

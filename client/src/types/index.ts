export interface LockedContent {
  _id: string;
  title: string;
  type: 'placement' | 'notes' | 'jobs' | 'hackathons' | 'coding';
  content: string;
  created_at: string;
}

export interface Lecture {
  _id: string;
  title: string;
  type: 'live' | 'recorded';
  youtubeLiveUrl?: string;
  youtubeRecordedUrl?: string;
  scheduledAt?: string;
  duration?: number;
  status: 'upcoming' | 'live' | 'completed';
}

export interface Module {
  _id: string;
  title: string;
  description?: string;
  order: number;
  visibility: 'published' | 'draft';
  lectures: Lecture[];
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  modules_count: number;
  isPublished: boolean;
  type: 'paid' | 'free';
  landing_page?: {
    benefits: string[];
    requirements: string[];
    target_audience: string[];
    curriculum_overview: string;
    instructor_name: string;
    instructor_bio: string;
    instructor_image: string;
  };
  modules: Module[];
}

export interface Stats {
  totalUsers: number;
  totalCourses: number;
  revenue: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  profile_photo?: string; // Added for consistency with HomePage
  enrolled_courses?: string[]; // Added for consistency with HomePage
  progress: {
    courseId: string;
    completedLectures: string[];
  }[];
  isTrialActive: boolean;
  trialStartDate: string;
  subscriptionPlan: 'monthly' | '6months' | '1year' | null;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  hasCourseAccess: boolean;
  profile?: {
    photo?: string;
    banner?: string;
    bio?: string;
    headline?: string;
    skills?: string[];
    projects?: { title: string; description: string; link: string }[];
    resumeUrl?: string;
    placementStatus?: 'searching' | 'placed' | 'not-looking';
    badges?: string[];
    points?: number;
    streak?: number;
  };
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description?: string;
  apply_url?: string;
  posted_at: string;
}

export interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  planId: string;
}

export interface LandingPageSection {
  _id?: string;
  id: string;
  type: string;
  title?: string;
  subtitle?: string;
  content: any;
  isVisible: boolean;
  order: number;
}

export interface PageConfig {
  _id?: string;
  title: string;
  slug: string;
  sections: LandingPageSection[];
  isPublished: boolean;
  isHomepage: boolean;
  logoUrl?: string;
  isDefault?: boolean;
}

export interface MenuLink {
  label: string;
  url: string;
  order: number;
}

export interface MenuConfig {
  _id?: string;
  name: string;
  links: MenuLink[];
}

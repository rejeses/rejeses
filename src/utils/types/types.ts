export interface NavTypes {
  logo: string;
  links: {
    label: string;
    url: string;
  }[];
  linkButtons: {
    label: string;
    url: string;
    className: string;
  }[];
}

export interface ButtonProps {
  url?: string;
  bg: string;
  text: string;
  icon?: React.ReactNode;
  text_color?: string;
  transition_class?: string;
  click?: () => void;
}

export interface FooterProps {
  pathname: "training" | "mentorship" | "consultation" | "/";
}

export interface CardProps {
  id: number;
  title: string;
  date: string;
  description: string;
  id2: number;
  price?: PricingData;
}

export interface TableProps {
  data: Array<{
    id: string;
    title: string;
    content: string;
    tag: string;
  }>;
}

export interface GeneralCardProps {
  id: number;
  pin?: string;
  person?: { name: string; job_title: string };
  title?: string;
  comment: string;
}
export interface UniqueComponentsProps {
  data: Array<{
    id: number;
    title?: string;
    pin?: string;
    comment: string;
    person?: {
      name: string;
      job_title: string;
    };
    tag: string;
  }>;
}

export interface TrainingOption {
  name: string;
  price: number;
  price2: number;
  payment_type: string;
  payment_description: string;
  extra_details: string[];
  register_link: string;
  amount_saved?: number; // Optional
}

export interface PricingDataItem {
  training_only?: TrainingOption;
  training_with_mentorship?: TrainingOption;
}

export interface PricingData {
  individuals: PricingDataItem[];
  group?: PricingDataItem[];
}

export interface PricingProps {
  item: PricingData;
  id?: number;
}

export interface PriceCardProps {
  data: {
    training_only?: TrainingOption;
    training_with_mentorship?: TrainingOption;
    path?: string;
  };
  id?: number;
}

export interface DynamicNavProps {
  link1: string;
  link_text1: string;
  link2: string;
  link_text2: string;
}

export interface Class {
  day: string;
  time: string;
}

export interface ScheduleData {
  days: string[];
  times: string[];
}

export interface ClientImageProps {
  trainingItem?: {
    image: string;
  };
}

// !------------------------------> for class schedule <-------------------------------------------------!
export interface Curriculum {
  week: string;
  topic: string;
  duration: string;
}

export interface Payment {
  order_summary: string;
  includes: string[];
  total: number;
  total2: number;
  curriculum: Curriculum[];
}

export interface ClassSchedule {
  day: string;
  time: string;
}

export interface TrainingOption1 {
  id: number;
  title: string;
  expanded_description: string;
  description: string;
  start_date: string;
  image: string;
  benefits: {
    why: string;
    answer: string[];
  }[];
  requirements: {
    software: string;
    how: string;
    tool: string;
  };
  payment: Payment;
  pricing: PricingData;
  class_schedule: ClassSchedule[];
}

export interface ClientPageProps {
  pricingItem?: {
    id: number;
    pricing: {
      group: Record<string, any>[];
      individuals: Record<string, any>[];
    };
    payment: {
      order_summary: string;
      total: number;
      total2?: number;
      includes: string[];
    };
  };
}

export interface contact_us_values {
  name: string;
  email: string;
  message: string;
}

export type ContactUsErrors = {
  name?: string;
  email?: string;
  message?: string;
};

export type TouchedFields = {
  name: boolean;
  email: boolean;
  message: boolean;
};

export interface scrollSectionTypes {
  children: React.ReactNode;
  className: string;
}

export interface FormDataTYpe {
  firstName: string;
  lastName: string;
  email: string;
  currency: string;
  discount?: string;
  participants: Array<{
    name: string;
    email: string;
  }>;
}

// !-------------------------------------------- end for class schedule --------------------------------------!
export interface PaymentInfo {
  price: number;
  price2: number;
  original_price: number;
  original_price2: number;
  training_id: number | null;
  training_type: string;
  start_date: string;
  classScheduleType: string;
  training_option?: string;
  is_group: boolean;
  promoPrices?: PromoData;
}

export type TrainingType = "training" | "mentoring" | "training&mentoring";

export interface PromoData {
  isPromo: boolean;
  dateRange: string[];
  prices: {
    naira: {
      training: number;
      mentoring: number;
      "training&mentoring": number;
    };
    dollar: {
      training: number;
      mentoring: number;
      "training&mentoring": number;
    };
  };
}

export interface AnimatedAboutcardProps {
  children?: React.ReactNode;
  delay: number;
  className?: string;
}

export interface PromoBannerProps {
  promoData: PromoData;
}

export interface OrderResponse {
  data: string;
}

export interface PromoPricingProps {
  promoData: PromoData | null;
}

export interface TransactionResponseType {
  data: { authorization_url: string; access_code: string; reference: string };
}

export interface TransactionDataType {
  id: number;
  txid: string;
  orderRef?: number;
  pid: string;
  reference: string;
  status: string;
  accessCode?: string;
  currency: string;
  fee?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderDataType {
  id: number;
  firstName: string;
  lastName: string;
  courseType: string;
  courseSchedule: Date[];
  courseScheduleType: classSceduleType;
  startDate: string;
  email: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  participants: string[];
}

// -------------------------------------------------> Animation indicator Types <--------------------------------------------------
export interface MobileIndicatorProps {
  totalItems: number;
  currentIndex: number;
  onIndicatorClick: (index: number) => void;
}
// -------------------------------------------------> End of Animation indicator Types <--------------------------------------------------

// -------------------------------------------------> Certification indicator Types <--------------------------------------------------

export interface Qualifications {
  intro: string;
  experience: string;
  education: string;
  exam: string;
}

export interface Benefits {
  intro: string;
  lists: string[];
}

export interface CertificationContent {
  description: string;
  qualifications: Qualifications;
  benefits: Benefits;
  salary: string;
  last?: string;
  ready?: string;
}

export interface Certification {
  title: string;
  logo: string;
  content: CertificationContent;
}

export interface CertificationData {
  [key: string]: Certification;
}

export interface PageProps {
  params: Promise<{ slug: string }>;
}
// -------------------------------------------------> Endo of certification Types <--------------------------------------------------

// !--------------------------------------------DB & Server Types -----------------------------------------------------!
export interface OrderType2 {
  firstName: string;
  lastName: string;
  courseType: string;
  courseSchedule: Date[];
  courseScheduleType: classSceduleType;
  startDate: string;
  email: string;
  amount: number;
  promocode?: string;
  status: StatusType;
}

export enum StatusType {
  pending = "pending",
  completed = "completed",
  failed = "failed",
  canceled = "canceled",
}

export enum classSceduleType {
  weekend = "weekend",
  weekday = "weekday",
}

export enum CurrencyType {
  naira = "naira",
  dollar = "dollar",
}

export interface TransactionType {
  txid: string;
  orderRef?: number;
  pid: string;
  reference: string;
  status: StatusType;
  accessCode: string;
  currency: CurrencyType;
  fee: number;
}

export interface WeekendSchedule {
  dates: Date[];
  month: number;
  year: number;
}

export interface EmailConfig {
  host?: string;
  port?: number;
  secure?: boolean;
  service?: string;
  auth: {
    user: string;
    pass: string;
  };
}

export type Participant = {
  name: string;
  email: string;
};

// !-----------------------------------------End of DB & Server Types -------------------------------------------------!

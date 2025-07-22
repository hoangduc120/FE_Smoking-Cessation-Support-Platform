export const PATH = {
  // AUTH
  AUTH: "/auth",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOTPASSWORD: "/auth/forgot-password",
  RESETPASSWORD: "/auth/reset-password/:token",

  // HOME
  HOME: "/",
  ASSESSMENTPAGE: "/assessment",
  UPGRADEMEMBER: "/upgradeMember",
  PLANCUSTOMIZATION: "/planCustomization",
  COASHPLANE: "/coachPlan",
  COACHPLANEDETAIL: "/coachPlane/:id",
  PROFILE: "/profile",
  BLOGPAGE: "/blog",
  BLOGDETAIL: "/blog/:slug",
  AUTHORPROFILE: "/author/:userId",
  CREATEBLOG: "/blog/create",
  CONTACT: "/contact",
  BENEFIT: "/benefit",
  ABOUTUS: "/aboutus",
  RESOURCES: "/resources",
  CHATPAGE: "/chat",
  ROADMAP: "/roadmap",
  STAGEDETAIL: "/member/my-roadmap/stage/:stageId",
  SUCCESSPLANRESULT: "/successPlanResult",
  FAILEDPLANRESULT: "/failedPlanResult",
  HISTORYPLAN: "/historyPlan",

  FOLLOWPAGE: "/follow/:userId",
  PAYMENTSUCCESS: "/payment/success",
  PAYMENTFAILED: "/payment/failed",
  CUSTOMQUITPLAN: "/customPlan",
  PAYMENTHISTORY: "/paymentHistory",
  // COACH
  COACH: "/coach",
  PLANMANAGEMEMTPAGE: "/coach/plan-management",
  COACH_MESSAGING: "/coach/messaging",
  COACH_PLAN_BADGE: "/coach/badge",
  COACH_SETTINGS: "/coach/settings",
  PROFILECOACH: "/coach/profileCoach",
  COACHQUITPLANS: "/coach/quitPlan",

  // ADMIN
  ADMIN: "/admin",
  ACCOUNT: "/admin/account",
  USERDETAIL: "/admin/accounts/:userId",
  TRANSITION:"/admin/transition",
  
  // ERROR
  ERROR: "*",
};

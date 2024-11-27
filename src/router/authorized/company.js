import admin from './admin'
import user from './user'
import report from './report'
import assignment from './assignment'
import assessments from './assessments'
export default [
  {
    name: 'company',
    path: 'company',
    component: () => import('pages/company/CompanyIndex.vue'),
    redirect: {
      name: 'company.settings'
    },
    children: [
      {
        name: 'company.settings',
        path: 'company-settings',
        component: () => import('pages/company/CompanySettings.vue'),
        meta: {
          title: 'Company Settings',
          icon: 'fas fa-university',
          breadCrumbs: [
            {
              name: 'company.settings',
              label: 'About',
              icon: 'fas fa-university'
            }
          ]
        }
      },
      ...admin,
      ...user,
      ...report,
      ...assignment,
      ...assessments
    ]
  },
  // {
  //   name: 'company.report',
  //   path: 'company/report',
  //   component: () => import('pages/reports/index.vue'),
  //   meta: {
  //     title: 'Company Report',
  //     icon: 'fas fa-building',
  //     breadCrumbs: [
  //       {
  //         name: 'company.report',
  //         label: 'Reports',
  //         icon: 'fas fa-building'
  //       }
  //     ]
  //   }
  // },
  {
    name: 'company.company_user_info',
    path: 'company/user-info/:email',
    component: () => import('pages/company/CompanyIndividualUserInfo.vue'),
    meta: { title: 'Company User Info', icon: 'person' }
  },
  {
    name: 'company.company_profile',
    path: 'company/profile-info/:email/:username',
    component: () => import('pages/company/ProfileUser.vue'),
    meta: {
      title: 'User Info',
      icon: 'person',
      breadCrumbs: [
        {
          name: 'company.users_ops',
          label: 'Users',
          icon: 'people'
        }
      ]
    }
  },
  {
    name: 'company.individual_team',
    path: 'company/team-info/:id/:teamName',
    component: () => import('pages/company/CompanyIndividualTeamInfo.vue'),
    meta: {
      title: 'Team Info',
      icon: 'fas fa-users',
      breadCrumbs: [
        {
          name: 'company.teamsops',
          label: 'Teams',
          icon: 'people'
        }
      ]
    }
  },

  {
    name: 'company.teamsops',
    path: 'company/teams',
    component: () => import('pages/company/CompanyTeamOps.vue'),
    meta: {
      title: 'Teams',
      icon: 'fas fa-users',
      breadCrumbs: [
        {
          name: 'company.teamsops',
          label: 'Teams',
          icon: 'fas fa-users'
        }
      ]
    }
  },

  {
    name: 'company.user_settings',
    path: 'company/company-user-settings',
    component: () => import('pages/company/CompanyUserSettings.vue'),
    meta: {
      title: 'User settings',
      icon: 'fas fa-users-cog',
      breadCrumbs: [
        {
          name: 'company.users_ops',
          label: 'Users',
          icon: 'people'
        },
        {
          name: 'company.user_settings',
          label: 'Company Settings',
          icon: 'fas fa-users-cog'
        }
      ]
    }
  },
  {
    name: 'company.about',
    path: 'company/company-about',
    component: () => import('pages/company/CompanySettings.vue'),
    meta: { title: 'User settings', icon: 'fas fa-users-cog', breadCrumbs: [] }
  },

  {
    name: 'company.assignments',
    path: 'company/assignments',
    component: () => import('pages/assignments/courseIndex.vue'),
    meta: {
      main: 'settings',
      title: 'Assignments',
      icon: 'library_books'
    }
  },
  {
    name: 'company.assignments.course',
    path: 'company/assignments/course',
    component: () => import('pages/assignments/course/CourseIndex.vue'),
    meta: {
      main: 'settings',
      title: 'Assignments',
      icon: 'library_books'
    }
  },
  {
    name: 'company.assignments.tests',
    path: 'company/assignments/tournaments',
    component: () => import('pages/assignments/courseIndex.vue'),
    meta: {
      main: 'settings',
      title: 'Assignments',
      icon: 'library_books',
      breadCrumbs: [
        {
          name: 'company.course_assignments.tests',
          label: 'Assessments',
          icon: 'library_books'
        }
      ]
    }
  },

  {
    name: 'company.assignments_create',
    path: 'company/assignments/create/:type',
    component: () => import('pages/assignments/tests.vue'),
    meta: { main: 'settings', title: 'Create Assignments', icon: 'library_books' }
  },
  {
    name: 'company.challenge_assignments',
    path: 'company/challenge/assignments',
    component: () => import('pages/assignments/challengeIndex.vue'),
    meta: { main: 'settings', title: 'Challenge Assignments', icon: 'library_books' }
  },
  {
    name: 'company.single_assignments',
    path: 'company/assignments/:assignmentId/',
    component: () => import('pages/assignments/certificateIndex.vue'),
    meta: {
      title: 'Certificate',
      icon: 'library_books',
      breadCrumbs: [
        {
          name: 'company.course_assignments.course',
          label: 'Assignments',
          icon: 'library_books'
        }
      ]
    }
  },
  {
    name: 'company.single_test',
    path: 'company/test/:testId/:testName',
    component: () => import('pages/tests/testsIndex.vue'),
    meta: {
      title: 'Individual Assignment',
      icon: 'gamepad',
      breadCrumbs: [
        {
          name: 'company.assignments.tests',
          label: 'Tournaments',
          icon: 'library_books'
        }
      ]
    }
  },
  {
    name: 'company.report_test',
    path: 'company/test-user/report/:testId/:testName',
    component: () => import('pages/tests/testsReportIndex.vue'),
    meta: { title: 'Individual User Test Report', icon: 'gamepad' }
  },
  {
    name: 'company.assignments_user',
    path: 'company/assignments-user',
    component: () => import('pages/assignments/individualUserAssignments.vue'),
    meta: { title: 'Certificate', icon: 'pen' }
  }
]

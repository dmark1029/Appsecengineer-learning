import { isAuthenticated } from 'src/utils/helpers'
import company from './company'
import Dashboard from 'pages/dashboard/index.vue'
import MainLayout from 'layouts/MainLayout.vue'

export default [
  {
    path: '/portal',
    name: 'portal',
    component: MainLayout,
    beforeEnter: (to, from, next) => {
      isAuthenticated(to) ? next() : next({ path: '/login' })
    },
    children: [
      ...company,
      {
        name: 'dashboard',
        path: 'dashboard',
        component: Dashboard,
        meta: {
          main: 'dashboard',
          title: 'Dashboard',
          icon: 'fas fa-home'
        }
      },
      {
        name: 'profile',
        path: 'profile',
        component: () => import('pages/profile/ProfileIndex.vue'),
        meta: {
          main: 'profile',
          title: 'Profile',
          icon: 'face',
          breadCrumbs: [
            {
              name: 'profile',
              label: 'Profile',
              icon: 'face'
            }
          ]
        }
      },
      {
        name: 'section',
        path: 'profile/:section',
        component: () => import('pages/profile/ProfileIndex.vue'),
        meta: {
          main: 'section',
          title: 'section',
          breadCrumbs: [
            {
              name: 'section',
              label: 'section'
            }
          ]
        }
      },
      // {
      //   name: 'asegpt',
      //   path: 'asegpt',
      //   component: () => import('src/pages/asegpt/ChatIndex.vue'),
      //   meta: {
      //     title: 'ASEGPT',
      //     icon: 'signpost',
      //     breadCrumbs: [
      //       {
      //         name: 'asegpt',
      //         label: 'ASEGPT',
      //         icon: 'fas fa-robot'
      //       }
      //     ]
      //   }
      // },
      {
        name: 'custom-challenge',
        path: 'custom-challenge',
        component: () => import('src/pages/ai_quiz/aiQuiz.vue'),
        meta: {
          title: 'Custom Challenge',
          icon: 'signpost',
          breadCrumbs: [
            {
              name: 'aiquiz',
              label: 'Build your own challenge',
              icon: 'fas fa-robot'
            }
          ]
        }
      },
      {
        name: 'saved-challenges',
        path: 'custom-challenge/saved-challenges',
        component: () => import('src/components/aiQuiz/SavedChallenges.vue'),
        meta: {
          title: 'Custom Challenge',
          icon: 'signpost',
          breadCrumbs: [
            {
              name: 'aiquiz',
              label: 'Build your own challenge',
              icon: 'fas fa-robot'
            }
          ]
        }
      },

      {
        name: 'ai-challenge',
        path: 'ai-challenge/:query',
        component: () => import('src/components/aiQuiz/QuizAIChallenge.vue'),
        meta: {
          title: 'Custom Challenge',
          icon: 'signpost',
          breadCrumbs: [
            {
              name: 'aiquiz',
              label: 'Build your own challenge',
              icon: 'fas fa-robot'
            }
          ]
        }
      },

      {
        name: 'courses',
        path: 'courses',
        component: () => import('pages/my_courses/Index.vue'),
        meta: {
          title: 'My Courses',
          icon: 'fas fa-user-graduate',
          breadCrumbs: [
            {
              name: 'courses',
              label: 'Courses',
              icon: 'fas fa-user-graduate'
            }
          ]
        }
      },
      {
        name: 'live-courses',
        path: 'live-courses',
        component: () => import('pages/my_courses/Index.vue'),
        meta: {
          title: 'Live Courses',
          icon: 'fas fa-user-graduate',
          breadCrumbs: [
            {
              name: 'live-courses',
              label: 'Live courses',
              icon: 'fas fa-user-graduate'
            }
          ]
        }
      },
      {
        name: 'challenges',
        path: 'challenges',
        component: () => import('pages/my_courses/Index.vue'),
        meta: {
          title: 'Challenges',
          icon: 'fas fa-user-graduate',
          breadCrumbs: [
            {
              name: 'challenges',
              label: 'Challenges',
              icon: 'fas fa-user-graduate'
            }
          ]
        }
      },
      {
        name: 'playgrounds',
        path: 'playgrounds',
        component: () => import('pages/my_courses/Index.vue'),
        meta: {
          title: 'Playgrounds',
          icon: 'fas fa-user-graduate',
          breadCrumbs: [
            {
              name: 'playgrounds',
              label: 'Playgrounds',
              icon: 'fas fa-user-graduate'
            }
          ]
        }
      },
      {
        name: 'runninglabs',
        path: 'running-labs',
        component: () => import('pages/running_labs/RunningLabsIndex.vue'),
        meta: {
          title: 'Running Labs',
          icon: 'fas fa-vials',
          breadCrumbs: [
            {
              name: 'runninglabs',
              label: 'Running Labs',
              icon: 'fas fa-vials'
            }
          ]
        }
      },
      {
        name: 'journeys',
        path: 'journeys',
        component: () => import('pages/journeys/index.vue'),
        meta: {
          title: 'Journeys',
          icon: '',
          breadCrumbs: [
            {
              name: 'journeys',
              label: 'Journey'
            }
          ]
        }
      },
      {
        name: 'journeys.journey',
        path: 'journeys/:journeyId',
        component: () => import('pages/journeys/JourneyIndex.vue')
      },
      {
        name: 'upgrade',
        path: 'upgrade',
        component: () => import('pages/upgrade/index.vue'),
        meta: {
          title: 'Upgrade Plans',
          icon: 'diamond',
          breadCrumbs: [
            {
              name: 'upgrade',
              label: 'Upgrade',
              icon: 'diamond'
            }
          ]
        }
      },
      {
        path: 'course-info/intro/:courseId',
        component: () => import('pages/course/CourseIntroUpdated.vue'),
        meta: { title: 'Course Intro', icon: 'school' }
      },
      //courseInfo
      {
        name: 'courseInfo',
        path: 'course-info/info/:courseId',
        component: () => import('pages/course/CourseInfoUpdated.vue'),
        meta: { title: 'Course Info', icon: 'school' }
      },
      {
        name: 'courseInfo.video',
        path: 'course-info/video/:courseId/:subjectId/:id',
        component: () => import('pages/course/VideoPage.vue'),
        meta: { title: 'Course Video', icon: 'ondemand_video' }
      },
      {
        name: 'courseInfo.lab',
        path: 'course-info/lab/:courseId/:subjectId/:id',
        component: () => import('pages/course/LabPage.vue'),
        meta: {
          title: 'Course Lab',
          icon: 'science'
        }
      },
      {
        name: 'courseInfo.quiz',
        path: 'course-info/quiz/:courseId/:subjectId/:id',
        component: () => import('pages/course/QuizPage.vue'),
        meta: { title: 'Course Quiz', icon: 'question_mark' }
      },
      {
        name: 'courseInfo.aiquiz',
        path: 'course-info/aiquiz/:courseId/:subjectId/:id',
        component: () => import('pages/course/AiQuizPage.vue'),
        meta: { title: 'Course Ai Quiz', icon: 'question_mark' }
      },
      {
        name: 'courseInfo.media',
        path: 'course-info/media/:courseId/:subjectId/:id',
        component: () => import('pages/course/MediaPage.vue'),
        meta: { title: 'Course Media', icon: 'fas fa-photo-video' }
      },
      {
        name: 'courseInfo.doiwnload',
        path: 'course-info/download/:courseId/:subjectId/:id',
        component: () => import('pages/course/DownloadPage.vue'),
        meta: { title: 'Course Download', icon: 'download' }
      },
      {
        name: 'courseInfo.complete_course_page',
        path: 'course-info/completed/:courseId/:id',
        component: () => import('pages/course/CourseCompletetionPage.vue'),
        meta: { title: 'Course Completed', icon: 'download' }
      },
      {
        name: 'courseInfo.completed_course_text',
        path: 'course-info/completed/:courseId/',
        component: () => import('pages/course/CourseCompletedText.vue'),
        meta: { title: 'Course Completed', icon: 'download' }
      },

      //courseInfo

      //company information

      //company
      {
        name: 'individualUserAssignments',
        path: 'individual-user-assignment-details/:assignmentId/',
        component: () => import('pages/assignments/normalUserAssignmentDetails.vue'),
        meta: { title: 'Assignment details', icon: 'book' }
      },
      {
        name: 'solutionInfo',
        path: 'solution/info/:challengeId/:courseId/:labId',
        component: () => import('pages/course/solution.vue'),
        meta: { title: 'Solution Info', icon: 'info' }
      },
      {
        name: 'notifications',
        path: 'notifications',
        component: () => import('pages/notifications/index.vue'),
        meta: {
          main: 'notifications',
          title: 'Notifications',
          icon: 'fas fa-home'
        }
      },
      {
        name: 'favorite',
        path: 'favorite',
        component: () => import('pages/wishlist/WishlistIndex.vue'),
        meta: {
          breadCrumbs: [
            {
              name: 'favorite',
              label: 'Favorite',
              icon: 'face'
            }
          ]
        }
      },
      {
        name: 'upload',
        path: 'showcase/upload',
        component: () => import('pages/showcase/fileUpload.vue'),
        meta: {
          title: 'File Upload',
          icon: 'fas fa-upload',
          breadCrumbs: [
            {
              name: 'fileupload',
              label: 'File Upload',
              icon: 'fas fa-upload'
            }
          ]
        }
      }
    ]
  }
]

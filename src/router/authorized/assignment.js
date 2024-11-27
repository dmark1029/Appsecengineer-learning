export default [
  {
    name: 'company.assignment',
    path: 'assignment',
    redirect: {
      name: 'company.course_assignments.course'
    },
    children: [
      {
        name: 'company.course_assignments.course',
        path: 'course',
        component: () => import('pages/assignments/course/CourseIndex.vue'),
        meta: {
          main: 'settings',
          title: 'Assignments',
          icon: 'library_books',
          breadCrumbs: [
            {
              name: 'company.course_assignments.course',
              label: 'Assignments',
              icon: 'library_books'
            }
          ]
        }
      }
    ]
  }
]

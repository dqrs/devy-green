// /*

// Data Notes:

// - On start up
//   - Auth and fetch user 
//   - Fetch user's panels and render them to
//   - Fetch user's features for each panel and render them

//   For each feature:
//     - add 'clear' button
//     - status + entry determines current state

// - Whenever 'save' button is clicked on code feature module, 
//   --> save it to firebase
//   --> go back --> clear
//     -> doe we want to save their incorrect responses?
// - Whenever minimization button is clicked, update panel's minimization status
// - Whenever activation is clicked, update status
// - Basically each button press corresponds to a db change










// */
// students = {
//   'user-1': {
//     first: ''
//     last: ''
//     email: ''
//     github_login: ''
//   },
//   'user-2':  {
//     ....
//   }
// }

// var coursesRef = database.ref('courses')

// courseRef = coursesRef.child('user-2')
// panelsRef = courseRef.child('panels')

// courses = {
//   'user-1': {
//     stats: {
//       completion_percentage: 83
//     }
//     panels: {
//       'basic-info': {
//         status: locked / not started / in progress / complete,
//         minimized: true / false,
//         features: {
//           one: {
//             entry: "t.getFulllNam"
//             status: locked / not started / incorrect /correct
//           }
//         }
//       }
//     },
//   },
//   'user-2': {
//     ...
//   },
//   'user-4': {
//   }
// }
//   
import axiosInstance from './../api';


export default {
  

  changeActiveState: function (userID: string) {
    return axiosInstance.patch(String('/users/' + userID + '/changeactivestate/'))
  },

  deleteUser: function (userID: string) {
    return axiosInstance.delete('/users/' + userID)
  },

  getProjects: function () {
    return axiosInstance.get('/projects/')
  },

  //TODO: data handling
  createProject: function (name: any, isActive: any, users_list: any, users_manage: any) {
    return axiosInstance.post('/projects/', {
      name: name,
      is_active: isActive,
      users_list: users_list,
      users_manage: users_manage
    })
  },

  getProjectByID: function (projectID: string) {
    return axiosInstance.get(String('/projects/' + projectID))
  },

  editProject: function (projectID: string, name: any, isActive: any, users_list: any, users_manage: any) {
    return axiosInstance.patch('/projects/' + projectID + '/edit', {
      name: name,
      is_active: isActive,
      users_list: users_list,
      users_manage: users_manage
    })
  },

  assignUserToProject: function (projectID: string, userID: any, isAdmin: any) {
    return axiosInstance.put(
      '/projects/' + projectID + '/assignuser',
      {},
      {
        params: {
          user_id: userID,
          user_manage: isAdmin
        }
      }
    )
  },

  removeUserFromProject: function (projectID: string, userID: any) {
    return axiosInstance.delete('/projects/' + projectID + '/revokeuser', {
      params: { user_id: userID }
    })
  },

  deleteProject: function (projectID: string) {
    return axiosInstance.delete('/projects/' + projectID)
  },

  getProjectFiles: function (projectID: string) {
    return axiosInstance.get('/projects/' + projectID + '/file/')
  },

  uploadFiles: function (projectID: string, files: any) {
    let form = new FormData()
    for (let file of files) {
      console.log(file)
      form.append('files', file)
      console.log(form)
    }
    return axiosInstance({
      method: 'post',
      url: '/projects/' + projectID + '/file/',
      data: form
    })
  },

  deleteProjectFiles: function (projectID: string, documentID: any) {
    const requestBody = [documentID]
    console.log(typeof documentID)
    return axiosInstance.delete('/projects/' + projectID + '/file/delete', {
      data: requestBody
    })
  },

  addTaskToProject: function (
    projectID: string,
    taskName: any,
    taskStartType: any,
    taskInsideType: any,
    taskLanguage: any,
    taskIsActive: any,
    taskMeta: any,
    taskActorsList: any,
    taskUsersList: any,
    taskFilesList: any,
    tryout = false
  ) {
    return axiosInstance.post('/projects/' + projectID + '/tasks/', {
      name: taskName,
      start_type: taskStartType,
      inside_type: taskInsideType,
      language: taskLanguage,
      is_active: taskIsActive,
      meta: taskMeta,
      actors_list: taskActorsList,
      users_list: taskUsersList,
      files_list: taskFilesList,
      tryout: !!tryout
    })
  },

  getTaskInfo: function (projectID: string, taskID: string) {
    return axiosInstance.get('/projects/' + projectID + '/tasks/' + taskID)
  },

  //Not working. Is it useful?
  isAuthenticated: function () {
    axiosInstance
      .get('/users/me')
      .then(function () {
        // console.log('true')
        return true
      })
      .catch(function () {
        // console.log('false')
        return false
      })
  },

  //Gets data from the endpoint specified during project creation
  getTaskData: function (endpoint: string) {
    return axiosInstance.get(endpoint)
  },

  deleteTask: function (projectID: string, taskID: string) {
    return axiosInstance.delete('/projects/' + projectID + '/tasks/' + taskID)
  },

  activateTask: function (projectID: string, taskID: string) {
    return axiosInstance.patch('/projects/' + projectID + '/tasks/' + taskID + '/activate')
  },

  deactivateTask: function (projectID: string, taskID: string) {
    return axiosInstance.patch('/projects/' + projectID + '/tasks/' + taskID + '/deactivate')
  },

  //This call only works when there is no ending "slash" symbol
  getFileContent: function (projectID: string, fileID: string) {
    return axiosInstance.get('/projects/' + projectID + '/file/' + fileID + '/content')
  },

  getAllAnnotations: function (projectID: string, taskID: string) {
    return axiosInstance.get('/projects/' + projectID + '/tasks/' + taskID + '/annotations')
  },

  createAnnotation: function (projectID: string, taskID: string, annotations: any, comment: any, parent: any) {
    return axiosInstance.post('/projects/' + projectID + '/tasks/' + taskID + '/annotations/', {
      annotations: annotations,
      comment: comment,
      parent: parent
    })
  },

  getAnnotation: function (projectID: string, taskID: string, annotationID: string) {
    return axiosInstance.get('/projects/' + projectID + '/tasks/' + taskID + '/annotations/' + annotationID)
  },

  editAnnotation: function (projectID: string, taskID: string, annotationID: string, annotations: any, comment: any) {
    return axiosInstance.patch(
      '/projects/' + projectID + '/tasks/' + taskID + '/annotations/' + annotationID,
      {
        annotations: annotations,
        comment: comment
      }
    )
  },

  deleteAnnotation: function (projectID: string, taskID: string, annotationID: string) {
    return axiosInstance.delete(
      '/projects/' + projectID + '/tasks/' + taskID + '/annotations/' + annotationID
    )
  },

  closeAnnotation: function (projectID: string, taskID: string, annotationID: string) {
    return axiosInstance.patch(
      '/projects/' + projectID + '/tasks/' + taskID + '/annotations/' + annotationID + '/close'
    )
  },

  reopenAnnotation: function (projectID: string, taskID: string, annotationID: string) {
    return axiosInstance.patch(
      '/projects/' + projectID + '/tasks/' + taskID + '/annotations/' + annotationID + '/reopen'
    )
  }
}

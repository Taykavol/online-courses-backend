import {PrismaClient} from "@prisma/client"
const prisma = new PrismaClient()



// function canViewProject(user, projectID) {
//     return (
    //   user.role === 'ADMIN' ||
    //   prisma.user.findOne
    //   .userID === user.id
//     )
//   }
  
  async function scopedProjects(user) {
    if (user.role === 'ADMIN') return await prisma.course.findMany()
    return await prisma.course.findMany({
        where:{
            status:"PUBLISH"
        }
    })
  }
  
  function canDeleteProject(user, project) {
    return project.userID === user.id
  }

export default { scopedProjects, canDeleteProject}
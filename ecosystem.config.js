module.exports = {
  apps : [{
    name: "app",
    script: "dist/index.js",
    env: {
      NODE_ENV: "development",
      FRONTEND_URL:"http://localhost:3000",
      SANDBOX_PAYPAL_CLIENT:"AQecO_cPaI4jsY-S7rBVo0QxhQv_NP7gzZML2kACL8P6LqDWabpeo1JfkLFuwFYl3zRG6wB7cxu2h7NO",
      SANDBOX_PAYPAL_SECRET:"EG-hodPsZAQLp-n1gCDfvOBbO0DcFpjxlErH66aoHimbxzHb2K5iDSAKcxMxBZ5CSXnN5Pm-65VWSutO",
      GOOGLE_CLIENT_ID:"231498108232-bqrk6v0pmvnm8o8igcn6en22f42g41ls.apps.googleusercontent.com",
      GOOGLE_CLIENT_SECRET:"QrwdEA1hK-BYzVXEYCDM-AiY ",
      FACEBOOK_CLIENT_ID:"314836566324405",
      FACEBOOK_CLIENT_SECRET:"de3c97ceb2199cd7ec2d8d051468c33d",
      VK_CLIENT_ID:"7678450",
      VK_CLIENT_SECRET:"b2IxFuAeN0hKXFKIG4BC",
      s3Url:"https://chess-courses.hb.bizmrg.com",
      DATABASE_URL:"postgresql://postgres:3524@localhost:5432"
    },
    env_production: {
      NODE_ENV: "production",
      FRONTEND_URL:"https://chess-courses.com",
      SANDBOX_PAYPAL_CLIENT:"AQecO_cPaI4jsY-S7rBVo0QxhQv_NP7gzZML2kACL8P6LqDWabpeo1JfkLFuwFYl3zRG6wB7cxu2h7NO",
      SANDBOX_PAYPAL_SECRET:"EG-hodPsZAQLp-n1gCDfvOBbO0DcFpjxlErH66aoHimbxzHb2K5iDSAKcxMxBZ5CSXnN5Pm-65VWSutO",
      GOOGLE_CLIENT_ID:"231498108232-bqrk6v0pmvnm8o8igcn6en22f42g41ls.apps.googleusercontent.com",
      GOOGLE_CLIENT_SECRET:"QrwdEA1hK-BYzVXEYCDM-AiY ",
      FACEBOOK_CLIENT_ID:"314836566324405",
      FACEBOOK_CLIENT_SECRET:"de3c97ceb2199cd7ec2d8d051468c33d",
      VK_CLIENT_ID:"7678450",
      VK_CLIENT_SECRET:"b2IxFuAeN0hKXFKIG4BC",
      s3Url:"https://chess-courses.hb.bizmrg.com",
      DATABASE_URL:"postgres://user1:35243524@rc1b-nswu5hhegloor430.mdb.yandexcloud.net:6432/db1"
    }
  }],

  // deploy : {
  //   production : {
  //     user : 'SSH_USERNAME',
  //     host : 'SSH_HOSTMACHINE',
  //     ref  : 'origin/master',
  //     repo : 'GIT_REPOSITORY',
  //     path : 'DESTINATION_PATH',
  //     'pre-deploy-local': '',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
  //     'pre-setup': ''
  //   }
  // }
};

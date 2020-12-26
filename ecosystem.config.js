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
      GOOGLE_CLIENT_SECRET:"QrwdEA1hK-BYzVXEYCDM-AiY",
      FACEBOOK_CLIENT_ID:"314836566324405",
      FACEBOOK_CLIENT_SECRET:"de3c97ceb2199cd7ec2d8d051468c33d",
      VK_CLIENT_ID:"7678450",
      VK_CLIENT_SECRET:"b2IxFuAeN0hKXFKIG4BC",
      s3Url:"https://chess-courses.hb.bizmrg.com",
      DATABASE_URL:"postgresql://postgres:3524@localhost:5432",
      JWT_SECRET:'secret'
    },
    env_production: {
      NODE_ENV: "production",
      FRONTEND_URL:"https://chess-courses.com",
      BACKEND_URL:"https://api.chess-courses.com",
      GOOGLE_CLIENT_ID:"231498108232-bqrk6v0pmvnm8o8igcn6en22f42g41ls.apps.googleusercontent.com",
      GOOGLE_CLIENT_SECRET:"QrwdEA1hK-BYzVXEYCDM-AiY",
      FACEBOOK_CLIENT_ID:"314836566324405",
      FACEBOOK_CLIENT_SECRET:"de3c97ceb2199cd7ec2d8d051468c33d",
      VK_CLIENT_ID:"7678450",
      VK_CLIENT_SECRET:"b2IxFuAeN0hKXFKIG4BC",
      s3Url:"https://chess-courses.hb.bizmrg.com",
      DATABASE_URL:"postgres://user1:35243524@rc1b-okjjh8lgsfxu3i2l.mdb.yandexcloud.net:6432/db1",
      JWT_SECRET:'secret',
      LIVE_PAYPAL_CLIENT:'AcKBt7lr_UgmiD9FJY6II7FQEPslK6sg-hKqdIo2PMazineptAtEWO_pxXC-TFu9RNNdAlVkeRBbTEs6',
      LIVE_PAYPAL_SECRET:'EOJvrHGIP2dvucNtlZdVYGrJZH5TYKSLDktWpSIe-5AALs8kI9uwbhEd_m04x0HKtkK6gcNx18yMUQ1Y',
      VIMEO_CLIENT:'32d615dc4ca483e433a4bf76192475102dcee8c0',
      VIMEO_SECRET:'lNFDTgMihkuv/mrQURmHCtREg4hLqo6K976Gycmv49AC8MY/BhAv5ojdWl1kUbHrWsYwNYSiVqShTmDvrXBS0hc7GgVR3g8Wmpg6coJC8x0Hv07kS21n6g92X+5VJuXS',
      VIMEO_ACCESS_TOKEN_DELETE_SCOPE:'8969d11029edcd376c506f0bc444149b',
      VIMEO_ACCESS_TOKEN_UPLOAD_SCOPE:'3e92014e848e2e2cf2be98351cf18204',
      YANDEX_CLIENT:'770033',
      YANDEX_SECRET:'test_j9KT3bKM3pRLIa4Nxhmd-Yf6fMMhxkPyBE4xjq1NAgw',

//       VIMEO_CLIENT=32d615dc4ca483e433a4bf76192475102dcee8c0
// VIMEO_SECRET=lNFDTgMihkuv/mrQURmHCtREg4hLqo6K976Gycmv49AC8MY/BhAv5ojdWl1kUbHrWsYwNYSiVqShTmDvrXBS0hc7GgVR3g8Wmpg6coJC8x0Hv07kS21n6g92X+5VJuXS
// VIMEO_ACCESS_TOKEN_DELETE_SCOPE=8969d11029edcd376c506f0bc444149b
// VIMEO_ACCESS_TOKEN_UPLOAD_SCOPE=3e92014e848e2e2cf2be98351cf18204
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

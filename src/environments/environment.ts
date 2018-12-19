// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // apiEndpoint: 'http://192.168.24.208:8000/',
  // urlEndpoint: 'http://192.168.24.208:8000'

  apiEndpoint: 'http://www.api-store.banaoapp.com:8001/',
  urlEndpoint: 'http://www.api-store.banaoapp.com:8001',

  apiEndpointBlog: 'http://192.168.24.208/blog-admin/api/',
  urlEndpointBlog: 'http://192.168.24.208/blog-admin/api/',
  imageBaseUrlBlog: "http://192.168.24.208/blog-admin/uploads/"
  
  //   apiEndpoint: 'https://www.api-store.banaoapp.com:8002/',
  // urlEndpoint: 'https://www.api-store.banaoapp.com:8002',

  // apiEndpointBlog: 'https://banaoapp.com/blog-admin/api/',
  // urlEndpointBlog: 'https://banaoapp.com/blog-admin/api/',
  // imageBaseUrlBlog: "https://banaoapp.com/blog-admin/uploads/"


};


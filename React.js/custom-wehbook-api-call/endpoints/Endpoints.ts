enum ENDPOINTS {
  BASE = "http://3.210.242.220:3000",
  lOCALBASE = "http://localhost:5000",
  GET_USER = "",
  END_USER_SESSION = "",
  //COMMON URLS
  LOGIN = "/user/login",
  //GLOBAL-CATEGORY-CODES urls
  GLOBAL_CODE_CATEGORY = "/global-code-category",
  //JOB_TYPES
  JOB_TYPES = "/job-type",
  //GLOBAL-CODE
  GLOBAL_CODE = "/global-code",
  PARENT_GLOBAL_CODE = "/global-code/category",
  //MACHINE_TYPES
  MACHINE_TYPES = "/machine-type",
  //MACHINES
  MACHINES = "/machines",
  GET_MACHINES_BY_MACHINE_TYPE = "/machines-machinetype",
  //SEGMENT
  SEGMENT = "/segment",
  PARENT_SEGMENT = "/segmentMachine",
  SUB_SEGMENT = "/sub-Segment",
  //PARTS
  PARTS = "/part",
  //INVENTORY
  INVENTORY = "/inventory",
  //STAGE
  STAGE = "/job-stage",
  //ATTRIBUTE MODAL
  ATTRIBUTE_MODALS = "/attribute",
  //TEMPLATE
  TEMPLATE = "/template",
  TEMPLATE_CLONE = "/template-clone",
  //QUESTIONS
  CREATE_QUESTION = "/questions",
  CLONE = "/question/clone",
  QUESTION = "/question",
  GET_EXISTING_QUESTIONS = "/question/existing",
  DELETE_OPTION = "/question/option",
  CREATE_OPTION = "/question/option",
  //IMAGEUPLOADER
  IMAGE_UPLOAD = "/question/upload",
  //HOLIDAY
  HOLIDAY = "/holiday",
  //ROLE
  ROLE = "/role",
  //ORGANIZATIONS
  ORGANIZATIONS = "/organization",
}

export default ENDPOINTS;

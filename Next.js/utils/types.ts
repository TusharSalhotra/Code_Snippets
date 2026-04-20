export interface IUSERS {
  _id: string
  firstName: string
  lastName: string
  email: string
  password: string
  isDeleted: string
}

export interface IFILE {
  name: string
  arrayBuffer: Function
}
export interface IPARAMS {
  params: { id: string }
}

export interface IMOVIES {
  title: string
  publishingYear: string
}

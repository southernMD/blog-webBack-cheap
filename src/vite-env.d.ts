/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
interface ImportMetaEnv {
  readonly VITE_APP_BASE_API: string
  // 更多环境变量...
}

type BaseRes = {
  status:number
  message:string
}

type PostQs = {
  q1:string
  q2:string
  q3:string
}

type LoginState = {
  status:number
  message?:string[]
  token?:string
}

type UseLogin = {
  theme:string
  windowWidth:number
}

type UseMy = {
  draftArr:DraftArr[]
  trashArr:TrashArr[]
  lookingArr:lookingArr[]
  writing:ArticleObj,
  saveIndex:number
  EndFlie:Array<any>
  newPageFlag:boolean
  lookactiveNames:string[]
}

type ImgUpload =  BaseRes &{
  filename:string
}

type PostArticle = BaseRes & {
  id?:number
}

type stateName =  '保存' | '发布' | '保存,删除'  | '发布,删除' | ''

type ArticleObj = {
  title: string ;
  title2:string;
  time: string;
  text: string;
  gather: any;
  tags: string;
  state:stateName;
  imgUrl: string;
  ifpublic: string;
  id?:number | null
  delTime?:string
  restOfTime?:15
}

type DraftArr = ArticleObj & {
  id:number
}

type TrashArr = & DraftArr 
type lookingArr = & DraftArr 

type DraftArrHttp = BaseRes &{
  data:DraftArr[]
}


type TrashArrHttp = DraftArrHttp &{}

type lookingArrHttp = DraftArrHttp &{}

type TagsMessage = BaseRes & {
  result:any[]
}

type GitHubIMG = BaseRes &{
  urls:string[]
}

type ErrorHttp = {
  data: string,
  time: string,
  success: boolean,
  path: string,
  status: number
}

type ErrorVar = {
  statusCode: number,
  message: string[],
  error: string
}

type uploadError = {
  status:number,
  error:string
}
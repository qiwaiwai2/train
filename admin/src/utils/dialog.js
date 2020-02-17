import {Modal} from 'ant-design-vue'
export default class Tips {
    constructor() {
        this.isLoading = false;
    }
    /**
    * 弹出确认窗口
    */
   static confirm (text, payload = {}, title = "提示"){
       return new Promise((resolve,reject) => {
            Modal.confirm({
                title:title,
                content:text,
                onOk(){
                    resolve(payload)
                },
                onCancel(){
                    reject(payload)
                }
            })
       })
   }
}
export default function MapLoader () {   // <-- 原作者这里使用的是module.exports
    return new Promise((resolve, reject) => {
      if (window.AMap) {
        resolve(window.AMap)

      } else {
        var script = document.createElement('script')
        var oCss = document.createElement('link')
        oCss.setAttribute("rel", "stylesheet");
        oCss.setAttribute("type", "text/css");
        oCss.setAttribute("href", 'https://a.amap.com/jsapi_demos/static/demo-center/css/demo-center.css');
        // oCss.href = 'https://a.amap.com/jsapi_demos/static/demo-center/css/demo-center.css'
        // oCss.rel = 'stylesheet'
        script.type = 'text/javascript'
        script.async = false
        script.src = 'https://webapi.amap.com/maps?v=1.4.15&callback=initAMap&key=0f31751255b231fcd092f6431b136a83&plugin=AMap.GraspRoad&plugin=AMap.MouseTool'
        script.onerror = reject
        document.head.appendChild(oCss)
        document.head.appendChild(script)

      }
      window.initAMap = () => {
        resolve(window.AMap)
      }
    })
  }
  
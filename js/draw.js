function draw() {
  let loading = document.querySelector(".loadingbox")
  let loadingtext = document.querySelector(".loadingtext")
  let errmsg = document.querySelector(".errmsg")
  let countdown = 60
  if (loading) {
    loading.style.display = "flex"

  }

  var fd = new FormData();
  var base64String = localStorage.getItem("dataUrl");
  var bytes = window.atob(base64String.split(",")[1]);
  var array = [];
  for (var i = 0; i < bytes.length; i++) {
    array.push(bytes.charCodeAt(i));
  }
  var blob = new Blob([new Uint8Array(array)], { type: "image/jpeg" });
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  var contentId = getParameterByName("id") || localStorage.getItem("contentId");
  fd.append("stylized_image", blob, Date.now() + ".jpg");
  fd.append("prompt", contentId);
  fd.append("client", "cuz");
  axios
    .post("/stylize", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(function (response) {

      console.log("发布绘图任务信息", response.data);
      const queryParams = {
        prompt_id: response.data.prompt_id,
        client_id: "cuz",
      };
      const intervalId = setInterval(() => {

        // 这里放置你想要延迟执行的代码
        axios
          .get("/view", {
            params: queryParams,
          })
          .then(
            (response) => {
              if (response.data.statusCode === 200) {
                console.log("绘图成功", response.data.data);
                const keys = Object.keys(response.data.data); // 获取对象的所有键
                const firstKey = keys[0]; // 获取数组中的第一个键
                const imgurl = response.data.data[firstKey]; // 获取第一个键对应的值
                console.log("imgurl,", imgurl);
                localStorage.setItem("myimg", imgurl);
                loading.style.block = "none"


                clearInterval(intervalId);
                location.href = './drawImage.html'

              } else if (response.data.statusCode === 102) {
                console.log("等待绘图中...", countdown);

                // 每秒更新倒计时
                countdown--;

                loadingtext.innerHTML = `<p>照片制作中</p><p>约${countdown}秒后呈现</p>`;

                // 减少倒计时

                // 如果倒计时结束，确保时间显示为0
                if (countdown <= 10) {
                  loadingtext.innerHTML = `<p>照片制作中</p><p>约10秒内呈现</p>`;
                }
              } else {
                console.log("绘图失败");
              }

              // 把生成的图片保存到本地
            },
            (error) => {
              console.log("网络连接错误(view)", error);
              errmsg.style.display = 'flex'

              setTimeout(() => {
                loading.style.display = "flex"
                location.href = './index.html'



              }, 1000)
            }
          ).catch(err => {
            errmsg.style.display = 'flex'
            console.log("网络连接错误,即将跳转到index", err);

            setTimeout(() => {
              loading.style.display = "flex"
              location.href = './index.html'



            }, 5000)

          });
      }, 1000);
    })
    .catch(err => {
      errmsg.style.display = 'flex'
      console.log("网络连接错误,即将跳转到index", err);

      setTimeout(() => {
        loading.style.display = "flex"
        location.href = './index.html'



      }, 5000)

    });
}
export { draw }
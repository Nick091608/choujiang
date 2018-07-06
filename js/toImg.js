$(function () {
    //初始化页面rem
    $("html").css({"font-size":$(window).height()/12+"px"})
    var ImgPage = {
        imglist: ["01哈曼电磁侠H5小版本.jpg", "02哈曼服务侠H5小版本.jpg", "03哈曼软件侠H5小版本.jpg", "04哈曼系统侠H5小版本.jpg", "05哈曼机械侠H5小版本.jpg", "06哈曼扬声侠H5小版本.jpg"],
        imgcvlist: [{ path: "电磁侠_03.png", x: 271, y: 508 }, 
            { path:"服务侠_03.png",x: 264, y: 445 }, 
            { path:"软件侠_03.png",x: 286, y: 487 },
            { path:"系统侠_03.png",x: 279, y: 536 },
        { path:"机械侠_03.png",x: 288, y: 499 }, { path:"扬声侠_03.png",x: 261, y: 454 }],
        selePageId: "#SeleImg",
        createId: "#ImgCreate",

        toSelePage: function () {
            $(this.selePageId).show();
            $(this.createId).animate({ left: "100%" }, 200, function () {
                $(this.createId).hide();
            });
        },
        toCreate: function (a) {
            var self = this;
            $("#viewImgdiv").hide();
            $(".foot-keep").hide();
            $("#toEnd").show();
            $("#viewMess").show();
            $("#toMore").hide();
            $(this.createId).css({ left: "100%" }).show();
            $(this.createId).animate({ left: 0 }, 200, function () {
                $(self.selePageId).hide();
                clipManager.open("../images/" + self.imglist[a], "../images/" + self.imgcvlist[a].path,self.imgcvlist[a]);
            });
        },
        toNext: function () {
            clipManager.save(function () {
                $("#viewMess").hide();
                $(".foot-keep").show();
                $("#toEnd").hide();
                $("#toMore").show();
                $("#viewImgdiv").show().css({ "z-index": 100 });
            });
            
        }
    };

    //监控点击
    $(".flipster").on("click", "li a", function (event) {
        ImgPage.toCreate($(event.target).data("to"));
        event.preventDefault();
        event.stopPropagation()
    });
    $("#toSele").on("click", function (event) {
        ImgPage.toSelePage();
        event.preventDefault();
        event.stopPropagation();
        return false;
    });
    $("#toEnd").on("click", function (event) {
        ImgPage.toNext();
        event.preventDefault();
        event.stopPropagation();
        return false;
    });

    //图片合成
    var clipManager = {
        box:null,
        canvas: null,
        currimg: null, //当前需要处理的图片
        bgimg: null,//背景图片
        duimg: null,//需要的抠图
        isinit: false,
        canvasAttr: { wid: 750, hid: 1334, left: 0, top: 0 },
        imgAttr: { left: 0, top: 0, scale: 1, tx: [] },
        imgtouch: { left: 0, top: 0, tx: [] },
        dupoint: {x:260,y:530},//遮罩坐标点
        oldtauches: [],
        scale: 1,
        succFun: null,
        failFun: null,
        issave:false,//是否是生成图片
        //选择图片后开启
        open: function (img, duimg, c) {
            this.issave = false;
            this.init();
            this.box.hide();
            $("#ImgCreate .box_camera").show();
            $("#ImgCreate .mould1").css({ "background-image": "url(" + img + ")" });
            this.dupoint = c;
            var self = this;
            console.log(img);
            this.bgimg.src = img;
            this.duimg.src=duimg
        },
        //删除选择图后关闭功能
        close: function () {
            this.box.hide();
            $("#camera").val("");//清空选择
            $("#ImgCreate .box_camera").show();
        },
        //更新
        update: function () {
            console.log(this.imgAttr)
            $(this.currimg).css({ left: this.imgAttr.left + this.canvasAttr.left, top: this.imgAttr.top + this.canvasAttr.top });
            if (this.imgAttr.tx.length > 0)
                $(this.currimg).css({ 'transform': 'matrix(' + this.imgAttr.tx[0] + ',' + this.imgAttr.tx[1] + ',' + this.imgAttr.tx[2] + ',' + this.imgAttr.tx[3] + ',' + this.imgAttr.tx[4] + ',' + this.imgAttr.tx[5] + ')' });
            //canvas画图
            var context = this.canvas.getContext("2d");
            context.clearRect(0, 0, this.canvasAttr.wid, this.canvasAttr.hid);
            context.save();
            //判断裁切图片
            if (this.duimg) {
                console.log("drawduimg");
                context.drawImage(this.duimg, this.dupoint.x, this.dupoint.y, this.duimg.width, this.duimg.height);
                context.globalCompositeOperation = "source-in"
            }
            context.setTransform(this.imgAttr.tx[0], this.imgAttr.tx[1], this.imgAttr.tx[2], this.imgAttr.tx[3], this.imgAttr.tx[4], this.imgAttr.tx[5])

            //绘制图像
            context.drawImage(this.currimg,
            this.imgAttr.left,
            this.imgAttr.top,
            this.currimg.width * this.imgAttr.scale,
            this.currimg.height * this.imgAttr.scale
            )
            context.restore();
            if (this.issave) {
                if (this.bgimg) {
                    context.globalCompositeOperation = "destination-over"
                    context.drawImage(this.bgimg, 0, 0, this.canvasAttr.wid, this.canvasAttr.hid);
                }
                context.restore();
                var qrimg = document.getElementById("qrcode");
                console.log(qrimg);
                context.globalCompositeOperation = "source-over"
                context.drawImage(qrimg, this.canvasAttr.wid - 160, this.canvasAttr.hid-160,160,160);
            }



        },
        //开始变动时记录原始参数
        setstartAttr: function () {
            var self = this;
            self.imgtouch.top = self.imgAttr.top;
            self.imgtouch.left = self.imgAttr.left;
            var st = $(this.currimg).css('transform');
            if (st && st != "none") {
                st = st.replace('matrix', '').replace('(', '').replace(' ', '').replace(')', '')
                st = st.split(',');
                if (st && st.length == 6)
                    self.imgtouch.tx = st;
                else
                    self.imgtouch.tx = [0.5, 0, 0, 0.5, 0, 0];
                //计算原始点
            } else {
                self.imgtouch.tx = [0.5, 0, 0, 0.5, 0, 0];
            }
            console.log(self.imgtouch.tx)
        },
        //转换成图片坐标点
        getImgPoint: function (x, y) {
            x =x -($(window).width()- $("#ImgCreate .Mould1").width())/2;
            x = x / this.scale - this.canvasAttr.left;
            y = y / this.scale - this.canvasAttr.top;

            return { x: x, y: y };
        },
        //保存至数据库并返回
        save: function (fun) {
            this.issave=true;
            this.update();
            var self = this;
            setTimeout(function () {
                document.getElementById("viewImg").src = self.canvas.toDataURL();
                fun();
                self.close();
            }, 100);
            
            
        },
        //获取变动点前的位置
        getOldPoint: function (p) {
            if (this.imgtouch.tx.length == 6) {
                var a = this.imgtouch.tx;
                var y1 = (p.x * a[1] - p.y * a[0] - a[1] * a[4] + a[0] * a[5]) / (a[1] * a[2] - a[0] * a[3]);
                var x1 = (p.x - a[2] * y1 - a[4]) / a[0];
                return { x: x1, y: y1 }
            }
            return { x: p.x, y: p.y };
        },
        //初始化
        init: function () {
            var self = this;
            if (this.isinit) return;
            this.isinit = true;
            //初始化画布 750*1334,画布大小
            var todiv = $("#ImgCreate .mould1");
            var odwid = todiv.width();
            //增加3层div，第一层背景图，第二层canvas，第三层控制层。
            todiv.append('<div id="clipbg"><div id="clipimgbg"><img crossorigin="anonymous" id="clipimg"></div><div id="clipcont"></div><div id="clipopt"></div></div>')
            this.canvas = document.createElement('canvas');
            this.canvas.setAttribute('width', this.canvasAttr.wid);
            this.canvas.setAttribute('height', this.canvasAttr.hid);
            $("#clipcont").append(this.canvas);
            var bg=this.box = $("#clipbg");
            this.scale = odwid / this.canvasAttr.wid;
            bg.css({ width: this.canvasAttr.wid, height: this.canvasAttr.hid, "transform": "scale(" + this.scale + ")" });
            this.currimg = $("#clipimg").get(0); //背景图
            //选择文件监控
            $("#camera").on("change", function (evt) {
                var ftarget = $(evt.currentTarget);
                if(!ftarget) alert('无对象');
                var f = evt.target.files[0];
                    if(!f.type){
                        alert('无法识别文件格式');
                    }else
                    if (!f.type.match('image.*')) {
                        return;  
                    }
                    var reader = new FileReader();
                    reader.onload = function (theFile) {
                        self.currimg.src = theFile.target.result;
                    };
                    reader.readAsDataURL(f);
                
            });
            //图片更改监控
            this.currimg.onload = function () {
                console.log('loadimg')
                //显示
                self.box.show();
                $("#ImgCreate .box_camera").hide();
                self.update();
            }
            this.duimg = new Image();
            this.duimg.onload = function () {
                console.log("loadduimgend")
            }
            this.bgimg = new Image();
            var opt = $('#clipopt');
            var testd = false;
            opt.on('contextmenu', function (event) {
                event.preventDefault();
                return false;
            });
            opt.on("touchstart", function (event) {
                self.oldtauches = event.touches;
                if (!self.oldtauches) self.oldtauches = event.originalEvent.touches;
                if (testd) testd = false;
                else testd = true;
                self.setstartAttr();
                return false;
            });
            opt.on("touchmove", function (event) {
                console.log(event);
                
                var touch = event.touches;
                if (!touch) touch = event.originalEvent.touches;
                if (touch.length == 1) {
                        //单点，移动
                        var dx = touch[0].pageX - self.oldtauches[0].pageX
                        var dy = touch[0].pageY - self.oldtauches[0].pageY
                        //self.imgAttr.top=self.imgtouch.top+dy/self.scale;
                        //self.imgAttr.left=self.imgtouch.left+dx/self.scale;
                        self.imgAttr.tx = [self.imgtouch.tx[0], self.imgtouch.tx[1], self.imgtouch.tx[2], self.imgtouch.tx[3], self.imgtouch.tx[4], self.imgtouch.tx[5]];
                        self.imgAttr.tx[4] = parseFloat(self.imgAttr.tx[4]) + dx / self.scale;
                        self.imgAttr.tx[5] = parseFloat(self.imgAttr.tx[5]) + dy / self.scale;
                        self.update();
                    
                } else if (touch.length == 2 && self.oldtauches.length==2) {
                    //多点计算
                    var new1 = self.getImgPoint(self.oldtauches[0].pageX, self.oldtauches[0].pageY)
                    var new2 = self.getImgPoint(self.oldtauches[1].pageX, self.oldtauches[1].pageY);
                    var old1 = self.getOldPoint(new1);
                    var old2 = self.getOldPoint(new2);
                    new1.x = new1.x + (touch[0].pageX - self.oldtauches[0].pageX) / self.scale;
                    new1.y = new1.y + (touch[0].pageY - self.oldtauches[0].pageY) / self.scale;

                    new2.x = new2.x + (touch[1].pageX - self.oldtauches[1].pageX) / self.scale;
                    new2.y = new2.y + (touch[1].pageY - self.oldtauches[1].pageY) / self.scale;

                    var x = old1.x - old2.x;
                    var y = old1.y - old2.y;
                    var n = new1.x - new2.x;
                    var m = new1.y - new2.y;

                    var a = (n * x + m * y) / (y * y + x * x);
                    var b = (a * x - n) / y;
                    var e = new1.x - a * old1.x + b * old1.y;
                    var f = new1.y - b * old1.x - a * old1.y;
                    self.imgAttr.tx = [a, b, -b, a, e, f];
                    //var c=(new1.x*old2.x-new2.x*old1.x)/(old1.y*old2.x-old2.y*old1.x);
                    //var a=(new1.x-c*old1.y)/old1.x;
                    //var d=(new1.y*old2.x-new2.y*old1.x)/(old1.y*old2.x-old2.y*old1.x);
                    //var b=(new1.y-d*old1.y)/old1.x;
                    //self.imgAttr.tx=[a,b,c,d,0,0];
                    self.update();
                    return false;
                }

                return false;
            });
            opt.on("touchend", function (event) {
                self.oldtauches = event.touches;
                if (!self.oldtauches) self.oldtauches = event.originalEvent.touches;
                self.setstartAttr();
                return false;
            });
            
        }
    }
});

$(".box_camera").click(function () {
    setTimeout(function(){
$(".foot1-next").css({
       'display':'block',
    });},3000)
});
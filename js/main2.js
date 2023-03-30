/*
  1:歌曲搜索接口
    请求地址:https://autumnfish.cn/search
    请求方法:get
    请求参数:keywords(查询关键字)
    响应内容:歌曲搜索结果

  2:歌曲url获取接口
    请求地址:https://autumnfish.cn/song/url
    请求方法:get
    请求参数:id(歌曲id)
    响应内容:歌曲url地址
  3.歌曲详情获取
    请求地址:https://autumnfish.cn/song/detail
    请求方法:get
    请求参数:ids(歌曲id)
    响应内容:歌曲详情(包括封面信息)
  4.热门评论获取
    请求地址:https://autumnfish.cn/comment/hot?type=0
    请求方法:get
    请求参数:id(歌曲id,地址中的type固定为0)
    响应内容:歌曲的热门评论
  5.mv地址获取
    请求地址:https://autumnfish.cn/mv/url
    请求方法:get
    请求参数:id(mvid,为0表示没有mv)
    响应内容:mv的地址
*/
const { createApp } = Vue
const app = createApp({
    data(){
        return {
            query:"",
            musicList:[],
            musicUrl:"",
            musicCover:"",
            hotComments:[],
            isPlaying:false,
            videoPlaying:false,
            isShow:false,
            mvUrl:"",
            mymusicList:[],
            mylistname:[],
            lyriclist:[],
            lyric:'',
            liston:false,
            liston2:false,
            currentTime:'',
            index:0
        }
    },
    methods:{
        gettime(event){
            const audio = event.target
            this.currentTime = '0' + Math.floor(Math.floor(audio.currentTime) / 60) + ':'
            if(Math.floor(audio.currentTime) % 60 < 10){
                this.currentTime += '0'
            }
            this.currentTime += Math.floor(audio.currentTime) % 60
            this.showlyric()
        },
        searchMusic:function(){
            // var that = this;
            axios.get("https://autumnfish.cn/search?keywords="+this.query)
            .then(response =>{
                // console.log(response);
                this.musicList = response.data.result.songs;
            },function(err){})
        },
        changeListOn(){
            this.liston = !this.liston
        },
        delfromlist:function(id){
            index2 = this.mymusicList.indexOf(id)
            this.mymusicList.splice(index2,1)
            this.mylistname.splice(index2,1)
            // if(this.musicUrl)
            if(this.mymusicList.length!=0){
                if(this.index!=this.mymusicList.length||this.index!=index2){
                    if(index2<this.index){
                        this.playMusic(this.mymusicList[this.index-1])
                        this.index = this.index - 1
                    }
                    else{
                        this.playMusic(this.mymusicList[this.index])
                    }
                }
                else{
                    this.index = 0
                    this.playMusic(this.mymusicList[0])
                }
            }
            else{
                this.musicUrl = ""
                this.musicCover = ""
                this.isPlaying = false
                this.hotComments = []
                this.lyric = ""
                this.lyriclist = []
            }
        },
        addmusicList:function(id,name){
            if(this.mymusicList.indexOf(id)==-1){
                this.mymusicList.push(id)
                this.mylistname.push(name)
                if(this.mymusicList.length==1){
                    this.playMusic(id)
                }
            }
            else{
                this.mymusicList.splice(this.mymusicList.indexOf(id),1)
                this.mylistname.splice(this.mymusicList.indexOf(id),1)
                if(this.mymusicList.length!=0){
                    this.playMusic(this.mymusicList[this.index])
                }
            }
            // console.log(this.mymusicList)
        },
        selectedcolor:function(id){
            if(id==this.mymusicList[this.index]){
                return 'skyblue'
            }
        },
        leftplay:function(){
            if(this.mymusicList.length!=0){
                return 'block'
            }
            else{
                return 'none'
            }
        },
        inmusicList:function(id){
            if(this.mymusicList.indexOf(id)!=-1){
                return '√'
            }
            else{
                return '+'
            }
        },
        playlist:function(id){
            return this.mylistname[this.mymusicList.indexOf(id)]
        },
        nextMusic:function(){
            if(this.index==this.mymusicList.length-1){
                this.index = 0
            }
            else{
                this.index = this.index + 1
            }
            this.playMusic(this.mymusicList[this.index])
        },
        lastMusic:function(){
            if(this.index==0){
                this.index = this.mymusicList.length-1
            }
            else{
                this.index = this.index - 1
            }
            this.playMusic(this.mymusicList[this.index])
        },
        playMusic:function(id,name){
            var that = this;
            axios.get("https://autumnfish.cn/song/url?id="+id)
            .then(function(response){
                // console.log(response.data)
                if(that.mymusicList.indexOf(id)==-1){
                    that.mymusicList.push(id)
                    that.mylistname.push(name)
                    that.index = that.mymusicList.length - 1
                }
                else{
                    that.index = that.mymusicList.indexOf(id)
                }
                that.musicUrl = response.data.data[0].url
                // console.log(that.mymusicList)
            },function(err){})
            axios.get("https://autumnfish.cn/song/detail?ids="+id)
            .then(function(response){
                // console.log(response)
                that.musicCover = response.data.songs[0].al.picUrl
            },function(err){})
            axios.get("https://autumnfish.cn/comment/hot?type=0&id="+id)
            .then(function(response){
                that.hotComments = response.data.hotComments
            },function(err){})
            axios.get("https://autumnfish.cn/lyric?id="+id)
            .then(function(response){
                // console.log(response.data.lrc.lyric)
                var arr1 = response.data.lrc.lyric.split('\n')
                that.lyriclist = arr1
                // console.log(arr2)
                // console.log(response.data)
                // that.hotComments = response.data.hotComments
            },function(err){})
        },
        showlyric:function(){
            for(let i=0;i<this.lyriclist.length;i++){
                if(this.lyriclist[i].indexOf(this.currentTime)!=-1){
                    this.lyric = this.lyriclist[i].split(']')[1]
                    // console.log(this.lyric)
                    break
                }
            }
        },
        play:function(){
            this.isPlaying = true
        },
        pause:function(){
            this.isPlaying = false
        },
        playMV:function(id){
            var that = this
            const video = that.$refs.video
            const audio = that.$refs.audio
            axios.get("https://autumnfish.cn/mv/url?id="+id)
            .then(function(response){
                that.isShow = true
                that.videoPlaying = true
                that.isPlaying = false
                video.play()
                audio.pause()
                that.mvUrl = response.data.data.url
            },function(err){})
        },
        hide:function(){
            const video = this.$refs.video
            this.isShow = false
            this.videoPlaying = false
            video.pause()
        },
    }
    
})
app.mount("#player")
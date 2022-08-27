const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const player = $('.player');
const dashboard = $('.dashboard');
const bookmark = $('.cd-saved');
const bookmarkSaved = $('.cd-saved.saved')
const playlist = $('.playlist');
const playBtn = $('.btn-toggle-play');
const cdHeading = $('div .cd-song');
const cdThumb = $('.cd-thumb');
const cdSinger = $('div .cd-singer');
const audio = $('#audio');
const progress = $('.progress-area');
const progressBar = $('.progress-bar');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const repeatBtn = $('.btn-repeat');
const randomBtn = $('.btn-random');
const showMore = $('.list-music')
const wrapper = $('.wrapper');
const closeList = $('.playlist-close');
var arrPlayed = []; 
const PLAYER_STORAGE_KEY = "MUSIC_PLAYER";


const app = {
   currentIndex: 0,
   isPlaying: false,
   isRandom: false,
   isRepeat: false,
   config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
   
    songs: [
        {
            name: "Không biết phải làm sao",
            singer: "Vương Tĩnh Văn",
            img: "./img/anh1.jpg",
            path: "./music/Không Biết Phải Làm Sao - Vương.mp3"
        },
        {
            name: "Lơ lửng",
            singer: "mademoiselle",
            img: "./img/anh2.jpg",
            path: "./music/lo-lung.mp3"
        },
        {
            name: "Vì em đâu có biết",
            singer: "Madihu feat Vũ",
            img: "./img/anh3.jpg",
            path: "./music/madihu-feat-vu-official-mv.mp3"
        },
        {
            name: "Our beloved summer",
            singer: "Kim Kyung Hee",
            img: "./img/anh4.jpeg",
            path: "./music/our-beloved-summer-geu-hae-urineun-our-beloved-summer-ost-part-11.mp3"
        },
        {
            name: "On the ground",
            singer: "Rosé",
            img: "./img/anh5.jpeg",
            path: "./music/ROSÉ - 'On The Ground' Dance Performance.mp3"
        },
        {
            name: "Love is gone",
            singer: "Rosé",
            img: "./img/anh6.jpg",
            path: "./music/SLANDER - Love Is Gone ft. Dylan Matthew (Lyrics Terjemahan Indonesia) 'I'm sorry, don't leave me'.mp3"
        },
        {
            name: "Hương mùa hè",
            singer: "Suni Hạ Linh",
            img: "./img/anh7.jpg",
            path: "./music/suni-ha-linh-huong-mua-he-show.mp3"
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
     
    render: function() {
        
       const htmls = this.songs.map((song,index) => {
            return `
            <div class="song ${index === this.currentIndex ? "active" : ""}" data-index = "${index}">
            <div class="thumb" style="background-image: url('${song.img}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function() {
        const _this = this;

       
       

        //XỬ lý khi click play 
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }
        }

        //Khi song được play 
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
        }

          //Khi song được pause 
          audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
        }

        //Khi tiến độ bài hát thay đổi

        audio.addEventListener ("timeupdate", (e) => {
            const currentTime = e.target.currentTime;//Lay ra thoi gian hien tai 
            const duration = e.target.duration; //lay ra tong khoangr thoi gian cua bai hat
            let ProgressPercent = (currentTime / duration) * 100;
            progressBar.style.width = `${ProgressPercent}%`;

            let musicCurrentTime =  dashboard.querySelector('.current-time')
            musicDuration = dashboard.querySelector('.max-duration');
           audio.addEventListener('loadeddata', () => {
                    //update song total duration 
                    let audioDuration = audio.duration;
                    let totalMin =  Math.floor(audioDuration / 60);
                    let totalSec =  Math.floor(audioDuration % 60);
                    if(totalSec < 10) {
                        totalSec = `0${totalSec}`
                    }
                    musicDuration.innerText =  `${totalMin}:${totalSec}`;
                    
            });
                    //update playing song current time  
                                
                    let currentMin =  Math.floor(currentTime / 60);
                    let currentSec =  Math.floor(currentTime% 60);
                    if(currentSec < 10) {
                        currentSec = `0${currentSec}`
                    }
                    musicCurrentTime.innerText =  `${currentMin}:${currentSec}`;
       }); 

       //tua bai khi click vao thanh progress bar 
        progress.addEventListener('click', (e) => {
            const progressWidth = progress.clientWidth;//Lay  ra width cua progress bar
            const clickedOffsetX = e.offsetX;//lay gia tri truc X
            const songDuration = audio.duration;//lay ra tong thoi gian cua bai hat
            audio.currentTime = (clickedOffsetX / progressWidth) * songDuration;


        })
        //Khi next song
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
             
            } else {
                _this.nextSong();

            }
            audio.play();
            _this.render();

        }

        //Khi prev song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
             
            } else {
            _this.prevSong();
            }
            audio.play();
            _this.render();

        }

            
        //Next song khi het bai
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
                
                
        }
        //Khi click vào repeat
        repeatBtn.onclick = function() {
            _this.isRepeat =! _this.isRepeat; //Đảo ngược lại chuyển thành true
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
          
        }

        //Khi click vào random
        randomBtn.onclick = function() {
            _this.isRandom =! _this.isRandom;
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        //Lắng nghe hành vi khi click vào playlist 
        playlist.onclick = function(e) {
            const songNode = e.target.closest(".song:not(.active)");

            if(songNode || e.target.closest(".option")) {
                //Khi click vào song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    console.log(songNode.dataset.index);
                    console.log(_this.currentIndex);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        }
        //Khi click vào icon danh mục hiện ra list danh sách
        showMore.onclick = function() {
            wrapper.classList.toggle('show');
            showMore.style.display = 'none';
        }
        //Khi click vào close thì ẩn  list danh sách
        closeList.onclick = function() {
            showMore.click();
            showMore.style.display = 'block';//đang viết trong hàm handle

        }
        

//Ví dụ về kéo thả timeline
//12. hiệu ứng kéo thả time line
// window.addEventListener('mousedown', function(e){
//     if(e.target.matches('.circle') || e.target.matches('.time-line') || e.target.matches('.percent')){
//         clickDown = true
//         clearInterval(currentTime)
//     }
// })

// window.addEventListener('mousemove', function(e){
//     this.document.body.style.userSelect = 'none'

//     let percent = percentTimeLine(e)

//     if(clickDown){
//         clearInterval(currentTime)
//         playingTimeLeft.innerHTML =  convertSecondsToMinutes(percent * document.querySelector('audio.active').duration)
//         circle.style.left = percent * 100 + '%'
//         percentLine.style.width = percent * 100 + '%'
//     }
    
// })

// window.addEventListener('mouseup', function(e){
//     if(clickDown){
//         document.querySelector('audio.active').currentTime = percentTimeLine(e) * document.querySelector('audio.active').duration
//         currentTime =  setInterval(()=>{
//             intervalCurrent()
//         }, 100)
//         clickDown = false
//     }
// })

// timeLine.addEventListener('click', function(){
//     intervalCurrent()
// })


    },
     //load current Song

    
    loadCurrentSong: function() {
        console.log(cdHeading,cdSinger,cdThumb)
          cdThumb.style.backgroundImage =`url('${this.currentSong.img}')`;
          cdHeading.textContent = this.currentSong.name;
          cdSinger.textContent = this.currentSong.singer;
          audio.src = this.currentSong.path;
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    
    playRandomSong: function() {
        let newIndex; 

        if( arrPlayed.length === this.songs.length) {
            arrPlayed.length = 0;
        }
        
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(arrPlayed.includes(newIndex))
        arrPlayed.splice(0,0, this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    
    

    
    
    start: function () {
        this.loadConfig();
        //ĐỊnh nghĩa các thuộc tính cho Object
        this.defineProperties()
        //render playlist
        this.render();
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
        //Hiện bài hát đầu tiên ra giao diện UI khi chạy ứng dụng
        this.loadCurrentSong();
        //xử lý các sự kiện
        this.handleEvents();
        //Scroll into view khi đang play bài hát

        
  
    }
};

app.start()



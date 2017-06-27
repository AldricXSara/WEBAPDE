var navVisible = 0;
var currCounter = 10;
var profVisible = 0;
var a = 0;
var b = 0;
var c = 0;
var photoLimit = 15;
var root = 'https://jsonplaceholder.typicode.com';
var posterName;
var limit = 10;
var albumLimit = 10;

var post = function(name, title, content, username, userId){
    this.name = name;
    this.title = title;
    this.content = content;
    this.username = username;
    this.userId = userId;
}

var users = function(userId, name, username){
    this.userId = userId;
    this.name = name;
    this.username = username;
    
}

var photoDetails = function(id, imgUrl, thumbUrl, albumId, userName, title, uName, personID){
    this.id = id;
    this.imgUrl = imgUrl;
    this.thumbUrl = thumbUrl;
    this.albumId = albumId;
    this.userName = userName;
    this.title = title;
    this.uName = uName;
    this.personID = personID;
}

var album = function(id, title, userName, userId){
    this.id = id;
    this.title = title;
    this.userName = userName;
    this.userId = userId;
}

var listOfPosts = [];
var listOfNames = [];
var listOfPhotos = [];
var listOfAlbums = [];
var photosInAlbum = [];
var photoIDS = [];

function attachToAlbums(){
    var q = 0, r = 0, oLim = listOfAlbums.length, iLim = listOfPhotos;
    
    for(q = 0; q < oLim; q++){
        for(r = 0; r < iLim; r++){
            if(listOfPhotos[r].albumId === listOfAlbums[q].id){
                var photoToList = listOfPhotos[r].id;
                listOfAlbums[q].photoArray.push(photoToList);
            }
        }
    }
}

function storeName(data){
    var user = new users(data.id, data.name, data.username);
    listOfNames.push(user);
}

function storeAlbum(data){
    matchName(data.userId);
    var nAlbum = new album(data.id, data.title, posterName, data.userId);
    listOfAlbums.push(nAlbum);
}

$.ajax({
    url: root + '/users',
    type: 'get',
    datatype: 'json',
    success: function(data){
        data.forEach(storeName);
    }
})

$.ajax({
    url: root + '/albums',
    type: 'get',
    datatype: 'json',
    success: function(data){
        data.forEach(storeAlbum);
    }
})

var uName;
var personID;
function getUserName(data){
    var c = 0;
    var exit = 0;
    while(exit != 1){
        if(data === listOfNames[c].name){
            console.log(c);
            uName = listOfNames[c].username;
            personID = listOfNames[c].userId;
            exit = 1;
        }      
        else{
            c++;
        }
    }
    console.log(uName + " HELLOO");
}

function matchPhotoDetails(data){
    var id = data.id;
    var imgUrl = data.url;
    var imgTitle = data.title;
    var thumbUrl = data.thumbnailUrl;
    var albumId = data.albumId;
    matchAlbum(albumId)
    getUserName(userName);
    var photo = new photoDetails(id, imgUrl, thumbUrl, albumId, userName, imgTitle, uName, personID);
    listOfPhotos.push(photo);
}

function getPhotoDetails(){
    $.ajax({
        url: root + '/photos',
        type: 'get',
        datatype: 'json',
        success: function(data){
            data.reverse();
            data.forEach(matchPhotoDetails);
            console.log(listOfPhotos);
            appendPhotos();
        }
    });
}

function getAlbums(){
    var trial = document.getElementById("loadClick");
    var albumList = listOfAlbums;
    if(trial != null){
        trial.outerHTML = "";
        delete trial;
    }
    albumList.reverse();
    albumList.slice(c, albumList).forEach(function(data)){
        getRelevantPhotos(albumList[c].id);
        if(c < albumLimit){
            
        }
    }
}

var photos = [];
function getRelevantPhotos(data){
    photos = [];
    var ctr = 0;
    listOfPhotos.forEach(function(data){
        if(listOfPhotos[ctr].albumId === data){
            photos.push(listOfPhotos[ctr].id);
        }
    })
}

var userName;
function matchAlbum(data){
    var exit = 0;
    var counter = 0;
    while(exit != 1){
        if(data === listOfAlbums[counter].id){
            userName = listOfAlbums[counter].userName;
            exit = 1;
        }
        else
            counter++;
    }
}

var userName;
function matchName(data){
    var alength = listOfNames.length;
    while(alength-1 >= 0){
        if(data === listOfNames[alength-1].userId){
            posterName = listOfNames[alength-1].name;
            userName = listOfNames[alength-1].username;
            break;
        }
        else
            alength--;
    }
}

function storePost(data){
    matchName(data.userId);
    var userId = data.userId;
    var title = data.title;
    var body = data.body;
    var nPost = new post(posterName, title, body, userName, userId);
    listOfPosts.push(nPost);
}

function getPost(){
    $.ajax({
        url: root + '/posts',
        type: 'get',
        datatype: 'json',
        success: function(posts){
            posts.reverse();
            posts.forEach(storePost);
            appendPost();
        }
    })
}

function appendPhotos(){
    var trial = document.getElementById("loadClick");
    
    if(trial != null){
        trial.outerHTML = "";
        delete trial;
    }
    
    listOfPhotos.slice(b, photoLimit).forEach(function(data){
       if(b < photoLimit){
           $(".center").append("<div class = 'picContent' onClick = 'showDetails("+listOfPhotos[b].id+")'><img src = '"+listOfPhotos[b].thumbUrl+"' class = 'imageGen'></div>&nbsp;&nbsp;&nbsp;&nbsp;");
           b++;
       }
       else
           ;
        
    });
    
      photoLimit += 15;
       $(".center").append("<div class = 'postFrame' id = 'emptySpace'><br></div>");
       $(".center").append("<div class = 'postFrame' id = 'loadClick' onClick = 'appendPhotos()'>Load more photos</div>");
}

var picture;

function findPhoto(data){
    var exit = 0;
    var ctr = 0; 
    while(exit!=1){
        if(data === listOfPhotos[ctr].id){
            console.log(listOfPhotos[ctr].title)
            picture = listOfPhotos[ctr];
            exit = 1;
        }
        else
            ctr++;
    }
}

function showDetails(data){
    findPhoto(data);
    getAlbumName(picture);
    $(".greatContainer").append("<div class = 'picContainer' id = 'pC'><div class = 'exit' onClick = 'removeThis()'>X</div><div class = 'showImg'><img src = '"+picture.imgUrl+"' class = 'bigPhoto'><div class = 'poster'>"+picture.userName+"</div><div class = 'poster' id = 'uPicName' id = 'uName' onClick = 'getID("+picture.personID+")'>@"+picture.uName+"</div><div class = 'titlePic'>"+picture.title+"</div><div class = 'albumSrc'>from: "+picture.albumName+"</div></div>");
    
}

function removeThis(){
    var toRemove = document.getElementById("pC");
    toRemove.outerHTML = "";
    delete toRemove;
}

function getAlbumName(data){
    var i = 0;
    var exit = 0;
    while(exit === 0){
        if(data.albumId === listOfAlbums[i].id){
            data.albumName = listOfAlbums[i].title;
            exit = 1;
        }
        else
            i++;
    }
}

function appendPost(){
    var trial = document.getElementById("loadClick");
    
    if(trial != null){
        trial.outerHTML = "";
        delete trial;
    }
    listOfPosts.slice(a, limit).forEach(function(data){
        console.log(listOfPosts[a].userId);
        var id = listOfPosts[a].userId;
        if(a < limit){
             $(".center").append("<div class = 'postFrame'><div class = 'postDetail' class = 'name' id = 'poster'>"+listOfPosts[a].name+"</a></div><div class = 'postDetail' id = 'uName'>@"+listOfPosts[a].username+"</div><div class = 'postDetail' class = 'title' id = 'postTitle'>"+listOfPosts[a].title+"</div> <div class = 'postDetail' class = 'body' id = 'postBody'>"+listOfPosts[a].content+"</div></div>");
            var uName = document.getElementById("uName");
            $(uName).on("click", function(e){
                           getID(id);
            });
             a++;
        }
        else{
            ;
        }
        
    });
        limit += 10;
        $(".center").append("<div class = 'postFrame' id = 'emptySpace'><br></div>");
        $(".center").append("<div class = 'postFrame' id = 'loadClick' onClick = 'appendPost()'>Load more posts</div>");

}

function getID(id){
    console.log(id);
    localStorage.setItem("personId", id);
    console.log(localStorage.personId);
//    window.location.href = "profile.html";
}

function makeProfile(){
    var uId = localStorage.getItem("personId");
    var person;
    var exit = 0;
    var x = 0;
    listOfNames.forEach(function(){
        console.log(listOfNames);
        if(listOfNames.userId === uId){
            person = listOfNames[x];
            console.log(person);
        }
        x++;
    });
}

function openProf(){
    if(profVisible === 0){
        document.getElementById("rb").style.display = "block";
        profVisible = 1;
    }
    else{
        document.getElementById("rb").style.display = "none";
        profVisible = 0;
    }
}

function openNav(){
    if(navVisible === 0){
        document.getElementById("sg").marginLeft = "15%";
        document.getElementById("navBar").style.width = "15%";
        document.getElementById("navBar").style.display = "block";
        navVisible = 1;
    }
    else if(navVisible === 1){
        document.getElementById("navBar").style.width = "0%";
        document.getElementById("navBar").style.display = "none";
        document.getElementById("contentPlace").style.marginLeft ="0%";
        document.getElementById("sg").marginLeft = "0%";
        navVisible = 0;
    }
}

function retainNav(){
    if(navVisible === 0){
        navVisible = 1;
        openNav();
    }
    else{
        navVisible = 0;
        openNav();
    }
}
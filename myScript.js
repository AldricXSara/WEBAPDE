var navVisible = 0;
var currCounter = 10;
var profVisible = 0;
var root = 'https://jsonplaceholder.typicode.com';
var posts;
var users;
var albums;
var photos;
var thisProfile;
var thisPosts;
var thisPhotos;
var thisAlbums;
var photoMax, albumMax, postMax;
var bigAlbumURL;

$("homeP.html").ready(function() {	
	
	$.get(root +"/posts", function(data) {
		posts = data;
        console.log(posts);
        postMax = posts.length;
	});
	
	$.get(root +"/users", function(data) {
		users = data;
	});
	
	$.get(root +"/photos", function(data) {
		photos = data;
	});
	
	setTimeout(function(){
		appendPosts();
		$("#loadClicker").on("click", function() {
			appendPosts();
		});
	}, 1000);
});

$("profile.html").ready(function() {
	$.get(root +"/users/" + localStorage.getItem("id"), function(data) {
		thisProfile = data;
	});
	
	$.get(root + "/users/" + localStorage.getItem("id") + "/posts", function(data) {
		thisPosts = data;
	});
	
    $.get(root +"/users/" + localStorage.getItem("id") + "/photos", function(data) {
		thisPhotos = data;
	});
	
	$.get(root +"/users/" + localStorage.getItem("id") + "/albums", function(data) {
		thisAlbums = data;
	});
    
	setTimeout(function(){
		appendProfile();
		displayProfilePosts();
        displayProfileAlbums();
	}, 1000);
});

$("photos.html").ready(function() {
	$.get(root +"/photos", function(data) {
		photos = data;
        photoMax = photos.length;
	});
	
	$.get(root +"/albums", function(data) {
		albums = data;
        albumMax = albums.length;
	});
	
	setTimeout(function(){
		appendPhotos();
		$("#loadPic").on("click", function() {
			appendPhotos();
		});
	}, 1000);
});

$("albums.html").ready(function() {
	$.get(root +"/photos", function(data) {
		photos = data;
	});
	
	$.get(root +"/albums", function(data) {
		albums = data;
	});
	
	setTimeout(function(){
		appendAlbums();
		$("#loadAlbums").on("click", function() {
			appendAlbums();
		});
	}, 1000);
});

$("albumPic.html").ready(function() {
    $.get(root +"/albums/"+ localStorage.getItem("albumId") + "/photos/", function(data){
         specificAlbum = data;
    });
    
    setTimeout(function(){
        appendSpecAlbums();
        $('#loadPhotos').on("click", function() {
            appendSpecAlbums();
        });
    }, 1000);
});

function displayProfilePosts(){
    console.log(thisPosts);
    
    var trial = document.getElementById("loadClick");
    
    if(trial != null){
        trial.outerHTML = "";
        delete trial;
    }
    
    var profPostMax = thisPosts.length;
    console.log(thisProfile);
    var x = 0;
    if(profPostMax >= 0){
        thisPosts.forEach(function(){
            var tName = thisProfile.name
            var uName = thisProfile.username;
            
             $(".centerPosts").append("<div class = 'header'>Posts</div><div class = 'postLayoutPr'><div class = 'postDetail' class = 'name' id = 'poster'>"+tName+"</a></div><div class = 'postDetail' id = 'uName' onClick = 'getID("+thisProfile.id+")'>@"+uName+"</div><div class = 'postDetail' class = 'title' id = 'postTitle'>"+thisPosts[x].title+"</div> <div class = 'postDetail' class = 'body' id = 'postBody'>"+thisPosts[x].body+"</div></div><br>");
            
            x++;
        });
    }
}

function displayProfileAlbums(){
    var trial = document.getElementById("loadAlbum");
    var profAlbumMax = thisAlbums.length; 
    if(trial != null){
        trial.outerHTML = "";
        delete trial;
    }
    if(profAlbumMax >= 0){
        $(".centerAlbums").append("<div class = 'header' id = 'left'>Albums</div>");
        console.log(profAlbumMax);
        for(var x = profAlbumMax - 1; x >= 0 ; x--){
        var url = [];
        var isIt4 = 0;
        console.log(thisAlbums[x]);
            for(var ctr = 0; ctr < thisPhotos.length; ctr++){  
                if(thisAlbums[x].id === thisPhotos[ctr].albumId){
                    url.push(thisPhotos[ctr].thumbnailUrl);
                    isIt4++;
                }
                if(isIt4 === 4)
                    break;       
            }
            
            $(".centerAlbums").append("<div class = 'albumFramePr' onClick = 'getAlbumID("+thisAlbums[x].id+")'><div class = 'thumbs'><img src = '"+url[0]+"' class = 'aImage' id = 'upLeft'><img src = '"+url[1]+"' class = 'aImage' id = 'upRight'><img src = '"+url[2]+"' class = 'aImage' id = 'downLeft'><img src = '"+url[3]+"' class = 'aImage' id = 'downRight'></div><div class = 'albumName'>"+thisAlbums[x].title+"</div></div>&nbsp;&nbsp;");
        }
        $(".centerA").append("<div class = 'postFrame' id = 'emptySpace'><br></div>");
        $(".centerA").append("<div class = 'postFrame' id = 'loadAlbum' onClick = 'displayProfileAlbums()'>Load more albums</div>");
    }
}

function appendPosts(){
    var trial = document.getElementById("loadClicker");
    
    if(trial != null){
        trial.outerHTML = "";
        delete trial;
    }
    
    if(postMax >= 0){
        for(var x = postMax - 1; x > postMax - 9; x--){
            var tName = users[posts[x].userId - 1].name
            var uName = users[posts[x].userId - 1].username;
             $(".centerP").append("<div class = 'postLayout'><div class = 'postDetail' class = 'name' id = 'poster'>"+tName+"</a></div><div class = 'postDetail' id = 'uName' onClick = 'getID("+users[posts[x].userId-1].id+")'>@"+uName+"</div><div class = 'postDetail' class = 'title' id = 'postTitle'>"+posts[x].title+"</div> <div class = 'postDetail' class = 'body' id = 'postBody'>"+posts[x].body+"</div></div><br>");
        }
        postMax -= 10;
        $(".centerP").append("<div class = 'postFrame' id = 'emptySpace'><br></div>");
        $(".centerP").append("<div id = 'loadClicker' onClick = 'appendPosts()'>Load more posts</div>");
    }  
}

function appendSpecAlbums(){
    var id = localStorage.getItem("albumId");
    console.log(id);
    var theAlbum;
    var albumURL = root + "/album/" + id + "/photos/";
    $.get(albumURL, function(response){
        console.log(response);
        theAlbum = response;
        console.log(response);
        
        var newDiv = document.createElement("div");
        newDiv.className = "albumContainer";
        newDiv.id = "aC";
        $(".greatsOverlay").append(newDiv);
        var y = 0;
        $(".albumContainer").append("<div class = 'pAlbum' id = 'nameOfAlbum'>"+albums[id-1].title+"</div><div class = 'pAlbum' id = 'usName' onClick = 'getID("+users[albums[id-1].userId-1].id+")'>@"+users[albums[id-1].userId-1].username+"</div>");
        theAlbum.forEach(function(data){
            console.log(theAlbum[y]);
            $(".albumContainer").append("<div class = 'restOfAlbum'><img class = 'albThumbs' src = "+theAlbum[y].thumbnailUrl+" onClick = 'showAppendedDetails("+theAlbum[y].id+")'></div>"); 
            y++;
        });
    });
}

function appendPhotos(){
    var trial = document.getElementById("loadPic");
    
    if(trial != null){
        trial.outerHTML = "";
        delete trial;
    }
    
    if(photoMax >= 0){
        for(var x = photoMax - 1; x > photoMax - 16; x--){
            $(".picLayout").append("<div class = 'picContent' id = 'thumbs' onClick = 'showDetails("+photos[x].id+")'><img src = '"+photos[x].thumbnailUrl+"' class = 'imageGen'></div>&nbsp;&nbsp;&nbsp;&nbsp;")
        }
        photoMax -= 16;
        $(".picLayout").append("<div class = 'postFrame' id = 'emptySpace'><br></div>");
        $(".picLayout").append("<div class = 'postFrame' id = 'loadPic' onClick = 'appendPhotos()'>Load more photos</div>");
    }
}

function showAppendedDetails(id){
    $(".greatsOverLay").append("<div class = 'picContainer' id = 'pC'><div class = 'exit' onClick = 'removeThis()'>X</div><div class = 'showImg'><img src = '"+photos[id-1].url+"' class = 'bigPhoto'><div class = 'poster'>"+users[albums[photos[id-1].albumId - 1].userId - 1].name+"</div><div class = 'poster' id = 'uPicName' id = 'uName' onClick = 'getID("+users[albums[photos[id-1].albumId - 1].userId - 1].id+")'>@"+users[albums[photos[id-1].albumId - 1].userId - 1].username+"</div><div class = 'titlePic'>"+photos[id-1].title+"</div><div class = 'albumSrc' onClick = 'getAlbumID("+albums[photos[id-1].albumId-1].id+")'>from: "+albums[photos[id-1].albumId - 1].title+"</div></div>");
}


function showDetails(id){
    $(".greatContainer").append("<div class = 'picContainer' id = 'pC'><div class = 'exit' onClick = 'removeThis()'>X</div><div class = 'showImg'><img src = '"+photos[id-1].url+"' class = 'bigPhoto'><div class = 'poster'>"+users[albums[photos[id-1].albumId - 1].userId - 1].name+"</div><div class = 'poster' id = 'uPicName' id = 'uName' onClick = 'getID("+users[albums[photos[id-1].albumId - 1].userId - 1].id+")'>@"+users[albums[photos[id-1].albumId - 1].userId - 1].username+"</div><div class = 'titlePic'>"+photos[id-1].title+"</div><div class = 'albumSrc' onClick = 'getAlbumID("+albums[photos[id-1].albumId-1].id+")'>from: "+albums[photos[id-1].albumId - 1].title+"</div></div>");
}

function removeThis(){
    var toRemove = document.getElementById("pC");
    toRemove.outerHTML = "";
    delete toRemove;
}

function appendAlbums(){
    var trial = document.getElementById("loadAlbum");
     
    if(trial != null){
        trial.outerHTML = "";
        delete trial;
    }
    if(albumMax >= 0){
        for(var x = albumMax - 1; x > albumMax - 13; x--){
        var url = [];
        var isIt4 = 0;
            for(var ctr = 0; ctr < photos.length; ctr++){
                                
                if(albums[x].id === photos[ctr].albumId){
                    url.push(photos[ctr].thumbnailUrl);
                    isIt4++;
                }
                if(isIt4 === 4)
                    ctr = photos.length;
                
            }
            $(".centerA").append("<div class = 'albumFrame' onClick = 'showPicsInAlbum("+albums[x].id+")'><div class = 'thumbs'><img src = '"+url[0]+"' class = 'aImage' id = 'upLeft'><img src = '"+url[1]+"' class = 'aImage' id = 'upRight'><img src = '"+url[2]+"' class = 'aImage' id = 'downLeft'><img src = '"+url[3]+"' class = 'aImage' id = 'downRight'></div><div class = 'albumName'>"+albums[x].title+"</div></div>&nbsp;&nbsp;");
        }
        albumMax -= 13;
        $(".centerA").append("<div class = 'postFrame' id = 'emptySpace'><br></div>");
        $(".centerA").append("<div class = 'postFrame' id = 'loadAlbum' onClick = 'appendAlbums()'>Load more albums</div>");
    }
}

function showPicsInAlbum(id){
    var imgId = [];
    var x = 0;
    
    for(x = 0; x < photos.length; x++){
        if(id === photos[x].albumId){
            imgId.push(photos[x].id);
        }
    }
    var theAlbum;
    var albumURL = root + "/album/" + id + "/photos/";
    $.get(albumURL, function(response){
        console.log(response);
        theAlbum = response;
        console.log(response);
        
        var newDiv = document.createElement("div");
        newDiv.className = "albumContainer";
        newDiv.id = "aC";
        $(".albumOverlay").append(newDiv);
        var y = 0;
        $(".albumContainer").append("<div class = 'pAlbum' id = 'nameOfAlbum'>"+albums[id-1].title+"</div><div class = 'pAlbum' id = 'usName' onClick = 'getID("+users[albums[id-1].userId-1].id+")'>@"+users[albums[id-1].userId-1].username+"</div>");
        $(".albumContainer").append("<div class = 'exit' onClick = 'removeThat()'>X</div>")
        theAlbum.forEach(function(data){
            console.log(theAlbum[y]);
            $(".albumContainer").append("<div class = 'restOfAlbum'><img class = 'albThumbs' src = "+theAlbum[y].thumbnailUrl+" onClick = 'showPhotoDetails("+theAlbum[y].id+")'></div>"); 
            y++;
        });
    });
    console.log(theAlbum);
    
}

function showPhotoDetails(id){
    $(".albumOverLay").append("<div class = 'picContainer' id = 'pC'><div class = 'exit' onClick = 'removeThis()'>X</div><div class = 'showImg'><img src = '"+photos[id-1].url+"' class = 'bigPhoto'><div class = 'poster'>"+users[albums[photos[id-1].albumId - 1].userId - 1].name+"</div><div class = 'poster' id = 'uPicName' id = 'uName' onClick = 'getID("+users[albums[photos[id-1].albumId - 1].userId - 1].id+")'>@"+users[albums[photos[id-1].albumId - 1].userId - 1].username+"</div><div class = 'titlePic'>"+photos[id-1].title+"</div><div class = 'albumSrc' onClick = 'getAlbumID("+albums[photos[id-1].albumId-1].id+")'>from: "+albums[photos[id-1].albumId - 1].title+"</div></div>");
}

function removeThat(){
    var trial = document.getElementById("aC");
    trial.outerHTML = "";
    delete trial;
}

function appendProfile(){
    console.log(thisProfile);
    $(".centerPr").append("<div class = 'info'><div class = 'pName' id = 'rName'>"+thisProfile.name+"</div><div class = 'pName' id = 'useName'>@"+thisProfile.username+"</div><div class = 'e-mail'>"+thisProfile.email+"</div><div class = 'number'>"+thisProfile.phone+"</div><br><div class = 'notNames'><div class = 'address'><div class = 'street'>Street: "+thisProfile.address.street+"</div><div class = 'suite'>Suite: "+thisProfile.address.suite+"</div><div class = 'city'>City: "+thisProfile.address.city+"</div><div class = 'zip'>ZIP Code: "+thisProfile.address.zipcode+"</div></div><div class = 'company'><div class = 'cName'>Company Name: "+thisProfile.company.name+"</div><div class = 'cPhrase'>Catch Phrase: "+thisProfile.company.catchPhrase+"</div><div class = 'cBs'>BS: "+thisProfile.company.bs+"</div></div></div></div>");
    appendThisAlbum(thisProfile.id);
}

function appendThisAlbum(id){
    var trial = document.getElementById("loadAlbum");
    
    
    if(trial != null){
        trial.outerHTML = "";
        delete trial;
    }
    
    
}

function getAlbumID(val) {
	localStorage.setItem("albumId", val);
	window.location.href = "albumPic.html";
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

function getID(val) {
	localStorage.setItem("id", val);
	window.location.href = "profile.html";
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
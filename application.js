const APIControlle = (function (){
  const clientId = '';
  const clientSecret = '';

  //private methods
  const _getToken = async () => {
    const result = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type' : 'applicatio/x-www-form-urlencoded',
        'Authorization' : 'Basic' +btoa(clientId + ':' + clientSecret)
      },
      body: 'grant_type = client_credentials'
    });

    const data = await result.json();
    return data.access_token;
  }

  const _getGenres = async (token) => {
    const result = await fetch('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
      method: 'GET',
      headers: {'Authorization' : 'Bearer' + token}
    });

    const data = await result.json();
    return data.categories.items;
  }

  const _getPlaylistByGenre = async (token, genreId) => {
    const limit = 10;

    const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
      method: 'GET',
      headers: {'Authorization' : 'Bearer' + token}
    });

    const data = await result.json();
    return data.playlists.items;
  }

  const _getTracks = async (token, tracksEndPoint) => {

    const limit = 10;

    const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
      method:'GET',
      headers: {'Authorization' : 'Bearer' + token}
    });

    const data = result.json();
    return data.items;
  }

  const _getTrack = async (token, trackEndPoint) => {
    
    const result = await fetch(`${trackEndPoint}`, {
      method: 'GET',
      headers: {'Authorization' : 'Bearer' + token}
    });

    const data = await result.json();
    return data;
  }

  return {
    getToken () {
      return _getToken();
    },
    getGenres (token) {
      return _getGenres(token);
    },
    getPlaylistsByGenre (token, genreId) {
      return _getPlaylistByGenre(token, genreId);
    },
    getTracks(token, tracksEndPoint) {
      return _getTracks(token, tracksEndPoint);
    },
    getTrack(token, trackEndPoint) {
      return _getTrack(token, trackEndPoint);
    }
  }
})();


// UI Module
const UIController =(function () {
  //object to hold references to html selectors
  const DOMElements = {
    selectGenre : '#select-genre',
    selectPlaylist: '#select-playlist',
    buttonSubmit: '#btn-submit',
    divSongDetail: '#song-detail',
    hfToken: '#hidden_token',
    divSonglist: '.song-list',
  }

  //public methods
  return {
    //method to get input fields 
    inputField(){
      return{
         genre: document.querySelector(DOMElements.selectGenre),
         playlist: document.querySelector(DOMElements.selectPlaylist),
         tracks: document.querySelector(DOMElements.divSonglist),
         submit: document.querySelector(DOMElements.buttonSubmit),
         songDetail: document.querySelector(DOMElements.divSongDetail)
        }
    },

    //need methods to create select list option
    createGenre(text, value) {
      const html = `<option value="${value}"${text}</option>`;
      document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
    },
    createPlaylist (text, value) {
      const html = `<option value="${value}">${text}</option>`;
      document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
    },

    //need method to create a track list group item
    createTrack(id, name) {
      const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
      decodeURIComponent.querySelector(DOMElements.divSonglist).innerAdjacentHTML('beforeend', html);
    },

    //need method to create the song detail
    createTrackDetail(img, title, artist){

      const detailDiv = document.querySelector(DOMElements.divSongDetail);
      //any time user clicks a new song, we need to clear out the sonng detail div
      detailDiv.innerHTML = '';

      const html = 
      `<div class="row col-sm-12 px-0">
        <img src="${img}" alt="probably an iamge"
        </div>
        <div class="row col-sm-12 px-0">
        <label for="artist" class="form-label col-sm-12">By ${artist}:</label>
        </div>
        `;
        detailDiv.insertAdjacentHTML('beforeend', html)
    },

    resetTrackDetail () {
      this.inputField().songDetail.innerHTML = '';
    },

    resetTracks () {
      this.inputField().songs.innerHTML = '';
      this.resetTracksDetail();
    },
    resetPlaylist () {
      this.inputField().playlist.innerHTML = '';
      this.resetTracks();
    }
  }
})();

const APPController = function(UICtrl, APICtrl) {
//get input field object ref
const DOMInputs = UICtrl.inputField();

const loadGenres = async () => {
  //get the token
const token = await APICtrl.getToken();
//populate our genres select element
genres.forEach(element => UICtrl.createGenre(element.name, element.id));
}

//create genre change event listener
DOMInputs.genre.addEventListener('change', async() => {

  // when user changes genres, we need to reset the subsequent fields
  UICtrl.resetPlaylist();
  //get the token. add method to store the token on the page so we don't have trouble
  const token = UICtrl.getStoredToken().token;
  //get the genre select field
  const genreSelect = UICtrl.inputField().genre;
  //get the selected genreId
  const genreId = genreSelect.options[genreSelect.selectedIndex].value;
  //get the playlist data from spotify based on the genre
  const playlist = await APICtrl.getPlaylistsByGenre(token, genreId);
  //load the playlist select field
});


//create submit button click event listened
DOMInputs.submit.addEventListener('click', async (e) => {
  //prevent page reset
  e.preventDefault();


});

DOMInputs.songs.addEventListener('click', async (e) => {})
//prevent page reset
e.preventDefault();
}
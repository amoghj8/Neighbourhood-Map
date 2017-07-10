function Model(){
	var locations = [
        {
        	title: 'Sixth Main' , 
        	lat: 12.325449, 
        	lng: 76.627979,
        	id: ' Sixth Main'
        },
    	{	title: 'Down Town Fast Food' , 
    		lat: 12.323795,
    		lng: 76.625774,
    		id: 'Downtown '
    	},
    	{
    		title: 'The Old House' , 
    		lat: 12.299324, 
    		lng: 76.642573,
    		id: ' Old House '
    	},
    	{
    		title: 'Mezzaluna Continental' ,
    		lat: 12.326381, 
    		lng: 76.61912,
    		id: ' Mezzaluna '
    	},
    	{
    		title: 'Depth N Green' , 
    		lat: 12.330673, 
    		lng: 76.62876,
    		id: ' Depth N Green '
    	},
 	    {
 	    	title: 'Corner House' , 
 	    	lat: 12.322875, 
 	    	lng: 76.634835,
 	    	id: 'Corner House'
 	    },
 	    {
 	    	title: 'Purple Haze' ,
 	    	lat: 12.338098, 
 	    	lng: 76.616789,
 	    	id: 'Purple Haze'
 	    },
 	    {
 	    	title: 'Tina\'s Café' ,
 	    	lat: 12.32807, 
 	    	lng: 76.628618,
 	    	id: 'Tina\'s Café'
 	    }];
	return locations;
}

locArray = ko.observableArray(Model());

function initMap() {

  // Create map
  var map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 12.316076, lng:76.62272},
    zoom: 14,
  });

  locArray().forEach(function(data) {
    
    var mkPosition = new google.maps.LatLng(data.lat, data.lng);
    var marker = new google.maps.Marker({
      position: mkPosition,
      map: map,
      title: data.title,
      animation: google.maps.Animation.DROP,
    });

    	var infowindow = new google.maps.InfoWindow({
   	 content: data.title
  	});

  	data.mapMarker = marker;

    // Add listener for clicks to the marker we just created.
    marker.addListener('click', function(event) {
      data.triggerMarker(marker);
      locArray().forEach(function(place) {
        if (data.title === place.title) {
          place.openInfoWindow();
        } else {
          place.closeInfoWindow();
        }
      });
    });

    map.addListener('click', function() {
      locArray().forEach(function(place) {
        place.closeInfoWindow();
      });
    });

    data.triggerMarker = function(marker) {
      infowindow.open(map, marker);
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() { marker.setAnimation(null); }, 3000);
    }.bind(this);

    data.closeInfoWindow = function() {
      infowindow.close(map, marker);
    }.bind(this);

    data.openInfoWindow = function() {
      infowindow.open(map, marker);
    }.bind(this);
	
  }); 

}



function ViewModel() {
  
  var self = this;
  
  self.placeList = ko.observableArray([]);

  locArray().forEach(function(place) {
    place.visible = ko.observable(true);
    self.placeList.push(place);
  });

  self.filterValue = ko.observable('');

  // Filter the list and trigger the marker on user
  // input into the filter text input.
  self.filterList = ko.computed(function() {
    locArray().forEach(function(place) {
      var searchParam = self.filterValue().toLowerCase();
      var toBeSearched = place.title.toLowerCase();

      // Set visible binding to the folowing boolean.  Filters on type.
      place.visible(toBeSearched.indexOf(searchParam) > -1);

      // Have to add check for existence of mapMarker since on initial render,
      // the marker doesn't yet exist by the time filterList() is called / built.
      if (place.mapMarker) {
        place.mapMarker.setVisible(toBeSearched.indexOf(searchParam) > -1);
      }
      
      if (place.visible() && searchParam && place.mapMarker) {
        place.triggerMarker(place.mapMarker);
      }

      // Make sure to close all infowindows if the filter doesn't have a match.
      else if (place.mapMarker) {
        place.closeInfoWindow();
      }
    });
  });
}
ko.applyBindings(new ViewModel());